"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash2, UserPlus, Users, Pencil, Sun, Moon, ShieldCheck, Wrench, ChevronLeft, ChevronRight } from "lucide-react";
import ModalAdicionarTecnico from "@/components/users/modal-tecnico";
import ModalEditarTecnico from "@/components/users/modal-editar-tecnico";
import { useTechnicians } from "@/hooks/useTechnicians";
import { Button } from "../ui/button";

export default function UsersTable() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalRemoverOpen, setModalRemoverOpen] = useState(false);
  const [tecnicoSelecionado, setTecnicoSelecionado] = useState(null);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [tecnicoEditando, setTecnicoEditando] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  const {
    tecnicos,
    loading,
    adicionarTecnico,
    removerTecnico,
    atualizarTecnico,
    pagina,
    totalPaginas,
    proximaPagina,
    paginaAnterior,
  } = useTechnicians();

  const handleAddTecnico = async (novoTecnico) => {
    try {
      await adicionarTecnico(novoTecnico);
      setModalOpen(false);
    } catch (err) {
      console.error(err);
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

  const handleAbrirEditar = (tec) => {
    setTecnicoEditando(tec);
    setModalEditarOpen(true);
  };

  const handleSalvarEdicao = async (id, payload) => {
    try {
      await atualizarTecnico(id, payload);
      setModalEditarOpen(false);
      setTecnicoEditando(null);
    } catch (err) {
      console.error(err);
      alert("Erro ao editar técnico");
    }
  };

  return (
    <div className="min-h-screen  dark:bg-zinc-950 transition-colors duration-300">
      <div className="w-full max-w-6xl mx-auto py-10 px-4 md:px-6 space-y-6">

        {/* Modais */}
        <ModalAdicionarTecnico
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onAddTecnico={handleAddTecnico}
        />

        <ModalEditarTecnico
          open={modalEditarOpen}
          onClose={() => {
            setModalEditarOpen(false);
            setTecnicoEditando(null);
          }}
          onEditTecnico={handleSalvarEdicao}
          tecnico={tecnicoEditando}
        />

        {/* Modal Remover */}
        {modalRemoverOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-gray-100 dark:border-zinc-700">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/20 mx-auto mb-4">
                <Trash2 className="w-5 h-5 text-red-500" />
              </div>
              <h2 className="text-lg font-bold text-gray-800 dark:text-zinc-100 text-center">
                Remover Técnico
              </h2>
              <p className="text-sm text-gray-500 dark:text-zinc-400 text-center mt-2">
                Tem certeza que deseja remover{" "}
                <span className="font-semibold text-gray-700 dark:text-zinc-200">
                  {tecnicoSelecionado?.nome}
                </span>
                ? Essa ação não pode ser desfeita.
              </p>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setModalRemoverOpen(false)}
                  className="flex-1 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 text-sm font-medium text-gray-600 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarRemocao}
                  className="flex-1 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition"
                >
                  Remover
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-sky-500 shadow-md shadow-sky-200 dark:shadow-sky-900">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-gray-800 dark:text-zinc-100">
                Gestão de Técnicos
              </h1>
              <p className="text-sm text-gray-400 dark:text-zinc-500">
                {tecnicos.length} técnico{tecnicos.length !== 1 ? "s" : ""} na página
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold shadow-md shadow-sky-200 dark:shadow-sky-900 transition"
            >
              <UserPlus size={16} />
              Adicionar Técnico
            </button>
          </div>
        </div>

        {/* Card da Tabela */}
        <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-400 dark:text-zinc-500">Carregando técnicos...</p>
            </div>
          ) : tecnicos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <Users className="w-10 h-10 text-gray-200 dark:text-zinc-700" />
              <p className="text-sm text-gray-400 dark:text-zinc-500">Nenhum técnico encontrado</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-zinc-800">
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                      Usuário
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                      Telefone
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-5 py-3.5 text-right text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-50 dark:divide-zinc-800">
                  {tecnicos.map((tec) => (
                    <tr
                      key={tec.id}
                      className="group hover:bg-sky-50/50 dark:hover:bg-sky-950/20 transition-colors"
                    >
                      {/* Usuário */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border-2 border-gray-100 dark:border-zinc-700 shadow-sm">
                            <AvatarImage src={tec.foto || ""} />
                            <AvatarFallback className="bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300 font-semibold text-sm">
                              {tec.nome?.charAt(0)?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <p className="font-semibold text-gray-800 dark:text-zinc-100 leading-tight">
                            {tec.nome}
                          </p>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-5 py-4 text-gray-500 dark:text-zinc-400">
                        {tec.email}
                      </td>

                      {/* Telefone */}
                      <td className="px-5 py-4 text-gray-500 dark:text-zinc-400">
                        {tec.telefone}
                      </td>

                      {/* Tipo */}
                      <td className="px-5 py-4">
                        {tec.tipo === "admin" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-800">
                            <ShieldCheck size={11} />
                            Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-800">
                            <Wrench size={11} />
                            Técnico
                          </span>
                        )}
                      </td>

                      {/* Ações */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleAbrirEditar(tec)}
                            className="flex items-center justify-center w-8 h-8 rounded-lg border border-sky-200 dark:border-sky-800 text-sky-500 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/30 transition opacity-0 group-hover:opacity-100"
                            title="Editar"
                          >
                            <Pencil size={14} />
                          </button>

                          <button
                            onClick={() => handleRemoveTecnico(tec)}
                            className="flex items-center justify-center w-8 h-8 rounded-lg border border-red-200 dark:border-red-800 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition opacity-0 group-hover:opacity-100"
                            title="Remover"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
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
    </div>
  );
}