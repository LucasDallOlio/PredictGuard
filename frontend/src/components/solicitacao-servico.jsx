"use client";

import { useState } from "react";

export default function ServiceRequestModal({ open, onClose, service }) {
  const [machine, setMachine] = useState("");
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState("media");
  const [reportDate, setReportDate] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);

    const data = {
      service,
      machine,
      description,
      urgency,
      reportDate,
    };

    try {
      const response = await fetch("/api/service-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Erro ao enviar solicitação");
      }

      const result = await response.json();
      console.log("Resposta da API:", result);

      // limpar formulário
      setMachine("");
      setDescription("");
      setUrgency("media");
      setReportDate("");

      onClose();

    } catch (error) {
      console.error(error);
      alert("Erro ao enviar solicitação");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">

      <div className="w-full max-w-lg rounded-lg bg-zinc-900 border border-zinc-800 p-6">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">
            Solicitar {service}
          </h2>

          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Máquina */}
          <div>
            <label className="block text-sm text-zinc-300 mb-1">
              Máquina
            </label>

            <input
              value={machine}
              onChange={(e) => setMachine(e.target.value)}
              placeholder="Ex: Compressor 01"
              className="w-full rounded-md bg-zinc-950 border border-zinc-800 px-3 py-2 text-white"
            />
          </div>

          {/* Urgência */}
          <div>
            <label className="block text-sm text-zinc-300 mb-1">
              Nível de urgência
            </label>

            <select
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
              className="w-full rounded-md bg-zinc-950 border border-zinc-800 px-3 py-2 text-white"
            >
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
              <option value="critica">Crítica</option>
            </select>
          </div>

          {/* Data */}
          <div>
            <label className="block text-sm text-zinc-300 mb-1">
              Data do reporte
            </label>

            <input
              type="text"
              value={reportDate}
              onChange={(e) => setReportDate(e.target.value)}
              placeholder="DD/MM/AAAA"
              className="w-full rounded-md bg-zinc-950 border border-zinc-800 px-3 py-2 text-white"
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm text-zinc-300 mb-1">
              Descrição do problema
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o problema..."
              className="w-full rounded-md bg-zinc-950 border border-zinc-800 px-3 py-2 text-white"
            />
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-3 pt-4">

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-zinc-700 text-zinc-300"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50"
            >
              {loading ? "Enviando..." : "Enviar solicitação"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}