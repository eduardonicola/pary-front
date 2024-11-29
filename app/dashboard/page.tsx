'use client';

import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LogOutIcon, Plus } from 'lucide-react';
import { storage } from '@/lib/storage';
import { Event } from '@/lib/types';
import { EventList } from '@/components/events/event-list';
import { JoinEventDialog } from '@/components/events/join-event-dialog';
import { useRouter } from 'next/navigation';
import { validate as validateUUID } from 'uuid';
import { toast } from 'sonner';

export default function DashboardPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [eventCode, setEventCode] = useState('');
  const auth = storage.getAuth();

  const featchEvents = async () =>{
    setEvents(await storage.getEvents());
  }

  useEffect(() => {
    if (!auth) {
      router.push('/login');
      return;
    }
    featchEvents()
  }, [router]);

  const createdEvents = events.filter(event => event.userLevel === 'owner' || event.userLevel === 'manager');
  const participatingEvents = events.filter(event => event.userLevel !== 'owner');

  const handleCreateEvent = () => {
    router.push('/events/create');
  };

  const handleJoinEvent = () => {
    const isUUID = validateUUID(eventCode)
    if(eventCode && isUUID){
      setShowJoinDialog(true);
      return
    }
    toast.error('Informe um codigo de evento valido');
  };
  const handLogOut = () => {
    storage.clearAuth()
    router.push('/login')
  }
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
          <Button onClick={handLogOut}>
            <LogOutIcon className="mr-2 h-4 w-4" />
            Sair 
          </Button>
        </div>
      </div>

      <Tabs defaultValue="created" className="space-y-4">
        <TabsList>
          <TabsTrigger value="created">Genciando</TabsTrigger>
          <TabsTrigger value="participating">Participando</TabsTrigger>
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
        resetlist={featchEvents}
      />
    </div>
  );
}