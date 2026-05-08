"use client";

import { useState } from "react";
import { TabelaMotores } from "@/components/engines/card/card";
import { Button } from "@/components/ui/button";
import { IconEngine } from "@tabler/icons-react";
import { ModalMotorDetalhes } from "@/components/engines/modal/modal-motor";
import { ModalCriarMotor } from "@/components/engines/modal/ModalCriarMotor";
import { useMotors } from "@/hooks/useMotors";

export default function MotoresPage() {
  const {
    motores,
    deletarMotor,
    addMotor,
    updateMotor,
    loading,
    pagina,
    totalPaginas,
    proximaPagina,
    paginaAnterior,
  } = useMotors();

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

        <div className="flex justify-between items-center">
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

        {loading && <p>Carregando motores...</p>}

        {!loading && (
          <TabelaMotores
            motores={motores}
            onDelete={handleDelete}
            onClick={(motor) => {
              setMotorSelecionado(motor);
              setOpen(true);
            }}
            pagina={pagina}
            totalPaginas={totalPaginas}
            proximaPagina={proximaPagina}
            paginaAnterior={paginaAnterior}
          />
        )}
      </div>

      <ModalMotorDetalhes
        open={open}
        setOpen={setOpen}
        motor={motorSelecionado}
        onDelete={handleDelete}
        onUpdate={updateMotor}
      />

      <ModalCriarMotor
        open={openCreateModal}
        setOpen={setOpenCreateModal}
        onSave={handleSaveNovoMotor}
      />
    </div>
  );
}