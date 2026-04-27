"use client";

import { useState } from "react";
import { CardMotor } from "@/components/engines/card/card";
import { Button } from "@/components/ui/button";
import { IconEngine } from "@tabler/icons-react";
import { ModalMotorDetalhes } from "@/components/engines/modal/modal-motor";
import { ModalCriarMotor } from "@/components/engines/modal/ModalCriarMotor";
import { useMotors } from "@/hooks/useMotors";

export default function MotoresPage() {
  const { motores, deletarMotor, addMotor, loading } = useMotors();

  const [open, setOpen] = useState(false);
  const [motorSelecionado, setMotorSelecionado] = useState(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);

  async function handleDelete(id) {
    try {
      await deletarMotor(id);
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir motor");
    }
  }

  async function handleSaveNovoMotor(novoMotor) {
    try {
      await addMotor(novoMotor);
    } catch (err) {
      console.error(err);
      alert("Erro ao criar motor");
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto space-y-6">

             <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-3">
              <IconEngine className="w-8 h-8 text-primary" />
              Motores
            </h1>
            <p className="text-muted-foreground text-sm">
              Gerencie e monitore todos os motores cadastrados
            </p>
          </div>

          <Button onClick={() => setOpenCreateModal(true)}>
            + Adicionar Motor
          </Button>
        </div>

        {loading && <p>Carregando...</p>}

        <div className="grid gap-4">
          {motores.map((motor) => (
            <CardMotor
              key={motor.id}
              motor={motor}
              onDelete={handleDelete}
              onClick={() => {
                setMotorSelecionado(motor);
                setOpen(true);
              }}
            />
          ))}
        </div>
      </div>

      <ModalMotorDetalhes
        open={open}
        setOpen={setOpen}
        motor={motorSelecionado}
        onDelete={handleDelete}
      />

      <ModalCriarMotor
        open={openCreateModal}
        setOpen={setOpenCreateModal}
        onSave={handleSaveNovoMotor}
      />
    </div>
  );
}


  