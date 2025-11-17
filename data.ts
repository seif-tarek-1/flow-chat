
import { User, Chat } from './types';

export const currentUser: User = {
  id: 'user1',
  name: 'المستخدم الحالي',
  avatarUrl: 'https://picsum.photos/seed/user1/200/200',
  status: 'متصل الآن',
  online: true,
  email: 'user@example.com',
};

export const users: User[] = [
  currentUser,
  { id: 'user2', name: 'علياء', avatarUrl: 'https://picsum.photos/seed/user2/200/200', status: 'مشغولة', online: true, email: 'alia@example.com' },
  { id: 'user3', name: 'محمد', avatarUrl: 'https://picsum.photos/seed/user3/200/200', status: 'في العمل', online: false, email: 'mohammed@example.com' },
  { id: 'user4', name: 'سارة', avatarUrl: 'https://picsum.photos/seed/user4/200/200', status: 'متاح للدردشة', online: true, email: 'sara@example.com' },
  { id: 'user5', name: 'خالد', avatarUrl: 'https://picsum.photos/seed/user5/200/200', status: 'نائم', online: false, email: 'khaled@example.com' },
  { id: 'user6', name: 'فاطمة', avatarUrl: 'https://picsum.photos/seed/user6/200/200', status: 'في إجازة', online: true, email: 'fatima@example.com' },
];

export const chats: Chat[] = [
  {
    id: 'chat1',
    participantIds: ['user1', 'user2'],
    unreadCount: 2,
    messages: [
      { id: 'msg1', senderId: 'user2', text: 'أهلاً! كيف حالك؟', timestamp: '10:30 صباحًا', read: false },
      { id: 'msg2', senderId: 'user1', text: 'أهلاً علياء! أنا بخير، شكرًا لك. ماذا عنك؟', timestamp: '10:31 صباحًا', read: true },
      { id: 'msg3', senderId: 'user2', text: 'بخير الحمد لله. هل أنت متفرغ اليوم؟', timestamp: '10:32 صباحًا', read: false },
       { id: 'msg4', senderId: 'user2', text: 'لدي سؤال بخصوص المشروع.', timestamp: '10:32 صباحًا', read: false },
    ],
  },
  {
    id: 'chat2',
    participantIds: ['user1', 'user3'],
    unreadCount: 0,
    messages: [
      { id: 'msg5', senderId: 'user1', text: 'مرحبًا محمد، هل استلمت البريد الإلكتروني الذي أرسلته؟', timestamp: '9:15 صباحًا', read: true },
      { id: 'msg6', senderId: 'user3', text: 'نعم، استلمته. سأقوم بالرد عليه قريبًا.', timestamp: '9:20 صباحًا', read: true },
    ],
  },
  {
    id: 'chat3',
    participantIds: ['user1', 'user4'],
    unreadCount: 1,
    messages: [
        { id: 'msg7', senderId: 'user4', text: 'مساء الخير!', timestamp: '8:00 مساءً', read: false },
    ],
  },
  {
    id: 'chat4',
    participantIds: ['user1', 'user5'],
    unreadCount: 0,
    messages: [
        { id: 'msg8', senderId: 'user1', text: 'أتمنى لك ليلة سعيدة يا خالد.', timestamp: '11:00 مساءً', read: true },
    ],
  },
    {
    id: 'chat5',
    participantIds: ['user1', 'user6'],
    unreadCount: 0,
    messages: [
        { id: 'msg9', senderId: 'user6', text: 'شكرًا على المساعدة اليوم!', timestamp: '4:30 عصرًا', read: true },
        { id: 'msg10', senderId: 'user1', text: 'على الرحب والسعة!', timestamp: '4:31 عصرًا', read: true },
    ],
  },
];
