'use client';

import { Event } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CalendarIcon, Hash, MapPinIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface EventListProps {
  events: Event[];
}

export function EventList({ events }: EventListProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum evento encontrado
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <Card key={event.uuid_event} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>{event.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="space-y-1">
              <p className="text-sm font-medium">Codigo do evento:</p>
              <div className="flex items-center text-sm text-muted-foreground">
                <Hash className="mr-2 h-4 w-4" />
                <p className="w-full">{ event.uuid_event} </p> 
              </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Data do evento:</p>
                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(new Date(event.date_and_time), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium">Encerramento das inscrições:</p>
                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(new Date(event.date_stop_sub), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </div>
              </div>
              <div className="space-y-1">
              <p className="text-sm font-medium">Localização</p>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPinIcon className="mr-2 h-4 w-4" />
                {event.locate}
              </div>
              </div>

              <div className="text-sm">
                <span className="font-medium">Participantes:</span>{' '}
                {event.participants.length}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}