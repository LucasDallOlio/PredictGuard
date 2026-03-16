"use client";

import { useState } from "react";
import { User, AlertCircle } from "lucide-react";

export default function ModalAdicionarTecnico({ open, onClose, onAddTecnico }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [area, setArea] = useState("");
  const [avatar, setAvatar] = useState("");
  const [status, setStatus] = useState("Ativo");
  const [carregando, setCarregando] = useState(false);

  if (!open) return null;

  function limparCampos() {
    setNome("");
    setEmail("");
    setArea("");
    setAvatar("");
    setStatus("Ativo");
  }

  async function handleAdicionar(e) {
    e.preventDefault();
    if (!nome || !email || !area) return alert("Preencha todos os campos obrigatórios!");

    setCarregando(true);

    const novoTecnico = {
      nome,
      email,
      area,
      src: avatar || `https://ui-avatars.com/api/?name=${nome.replace(" ", "+")}`,
      fallback: nome.split(" ").map(n => n[0]).join("").toUpperCase(),
      status,
    };

    try {
      // Envia para a API
      const resposta = await fetch("/api/technicians", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoTecnico),
      });

      if (!resposta.ok) throw new Error("Erro ao adicionar técnico");

      const tecnicoCriado = await resposta.json();

      if (onAddTecnico) onAddTecnico(tecnicoCriado);

      limparCampos();
      onClose();
    } catch (erro) {
      console.error(erro);
      alert("Erro ao adicionar técnico");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg md:max-w-md rounded-3xl bg-zinc-900 border border-zinc-800 p-6 md:p-8 shadow-2xl relative">
        
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
          Adicionar Técnico
        </h2>

        <form onSubmit={handleAdicionar} className="space-y-5">

          {/* Nome */}
          <div className="flex flex-col relative">
            <label className="text-sm font-semibold text-zinc-300 mb-2">Nome</label>
            <User className="absolute left-3 top-[38px] w-5 h-5 text-zinc-500 pointer-events-none mt-1" />
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: João Silva"
              className="w-full pl-10 rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col relative">
            <label className="text-sm font-semibold text-zinc-300 mb-2">Email</label>
            <User className="absolute left-3 top-[38px] w-5 h-5 text-zinc-500 pointer-events-none mt-1" />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ex: joao@gmail.com"
              className="w-full pl-10 rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
          </div>

          {/* Área */}
          <div className="flex flex-col relative">
            <label className="text-sm font-semibold text-zinc-300 mb-2">Área</label>
            <AlertCircle className="absolute left-3 top-[38px] w-5 h-5 text-zinc-500 pointer-events-none mt-1" />
            <input
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="Ex: Manutenção"
              className="w-full pl-10 rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
          </div>

          {/* Avatar */}
          <div className="flex flex-col relative">
            <label className="text-sm font-semibold text-zinc-300 mb-2">URL do Avatar (opcional)</label>
            <User className="absolute left-3 top-[38px] w-5 h-5 text-zinc-500 pointer-events-none mt-1" />
            <input
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://..."
              className="w-full pl-10 rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
          </div>

          {/* Status */}
          <div className="flex flex-col relative">
            <label className="text-sm font-semibold text-zinc-300 mb-2">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full pl-3 rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            >
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>
          </div>

          {/* Botões */}
          <div className="flex flex-col md:flex-row justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => { limparCampos(); onClose(); }}
              className="px-5 py-2 rounded-xl border border-zinc-700 text-zinc-300 hover:text-white transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={carregando}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition disabled:opacity-50"
            >
              {carregando ? "Adicionando..." : "Adicionar Técnico"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}