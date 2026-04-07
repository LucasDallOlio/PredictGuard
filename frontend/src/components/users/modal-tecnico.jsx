"use client";

import { useState } from "react";
import { User, ChevronDown, Upload, Phone, Mail } from "lucide-react";
import { useTechnicians } from "@/hooks/useTechnicians";

export default function ModalAdicionarTecnico({ open, onClose }) {
  const { addTecnico } = useTechnicians(open);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState(""); 
  const [avatar, setAvatar] = useState(null);
  const [status, setStatus] = useState("Ativo");
  const [carregando, setCarregando] = useState(false);

  if (!open) return null;

  function limparCampos() {
    setNome("");
    setEmail("");
    setTelefone("");
    setSenha(""); 
    setAvatar(null);
    setStatus("Ativo");
  }

  async function handleAdicionar(e) {
    e.preventDefault();

    if (!nome || !email || !telefone || !senha) {
      return alert("Preencha todos os campos obrigatórios!");
    }

    setCarregando(true);

    const novoTecnico = {
      nome,
      email,
      telefone,
      senha, 
      src:
        avatar ||
        `https://ui-avatars.com/api/?name=${nome.replace(" ", "+")}`,
      fallback: nome
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase(),
      status,
    };

    try {
      await addTecnico(novoTecnico);

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
      <div className="w-full max-w-lg md:max-w-md rounded-(--radius) bg-card border border-border p-6 md:p-8 shadow-2xl relative">

        <h2 className="text-2xl md:text-3xl font-bold text-card-foreground mb-6 text-center">
          Adicionar Técnico
        </h2>

        <form onSubmit={handleAdicionar} className="space-y-5">

          <div className="flex flex-col relative">
            <label className="text-sm font-semibold mb-2">Nome</label>
            <User className="absolute left-3 top-[38px] w-5 h-5 text-muted-foreground mt-1" />
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: João Silva"
              className="w-full pl-10 border px-4 py-3 rounded"
            />
          </div>

          <div className="flex flex-col relative">
            <label className="text-sm font-semibold mb-2">Email</label>
            <Mail className="absolute left-3 top-[38px] w-5 h-5 text-muted-foreground mt-1" />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Ex: joao@gmail.com"
              className="w-full pl-10 border px-4 py-3 rounded"
            />
          </div>

              <div className="flex flex-col relative">
            <label className="text-sm font-semibold mb-2">Senha</label>
            <input
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Digite a senha"
              className="w-full border px-4 py-3 rounded"
            />
          </div>

          <div className="flex flex-col relative">
            <label className="text-sm font-semibold mb-2">Telefone</label>
            <Phone className="absolute left-3 top-[38px] w-5 h-5 text-muted-foreground mt-1" />
            <input
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              type="tel"
              placeholder="Ex: 11999999999"
              className="w-full pl-10 border px-4 py-3 rounded"
            />
          </div>

        
      

          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-2">
              Foto de perfil
            </label>

            <label className="flex items-center gap-2 cursor-pointer border px-4 py-3 rounded">
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
            <label className="text-sm font-semibold mb-2">Status</label>

            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border px-4 py-3 rounded appearance-none"
              >
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </select>

              <ChevronDown className="absolute right-3 top-4 w-4 h-4 text-muted-foreground" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                limparCampos();
                onClose();
              }}
              className="px-5 py-2 border rounded"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={carregando}
              className="px-5 py-2 bg-primary text-white rounded disabled:opacity-50"
            >
              {carregando ? "Adicionando..." : "Adicionar"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}