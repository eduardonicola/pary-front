'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EventForm } from '@/components/events/event-form';
import { storage } from '@/lib/storage';
import { Event } from '@/lib/types';
import { toast } from 'sonner';

export default function CreateEventPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (eventData: Omit<Event, 'id' | 'code' | 'ownerId' | 'participants' | 'expenses'>) => {
    setIsSubmitting(true);
    try {
      const auth = storage.getAuth();
      if (!auth.user) {
        toast.error('Usuário não autenticado');
        router.push('/login');
        return;
      }

      const newEvent: Event = {
        ...eventData,
        id: crypto.randomUUID(),
        code: Math.random().toString(36).substring(2, 8).toUpperCase(),
        ownerId: auth.user.id,
        participants: [{
          userId: auth.user.id,
          role: 'owner',
          preferences: {
            hardDrinks: false,
            drinks: false,
            pastimeActivities: false,
          }
        }],
        expenses: []
      };

      const events = storage.getEvents();
      storage.setEvents([...events, newEvent]);
      
      toast.success('Evento criado com sucesso!');
      router.push('/dashboard');
    } catch (error) {
      toast.error('Erro ao criar evento');
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