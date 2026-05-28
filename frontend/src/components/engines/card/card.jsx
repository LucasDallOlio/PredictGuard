"use client";

import { useState } from "react";
import {
  Trash2,
  Eye,
  AlertTriangle,
  CheckCircle2,
  Factory,
} from "lucide-react";

import { ModalExcluirMotor } from "../modal/ModalExcluirMotor";
import { Button } from "@/components/ui/button";

function LinhaMotor({ motor, onClick, onOpenDelete }) {
  const statusOp = motor.status_operacional?.toLowerCase();

  const statusOpStyle =
    statusOp === "ativa"
      ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800"
      : statusOp === "manutencao"
      ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-800"
      : "bg-gray-50 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 border border-gray-100 dark:border-zinc-700";

  const statusOpLabel =
    statusOp === "ativa"
      ? "Ativa"
      : statusOp === "manutencao"
      ? "Manutenção"
      : "Parada";

  return (
    <tr className="group hover:bg-sky-50/50 dark:hover:bg-sky-950/20 transition-colors">
    
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-sky-50 dark:bg-sky-900/30 border border-sky-100 dark:border-sky-800 flex-shrink-0">
            <Factory className="w-4 h-4 text-sky-500 dark:text-sky-400" />
          </div>

          <div>
            <p className="font-semibold text-gray-800 dark:text-zinc-100 leading-tight">
              {motor.nome}
            </p>

            <p className="text-xs text-gray-400 dark:text-zinc-500">
              {motor.cod_registro}
            </p>
          </div>
        </div>
      </td>


      <td className="px-5 py-4 text-gray-500 dark:text-zinc-400 text-sm">
        {motor.setor?.replace("_", " ")}
      </td>

      
      <td className="px-5 py-4">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusOpStyle}`}
        >
          {statusOpLabel}
        </span>
      </td>

  
      <td className="px-5 py-4">
        {motor.status_saude?.toLowerCase() === "alerta" ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800">
            <AlertTriangle size={11} />
            Alerta
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800">
            <CheckCircle2 size={11} />
            OK
          </span>
        )}
      </td>

      <td className="px-5 py-4">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onClick(motor)}
            className="flex items-center justify-center w-8 h-8 rounded-lg border border-sky-200 dark:border-sky-800 text-sky-500 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/30 transition opacity-0 group-hover:opacity-100"
            title="Ver detalhes"
          >
            <Eye size={14} />
          </button>

          <button
            onClick={() => onOpenDelete(motor)}
            className="flex items-center justify-center w-8 h-8 rounded-lg border border-red-200 dark:border-red-800 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition opacity-0 group-hover:opacity-100"
            title="Excluir"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}

export function TabelaMotores({
  motores = [],
  onClick,
  onDelete,
  pagina,
  totalPaginas,
  proximaPagina,
  paginaAnterior,
}) {
  const [motorDelete, setMotorDelete] = useState(null);

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
        {motores.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <Factory className="w-10 h-10 text-gray-200 dark:text-zinc-700" />

            <p className="text-sm text-gray-400 dark:text-zinc-500">
              Nenhum motor para exibir.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-zinc-800">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                    Motor
                  </th>

                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                    Setor
                  </th>

                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                    Operacional
                  </th>

                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                    Saúde
                  </th>

                  <th className="px-5 py-3.5 text-right text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50 dark:divide-zinc-800">
                {motores.map((motor) => (
                  <LinhaMotor
                    key={motor.id}
                    motor={motor}
                    onClick={onClick}
                    onOpenDelete={setMotorDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

   
      <div className="flex justify-center items-center gap-4">
        <Button
          variant="outline"
          onClick={paginaAnterior}
          disabled={pagina === 1}
        >
          ← Anterior
        </Button>

        <span className="text-sm">
          Página <strong>{pagina}</strong> de{" "}
          <strong>{totalPaginas}</strong>
        </span>

        <Button
          variant="outline"
          onClick={proximaPagina}
          disabled={pagina === totalPaginas}
        >
          Próxima →
        </Button>
      </div>

    
      <ModalExcluirMotor
        open={!!motorDelete}
        setOpen={(value) => {
          if (!value) setMotorDelete(null);
        }}
        motor={motorDelete}
        onConfirm={onDelete}
      />
    </div>
  );
}