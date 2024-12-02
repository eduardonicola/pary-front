import { useEffect, useState } from "react";
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
import { EventEdits, EventSpec } from "@/lib/types";
import { Textarea } from "../ui/textarea";
import axiosInstance from "@/hooks/axios/services";
import { toast } from "sonner";

export interface EditEventFormProps {
  event: EventSpec;
  onClose: () => void
  onUpdate: (newItens: EventEdits ) => void
}


export function EditEventForm({ event, onClose, onUpdate }: EditEventFormProps) {
  const [name, setName] = useState("");
  const [description, setDiscription] = useState("");
  const [locate, setLocate] = useState("");
  const [date_and_time, setDate] = useState("");
  const [date_stop_sub, setRegistrationDeadline] = useState("");
  const [egalitarian, setCostDivisionType] = useState(true);
  const [isSubmitting, setIsSubmitting ] = useState(false)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true)
    try {
      const response = await axiosInstance.post(`/event/${event.uuid_event}`, {
        name:name,
        description:description,
        locate:locate,
        date_and_time:new Date(date_and_time).toISOString(),
        date_stop_sub:new Date(date_stop_sub).toISOString(),
        egalitarian: egalitarian,
      })
      if(response.data){
        toast.success('Evento editado')
        setIsSubmitting(false)
        onUpdate(response.data)
      }
    } catch (error) {
      toast.error('Erro ao Atualizar')
    }
  };

  useEffect(()=>{
    const deteInit = new Date(event.date_and_time); 
    const dateStop = new Date(event.date_stop_sub); 

    deteInit.setHours(deteInit.getHours() - 3)
    dateStop.setHours(dateStop.getHours() - 3)

    const setDateAnd = deteInit.toISOString().slice(0, 16)
    const setStopdate= dateStop.toISOString().slice(0, 16)

    setName(event.name) 
    setDiscription(event.description)
    setLocate(event.locate)
    setDate(setDateAnd)
    setRegistrationDeadline(setStopdate)
    setCostDivisionType(event.egalitarian)
  },[event])

  return (
    <div>
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
            onClick={() => onClose()}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </div>
  );
}
