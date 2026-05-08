"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Thermometer, Activity, Trash2, Eye } from "lucide-react";
import { ModalExcluirMotor } from "../modal/ModalExcluirMotor";

function LinhaMotor({ motor, onClick, onDelete }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <>
      <tr className="border-b transition-colors hover:bg-muted/50">
        <td className="p-3 font-medium">{motor.nome}</td>
        <td className="p-3 text-muted-foreground">{motor.setor}</td>
        <td className="p-3 text-muted-foreground">{motor.cod_registro}</td>

        <td className="p-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex items-center gap-1 border rounded-md px-2 py-1 text-xs w-max">
              <Thermometer size={14} />
              <span className={motor.temperatura > 85 ? "text-red-500 font-medium" : "text-green-500 font-medium"}>
                {motor.temperatura}°C
              </span>
            </div>

            <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs w-max ${motor.vibracao === "Normal"
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
              }`}>
              <Activity size={14} />
              {motor.vibracao}
            </div>
          </div>
        </td>

        <td className="p-3 text-right">
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => onClick(motor)}>
              <Eye size={16} className="mr-0 sm:mr-2" />
              <span className="hidden sm:inline">Ver detalhes</span>
            </Button>

            <Button
              variant="destructive"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </td>
      </tr>

      <ModalExcluirMotor
        open={isDeleteDialogOpen}
        setOpen={setIsDeleteDialogOpen}
        motor={motor}
        onConfirm={() => onDelete(motor.id)}
      />
    </>
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
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="rounded-md border bg-card shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/30">
            <tr>
              <th className="p-3 text-left">Nome</th>
              <th className="p-3 text-left">Setor</th>
              <th className="p-3 text-left">Código</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-right">Ações</th>
            </tr>
          </thead>

          <tbody>
            {motores.length > 0 ? (
              motores.map((motor) => (
                <LinhaMotor
                  key={motor.id}
                  motor={motor}
                  onClick={onClick}
                  onDelete={onDelete}
                />
              ))
            ) : (
              <tr>
                <td colSpan="5" className="h-24 text-center text-muted-foreground">
                  Nenhum motor para exibir.
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
          Página <strong>{pagina}</strong> de <strong>{totalPaginas}</strong>
        </span>

        <Button
          variant="outline"
          onClick={proximaPagina}
          disabled={pagina === totalPaginas}
        >
          Próxima →
        </Button>
      </div>

    </div>
  );
}