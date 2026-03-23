"use client";

import { useState } from "react";
import { User, AlertCircle, ChevronDown, Upload } from "lucide-react";
import { Phone, PhoneCall } from "lucide-react";

export default function ModalAdicionarTecnico({ open, onClose, onAddTecnico }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [status, setStatus] = useState("Ativo");
  const [carregando, setCarregando] = useState(false);

  if (!open) return null;

  function limparCampos() {
    setNome("");
    setEmail("");
    setTelefone("");
    setAvatar("");
    setStatus("Ativo");
  }

  async function handleAdicionar(e) {
    e.preventDefault();
    if (!nome || !email || !telefone) return alert("Preencha todos os campos obrigatórios!");

    setCarregando(true);

    const novoTecnico = {
      nome,
      email,
      telefone,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 min-h-screen">
      <div className="w-full max-w-lg md:max-w-md rounded-3xl bg-zinc-900 border border-zinc-800 p-6 md:p-8 shadow-2xl relative">

        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
          Adicionar Técnico
        </h2>

        <form onSubmit={handleAdicionar} className="space-y-5">


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


          <div className="flex flex-col relative">
            <label className="text-sm font-semibold text-zinc-300 mb-2">Email</label>
            <User className="absolute left-3 top-[38px] w-5 h-5 text-zinc-500 pointer-events-none mt-1" />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ex: joao@gmail.com"
              className="w-full pl-10 rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              type="email"
            />
          </div>

          <div className="flex flex-col relative">
            <label className="text-sm font-semibold text-zinc-300 mb-2">Telefone</label>
            <Phone className="absolute left-3 top-[38px] w-5 h-5 text-zinc-500 pointer-events-none mt-1" />
            <input
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="Ex: 119709867778"
              className="w-full pl-10 rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              type="tel"
            />
          </div>





          <div className="flex flex-col">
            <label className="text-sm font-semibold text-zinc-300 mb-2">
              Avatar (upload)
            </label>

            <label className="flex items-center gap-2 cursor-pointer rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-zinc-400 hover:border-blue-500 transition">
              <Upload className="w-5 h-5" />
              <span>Selecionar imagem</span>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setAvatar(e.target.files[0])}
                className="hidden"
              />
            </label>
          </div>



          <div className="flex flex-col relative">
            <label className="text-sm font-semibold text-zinc-300 mb-2">
              Status
            </label>

            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full appearance-none  pr-10 rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              >
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </select>


              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-zinc-400">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
          </div>

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