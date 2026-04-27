"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Thermometer, Activity, Trash2 } from "lucide-react";
import { ModalExcluirMotor } from "../modal/ModalExcluirMotor";

export function CardMotor({ motor, onClick, onDelete }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    try {
      setIsDeleting(true);

      await onDelete(motor.id); 

      setIsDeleteDialogOpen(false);
    } catch (err) {
      console.error("Erro ao excluir motor:", err);
      alert("Erro ao excluir motor");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <Card className="flex w-full max-w-6xl mx-auto flex-col md:flex-row overflow-hidden py-0">
        
        <div className="md:w-2/5 w-full h-48 md:h-auto shrink-0">
          <img
            src={motor.imagem}
            alt={motor.nome}
            className="h-full w-full object-cover"
          />
        </div>

        <CardContent className="flex flex-col justify-between p-6 w-full">
          <div>
            <CardTitle className="mb-2 text-xl">{motor.nome}</CardTitle>

            <p className="text-muted-foreground text-sm">
              Setor: {motor.setor}
            </p>

            <p className="text-muted-foreground text-sm mb-4">
              Código: {motor.cod_registro}
            </p>

            <div className="flex gap-4 flex-wrap">
              <div className="flex items-center gap-2 border rounded-lg px-3 py-1">
                <Thermometer size={16} />
                <span
                  className={
                    motor.temperatura > 85
                      ? "text-red-500 font-medium"
                      : "text-green-500 font-medium"
                  }
                >
                  {motor.temperatura}°C
                </span>
              </div>

              <div
                className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm ${
                  motor.vibracao === "Normal"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                <Activity size={16} />
                {motor.vibracao}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={onClick}>
              Ver detalhes
            </Button>

            <Button
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Trash2 size={16} />
              Excluir
            </Button>
          </div>
        </CardContent>
      </Card>

      <ModalExcluirMotor
        open={isDeleteDialogOpen}
        setOpen={setIsDeleteDialogOpen}
        motor={motor}
        onConfirm={handleDelete}
        loading={isDeleting}
      />
    </>
  );
}