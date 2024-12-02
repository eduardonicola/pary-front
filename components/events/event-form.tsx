"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Event } from "@/lib/types";
import { Textarea } from "../ui/textarea";

interface EventFormProps {
  onSubmit: (
    data: Omit<Event, "userLevel" | "participants" | "spents" | "uuid_event">
  ) => void;
  isSubmitting: boolean;
}

export function EventForm({ onSubmit, isSubmitting }: EventFormProps) {
  const [name, setName] = useState("");
  const [description, setDiscription] = useState("");
  const [locate, setLocate] = useState("");
  const [date_and_time, setDate] = useState("");
  const [date_stop_sub, setRegistrationDeadline] = useState("");
  const [egalitarian, setCostDivisionType] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      locate,
      description,
      date_and_time,
      date_stop_sub,
      egalitarian,
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
            <div className="space-y-2">
              <Label htmlFor="description">descrição</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDiscription(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="locate">Local</Label>
            <Input
              id="locate"
              value={locate}
              onChange={(e) => setLocate(e.target.value)}
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
                value={date_and_time}
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
                value={date_stop_sub}
                onChange={(e) => setRegistrationDeadline(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="costDivisionType">Tipo de Divisão de Custos</Label>
            <Select
              value={egalitarian ? "equal" : "consumption"}
              onValueChange={(value: "equal" | "consumption") =>
                setCostDivisionType(value == "equal")
              }
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
              {isSubmitting ? "Criando..." : "Criar Evento"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
