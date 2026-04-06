"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, UserPlus, Users } from "lucide-react";
import ModalAdicionarTecnico from "@/components/users/modal-tecnico";
import { useTechnicians } from "@/hooks/useTechnicians"; 

export default function UsersTable() {
  const [modalOpen, setModalOpen] = useState(false);

  
  const { tecnicos, loading, adicionarTecnico, removerTecnico, atualizarTecnico } = useTechnicians(modalOpen);


  const toggleStatus = async (id, statusAtual) => {
    try {
      const novoStatus = statusAtual === "Ativo" ? "Inativo" : "Ativo";
      await atualizarTecnico(id, { status: novoStatus });
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
      alert("Não foi possível atualizar o status");
    }
  };

  
  const handleAddTecnico = async (novoTecnico) => {
    try {
      await adicionarTecnico(novoTecnico);
      setModalOpen(false);
    } catch (err) {
      console.error("Erro ao adicionar técnico:", err);
      alert("Não foi possível adicionar o técnico");
    }
  };

  
  const handleRemoveTecnico = async (id) => {
    if (!confirm("Tem certeza que deseja remover este técnico?")) return;
    try {
      await removerTecnico(id);
    } catch (err) {
      console.error("Erro ao remover técnico:", err);
      alert("Não foi possível remover o técnico");
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-10 px-4 md:px-6 space-y-8 bg-white">

      
      <ModalAdicionarTecnico
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAddTecnico={handleAddTecnico}
      />

      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-6 h-6 text-sky-500" />
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-800">Gestão de Técnicos</h1>
          </div>
          <p className="text-gray-500">Visualize e gerencie as permissões dos técnicos do sistema</p>
        </div>

        <Button
          onClick={() => setModalOpen(true)}
          className="bg-sky-500 hover:bg-sky-600 text-white flex items-center gap-2 h-11 px-6 transition-all"
        >
          <UserPlus size={18} />
          <span>Adicionar Técnico</span>
        </Button>
      </div>

   
      <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6 text-center text-muted-foreground">Carregando técnicos...</div>
          ) : (
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow className="hover:bg-transparent border-gray-200">
                  <TableHead className="text-gray-600 font-semibold py-4">Usuário</TableHead>
                  <TableHead className="text-gray-600 font-semibold">Email</TableHead>
                  <TableHead className="text-gray-600 font-semibold">Telefone</TableHead>
                  <TableHead className="text-gray-600 font-semibold">Status</TableHead>
                  <TableHead className="text-gray-600 font-semibold text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {tecnicos.map((tec) => (
                  <TableRow key={tec.id} className="border-gray-200 hover:bg-sky-50 transition-colors">
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-gray-200">
                          <AvatarImage src={tec.src} />
                          <AvatarFallback>{tec.fallback}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-gray-700 whitespace-nowrap">{tec.name}</span>
                      </div>
                    </TableCell>

                    <TableCell className="text-gray-500 whitespace-nowrap">{tec.email}</TableCell>
                    <TableCell className="text-gray-500">{tec.area}</TableCell>

                    <TableCell>
                      <Badge
                        variant={tec.status === "Ativo" ? "default" : "secondary"}
                        className={tec.status === "Ativo"
                          ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-emerald-200"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"}
                      >
                        {tec.status}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleStatus(tec.id, tec.status)}
                          className="border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        >
                          {tec.status === "Ativo" ? "Desativar" : "Ativar"}
                        </Button>

                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleRemoveTecnico(tec.id)}
                          className="h-8 w-8"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}