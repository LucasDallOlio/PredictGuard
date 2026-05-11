"use client";

import { useState, useEffect } from "react";
import { User, Phone, Mail, ChevronDown, X, KeyRound, ShieldCheck, Wrench } from "lucide-react";

export default function ModalEditarTecnico({ open, onClose, onEditTecnico, tecnico }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [tipo, setTipo] = useState("tecnico");
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (open && tecnico) {
      setNome(tecnico.nome || "");
      setEmail(tecnico.email || "");
      setTelefone(tecnico.telefone || "");
      setTipo(tecnico.tipo || "tecnico");
      setSenha("");
    }
  }, [open, tecnico]);

  if (!open) return null;

  function formatarTelefone(valor) {
    let numeros = valor.replace(/\D/g, "");
    if (numeros.length > 11) numeros = numeros.slice(0, 11);
    if (numeros.length <= 2) return numeros;
    if (numeros.length <= 6) return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
    if (numeros.length <= 10) return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`;
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
  }

  async function handleSalvar(e) {
    e.preventDefault();
    if (!nome || !email || !telefone) return alert("Preencha todos os campos obrigatórios!");
    setCarregando(true);
    try {
      const payload = { nome, email, telefone, tipo };
      if (senha) payload.senha = senha;
      await onEditTecnico(tecnico.id, payload);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Erro ao editar técnico");
    } finally {
      setCarregando(false);
    }
  }

  const iniciais = nome?.charAt(0)?.toUpperCase() || "?";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden border border-gray-100 dark:border-zinc-700">

        {/* Header */}
        <div className="bg-gradient-to-r from-sky-500 to-sky-400 px-6 py-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-white/60 shadow-md bg-white/20 overflow-hidden flex-shrink-0 flex items-center justify-center">
            {tecnico?.foto ? (
              <img src={tecnico.foto} alt="foto" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white text-lg font-bold">{iniciais}</span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-base leading-tight truncate">{nome || "Técnico"}</p>
            <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white">
              {tipo === "admin"
                ? <><ShieldCheck size={11} /> Admin</>
                : <><Wrench size={11} /> Técnico</>
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

          {/* Nome */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
              Nome
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 dark:text-zinc-500" />
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome completo"
                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-800 dark:text-zinc-100 text-sm placeholder:text-gray-300 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 dark:text-zinc-500" />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="email@exemplo.com"
                autoComplete="off"
                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-800 dark:text-zinc-100 text-sm placeholder:text-gray-300 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Telefone + Tipo */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-400 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                Telefone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 dark:text-zinc-500" />
                <input
                  value={telefone}
                  onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
                  placeholder="(11) 99999-9999"
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-800 dark:text-zinc-100 text-sm placeholder:text-gray-300 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition"
                />
              </div>
            </div>

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
                  <option value="tecnico">Técnico</option>
                  <option value="admin">Admin</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 dark:text-zinc-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Nova Senha */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
              Nova Senha{" "}
              <span className="text-gray-300 dark:text-zinc-600 font-normal normal-case">
                (em branco = sem alteração)
              </span>
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 dark:text-zinc-500" />
              <input
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-800 dark:text-zinc-100 text-sm placeholder:text-gray-300 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition"
              />
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