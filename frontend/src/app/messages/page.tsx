'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../context/LanguageContext';
import { useDemo } from '../../context/DemoContext';
import { useAuth } from '../../context/AuthContext';
import { mockConversations, Conversation, ChatMessage } from '../../data/mockMessages';
import {
  Send,
  Lock,
  Unlock,
  Phone,
  MessageCircle,
  ShieldCheck,
  ArrowRight,
  ChevronLeft,
} from 'lucide-react';
import { PageHeaderBanner } from '../../components/PageHeaderBanner';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export default function MessagesPage() {
  const { language, t } = useLanguage();
  const { role } = useDemo();
  const { user, isAuthenticated, isLoading, token, login } = useAuth();
  const router = useRouter();

  // Route Guard: Auto redirect unauthenticated visitors to login
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login?redirect=/messages');
    }
  }, [isLoading, isAuthenticated, router]);

  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [activeConvId, setActiveConvId] = useState<string>(mockConversations[0]?.id || '');
  const [inputText, setInputText] = useState<string>('');
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');
  const [isLiveApi, setIsLiveApi] = useState<boolean>(false);
  const [demoLoginLoading, setDemoLoginLoading] = useState<boolean>(false);

  // Load live conversations from Laravel API if authenticated
  useEffect(() => {
    if (!isAuthenticated || !token) return;

    const fetchConversations = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/member/conversations`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setIsLiveApi(true);
            if (data.length > 0) {
              const mapped: Conversation[] = data.map((c: any) => ({
                id: String(c.id),
                profileId: String(c.partner.id),
                profileCode: c.partner.profile_code,
                candidateName: c.partner.display_name,
                photoUrl: c.partner.primary_photo_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80',
                lastMessage: c.last_message || 'New conversation channel opened',
                lastTimestamp: c.last_message_at
                  ? new Date(c.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : 'Recently',
                unreadCount: c.unread_count || 0,
                contactReleased: c.contact_released_to_me,
                messages: [],
              }));

              setConversations(mapped);
              setActiveConvId(mapped[0]?.id || '');
            } else {
              setConversations([]);
              setActiveConvId('');
            }
          }
        }
      } catch {
        console.log('Using fallback mock conversations');
      }
    };

    fetchConversations();
  }, [isAuthenticated, token]);

  // Load messages for active conversation from Laravel API
  useEffect(() => {
    if (!isLiveApi || !token || !activeConvId) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/member/conversations/${activeConvId}/messages`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });

        if (res.ok) {
          const data = await res.json();
          const mappedMsgs: ChatMessage[] = data.map((m: any) => ({
            id: String(m.id),
            senderId: m.is_me ? 'me' : String(m.sender_id),
            senderName: m.is_me ? 'Me' : 'Partner',
            text: m.message,
            timestamp: m.time,
            isMe: m.is_me,
          }));

          setConversations((prev) =>
            prev.map((c) => (c.id === activeConvId ? { ...c, messages: mappedMsgs } : c))
          );
        }
      } catch {}
    };

    fetchMessages();
  }, [activeConvId, isLiveApi, token]);

  const currentConv = conversations.find((c) => c.id === activeConvId);

  const handleDemoMemberLogin = async () => {
    setDemoLoginLoading(true);
    await login('kasun@gmail.com', 'secret123');
    setDemoLoginLoading(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !currentConv) return;

    const textToSend = inputText.trim();
    setInputText('');

    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      senderId: 'me',
      senderName: 'Me',
      text: textToSend,
      timestamp: 'Just now',
      isMe: true,
    };

    // Optimistic UI update
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConvId) {
          return {
            ...c,
            lastMessage: textToSend,
            lastTimestamp: 'Just now',
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );

    // Call Laravel API if authenticated
    if (isLiveApi && token) {
      try {
        await fetch(`${API_BASE_URL}/member/conversations/${activeConvId}/messages`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ message: textToSend }),
        });
      } catch {}
    }
  };

  const handleToggleContactRelease = async () => {
    if (!currentConv) return;

    const newState = !currentConv.contactReleased;
    const statusMsg: ChatMessage = {
      id: `m-sys-${Date.now()}`,
      senderId: 'system',
      senderName: 'System',
      text: newState
        ? '🎉 Profile Owner has authorized Contact Release. Direct phone & WhatsApp numbers are now accessible!'
        : '🔒 Contact Release permission was revoked.',
      timestamp: 'Just now',
      isMe: false,
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConvId) {
          return {
            ...c,
            contactReleased: newState,
            messages: [...c.messages, statusMsg],
          };
        }
        return c;
      })
    );

    // Call backend API to persist contact release if live
    if (isLiveApi && token && newState) {
      try {
        await fetch(`${API_BASE_URL}/member/conversations/${activeConvId}/grant-contact`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });
      } catch {}
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#AD3B65] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-[#352A30]/60 font-medium">
            {language === 'si' ? 'සාමාජික තොරතුරු තහවුරු කරමින්...' : 'Checking member access...'}
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#F8E4EB] shadow-xl text-center space-y-4 max-w-md w-full">
          <div className="w-16 h-16 bg-[#FFF8FA] text-[#AD3B65] border border-[#F8E4EB] rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-8 h-8 text-[#AD3B65]" />
          </div>
          <h2 className="text-2xl font-bold font-serif text-[#352A30]">
            {language === 'si' ? 'සාමාජිකයින්ට පමණි' : 'Registered Members Only'}
          </h2>
          <p className="text-xs sm:text-sm text-[#352A30]/75 leading-relaxed font-serif">
            {language === 'si'
              ? 'පෞද්ගලික පණිවිඩ පිටුවට පිවිසිය හැක්කේ ලියාපදිංචි වී ගිණුමට ඇතුල් වූ සාමාජිකයින්ට පමණි. කරුණාකර ඔබගේ ගිණුමට ඇතුල් වන්න.'
              : 'The private messaging portal is strictly reserved for registered logged-in members. Please sign in to your account to continue.'}
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/login?redirect=/messages"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-[#AD3B65] to-[#8E2E52] text-white px-6 py-2.5 rounded-2xl text-xs font-bold shadow-md hover:shadow-lg transition cursor-pointer"
            >
              <span>{language === 'si' ? 'ඇතුල් වන්න (Sign In)' : 'Sign In'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C6A56B]" />
            </Link>
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-[#FFF8FA] text-[#AD3B65] border border-[#F8E4EB] px-6 py-2.5 rounded-2xl text-xs font-bold hover:bg-[#F8E4EB] transition cursor-pointer"
            >
              <span>{language === 'si' ? 'ලියාපදිංචි වන්න' : 'Register Free'}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Full-Screen Width Royal Banner */}
      <PageHeaderBanner
        badgeText={language === 'si' ? 'අතිශය සුරක්ෂිත පණිවිඩ හුවමාරුව' : 'Encrypted Private Chat'}
        titlePrefix={language === 'si' ? 'පෞද්ගලික' : 'Private'}
        titleHighlight={language === 'si' ? 'සාමාජික පණිවිඩ' : 'Member Messages'}
        subtitle={t.chatPage.subtitle}
        breadcrumbCurrent={language === 'si' ? 'පණිවිඩ' : 'Messages'}
      />

      <div className="max-w-6xl mx-auto px-2 sm:px-6 lg:px-8 space-y-6">
        {/* Live vs Demo Mode Indicator Strip */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white rounded-2xl p-3.5 sm:px-5 border border-[#F8E4EB] shadow-xs">
              <div className="flex items-center gap-2.5">
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${isLiveApi ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
                <div className="text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#352A30]">
                      {isLiveApi ? 'සජීවී සාමාජික පණිවිඩ (Live Database - MySQL)' : 'නියැදි දත්ත පෙරදසුන (Demo Preview / Mock Data)'}
                    </span>
                    <span className={`px-2 py-0.2 rounded-full text-[10px] font-extrabold uppercase ${
                      isLiveApi ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}>
                      {isLiveApi ? 'LIVE API' : 'MOCK'}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500">
                    {isLiveApi
                      ? `ලියාපදිංචි සාමාජික ගිණුම: ${user?.name} (${user?.email}) හරහා Laravel API වෙත සෘජුව සම්බන්ධ වී ඇත.`
                      : 'නොමිලේ හෝ Guest පරිශීලකයින්ට පද්ධතිය පරීක්ෂා කිරීම සඳහා මෙම Mock Data පෙන්වයි. සැබෑ පණිවිඩ අත්හදා බැලීමට සාමාජිකයෙකු ලෙස ලොග් වන්න.'}
                  </p>
                </div>
              </div>

              {!isLiveApi && (
                <button
                  type="button"
                  onClick={handleDemoMemberLogin}
                  disabled={demoLoginLoading}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#AD3B65] to-[#8E2E52] hover:from-[#8E2E52] hover:to-[#6E1F3C] text-white text-xs font-bold shadow-xs hover:shadow-md transition flex items-center gap-1.5 shrink-0"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#C6A56B]" />
                  <span>{demoLoginLoading ? 'සම්බන්ධ වෙමින්...' : 'සැබෑ Member ලෙස ලොග් වන්න (Kasun)'}</span>
                </button>
              )}
            </div>

            {/* Chat Container */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#F8E4EB] shadow-sm overflow-hidden flex flex-col md:grid md:grid-cols-3 h-[78vh] min-h-[520px] max-h-[740px] sm:h-[680px]">
              {/* Left: Conversation List */}
              <div
                className={`border-r border-[#F8E4EB] flex flex-col bg-[#FFF8FA]/70 h-full ${
                  mobileView === 'chat' ? 'hidden md:flex' : 'flex'
                }`}
              >
                <div className="p-3.5 sm:p-4 border-b border-[#F8E4EB] flex items-center justify-between">
                  <h3 className="text-xs font-bold text-[#352A30] uppercase tracking-wider">
                    {language === 'si' ? 'අනුමත වූ සංවාද' : 'Accepted Matches'}
                  </h3>
                  <span className="text-[10px] bg-[#F8E4EB] text-[#AD3B65] font-extrabold px-2 py-0.5 rounded-full border border-[#AD3B65]/20">
                    {conversations.length}
                  </span>
                </div>

                <div className="overflow-y-auto flex-1 divide-y divide-[#F8E4EB]/60">
                  {conversations.map((conv) => {
                    const active = conv.id === activeConvId;
                    return (
                      <button
                        key={conv.id}
                        onClick={() => {
                          setActiveConvId(conv.id);
                          setMobileView('chat');
                        }}
                        className={`w-full p-3.5 sm:p-4 text-left transition flex items-start space-x-3 cursor-pointer ${
                          active
                            ? 'bg-[#F8E4EB] border-l-4 border-[#AD3B65]'
                            : 'hover:bg-white active:bg-[#F8E4EB]/40'
                        }`}
                      >
                        <img
                          src={conv.photoUrl}
                          alt={conv.profileCode}
                          className="w-12 h-12 rounded-2xl object-cover shrink-0 shadow-sm border border-white"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs sm:text-sm text-[#352A30] truncate">
                              {conv.candidateName}
                            </span>
                            <span className="text-[10px] text-[#352A30]/50 shrink-0 ml-1">
                              {conv.lastTimestamp}
                            </span>
                          </div>
                          <span className="font-mono text-[10px] text-[#AD3B65] font-bold block">
                            {conv.profileCode}
                          </span>
                          <p className="text-xs text-[#352A30]/70 truncate mt-1">
                            {conv.lastMessage}
                          </p>
                          {conv.contactReleased && (
                            <span className="inline-flex items-center text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded mt-1 border border-emerald-200">
                              <Unlock className="w-2.5 h-2.5 mr-1 text-emerald-700" />
                              Contact Shared
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right: Message Window */}
              <div
                className={`md:col-span-2 flex flex-col bg-white h-full ${
                  mobileView === 'list' ? 'hidden md:flex' : 'flex'
                }`}
              >
                {currentConv ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-3 sm:p-4 border-b border-[#F8E4EB] flex items-center justify-between bg-[#FFF8FA]/90">
                      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                        {/* Mobile Back Button */}
                        <button
                          type="button"
                          onClick={() => setMobileView('list')}
                          className="md:hidden p-1.5 -ml-1 text-[#352A30] hover:bg-[#F8E4EB] active:bg-[#F8E4EB] rounded-full transition flex items-center justify-center shrink-0 cursor-pointer"
                          title={language === 'si' ? 'සංවාද වෙත' : 'Back'}
                        >
                          <ChevronLeft className="w-5 h-5 text-[#352A30]" />
                        </button>

                        <img
                          src={currentConv.photoUrl}
                          alt={currentConv.profileCode}
                          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover shadow-sm shrink-0 border border-[#F8E4EB]"
                        />
                        <div className="min-w-0">
                          <span className="font-bold text-xs sm:text-sm text-[#352A30] block truncate">
                            {currentConv.candidateName}
                          </span>
                          <span className="font-mono text-[10px] text-[#AD3B65] font-semibold block truncate">
                            {currentConv.profileCode} • Internal Chat Channel
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <button
                          onClick={handleToggleContactRelease}
                          className={`text-[11px] sm:text-xs px-2.5 sm:px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1 sm:space-x-1.5 transition shrink-0 cursor-pointer ${
                            currentConv.contactReleased
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-[#AD3B65] hover:bg-[#972F55] text-white shadow-sm shadow-[#AD3B65]/20'
                          }`}
                        >
                          {currentConv.contactReleased ? (
                            <>
                              <Unlock className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">
                                {language === 'si' ? 'අංක හුවමාරුව අනුමතයි' : 'Contact Released'}
                              </span>
                              <span className="sm:hidden">
                                {language === 'si' ? 'අනුමතයි' : 'Shared'}
                              </span>
                            </>
                          ) : (
                            <>
                              <Lock className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">{t.chatPage.approveContactBtn}</span>
                              <span className="sm:hidden">
                                {language === 'si' ? 'අංක දෙන්න' : 'Share'}
                              </span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Contact Released Banner in Chat */}
                    {currentConv.contactReleased ? (
                      <div className="bg-emerald-50 border-b border-emerald-200 px-3 sm:px-4 py-2.5 text-xs text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center space-x-2">
                          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                          <span className="font-semibold text-[11px] sm:text-xs">
                            {language === 'si'
                              ? 'දෙපාර්ශවයේ එකඟතාවය මත දුරකථන අංක හුවමාරුව සක්‍රිය කර ඇත:'
                              : 'Contact details released with mutual consent:'}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 font-mono font-bold text-xs">
                          <span className="flex items-center text-[#AD3B65]">
                            <Phone className="w-3.5 h-3.5 mr-1" />
                            +94 72 222 2222
                          </span>
                          <span className="flex items-center text-emerald-700">
                            <MessageCircle className="w-3.5 h-3.5 mr-1" />
                            WhatsApp Active
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-amber-50/70 border-b border-amber-200 px-3 sm:px-4 py-2 text-[11px] text-amber-900 flex items-center space-x-2">
                        <Lock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                        <span className="text-[10px] sm:text-[11px] leading-tight">
                          {language === 'si'
                            ? 'පෞද්ගලික ආරක්ෂාව තහවුරු කර ඇත. දුරකථන අංක හුවමාරු කිරීමට ඉහත බොත්තම ඔබන්න.'
                            : 'Protected chat. Phone numbers remain confidential until you click "Approve & Share".'}
                        </span>
                      </div>
                    )}

                    {/* Messages Scroll View */}
                    <div className="flex-1 p-3 sm:p-6 overflow-y-auto space-y-3 sm:space-y-4">
                      {currentConv.messages.map((msg) => {
                        if (msg.senderId === 'system') {
                          return (
                            <div key={msg.id} className="text-center my-3">
                              <span className="bg-[#FFF8FA] text-[#352A30]/80 text-[10px] sm:text-[11px] px-3 py-1 rounded-full font-medium border border-[#F8E4EB] inline-block shadow-xs">
                                {msg.text}
                              </span>
                            </div>
                          );
                        }

                        return (
                          <div
                            key={msg.id}
                            className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
                          >
                            <div
                              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm shadow-xs ${
                                msg.isMe
                                  ? 'bg-[#AD3B65] text-white rounded-br-xs'
                                  : 'bg-[#F8E4EB] text-[#352A30] rounded-bl-xs'
                              }`}
                            >
                              <p className="leading-relaxed">{msg.text}</p>
                            </div>
                            <span className="text-[10px] text-[#352A30]/50 mt-1 px-1">
                              {msg.timestamp}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Message Input Box */}
                    <form
                      onSubmit={handleSendMessage}
                      className="p-2.5 sm:p-4 border-t border-[#F8E4EB] bg-[#FFF8FA]/80 flex items-center space-x-2"
                    >
                      <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder={t.chatPage.typeMessage}
                        className="flex-1 bg-white border border-[#F8E4EB] rounded-2xl px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-[#352A30] focus:outline-none focus:border-[#AD3B65]"
                      />
                      <button
                        type="submit"
                        className="bg-[#AD3B65] hover:bg-[#972F55] text-white font-bold p-2.5 sm:p-2.5 rounded-2xl transition shadow-md shadow-[#AD3B65]/20 shrink-0 cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center p-8 text-center text-[#352A30]/50 text-xs">
                    {t.chatPage.selectConversation}
                  </div>
                )}
              </div>
            </div>
      </div>
    </div>
  );
}
