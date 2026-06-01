"use client";

import { useState } from "react";
import { TabelaMotores } from "@/components/engines/card/card";
import { Button } from "@/components/ui/button";
import { IconEngine } from "@tabler/icons-react";
import { ChevronDown, X } from "lucide-react";
import { ModalMotorDetalhes } from "@/components/engines/modal/modal-motor";
import { ModalCriarMotor } from "@/components/engines/modal/ModalCriarMotor";
import { useMotors } from "@/hooks/useMotors";
import { FunnelX } from 'lucide-react';

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
    filtroSetor,
    filtroStatusOperacional,
    filtroStatusSaude,
    alterarFiltroSetor,
    alterarFiltroStatusOperacional,
    alterarFiltroStatusSaude,
    limparFiltros,
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

  const SelectField = ({ value, onChange, placeholder, options }) => (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          h-10 w-[190px] appearance-none rounded-xl
          border border-gray-200 dark:border-zinc-700
          bg-white dark:bg-zinc-900
          px-3 pr-10 text-sm
          text-gray-700 dark:text-zinc-200
          outline-none
        "
      >
        <option value="">{placeholder}</option>

        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-zinc-500 pointer-events-none" />
    </div>
  );

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-3">
              <IconEngine className="w-8 h-8 text-primary" />
              Motores
            </h1>
            <p className="text-muted-foreground text-sm">
              Gerencie e monitore todos os motores cadastrados
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <SelectField
              value={filtroSetor}
              onChange={alterarFiltroSetor}
              placeholder="Filtrar setor"
              options={[
                { value: "linha_1", label: "Linha 1" },
                { value: "linha_2", label: "Linha 2" },
                { value: "linha_3", label: "Linha 3" },
              ]}
            />

            <SelectField
              value={filtroStatusOperacional}
              onChange={alterarFiltroStatusOperacional}
              placeholder="Status operacional"
              options={[
                { value: "ativa", label: "Ativa" },
                { value: "parada", label: "Parada" },
                { value: "manutencao", label: "Manutenção" },
              ]}
            />

            <SelectField
              value={filtroStatusSaude}
              onChange={alterarFiltroStatusSaude}
              placeholder="Status saúde"
              options={[
                { value: "ok", label: "OK" },
                { value: "alerta", label: "Alerta" },
              ]}
            />

            <button
              type="button"
              onClick={limparFiltros}
              className="
                h-10 w-10 flex items-center justify-center rounded-xl
                border border-gray-200 dark:border-zinc-700
                bg-white dark:bg-zinc-900
                text-gray-700 dark:text-zinc-200
                hover:bg-gray-50 dark:hover:bg-zinc-800
                transition
              "
              title="Limpar filtros"
              aria-label="Limpar filtros"
            >
              <FunnelX className="w-5 h-5" />
            </button>

            <Button onClick={() => setOpenCreateModal(true)}>
              + Adicionar Motor
            </Button>
          </div>
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