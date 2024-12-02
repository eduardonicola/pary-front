import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";

export interface ConfirmActionProps {
  isOpen: boolean,
  title: string
  onClose: () => void;
  callConfirmAction: () => void,
  children?: React.ReactNode
}

export function ConfirmAction ({isOpen, title, onClose, callConfirmAction , children}: ConfirmActionProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children && <div className="flex justify-center">{children}</div>}
        <DialogFooter className="flex sm:justify-center w-full justify-center w-full">
          <Button
            variant="outline"
            onClick={() => onClose()}
          >
            Cancelar
          </Button>
          <Button variant={"red"} onClick={callConfirmAction} >
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}