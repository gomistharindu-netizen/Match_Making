export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isMe: boolean;
}

export interface Conversation {
  id: string;
  profileId: string;
  profileCode: string;
  candidateName: string;
  photoUrl: string;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
  contactReleased: boolean;
  messages: ChatMessage[];
}

export const mockConversations: Conversation[] = [
  {
    id: 'c-1',
    profileId: 'p-2',
    profileCode: 'MP-2026-002',
    candidateName: 'Dr. Sanduni Dissanayake (Kandy)',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80',
    lastMessage: 'Thank you for your proposal details. Our parents checked the Porondam matching and it looks very positive.',
    lastTimestamp: '10:14 AM',
    unreadCount: 1,
    contactReleased: false,
    messages: [
      {
        id: 'm-1',
        senderId: 'me',
        senderName: 'Me',
        text: 'Ayubowan! We saw your profile (MP-2026-002) and were very impressed with the educational background and family values.',
        timestamp: 'Yesterday 4:30 PM',
        isMe: true,
      },
      {
        id: 'm-2',
        senderId: 'p-2',
        senderName: 'Dr. Sanduni (via Father)',
        text: 'Ayubowan! Thank you very much for reaching out. We also reviewed your profile and appreciate the sincerity.',
        timestamp: 'Yesterday 6:45 PM',
        isMe: false,
      },
      {
        id: 'm-3',
        senderId: 'p-2',
        senderName: 'Dr. Sanduni (via Father)',
        text: 'Thank you for your proposal details. Our parents checked the Porondam matching and it looks very positive.',
        timestamp: '10:14 AM',
        isMe: false,
      },
    ],
  },
  {
    id: 'c-2',
    profileId: 'p-4',
    profileCode: 'MP-2026-004',
    candidateName: 'Natasha Fernando (London, UK)',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80',
    lastMessage: 'Owner has released contact details! Contact phone: +44 7911 123456.',
    lastTimestamp: 'Yesterday',
    unreadCount: 0,
    contactReleased: true,
    messages: [
      {
        id: 'm-4',
        senderId: 'me',
        senderName: 'Me',
        text: 'Hello Natasha, hope you are doing well in London. Would love to know if you are open to discussing further.',
        timestamp: '2 days ago',
        isMe: true,
      },
      {
        id: 'm-5',
        senderId: 'p-4',
        senderName: 'Natasha (via Mother)',
        text: 'Hello! Yes, we have reviewed your background and we would be happy to share contact numbers to speak with family.',
        timestamp: 'Yesterday 2:10 PM',
        isMe: false,
      },
      {
        id: 'm-6',
        senderId: 'system',
        senderName: 'System',
        text: '🎉 Profile Owner has authorized Contact Release. You can now call or WhatsApp directly.',
        timestamp: 'Yesterday 2:12 PM',
        isMe: false,
      },
    ],
  },
];

export interface ProfileViewActivity {
  id: string;
  profileId: string;
  profileCode: string;
  candidateTitle: string;
  photoUrl: string;
  location: string;
  profession: string;
  viewedAt: string;
  viewCount: number;
}

export const mockRecentlyViewed: ProfileViewActivity[] = [
  {
    id: 'rv-1',
    profileId: 'p-2',
    profileCode: 'MP-2026-002',
    candidateTitle: 'Doctor (26 Yrs) - Kandy',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80',
    location: 'Kandy, Sri Lanka',
    profession: 'Medical Doctor',
    viewedAt: '10 minutes ago',
    viewCount: 3,
  },
  {
    id: 'rv-2',
    profileId: 'p-4',
    profileCode: 'MP-2026-004',
    candidateTitle: 'Data Scientist (28 Yrs) - London',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80',
    location: 'London, UK',
    profession: 'Lead AI Data Analyst',
    viewedAt: 'Yesterday 8:20 PM',
    viewCount: 1,
  },
  {
    id: 'rv-3',
    profileId: 'p-6',
    profileCode: 'MP-2026-006',
    candidateTitle: 'University Lecturer (27 Yrs) - Galle',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80',
    location: 'Galle, Sri Lanka',
    profession: 'Lecturer in English',
    viewedAt: '2 days ago',
    viewCount: 2,
  },
];

export const mockWhoViewedMe: ProfileViewActivity[] = [
  {
    id: 'wvm-1',
    profileId: 'p-1',
    profileCode: 'MP-2026-001',
    candidateTitle: 'Software Architect (29 Yrs) - Colombo',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
    location: 'Colombo 05',
    profession: 'Senior Lead Software Architect',
    viewedAt: 'Today 9:15 AM',
    viewCount: 4,
  },
  {
    id: 'wvm-2',
    profileId: 'p-3',
    profileCode: 'MP-2026-003',
    candidateTitle: 'Civil Engineer (32 Yrs) - Melbourne',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
    location: 'Melbourne, Australia',
    profession: 'Chartered Senior Civil Engineer',
    viewedAt: 'Yesterday 11:45 PM',
    viewCount: 2,
  },
  {
    id: 'wvm-3',
    profileId: 'p-5',
    profileCode: 'MP-2026-005',
    candidateTitle: 'Quantity Surveyor (31 Yrs) - Gampaha',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    location: 'Gampaha',
    profession: 'Chartered QS & Director',
    viewedAt: '3 days ago',
    viewCount: 1,
  },
];
