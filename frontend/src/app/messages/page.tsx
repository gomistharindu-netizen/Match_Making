'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';
import { useDemo } from '../../context/DemoContext';
import { mockConversations, Conversation, ChatMessage } from '../../data/mockMessages';
import {
  Send,
  Lock,
  Unlock,
  Phone,
  MessageCircle,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { PageHeaderBanner } from '../../components/PageHeaderBanner';

export default function MessagesPage() {
  const { language, t } = useLanguage();
  const { role } = useDemo();

  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [activeConvId, setActiveConvId] = useState<string>(mockConversations[0]?.id || '');
  const [inputText, setInputText] = useState<string>('');

  const currentConv = conversations.find((c) => c.id === activeConvId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !currentConv) return;

    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      senderId: 'me',
      senderName: 'Me',
      text: inputText,
      timestamp: 'Just now',
      isMe: true,
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConvId) {
          return {
            ...c,
            lastMessage: inputText,
            lastTimestamp: 'Just now',
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );
    setInputText('');
  };

  const handleToggleContactRelease = () => {
    if (!currentConv) return;
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConvId) {
          const newState = !c.contactReleased;
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
          return {
            ...c,
            contactReleased: newState,
            messages: [...c.messages, statusMsg],
          };
        }
        return c;
      })
    );
  };

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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {role === 'visitor' ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-sm text-center space-y-4 max-w-2xl mx-auto my-8">
            <div className="w-16 h-16 bg-[#7A2943]/10 text-[#7A2943] border border-[#7A2943]/20 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <Lock className="w-8 h-8 text-[#7A2943]" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#7A2943]">
              {language === 'si' ? 'පණිවිඩ කියවීමට සාමාජිකත්වය අවශ්‍යයි' : 'Registered Member Access Required'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed font-serif">
              {language === 'si'
                ? 'පෞද්ගලික පණිවිඩ සහ යෝජනා හුවමාරුව කළ හැක්කේ සක්‍රිය සාමාජිකයින්ට පමණි. කරුණාකර Demo Toolbar එකෙන් "Active Member" තෝරා පරීක්ෂා කරන්න.'
                : 'Private messaging is restricted to active members. Please switch your role to "Active Lifetime Member" on the top Demo Toolbar to simulate messaging.'}
            </p>
            <div className="pt-2">
              <Link
                href="/membership"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#7A2943] to-[#9e3859] text-white px-6 py-2.5 rounded-full text-xs font-bold hover:shadow-md transition"
              >
                <span>{language === 'si' ? 'සාමාජිකත්වය ලබාගන්න' : 'Get Membership'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C6A56B]" />
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Chat Container */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-3 h-[680px]">
        {/* Left: Conversation List */}
        <div className="border-r border-stone-200 flex flex-col bg-stone-50/50">
          <div className="p-4 border-b border-stone-200">
            <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              {language === 'si' ? 'අනුමත වූ සංවාද' : 'Accepted Matches'}
            </h3>
          </div>

          <div className="overflow-y-auto flex-1 divide-y divide-stone-100">
            {conversations.map((conv) => {
              const active = conv.id === activeConvId;
              return (
                <button
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`w-full p-4 text-left transition flex items-start space-x-3 ${
                    active ? 'bg-brand-50/80 border-l-4 border-brand-600' : 'hover:bg-white'
                  }`}
                >
                  <img
                    src={conv.photoUrl}
                    alt={conv.profileCode}
                    className="w-12 h-12 rounded-2xl object-cover shrink-0 shadow-sm"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-stone-900 truncate">
                        {conv.candidateName}
                      </span>
                      <span className="text-[10px] text-stone-400">
                        {conv.lastTimestamp}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-brand-700 font-bold block">
                      {conv.profileCode}
                    </span>
                    <p className="text-xs text-stone-500 truncate mt-1">
                      {conv.lastMessage}
                    </p>
                    {conv.contactReleased && (
                      <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded mt-1">
                        <Unlock className="w-2.5 h-2.5 mr-1" />
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
        <div className="md:col-span-2 flex flex-col bg-white">
          {currentConv ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
                <div className="flex items-center space-x-3">
                  <img
                    src={currentConv.photoUrl}
                    alt={currentConv.profileCode}
                    className="w-10 h-10 rounded-xl object-cover shadow-sm"
                  />
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-stone-900 block">
                      {currentConv.candidateName}
                    </span>
                    <span className="font-mono text-[10px] text-brand-700 font-semibold">
                      {currentConv.profileCode} • Internal Chat Channel
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleToggleContactRelease}
                    className={`text-xs px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 transition ${
                      currentConv.contactReleased
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-brand-600 hover:bg-brand-700 text-white shadow'
                    }`}
                  >
                    {currentConv.contactReleased ? (
                      <>
                        <Unlock className="w-3.5 h-3.5" />
                        <span>{language === 'si' ? 'අංක හුවමාරුව අනුමතයි' : 'Contact Released'}</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>{t.chatPage.approveContactBtn}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Contact Released Banner in Chat */}
              {currentConv.contactReleased ? (
                <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2.5 text-xs text-emerald-900 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span className="font-semibold">
                      {language === 'si'
                        ? 'දෙපාර්ශවයේ එකඟතාවය මත දුරකථන අංක හුවමාරුව සක්‍රිය කර ඇත:'
                        : 'Contact details released with mutual consent:'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 font-mono font-bold">
                    <span className="flex items-center text-brand-700">
                      <Phone className="w-3.5 h-3.5 mr-1" />
                      +94 77 345 6789
                    </span>
                    <span className="flex items-center text-emerald-700">
                      <MessageCircle className="w-3.5 h-3.5 mr-1" />
                      WhatsApp Active
                    </span>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50/70 border-b border-amber-200 px-4 py-2 text-[11px] text-amber-900 flex items-center space-x-2">
                  <Lock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>
                    {language === 'si'
                      ? 'පෞද්ගලික ආරක්ෂාව තහවුරු කර ඇත. දුරකථන අංක හුවමාරු කිරීමට ඉහත බොත්තම ඔබන්න.'
                      : 'Protected chat. Phone numbers remain confidential until you click "Approve & Share".'}
                  </span>
                </div>
              )}

              {/* Messages Scroll View */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {currentConv.messages.map((msg) => {
                  if (msg.senderId === 'system') {
                    return (
                      <div key={msg.id} className="text-center my-3">
                        <span className="bg-stone-100 text-stone-600 text-[11px] px-3 py-1 rounded-full font-medium border border-stone-200 inline-block">
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
                        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm shadow-sm ${
                          msg.isMe
                            ? 'bg-brand-600 text-white rounded-br-none'
                            : 'bg-stone-100 text-stone-900 rounded-bl-none'
                        }`}
                      >
                        <p className="leading-relaxed">{msg.text}</p>
                      </div>
                      <span className="text-[10px] text-stone-400 mt-1 px-1">
                        {msg.timestamp}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Message Input Box */}
              <form
                onSubmit={handleSendMessage}
                className="p-4 border-t border-stone-200 bg-stone-50 flex items-center space-x-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={t.chatPage.typeMessage}
                  className="flex-1 bg-white border border-stone-300 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-brand-500"
                />
                <button
                  type="submit"
                  className="bg-brand-600 hover:bg-brand-700 text-white font-bold p-2.5 rounded-2xl transition shadow"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-center text-stone-400 text-xs">
              {t.chatPage.selectConversation}
            </div>
          )}
        </div>
      </div>
          </>
        )}
      </div>
    </div>
  );
}
