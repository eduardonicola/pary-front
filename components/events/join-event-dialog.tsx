'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { storage } from '@/lib/storage';
import { toast } from 'sonner';

interface JoinEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventCode: string;
}

export function JoinEventDialog({
  open,
  onOpenChange,
  eventCode,
}: JoinEventDialogProps) {
  const [hardDrinks, setHardDrinks] = useState(false);
  const [drinks, setDrinks] = useState(false);
  const [pastimeActivities, setPastimeActivities] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleJoin = () => {
    setIsLoading(true);
    const auth = storage.getAuth();
    const events = storage.getEvents();
    const event = events.find(e => e.code === eventCode);

    if (!event) {
      toast.error('Evento não encontrado');
      setIsLoading(false);
      return;
    }

    if (!auth.user) {
      toast.error('Usuário não autenticado');
      setIsLoading(false);
      return;
    }

    if (event.participants.some(p => p.userId === auth.user?.id)) {
      toast.error('Você já participa deste evento');
      setIsLoading(false);
      return;
    }

    const updatedEvent = {
      ...event,
      participants: [
        ...event.participants,
        {
          userId: auth.user.id,
          role: 'participant',
          preferences: {
            hardDrinks,
            drinks,
            pastimeActivities,
          },
        },
      ],
    };

    const updatedEvents = events.map(e =>
      e.id === event.id ? updatedEvent : e
    );

    storage.setEvents(updatedEvents);
    toast.success('Você entrou no evento com sucesso!');
    onOpenChange(false);
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Participar do Evento</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hardDrinks"
              checked={hardDrinks}
              onCheckedChange={(checked) => setHardDrinks(checked as boolean)}
            />
            <Label htmlFor="hardDrinks">Consumirá bebidas alcoólicas</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="drinks"
              checked={drinks}
              onCheckedChange={(checked) => setDrinks(checked as boolean)}
            />
            <Label htmlFor="drinks">Consumirá bebidas não alcoólicas</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="pastimeActivities"
              checked={pastimeActivities}
              onCheckedChange={(checked) => setPastimeActivities(checked as boolean)}
            />
            <Label htmlFor="pastimeActivities">Participará de atividades de passatempo</Label>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button onClick={handleJoin} disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Confirmar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}