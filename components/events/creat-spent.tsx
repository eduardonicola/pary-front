import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { SpentForm } from './spent-form';
import { Spent } from '@/lib/types';
import axiosInstance from '@/hooks/axios/services';
import { toast } from 'sonner';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  addListSpent:(item : Spent) => void;
  propsIdEvent: string;
}

export function CreatSpent({ isOpen, onClose, addListSpent, propsIdEvent }: ExpenseModalProps) {

  const handleSubmit = async (data: Omit<Spent, "uuid_spent">) => {
    if(data.amount <= 0){
      toast.error("Quantidade deve ser maior que 0")
      return
    }
    try {
      const resp = await axiosInstance.post('/spent', {...data, uuid_event: propsIdEvent})
      if(resp.data){
        toast.success('Despesa criada')
        addListSpent(resp.data)
        onClose()
      }
    } catch (error: any) {
      if(error?.response?.data?.message[0]){
        toast.error(error.response.data.message[0])
      }
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Despesa</DialogTitle>
        </DialogHeader>
        <SpentForm onSubmit={handleSubmit} onCancel={onClose} />
      </DialogContent>
    </Dialog>
  );
}