import { useState } from 'react';
import { DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Spent } from '@/lib/types';

interface ExpenseFormProps {
  onSubmit: (data: Omit<Spent, 'uuid_spent'>) => void;
  onCancel: () => void;
}

export function SpentForm({ onSubmit, onCancel }: ExpenseFormProps) {
  const [formData, setFormData] = useState<Omit<Spent, 'uuid_spent'>>({
    name: '',
    description: '',
    amount: 0,
    value: '',
    type_spent: 'food',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        <div className="grid w-full gap-1.5">
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="grid w-full gap-1.5">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="grid w-full gap-1.5">
          <Label htmlFor="amount">Quantidade</Label>
          <Input
            id="amount"
            type="number"
            required
            min="0"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
          />
        </div>

        <div className="grid w-full gap-1.5">
          <Label htmlFor="value">Valor</Label>
          <Input
            id="value"
            required
            value={formData.value}
            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
          />
        </div>

        <div className="grid w-full gap-1.5">
          <Label htmlFor="type">Tipo de Despesa</Label>
          <Select
            value={formData.type_spent}
            onValueChange={(value) => setFormData({ ...formData, type_spent: value as Spent['type_spent'] })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="food">Comida</SelectItem>
              <SelectItem value="drink">Bebida</SelectItem>
              <SelectItem value="hard_drink">Bebida Alcoólica</SelectItem>
              <SelectItem value="pastime">Passatempo</SelectItem>
              <SelectItem value="location">Local</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Criar Despesa</Button>
      </DialogFooter>
    </form>
  );
}