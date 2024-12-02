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
  spent: Spent[];
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
  type_spent: 'hard_drink' | 'drink' | 'food' | 'pastime' | 'location';
}

export interface EventSpec extends Event {
  spentTotal: string
}

export interface AdditinalUser {
  hard_drink: boolean,
  drink: boolean,
  food: boolean,
  pastime: boolean,
  uuid_user: string,
  uuid_event: string
}