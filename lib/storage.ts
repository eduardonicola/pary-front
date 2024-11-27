import { User, Event } from './types';

const STORAGE_KEYS = {
  AUTH: 'auth_state',
  EVENTS: 'events',
  USERS: 'users',
};

export const storage = {
  getAuth: (): string | null => {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(STORAGE_KEYS.AUTH);
    return data ? data : null;
  },

  setAuth: (state: string) => {
    localStorage.setItem(STORAGE_KEYS.AUTH, state);
  },

  clearAuth: () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  },

  getEvents: (): Event[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.EVENTS);
    return data ? JSON.parse(data) : [];
  },

  setEvents: (events: Event[]) => {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  },

  getUsers: (): User[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  },

  setUsers: (users: User[]) => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },
};