"use client";

import { useState } from "react";
import { User, ChevronDown, Upload, Phone } from "lucide-react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 min-h-screen">
      <div className="w-full max-w-lg md:max-w-md rounded-[var(--radius)] bg-card border border-border p-6 md:p-8 shadow-2xl relative">

        <h2 className="text-2xl md:text-3xl font-bold text-card-foreground mb-6 text-center">
          Adicionar Técnico
        </h2>

        <form onSubmit={handleAdicionar} className="space-y-5">

          <div className="flex flex-col relative">
            <label className="text-sm font-semibold text-foreground mb-2">Nome</label>
            <User className="absolute left-3 top-[38px] w-5 h-5 text-muted-foreground pointer-events-none mt-1" />
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: João Silva"
              className="w-full pl-10 rounded-[calc(var(--radius)-4px)] bg-background border border-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring transition"
            />
          </div>

          <div className="flex flex-col relative">
            <label className="text-sm font-semibold text-foreground mb-2">Email</label>
            <User className="absolute left-3 top-[38px] w-5 h-5 text-muted-foreground pointer-events-none mt-1" />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ex: joao@gmail.com"
              className="w-full pl-10 rounded-[calc(var(--radius)-4px)] bg-background border border-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring transition"
              type="email"
            />
          </div>

          <div className="flex flex-col relative">
            <label className="text-sm font-semibold text-foreground mb-2">Telefone</label>
            <Phone className="absolute left-3 top-[38px] w-5 h-5 text-muted-foreground pointer-events-none mt-1" />
            <input
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="Ex: 119709867778"
              className="w-full pl-10 rounded-[calc(var(--radius)-4px)] bg-background border border-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring transition"
              type="tel"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-foreground mb-2">
              Foto de perfil (upload)
            </label>

            <label className="flex items-center gap-2 cursor-pointer rounded-[calc(var(--radius)-4px)] bg-background border border-input px-4 py-3 text-muted-foreground hover:border-ring hover:text-foreground transition">
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
            <label className="text-sm font-semibold text-foreground mb-2">
              Status
            </label>

            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full appearance-none pr-10 rounded-[calc(var(--radius)-4px)] bg-background border border-input px-4 py-3 text-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring transition"
              >
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </select>

              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-muted-foreground">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => { limparCampos(); onClose(); }}
              className="px-5 py-2 rounded-[calc(var(--radius)-4px)] border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={carregando}
              className="px-5 py-2 rounded-[calc(var(--radius)-4px)] bg-primary text-primary-foreground hover:bg-primary/90 font-semibold transition disabled:opacity-50"
            >
              {carregando ? "Adicionando..." : "Adicionar Técnico"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}