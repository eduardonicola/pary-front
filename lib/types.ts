export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export interface Event {
  id: string;
  code: string;
  name: string;
  location: string;
  date: string;
  registrationDeadline: string;
  costDivisionType: 'equal' | 'consumption';
  ownerId: string;
  participants: Participant[];
  expenses: Expense[];
}

export interface Participant {
  userId: string;
  role: 'owner' | 'manager' | 'participant';
  preferences: {
    hardDrinks: boolean;
    drinks: boolean;
    pastimeActivities: boolean;
  };
}

export interface Expense {
  id: string;
  name: string;
  quantity: number;
  value: number;
  category: 'hardDrinks' | 'drinks' | 'food' | 'location';
  createdBy: string;
  date: string;
}
