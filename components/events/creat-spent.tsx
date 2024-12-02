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
  isEditSpent: Spent | null
}

export function CreatSpent({ isOpen, onClose, addListSpent, propsIdEvent, isEditSpent }: ExpenseModalProps) {

  const handleSubmit = async (data: Spent | Omit<Spent, "uuid_spent">) => {
    if(data.amount <= 0){
      toast.error("Quantidade deve ser maior que 0")
      return
    }
    const isEdited = isEditSpent && isEditSpent.uuid_spent
    if(isEdited){
      delete data.uuid_spent
    }
    const url = isEdited ? `/spent/${isEditSpent.uuid_spent}` : '/spent'

    try {
      const resp = await axiosInstance.post(url, {...data, uuid_event: propsIdEvent})
      if(resp.data){
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
          <DialogTitle>{!isEditSpent ? 'Adicionar Despesa' : 'Editar Despesa'}</DialogTitle>
        </DialogHeader>
        <SpentForm isEditSpent={isEditSpent} onSubmit={handleSubmit} onCancel={onClose} />
      </DialogContent>
    </Dialog>
  );
}