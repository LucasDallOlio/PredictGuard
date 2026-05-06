"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Thermometer, Activity, Trash2, Eye } from "lucide-react";
import { ModalExcluirMotor } from "../modal/ModalExcluirMotor";

// 1. COMPONENTE DA LINHA
function LinhaMotor({ motor, onClick, onDelete }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <>
      <tr className="border-b transition-colors hover:bg-muted/50">
        {/* Coluna de Imagem removida daqui */}
        <td className="p-3 align-middle font-medium">{motor.nome}</td>
        <td className="p-3 align-middle text-muted-foreground">{motor.setor}</td>
        <td className="p-3 align-middle text-muted-foreground">{motor.cod_registro}</td>
        
        <td className="p-3 align-middle">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex items-center gap-1 border rounded-md px-2 py-1 text-xs w-max">
              <Thermometer size={14} />
              <span className={motor.temperatura > 85 ? "text-red-500 font-medium" : "text-green-500 font-medium"}>
                {motor.temperatura}°C
              </span>
            </div>
            <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs w-max ${
                motor.vibracao === "Normal" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
              }`}
            >
              <Activity size={14} />
              {motor.vibracao}
            </div>
          </div>
        </td>
        
        <td className="p-3 align-middle text-right">
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => onClick(motor)}>
              <Eye size={16} className="mr-0 sm:mr-2" />
              <span className="hidden sm:inline">Ver detalhes</span>
            </Button>
            
            {/* Botão de excluir apenas com o ícone */}
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

// 2. COMPONENTE DA TABELA COM PAGINAÇÃO
export function TabelaMotores({ motores = [], onClick, onDelete }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMotores = motores.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(motores.length / itemsPerPage);

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="rounded-md border bg-card text-card-foreground shadow-sm overflow-x-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b bg-muted/30">
            <tr className="border-b transition-colors">
              {/* Cabeçalho de Imagem removido daqui */}
              <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground">Nome</th>
              <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground">Setor</th>
              <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground">Código</th>
              <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground">Status</th>
              <th className="h-12 px-3 text-right align-middle font-medium text-muted-foreground">Ações</th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {currentMotores.length > 0 ? (
              currentMotores.map((motor, index) => (
                <LinhaMotor
                  key={motor.cod_registro || index} 
                  motor={motor}
                  onClick={onClick}
                  onDelete={onDelete}
                />
              ))
            ) : (
              <tr>
                {/* Ajustei o colSpan de 6 para 5 porque tiramos uma coluna */}
                <td colSpan="5" className="h-24 text-center align-middle text-muted-foreground">
                  Nenhum motor para exibir.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2 py-2">
          <span className="text-sm text-muted-foreground px-4">
            Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Próximo
          </Button>
        </div>
      )}
    </div>
  );
}