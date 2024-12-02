"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AdditinalUser, Event, EventEdits, EventSpec, Participant, Spent } from "@/lib/types";
import { storage } from "@/lib/storage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Users,
  Wallet,
  Plus,
  Pencil,
  Trash,
} from "lucide-react";
import { CreatSpent } from "@/components/events/creat-spent";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { EventDetailsInfo } from "@/components/events/exib-info-event";
import { toast } from "sonner";
import { ConfirmAction } from "@/components/events/action-confirm";
import axiosInstance from "@/hooks/axios/services";
import { EditEventForm } from "@/components/events/form-edit-event";
import ModalEditLevel from "@/components/events/user-level";

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<EventSpec | null>(null);
  const [additional, setAdditional] = useState<AdditinalUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditEvent, setEditEvent] = useState(false);
  const [selectedSpent, setSelectedSpent] = useState<Spent | null>(null);
  const [ modalLevelEdit , setModalLevelEdit ] = useState(false)
  const [ selectedUser , setSelectedUser] = useState<Participant>({
    name: '',
    user_level: 'guest',
    uuid_user: '',
  })
  const [modalActions, setModalActions] = useState({
    event: false,
    spent: false,
  });


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

  const igualitPerson = totalSpent / (event.participants.length + 1);

  const lislistLevels = {
    owner: "Dono",
    manager: "Gestor",
    guest: "Partcipante",
  };

  const isOwner = event.userLevel == "owner";

  const isLevelEdit = event.userLevel != "guest";

  const showLevel = (strin: "owner" | "manager" | "guest") =>
    lislistLevels[strin];

  const handleCreateSpent = (e: React.MouseEvent<SVGSVGElement>) => {
    e.stopPropagation;
    setIsModalOpen(!isModalOpen);
  };

  const handleEditSpent = (spent: Spent) => {
    setSelectedSpent(spent);
    setIsModalOpen(true);
  };

  const onCloseModalSpent = () => {
    setSelectedSpent(null);
    setIsModalOpen(false);
  };

  const handleCloseActions = () => {
    setModalActions({
      event:false,
      spent:false,
    })
    setSelectedSpent(null);
  } 

  const openDeletEvent = () =>{
    setModalActions({
      event:true,
      spent:false,
    })
  }

  const openDeletSpent = (spent : Spent) =>{
    setModalActions({
      event:false,
      spent:true,
    })
    setSelectedSpent(spent)
  }

  const clearListSpent = () =>{
    const index = event.spent.findIndex(item => item.uuid_spent == selectedSpent?.uuid_spent)
    if(index >= 0){
      event.spent.splice(index ,1)
    }
    handleCloseActions()
  }

  const updateEvent = async (eventEdited: EventEdits) =>{
    await  activeEdit()
    setEvent({...event, ...eventEdited})
  }

  const deleteSpent = async () => {
    if(selectedSpent && selectedSpent.uuid_spent){
      try {
        const response = await axiosInstance.delete(`/spent/${selectedSpent.uuid_spent}/${event.uuid_event}`)
        if(response.data.message){
          toast.success(response.data.message)
          clearListSpent()
        }
      } catch (error: any) {
        if(error?.response?.data?.message){
          toast.error(error.response.data.message)
        }
      }
    }
  }

  const deleteEvent = async () => {
    try {
      const response = await axiosInstance.delete(`/event/${event.uuid_event}`)
      if(response.data.message){
        toast.success(response.data.message)
        router.push('/dashboard')
      }
    } catch (error: any) {
      if(error?.response?.data?.message){
        toast.error(error.response.data.message)
        router.push('/dashboard')
      }
    }
  }

  const activeEdit = () => setEditEvent(!isEditEvent);

  const editList = (item: Participant) =>{    
    const index = event.participants.findIndex(parti => parti.uuid_user == selectedUser.uuid_user)
    event.participants[index].user_level = item.user_level
  }

  const onCloseEditLevel = () =>{
    setSelectedUser({
      name: '',
      user_level: 'guest',
      uuid_user: '',
    })
    setModalLevelEdit(false)
  }

  const onEditLevel = (select: Participant) => {
    setSelectedUser(select)
    setModalLevelEdit(true)

  }

  const addSpent = (newSpent: Spent) => {
    const findSpent = event.spent.findIndex(
      (item) => item.uuid_spent == newSpent.uuid_spent
    );
    if (findSpent >= 0) {
      event.spent[findSpent] = { ...event.spent[findSpent], ...newSpent };
      toast.success("Despesa editada");

      return;
    }
    event.spent.push(newSpent);
    toast.success("Despesa criada");
  };

  return (
    <div className="container mx-auto py-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex justify-between">
            {event.name}
            {isLevelEdit ? (
              <div className="flex gap-2 items-center">
                <Pencil
                  onClick={activeEdit}
                  className="h-5 w-5 text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                />
                <Trash onClick={openDeletEvent} className="h-5 w-5 text-muted-foreground hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer" />
              </div>
            ) : null}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {isEditEvent ? <EditEventForm onUpdate={updateEvent} onClose={activeEdit} event={event}/> : <EventDetailsInfo event={event} />}

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
                          className="flex text-sm text-muted-foreground justify-between"
                        >
                          <span>{participant.name} </span>
                          <div className="flex items-center ">
                            {isOwner && isLevelEdit ? (
                              <Pencil onClick={() => onEditLevel(participant)} className="h-4 mr-2 w-4 text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400" />
                            ) : null}
                            <span>{showLevel(participant.user_level)}</span>
                          </div>
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
                    <span className="font-medium">Despesas ({event.spent.length})</span>
                    {isLevelEdit ? (
                      <Plus
                        onClick={(e) => handleCreateSpent(e)}
                        className="mx-2 h-4 w-4"
                      />
                    ) : null}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <Accordion type="single" collapsible>
                    {event.spent.map((spent, index) => (
                      <AccordionItem key={index} value={`index-${index}`}>
                        <AccordionTrigger>
                          <div className="flex w-full justify-between">
                            <span>{spent.name}</span>
                            {isLevelEdit ? (
                              <div className="flex gap-2 items-center mr-2">
                                <Pencil
                                  onClick={() => handleEditSpent(spent)}
                                  className="h-4 w-4 text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                                />
                                <Trash onClick={() => openDeletSpent(spent)} className="h-4 w-4 text-muted-foreground hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer" />
                              </div>
                            ) : null}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div
                            key={spent.uuid_spent}
                            className="flex justify-between text-sm"
                          >
                            <span>
                              {spent.description} (x{spent.amount})
                            </span>
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
                <span>
                  R${" "}
                  {event.egalitarian
                    ? igualitPerson.toFixed(2)
                    : spentPerson.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <CreatSpent
        isEditSpent={selectedSpent}
        isOpen={isModalOpen}
        onClose={() => onCloseModalSpent()}
        addListSpent={addSpent}
        propsIdEvent={event.uuid_event}
      />

      <ConfirmAction 
        isOpen={modalActions['event']}
        onClose={handleCloseActions}
        title="Deletar evento"
        callConfirmAction={deleteEvent}
      >
        Ao confirmar essa ação não pode ser revertida 
      </ConfirmAction>
      <ConfirmAction 
        isOpen={modalActions['spent']}
        onClose={handleCloseActions}
        title="Deletar despesas"
        callConfirmAction={deleteSpent}
      >
        Ao confirmar essa ação não pode ser revertida 
      </ConfirmAction>
      <ModalEditLevel 
        uuid_event={event.uuid_event}
        isOpen={modalLevelEdit}
        editList={(e: Participant) => editList(e)}
        onClose={onCloseEditLevel}
        userSelected={selectedUser}
      />
    </div>
  );
}
