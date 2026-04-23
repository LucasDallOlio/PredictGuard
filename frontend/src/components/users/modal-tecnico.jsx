"use client";

import { useState } from "react";
import { User, ChevronDown, Upload, Phone, Mail } from "lucide-react";
import { useTechnicians } from "@/hooks/useTechnicians";

export default function ModalAdicionarTecnico({ open, onClose }) {
  const { adicionarTecnico } = useTechnicians();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [tipo, setTipo] = useState("técnico"); // 🔥 alinhado com backend
  const [carregando, setCarregando] = useState(false);

  if (!open) return null;

  function limparCampos() {
    setNome("");
    setEmail("");
    setTelefone("");
    setSenha("");
    setTipo("técnico");
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
      tipo,
      foto: "default.jpg", // 🔥 simples por enquanto
    };

    try {
      await adicionarTecnico(novoTecnico);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-2xl">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Adicionar Técnico
        </h2>

        <form onSubmit={handleAdicionar} className="space-y-5">

          {/* NOME */}
          <div className="relative">
            <label className="text-sm font-semibold mb-1 block">Nome</label>
            <User className="absolute left-3 top-[38px] w-5 h-5 text-gray-400" />
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full pl-10 border px-4 py-3 rounded"
            />
          </div>

          {/* EMAIL */}
          <div className="relative">
            <label className="text-sm font-semibold mb-1 block">Email</label>
            <Mail className="absolute left-3 top-[38px] w-5 h-5 text-gray-400" />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="w-full pl-10 border px-4 py-3 rounded"
            />
          </div>

          {/* SENHA */}
          <div>
            <label className="text-sm font-semibold mb-1 block">Senha</label>
            <input
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              type="password"
              className="w-full border px-4 py-3 rounded"
            />
          </div>

          {/* TELEFONE */}
          <div className="relative">
            <label className="text-sm font-semibold mb-1 block">Telefone</label>
            <Phone className="absolute left-3 top-[38px] w-5 h-5 text-gray-400" />
            <input
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              className="w-full pl-10 border px-4 py-3 rounded"
            />
          </div>

          {/* TIPO */}
          <div className="relative">
            <label className="text-sm font-semibold mb-1 block">Tipo</label>

            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="w-full border px-4 py-3 rounded appearance-none"
            >
              <option value="técnico">Técnico</option>
              <option value="admin">Admin</option>
            </select>

            <ChevronDown className="absolute right-3 top-10 w-4 h-4 text-gray-400" />
          </div>

          {/* BOTÕES */}
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
              className="px-5 py-2 bg-blue-500 text-white rounded"
            >
              {carregando ? "Adicionando..." : "Adicionar"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}