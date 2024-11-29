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
import { useRouter } from 'next/navigation';
import axiosInstance from '@/hooks/axios/services';
interface JoinEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventCode: string;
  resetlist: () => void
}


export function JoinEventDialog({
  open,
  onOpenChange,
  resetlist,
  eventCode,
}: JoinEventDialogProps) {
  const [hardDrinks, setHardDrinks] = useState(false);
  const [drinks, setDrinks] = useState(false);
  const [pastimeActivities, setPastimeActivities] = useState(false);
  const [food, setFood] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter()


  const handleJoin = async () => {
    setIsLoading(true);
    const auth = storage.getAuth();

    if (!auth) {
      toast.error('Usuário não autenticado');
      router.push('/login')
      setIsLoading(false);
      return;
    }

    try {
      const response = await  axiosInstance.post(`${'/subscription/'+eventCode}`, {
        hard_drink: hardDrinks,
        drink: drinks,
        food: food,
        pastime: pastimeActivities,
      })
  
      if(response.data.subscribe){
        toast.success('Você entrou no evento com sucesso!');
        onOpenChange(false);
        setIsLoading(false);
        resetlist()
      }
  
    } catch (error: any) {
      if(error?.response?.data?.message){
        toast.error(error.response.data.message);
        onOpenChange(false);
        setIsLoading(false);
        resetlist()
      }else{
        toast.error("Erro ao se iscrever");
        onOpenChange(false);
        setIsLoading(false);
        resetlist()
      }    
    }
  
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
          <div className="flex items-center space-x-2">
            <Checkbox
              id="food"
              checked={food}
              onCheckedChange={(checked) => setFood(checked as boolean)}
            />
            <Label htmlFor="food">Consumo de alimentos</Label>
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