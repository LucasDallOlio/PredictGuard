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


  const [modalRemoverOpen, setModalRemoverOpen] = useState(false);
  const [tecnicoSelecionado, setTecnicoSelecionado] = useState(null);

  const { tecnicos, loading, adicionarTecnico, removerTecnico } = useTechnicians();

  const handleAddTecnico = async (novoTecnico) => {
    try {
      await adicionarTecnico(novoTecnico);
      setModalOpen(false);
    } catch (err) {
      console.error("Erro ao adicionar técnico:", err);
      alert("Não foi possível adicionar o técnico");
    }
  };

  
  const handleRemoveTecnico = (tec) => {
    setTecnicoSelecionado(tec);
    setModalRemoverOpen(true);
  };

 
  const confirmarRemocao = async () => {
    try {
      await removerTecnico(tecnicoSelecionado.id);
      setModalRemoverOpen(false);
      setTecnicoSelecionado(null);
    } catch (err) {
      console.error(err);
      alert("Erro ao remover técnico");
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-10 px-4 md:px-6 space-y-8 bg-white">

      
      <ModalAdicionarTecnico
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAddTecnico={handleAddTecnico}
      />

      
      {modalRemoverOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">

            <h2 className="text-xl font-bold text-gray-800">
              Remover Técnico
            </h2>

            <p className="text-gray-600">
              Tem certeza que deseja remover{" "}
              <span className="font-semibold text-gray-800">
                {tecnicoSelecionado?.nome}
              </span>
              ?
            </p>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setModalRemoverOpen(false)}
              >
                Cancelar
              </Button>

              <Button
                variant="destructive"
                onClick={confirmarRemocao}
              >
                Remover
              </Button>
            </div>
          </div>
        </div>
      )}

      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-6 h-6 text-sky-500" />
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-800">
              Gestão de Técnicos
            </h1>
          </div>
          <p className="text-gray-500">
            Visualize e gerencie os técnicos do sistema
          </p>
        </div>

        <Button
          onClick={() => setModalOpen(true)}
          className="bg-sky-500 hover:bg-sky-600 text-white flex items-center gap-2 h-11 px-6"
        >
          <UserPlus size={18} />
          <span>Adicionar Técnico</span>
        </Button>
      </div>

    
      <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6 text-center text-muted-foreground">
              Carregando técnicos...
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow className="border-gray-200">
                  <TableHead>Usuário</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {tecnicos.map((tec) => (
                  <TableRow key={tec.id} className="border-gray-200 hover:bg-sky-50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border">
                          <AvatarImage src={`/images/${tec.foto}`} />
                          <AvatarFallback>
                            {tec.nome?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>

                        <span className="font-medium text-gray-700">
                          {tec.nome}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-gray-500">
                      {tec.email}
                    </TableCell>

                    <TableCell className="text-gray-500">
                      {tec.telefone}
                    </TableCell>

                    <TableCell>
                      <Badge className="bg-gray-100 text-gray-700">
                        {tec.tipo}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleRemoveTecnico(tec)}
                        className="h-8 w-8"
                      >
                        <Trash2 size={14} />
                      </Button>
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