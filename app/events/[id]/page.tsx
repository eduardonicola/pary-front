"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AdditinalUser, Event, EventSpec, Spent } from "@/lib/types";
import { storage } from "@/lib/storage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  MapPinIcon,
  ArrowLeft,
  Users,
  Wallet,
  Plus,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CreatSpent } from "@/components/events/creat-spent";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<EventSpec | null>(null);
  const [additional, setAdditional] = useState<AdditinalUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      const uniqueEvent = await storage.getUniqueEvent(params.id);
      setEvent(uniqueEvent);
    };
    const fetchAditionalUser = async () => {
      const addit = await storage.getUserAdditional(params.id);
      setAdditional(addit);
    };

    fetchEvent();
    fetchAditionalUser();
  }, [params.id]);

  if (!event) {
    return (
      <div className="container mx-auto py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <div className="text-center">Evento não encontrado</div>
      </div>
    );
  }
  const totalSpent = event.spent.reduce((acc, curr) => {
    const value = Number(curr.value); // Converte o valor para número
    const amount = curr.amount; // Obtém a quantidade
    return acc + value * amount; // Multiplica e adiciona ao acumulador
  }, 0);

  const spentPerson = event.spent.reduce((acc, curr) => {
    if (curr.type_spent == "location" || additional?.[curr.type_spent]) {
      const value = Number(curr.value); // Converte o valor para número
      const amount = curr.amount; // Obtém a quantidade
      return acc + value * amount; // Multiplica e adiciona ao acumulador
    } else {
      return acc;
    }
  }, 0);

  const  igualitPerson  = totalSpent / event.participants.length

  const handleCreateSpent = (e: React.MouseEvent<SVGSVGElement>) => {
      e.stopPropagation
    setIsModalOpen(!isModalOpen);
  };

  const addSpent = (newSpent: Spent) =>{
    event.spent.push(newSpent)
  }

  return (
    <div className="container mx-auto py-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
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

          <div className="space-y-4">
            <Accordion type="single" collapsible>
              <AccordionItem value="index-0">
                <AccordionTrigger>
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    <span className="font-medium">
                      Participantes ({event.participants.length})
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="w-full">
                    {event.participants.length > 0 ? (
                      event.participants.map((participant) => (
                        <div
                          key={participant.uuid_user}
                          className="text-sm text-muted-foreground"
                        >
                          {participant.name}
                        </div>
                      ))
                    ) : (
                      <div className="flex text-sm text-muted-foreground justify-center">
                        Sem participantes
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="grid gap-2"></div>
          </div>

          <div className="space-y-4">
            <Accordion type="single" collapsible>
              <AccordionItem value="index-0">
                <AccordionTrigger>
                  <div className="flex items-center">
                    <Wallet className="mr-2 h-4 w-4" />
                    <span className="font-medium">Despesas</span>
                    <Plus
                      onClick={(e) => handleCreateSpent(e)}
                      className="mx-2 h-4 w-4"
                    />
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <Accordion type="single" collapsible>
                    {event.spent.map((spent, index) => (
                      <AccordionItem key={index} value={`index-${index}`}>
                        <AccordionTrigger>{spent.name}</AccordionTrigger>
                        <AccordionContent>
                          <div
                            key={spent.uuid_spent}
                            className="flex justify-between text-sm"
                          >
                            <span>{spent.description} (x{spent.amount})</span>
                            <span>R$ {Number(spent.value).toFixed(2)}</span>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div className="space-y-2">
            <div className=" pt-2">
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span>R$ {totalSpent.toFixed(2)}</span>
              </div>  
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>Seu valor de consumo:</span>
                  <span>R$ {event.egalitarian ? igualitPerson.toFixed(2) : spentPerson.toFixed(2)}</span>
                </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <CreatSpent
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        addListSpent={addSpent}
        propsIdEvent={event.uuid_event}
      />
    </div>
  );
}
