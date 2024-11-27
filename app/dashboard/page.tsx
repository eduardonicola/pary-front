'use client';

import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { storage } from '@/lib/storage';
import { Event } from '@/lib/types';
import { EventList } from '@/components/events/event-list';
import { JoinEventDialog } from '@/components/events/join-event-dialog';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [eventCode, setEventCode] = useState('');
  const auth = storage.getAuth();

  useEffect(() => {
    if (!auth.isAuthenticated) {
      router.push('/login');
      return;
    }
    setEvents(storage.getEvents());
  }, [router]);

  const createdEvents = events.filter(event => event.ownerId === auth.user?.id);
  const participatingEvents = events.filter(
    event => event.participants.some(p => p.userId === auth.user?.id && p.role !== 'owner')
  );

  const handleCreateEvent = () => {
    router.push('/events/create');
  };

  const handleJoinEvent = () => {
    setShowJoinDialog(true);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Meus Eventos</h1>
        <div className="flex gap-4">
          <div className="flex gap-2">
            <Input
              placeholder="Código do evento"
              value={eventCode}
              onChange={(e) => setEventCode(e.target.value)}
              className="w-48"
            />
            <Button onClick={handleJoinEvent}>
              Participar
            </Button>
          </div>
          <Button onClick={handleCreateEvent}>
            <Plus className="mr-2 h-4 w-4" />
            Criar Evento
          </Button>
        </div>
      </div>

      <Tabs defaultValue="created" className="space-y-4">
        <TabsList>
          <TabsTrigger value="created">Eventos Criados</TabsTrigger>
          <TabsTrigger value="participating">Eventos Participando</TabsTrigger>
        </TabsList>
        <TabsContent value="created">
          <EventList events={createdEvents} />
        </TabsContent>
        <TabsContent value="participating">
          <EventList events={participatingEvents} />
        </TabsContent>
      </Tabs>

      <JoinEventDialog
        open={showJoinDialog}
        onOpenChange={setShowJoinDialog}
        eventCode={eventCode}
      />
    </div>
  );
}