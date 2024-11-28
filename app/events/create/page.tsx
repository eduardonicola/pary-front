'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EventForm } from '@/components/events/event-form';
import { storage } from '@/lib/storage';
import { Event } from '@/lib/types';
import { toast } from 'sonner';
import axiosInstance from '@/app/axios/services';

export default function CreateEventPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (eventData: Omit<Event, 'userLevel' | 'participants' | 'spents' | 'uuid_event'>) => {
    setIsSubmitting(true);
    try {
      const auth = storage.getAuth();
      const user = storage.getUser()
      if (!auth) {
        toast.error('Usuário não autenticado');
        router.push('/login');
        return;
      }
      const dateAndTime = new Date(eventData.date_and_time);
      const dateStopSub = new Date(eventData.date_stop_sub);
      
      if(dateStopSub < dateAndTime){
        toast.error('Prazo de inscrição deve ser maior que a data do evento');
        return
      }
      const newEvent: Omit<Event, 'userLevel' | 'participants' | 'spents' | 'uuid_event'> = {
        ...eventData,
      };
      newEvent.date_and_time  = dateAndTime.toISOString()
      newEvent.date_stop_sub  = dateStopSub.toISOString()

      const response = await axiosInstance.post('/event', newEvent)
      
      if(response.data){
        console.log(response);
      }

      toast.success('Evento criado com sucesso!');
      router.push('/dashboard');
    } catch (error) {
      toast.error(error.response.data.message[0]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Criar Novo Evento</h1>
      <EventForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}