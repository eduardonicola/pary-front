export interface User {
  uuid_user: string;
  name: string;
  email: string;
}

export interface Event {
  uuid_event: string;
  name: string;
  locate: string;
  description: string;
  date_and_time: string;
  date_stop_sub: string;
  egalitarian: boolean;
  userLevel: 'guest'| 'owner' | 'manager';
  participants: Participant[];
  spents: Spent[];
}

export interface Participant {
  uuid_user: string;
  name: string  
}

export interface Spent {
  uuid_spent: string;
  name: string;
  description: string;
  amount: number;
  value: string;
  type_spent: 'hard_drink' | 'drink' | 'food' | 'pastime';
}

