"use client";

import { useState } from "react";
import { Cpu, ChevronDown, X, Thermometer, Activity } from "lucide-react";

export default function ModalAdicionarSensor({ open, onClose, onAddSensor, maquinas = [] }) {
  const [modelo, setModelo] = useState("");
  const [tipo, setTipo] = useState("temperatura");
  const [maquinaId, setMaquinaId] = useState("");
  const [carregando, setCarregando] = useState(false);

  if (!open) return null;

  function limparCampos() {
    setModelo("");
    setTipo("temperatura");
    setMaquinaId("");
  }

  async function handleAdicionar(e) {
    e.preventDefault();
    if (!modelo || !tipo) return alert("Preencha todos os campos obrigatórios!");
    setCarregando(true);
    try {
      await onAddSensor({
        modelo,
        tipo,
        maquina_id: maquinaId || null,
      });
      limparCampos();
      onClose();
    } catch (erro) {
      console.error(erro);
      alert("Erro ao adicionar sensor");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden border border-gray-100 dark:border-zinc-700">

        {/* Header */}
        <div className="bg-gradient-to-r from-sky-500 to-sky-400 px-6 py-5 flex items-center gap-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/20 flex-shrink-0">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-white font-bold text-base leading-tight">Adicionar Sensor</p>
            <p className="text-sky-100 text-xs mt-0.5">Preencha as informações do novo sensor</p>
          </div>
          <button
            type="button"
            onClick={() => { limparCampos(); onClose(); }}
            className="text-white/70 hover:text-white hover:bg-white/20 rounded-full p-1.5 transition flex-shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleAdicionar} className="px-6 py-5 space-y-4" autoComplete="off">

          {/* Modelo */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
              Modelo
            </label>
            <div className="relative">
              <Cpu className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 dark:text-zinc-500" />
              <input
                value={modelo}
                onChange={(e) => setModelo(e.target.value)}
                placeholder="Ex: PT100-XR, VIB-MEMS-200"
                autoComplete="off"
                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-800 dark:text-zinc-100 text-sm placeholder:text-gray-300 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Tipo + Máquina */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-400 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                Tipo
              </label>
              <div className="relative">
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-800 dark:text-zinc-100 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition"
                >
                  <option value="temperatura">Temperatura</option>
                  <option value="acelerometro">Acelerômetro</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 dark:text-zinc-500 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                Máquina <span className="text-gray-300 dark:text-zinc-600 font-normal normal-case">(opcional)</span>
              </label>
              <div className="relative">
                <select
                  value={maquinaId}
                  onChange={(e) => setMaquinaId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-800 dark:text-zinc-100 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition"
                >
                  <option value="">Sem vínculo</option>
                  {maquinas.map((m) => (
                    <option key={m.id} value={m.id}>{m.nome}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 dark:text-zinc-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Preview badge */}
          {modelo && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-sky-50 dark:bg-sky-900/20 border border-sky-100 dark:border-sky-800">
              {tipo === "temperatura" ? (
                <Thermometer className="w-4 h-4 text-sky-500 flex-shrink-0" />
              ) : (
                <Activity className="w-4 h-4 text-sky-500 flex-shrink-0" />
              )}
              <span className="text-sm font-medium text-sky-700 dark:text-sky-300 truncate">{modelo}</span>
              <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-800 text-sky-600 dark:text-sky-300 flex-shrink-0">
                {tipo === "temperatura" ? "Temperatura" : "Acelerômetro"}
              </span>
            </div>
          )}

          {/* Divisor */}
          <div className="border-t border-gray-100 dark:border-zinc-700 pt-2" />

          {/* Botões */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => { limparCampos(); onClose(); }}
              className="flex-1 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 text-sm font-medium text-gray-600 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={carregando}
              className="flex-1 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {carregando ? "Adicionando..." : "Adicionar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}