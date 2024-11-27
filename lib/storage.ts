import { User, Event, AuthState } from './types';

const STORAGE_KEYS = {
  AUTH: 'auth_state',
  EVENTS: 'events',
  USERS: 'users',
};

export const storage = {
  getAuth: (): AuthState => {
    if (typeof window === 'undefined') return { user: null, isAuthenticated: false };
    const data = localStorage.getItem(STORAGE_KEYS.AUTH);
    return data ? JSON.parse(data) : { user: null, isAuthenticated: false };
  },

  setAuth: (state: AuthState) => {
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(state));
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