import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { DialogFooter, DialogHeader } from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Participant } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useEffect, useState } from "react";
import axiosInstance from "@/hooks/axios/services";
import { toast } from "sonner";

interface ModalEditLevelProps {
  isOpen: boolean;
  onClose: () => void;
  editList: (data: Participant) => void;
  userSelected: Participant
  uuid_event: string
}

export default function ModalEditLevel({
  isOpen,
  onClose,
  editList,
  userSelected,
  uuid_event
}: ModalEditLevelProps) {
  useEffect(()=>{
    setNewLevel(userSelected.user_level)
  },[userSelected])

  const [level, setNewLevel] = useState< 'owner' |'manager' | 'guest'>('guest');

  const handleSubmit = async () =>{
    const clone = {...userSelected}
    clone.user_level = level

    try {
      const { data } = await axiosInstance.post(`/subscription/level/${uuid_event}`, clone)
  
      if(data){
        toast.success('Editado com sucesso')
        editList(data)
        onClose()
      }
      
    } catch (error) {
      console.error(error)
      toast.error('Não foi possivel fazer a alteração')
      
    }

  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar nivel do usuario</DialogTitle>
        </DialogHeader>
        <Label htmlFor="userLevel">Editar Usuario</Label>
        <Select
            value={level}
            onValueChange={(value: "guest" | "manager") =>
              setNewLevel(value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo de divisão" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="guest">Convidado</SelectItem>
              <SelectItem value="manager">Gestor</SelectItem>
            </SelectContent>
          </Select>
        <DialogFooter>  
          <Button variant="outline" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} type="submit">
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
