import axiosInstance from '@/hooks/axios/services';
import { User, Event, EventSpec, AdditinalUser } from './types';
import Cookies from 'js-cookie';


const STORAGE_KEYS = {
  EVENTS: 'events',
  USER: 'user',
};
const COOKIE_KEYS = {
  AUTH: 'auth_state', 
};
export const storage = {
  getAuth: (): string | null => {
    // Recupera o valor do cookie
    return Cookies.get(COOKIE_KEYS.AUTH) || null;
  },

  setAuth: (state: string) => {
    // Define o valor no cookie
    Cookies.set(COOKIE_KEYS.AUTH, state, { expires: 360 }); 
  },

  clearAuth: () => {
    Cookies.remove(COOKIE_KEYS.AUTH);
  },

  getUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  },

  setUser: (user: User) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },
  getEvents: async () : Promise<Event[]> =>{
    try {
     const response = await axiosInstance.get('/event')
     return response.data
    } catch (error) {
      console.error(error)
    }
    return []
  },

  getUniqueEvent: async (uuid_event: string | string[]) : Promise<EventSpec | null> =>{

    try {
      const resp = await axiosInstance.get(`${'event/'+uuid_event}`)
      return resp.data
    } catch (error) {
      console.error(error);    
      return null
    }
  },
  getUserAdditional: async (uuid_event: string | string[]) : Promise<AdditinalUser | null> =>{
    try {
      const resp = await axiosInstance.get(`${'additional/'+uuid_event}`)
      return resp.data
    } catch (error) {
      console.error(error);    
      return null
    }
  }

};