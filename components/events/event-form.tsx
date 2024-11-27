'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Event } from '@/lib/types';

interface EventFormProps {
  onSubmit: (data: Omit<Event, 'id' | 'code' | 'ownerId' | 'participants' | 'expenses'>) => void;
  isSubmitting: boolean;
}

export function EventForm({ onSubmit, isSubmitting }: EventFormProps) {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [registrationDeadline, setRegistrationDeadline] = useState('');
  const [costDivisionType, setCostDivisionType] = useState<'equal' | 'consumption'>('equal');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      location,
      date,
      registrationDeadline,
      costDivisionType,
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Evento</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Local</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Data do Evento</Label>
              <Input
                id="date"
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="registrationDeadline">Prazo de Inscrição</Label>
              <Input
                id="registrationDeadline"
                type="datetime-local"
                value={registrationDeadline}
                onChange={(e) => setRegistrationDeadline(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="costDivisionType">Tipo de Divisão de Custos</Label>
            <Select
              value={costDivisionType}
              onValueChange={(value: 'equal' | 'consumption') => setCostDivisionType(value)}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de divisão" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="equal">Divisão Igual</SelectItem>
                <SelectItem value="consumption">Baseado no Consumo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Criando...' : 'Criar Evento'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}