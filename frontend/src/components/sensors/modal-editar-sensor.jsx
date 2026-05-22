"use client";

import { useState, useEffect } from "react";
import { Radio, ChevronDown, X, Thermometer, Activity } from "lucide-react";

export default function ModalEditarSensor({ open, onClose, onEditSensor, sensor, maquinas = [] }) {
  const [modelo, setModelo] = useState("");
  const [tipo, setTipo] = useState("temperatura");
  const [maquinaId, setMaquinaId] = useState("");
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (open && sensor) {
      setModelo(sensor.modelo || "");
      setTipo(sensor.tipo || "temperatura");
      setMaquinaId(sensor.maquina_id ? String(sensor.maquina_id) : "");
    }
  }, [open, sensor]);

  if (!open) return null;

  async function handleSalvar(e) {
    e.preventDefault();
    if (!sensor?.id) return;
    if (!modelo || !tipo) return alert("Preencha todos os campos obrigatórios!");
    setCarregando(true);
    try {
      await onEditSensor(sensor.id, {
        modelo,
        tipo,
        maquina_id: maquinaId || null,
      });
      onClose();
    } catch (err) {
      console.error(err);
      alert("Erro ao editar sensor");
    } finally {
      setCarregando(false);
    }
  }

  const TipoIcon = tipo === "temperatura" ? Thermometer : Activity;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden border border-gray-100 dark:border-zinc-700">

        {/* Header */}
        <div className="bg-gradient-to-r from-sky-500 to-sky-400 px-6 py-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-white/60 shadow-md bg-white/20 overflow-hidden flex-shrink-0 flex items-center justify-center">
            <TipoIcon className="w-5 h-5 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-base leading-tight truncate">{modelo || "Sensor"}</p>
            <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white">
              {tipo === "temperatura"
                ? <><Thermometer size={11} /> Temperatura</>
                : <><Activity size={11} /> Acelerômetro</>
              }
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-white/70 hover:text-white hover:bg-white/20 rounded-full p-1.5 transition flex-shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSalvar} className="px-6 py-5 space-y-4" autoComplete="off">

          {/* Modelo */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
              Modelo
            </label>
            <div className="relative">
              <Radio className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 dark:text-zinc-500" />
              <input
                value={modelo}
                onChange={(e) => setModelo(e.target.value)}
                placeholder="Ex: PT100-XR, VIB-MEMS-200"
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
                    <option key={m.id} value={String(m.id)}>{m.nome}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 dark:text-zinc-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Divisor */}
          <div className="border-t border-gray-100 dark:border-zinc-700 pt-2" />

          {/* Botões */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 text-sm font-medium text-gray-600 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={carregando}
              className="flex-1 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {carregando ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}