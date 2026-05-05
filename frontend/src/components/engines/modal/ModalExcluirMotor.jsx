"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export function ModalExcluirMotor({ open, setOpen, motor, onConfirm }) {
  const [loading, setLoading] = useState(false);

  if (!motor) return null;

  const handleExcluir = async () => {
    setLoading(true);

    try {
      await onConfirm(motor.id); 
      setOpen(false);
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir motor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full max-w-md sm:max-w-lg">

        <DialogHeader className="flex flex-col items-center text-center">
          <div className="bg-red-100 p-3 rounded-full mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>

          <DialogTitle className="text-xl">
            Excluir Motor
          </DialogTitle>

          <DialogDescription className="pt-2 text-base">
            Tem certeza que deseja excluir o motor{" "}
            <strong className="text-foreground">
              {motor.nome}
            </strong>{" "}
            (Código: {motor.cod_registro})?
            <br />
            <span className="text-red-500 font-medium text-sm">
              Essa ação não poderá ser desfeita.
            </span>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex gap-2 sm:justify-center mt-4">
          
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            Cancelar
          </Button>

          <Button
            variant="destructive"
            onClick={handleExcluir}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading ? "Excluindo..." : "Sim, excluir motor"}
          </Button>

        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}