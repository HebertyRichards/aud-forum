export type MemberRole = 'default' | 'auditore' | 'leader';

export type Member = {
  id: number;
  avatar: string;
  username: string;
  role: MemberRole;
  humor?: string;
  joinDate: string;
  lastVisit: string;
  messages: number;
  hasPrivateMessage: boolean;
  hasWebsite: boolean;
};

export const members: Member[] = [
  {
    id: 1,
    avatar: 'https://avatar.iran.liara.run/public/3',
    username: 'Knalzin_Auditore',
    role: 'auditore',
    joinDate: '24/05/2020',
    lastVisit: 'Hoje às 11:15',
    messages: 7,
    hasPrivateMessage: true,
    hasWebsite: true,
  },
  {
    id: 2,
    avatar: 'https://avatar.iran.liara.run/public/12', 
    username: 'AizeN_Auditore',
    role: 'leader',
    joinDate: '06/05/2020',
    lastVisit: 'Sáb 24 Maio 2025 - 21:55',
    messages: 111,
    hasPrivateMessage: true,
    hasWebsite: true,
  },
  {
    id: 3,
    avatar: 'https://avatar.iran.liara.run/public/22', 
    username: 'Daddy',
    role: 'default',
    joinDate: '24/10/2020',
    lastVisit: 'Sex 7 Mar 2025 - 3:56',
    messages: 1,
    hasPrivateMessage: true,
    hasWebsite: false,
  },
  {
    id: 4,
    avatar: 'https://avatar.iran.liara.run/public/45', 
    username: 'itamey',
    role: 'default',
    joinDate: '06/09/2021',
    lastVisit: 'Qua 15 Jan 2025 - 2:07',
    messages: 1,
    hasPrivateMessage: true,
    hasWebsite: false,
  },
  {
    id: 5,
    avatar: 'https://avatar.iran.liara.run/public/55',
    username: 'bestplayer_Auditore',
    role: 'auditore',
    joinDate: '25/06/2020',
    lastVisit: 'Dom 21 Jul 2024 - 0:26',
    messages: 2,
    hasPrivateMessage: true,
    hasWebsite: false,
  },
  {
    id: 6,
    avatar: 'https://avatar.iran.liara.run/public/66',
    username: 'mkz',
    role: 'default',
    joinDate: '13/01/2024',
    lastVisit: 'Seg 15 Jan 2024 - 0:24',
    messages: 0,
    hasPrivateMessage: true,
    hasWebsite: false,
  },
  {
    id: 7,
    avatar: 'https://avatar.iran.liara.run/public/77', 
    username: 'whisk_',
    role: 'default',
    joinDate: '06/08/2020',
    lastVisit: 'Qui 19 Out 2023 - 7:25',
    messages: 2,
    hasPrivateMessage: true,
    hasWebsite: false,
  },
  {
    id: 8,
    avatar: 'https://avatar.iran.liara.run/public/88', 
    username: 'Nyas_Auditore',
    role: 'auditore',
    joinDate: '12/08/2021',
    lastVisit: 'Qui 19 Out 2023 - 7:17',
    messages: 0,
    hasPrivateMessage: true,
    hasWebsite: false,
  },
];