"use client";

import { useState } from "react";
import { Trash2, Cpu, Pencil, Thermometer, Activity, Link2, Link2Off } from "lucide-react";
import ModalAdicionarSensor from "@/components/sensors/modal-sensor";
import ModalEditarSensor from "@/components/sensors/modal-editar-sensor";
import { useSensors } from "@/hooks/useSensors";
import { Button } from "@/components/ui/button";

export default function SensorsTable() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalRemoverOpen, setModalRemoverOpen] = useState(false);
  const [sensorSelecionado, setSensorSelecionado] = useState(null);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [sensorEditando, setSensorEditando] = useState(null);

  const {
    sensores,
    maquinas,
    loading,
    adicionarSensor,
    removerSensor,
    atualizarSensor,
    pagina,
    totalPaginas,
    proximaPagina,
    paginaAnterior,
  } = useSensors();

  const handleAddSensor = async (novoSensor) => {
    try {
      await adicionarSensor(novoSensor);
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Não foi possível adicionar o sensor");
    }
  };

  const handleRemoveSensor = (sensor) => {
    setSensorSelecionado(sensor);
    setModalRemoverOpen(true);
  };

  const confirmarRemocao = async () => {
    try {
      await removerSensor(sensorSelecionado.id);
      setModalRemoverOpen(false);
      setSensorSelecionado(null);
    } catch (err) {
      console.error(err);
      alert("Erro ao remover sensor");
    }
  };

  const handleAbrirEditar = (sensor) => {
    setSensorEditando(sensor);
    setModalEditarOpen(true);
  };

  const handleSalvarEdicao = async (id, payload) => {
    try {
      await atualizarSensor(id, payload);
      setModalEditarOpen(false);
      setSensorEditando(null);
    } catch (err) {
      console.error(err);
      alert("Erro ao editar sensor");
    }
  };

  const getNomeMaquina = (maquinaId) => {
    if (!maquinaId) return null;
    return maquinas.find((m) => m.id === maquinaId)?.nome || `Máquina #${maquinaId}`;
  };

  return (
    <div className="min-h-screen dark:bg-zinc-950 transition-colors duration-300">
      <div className="w-full max-w-6xl mx-auto py-10 px-4 md:px-6 space-y-6">

        {/* Modal Adicionar */}
        <ModalAdicionarSensor
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onAddSensor={handleAddSensor}
          maquinas={maquinas}
        />

        {/* Modal Editar */}
        <ModalEditarSensor
          open={modalEditarOpen}
          onClose={() => {
            setModalEditarOpen(false);
            setSensorEditando(null);
          }}
          onEditSensor={handleSalvarEdicao}
          sensor={sensorEditando}
          maquinas={maquinas}
        />

        {/* Modal Remover */}
        {modalRemoverOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-gray-100 dark:border-zinc-700">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/20 mx-auto mb-4">
                <Trash2 className="w-5 h-5 text-red-500" />
              </div>
              <h2 className="text-lg font-bold text-gray-800 dark:text-zinc-100 text-center">
                Remover Sensor
              </h2>
              <p className="text-sm text-gray-500 dark:text-zinc-400 text-center mt-2">
                Tem certeza que deseja remover o sensor{" "}
                <span className="font-semibold text-gray-700 dark:text-zinc-200">
                  {sensorSelecionado?.modelo}
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
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-gray-800 dark:text-zinc-100">
                Gestão de Sensores
              </h1>
              <p className="text-sm text-gray-400 dark:text-zinc-500">
                {sensores.length} sensor{sensores.length !== 1 ? "es" : ""} na página
              </p>
            </div>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold shadow-md shadow-sky-200 dark:shadow-sky-900 transition"
          >
            <Cpu size={16} />
            Adicionar Sensor
          </button>
        </div>

        {/* Tabela */}
        <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-400 dark:text-zinc-500">Carregando sensores...</p>
            </div>
          ) : sensores.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <Cpu className="w-10 h-10 text-gray-200 dark:text-zinc-700" />
              <p className="text-sm text-gray-400 dark:text-zinc-500">Nenhum sensor encontrado</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-zinc-800">
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Sensor</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Tipo</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Máquina Vinculada</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Criado em</th>
                    <th className="px-5 py-3.5 text-right text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-zinc-800">
                  {sensores.map((sensor) => {
                    const nomeMaquina = getNomeMaquina(sensor.maquina_id);
                    return (
                      <tr
                        key={sensor.id}
                        className="group hover:bg-sky-50/50 dark:hover:bg-sky-950/20 transition-colors"
                      >
                        {/* Sensor */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-sky-50 dark:bg-sky-900/30 border border-sky-100 dark:border-sky-800 flex-shrink-0">
                              {sensor.tipo === "temperatura" ? (
                                <Thermometer className="w-4 h-4 text-sky-500 dark:text-sky-400" />
                              ) : (
                                <Activity className="w-4 h-4 text-sky-500 dark:text-sky-400" />
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800 dark:text-zinc-100 leading-tight">{sensor.modelo}</p>
                              <p className="text-xs text-gray-400 dark:text-zinc-500">ID #{sensor.id}</p>
                            </div>
                          </div>
                        </td>

                        {/* Tipo */}
                        <td className="px-5 py-4">
                          {sensor.tipo === "temperatura" ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border border-orange-100 dark:border-orange-800">
                              <Thermometer size={11} /> Temperatura
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 border border-violet-100 dark:border-violet-800">
                              <Activity size={11} /> Acelerômetro
                            </span>
                          )}
                        </td>

                        {/* Máquina */}
                        <td className="px-5 py-4">
                          {nomeMaquina ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-800">
                              <Link2 size={11} /> {nomeMaquina}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-50 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500 border border-gray-100 dark:border-zinc-700">
                              <LinkOff size={11} /> Sem vínculo
                            </span>
                          )}
                        </td>

                        {/* Data */}
                        <td className="px-5 py-4 text-gray-500 dark:text-zinc-400">
                          {sensor.data_criacao
                            ? new Date(sensor.data_criacao).toLocaleDateString("pt-BR")
                            : "—"}
                        </td>

                        {/* Ações */}
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleAbrirEditar(sensor)}
                              className="flex items-center justify-center w-8 h-8 rounded-lg border border-sky-200 dark:border-sky-800 text-sky-500 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/30 transition opacity-0 group-hover:opacity-100"
                              title="Editar"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => handleRemoveSensor(sensor)}
                              className="flex items-center justify-center w-8 h-8 rounded-lg border border-red-200 dark:border-red-800 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition opacity-0 group-hover:opacity-100"
                              title="Remover"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Paginação */}
        <div className="flex justify-center items-center gap-4">
          <Button variant="outline" onClick={paginaAnterior} disabled={pagina === 1}>
            ← Anterior
          </Button>
          <span className="text-sm">
            Página <strong>{pagina}</strong> de <strong>{totalPaginas}</strong>
          </span>
          <Button variant="outline" onClick={proximaPagina} disabled={pagina === totalPaginas}>
            Próxima →
          </Button>
        </div>

      </div>
    </div>
  );
}