'use client';

import { Event } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CalendarIcon, MapPinIcon } from 'lucide-react';
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
        <Card key={event.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>{event.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(new Date(event.date), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPinIcon className="mr-2 h-4 w-4" />
                {event.location}
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