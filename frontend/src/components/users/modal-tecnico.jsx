"use client";

import { useState } from "react";
import { User, ChevronDown, Phone, Mail } from "lucide-react";

export default function ModalAdicionarTecnico({ open, onClose, onAddTecnico }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [tipo, setTipo] = useState("técnico");
  const [foto, setFoto] = useState(null);
  const [carregando, setCarregando] = useState(false);

  if (!open) return null;

  function limparCampos() {
    setNome("");
    setEmail("");
    setTelefone("");
    setSenha("");
    setTipo("técnico");
    setFoto(null);
  }

  async function handleAdicionar(e) {
    e.preventDefault();

    if (!nome || !email || !telefone || !senha) {
      return alert("Preencha todos os campos obrigatórios!");
    }

    setCarregando(true);

    try {
      const formData = new FormData();
      formData.append("nome", nome);
      formData.append("email", email);
      formData.append("telefone", telefone);
      formData.append("senha", senha);
      formData.append("tipo", tipo);
      if (foto) formData.append("foto", foto);

      await onAddTecnico(formData);

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

        <form onSubmit={handleAdicionar} className="space-y-5" autoComplete="off">
          
          {/* Nome */}
          <div className="relative">
            <label className="text-sm font-semibold mb-1 block">Nome</label>
            <User className="absolute left-3 top-[38px] w-5 h-5 text-gray-400" />
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full pl-10 border px-4 py-3 rounded"
              autoComplete="off"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <label className="text-sm font-semibold mb-1 block">Email</label>
            <Mail className="absolute left-3 top-[38px] w-5 h-5 text-gray-400" />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="off"
              className="w-full pl-10 border px-4 py-3 rounded"
            />
          </div>

          {/* Senha */}
          <div>
            <label className="text-sm font-semibold mb-1 block">Senha</label>
            <input
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              type="password"
              autoComplete="new-password"
              className="w-full border px-4 py-3 rounded"
            />
          </div>

          {/* Telefone */}
          <div className="relative">
            <label className="text-sm font-semibold mb-1 block">Telefone</label>
            <Phone className="absolute left-3 top-[38px] w-5 h-5 text-gray-400" />
            <input
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              className="w-full pl-10 border px-4 py-3 rounded"
              autoComplete="off"
            />
          </div>

          {/* Tipo */}
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

          {/* Foto */}
          <div>
            <label className="text-sm font-semibold mb-1 block">Foto</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFoto(e.target.files[0])}
              className="w-full border px-4 py-3 rounded"
            />
          </div>

          {/* Botões */}
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