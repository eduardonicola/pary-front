'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Event } from '@/lib/types';
import { storage } from '@/lib/storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarIcon, MapPinIcon, ArrowLeft, Users, Wallet } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      const events = await storage.getEvents();
      const foundEvent = events.find(e => e.uuid_event === params.id);
      setEvent(foundEvent || null);
    };

    fetchEvent();
  }, [params.id]);

  if (!event) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Evento não encontrado</div>
      </div>
    );
  }

  const totalSpent = event.spents.reduce((acc, curr) => acc + Number(curr.value), 0);
  const spentPerPerson = event.egalitarian 
    ? totalSpent / (event.participants.length || 1)
    : 0;

  return (
    <div className="container mx-auto py-8">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{event.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center">
                <CalendarIcon className="mr-2 h-4 w-4" />
                <span className="font-medium">Data do Evento:</span>
              </div>
              <p className="text-muted-foreground">
                {format(new Date(event.date_and_time), "d 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <MapPinIcon className="mr-2 h-4 w-4" />
                <span className="font-medium">Localização:</span>
              </div>
              <p className="text-muted-foreground">{event.locate}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Descrição</h3>
            <p className="text-muted-foreground">{event.description}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                <span className="font-medium">Participantes ({event.participants.length})</span>
              </div>
            </div>
            <div className="grid gap-2">
              {event.participants.map((participant) => (
                <div key={participant.uuid_user} className="text-sm text-muted-foreground">
                  {participant.name}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <Wallet className="mr-2 h-4 w-4" />
              <span className="font-medium">Despesas</span>
            </div>
            <div className="space-y-2">
              {event.spent.map((spent) => (
                <div key={spent.uuid_spent} className="flex justify-between text-sm">
                  <span>{spent.description}</span>
                  <span>R$ {Number(spent.value).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-2">
                <div className="flex justify-between font-medium">
                  <span>Total:</span>
                  <span>R$ {totalSpent.toFixed(2)}</span>
                </div>
                {event.egalitarian && (
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <span>Valor por pessoa:</span>
                    <span>R$ {spentPerPerson.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}