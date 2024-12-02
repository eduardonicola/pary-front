import { EventSpec } from "@/lib/types";
import { CalendarIcon, MapPinIcon } from "lucide-react";
import { ptBR } from "date-fns/locale";
import { format } from "date-fns";

export interface useEvent {
  event: EventSpec;
}

export function EventDetailsInfo({ event }: useEvent) {
  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center">
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span className="font-medium">Data do Evento:</span>
          </div>
          <p className="text-muted-foreground">
            {format(
              new Date(event.date_and_time),
              "d 'de' MMMM 'de' yyyy 'às' HH:mm",
              { locale: ptBR }
            )}
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

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <h3 className="text-lg font-medium mb-2">Descrição</h3>
          <p className="text-muted-foreground">{event.description}</p>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-medium mb-2">Tipo de Divisão</h3>
          <p className="text-muted-foreground">
            {event.egalitarian ? "Igalitaria" : "Por consumo"}
          </p>
        </div>
      </div>
    </div>
  );
}
