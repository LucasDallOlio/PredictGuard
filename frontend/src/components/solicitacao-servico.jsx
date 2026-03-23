"use client";

import { useState, useEffect } from "react";
import { User, Calendar, AlertCircle, Edit3, Cpu } from "lucide-react"; // ícones

export default function ModalSolicitacaoServico({ open, onClose, service }) {
  const [maquina, setMaquina] = useState("");
  const [descricao, setDescricao] = useState("");
  const [urgencia, setUrgencia] = useState("media");
  const [dataRelato, setDataRelato] = useState("");
  const [tecnico, setTecnico] = useState("");
  const [tecnicos, setTecnicos] = useState([]);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    async function buscarTecnicos() {
      try {
        const resposta = await fetch("/api/technicians");
        if (!resposta.ok) throw new Error("Erro ao buscar técnicos");
        const dados = await resposta.json();
        setTecnicos(dados);
      } catch (erro) {
        console.error(erro);
      }
    }
    if (open) buscarTecnicos();
  }, [open]);

  
  function resetForm() {
    setMaquina("");
    setDescricao("");
    setUrgencia("media");
    setDataRelato("");
    setTecnico("");
  }


  function handleCancelar() {
    resetForm();
    onClose();
  }

  async function enviarSolicitacao(e) {
    e.preventDefault();
    setCarregando(true);
    const dados = { service, maquina, descricao, urgencia, dataRelato, tecnico };

    try {
      const resposta = await fetch("/api/service-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });
      if (!resposta.ok) throw new Error("Erro ao enviar solicitação");

      resetForm();
      onClose();
    } catch (erro) {
      console.error(erro);
      alert("Erro ao enviar solicitação");
    } finally {
      setCarregando(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-3xl bg-zinc-900 border border-zinc-800 p-8 shadow-2xl relative">

        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
          Solicitar {service}
        </h2>

        <form onSubmit={enviarSolicitacao} className="space-y-5">

         
          <div className="flex flex-col relative">
            <label className="text-sm font-semibold text-zinc-300 mb-2">Máquina</label>
            <Cpu className="absolute left-3 top-[38px] w-5 h-5 text-zinc-500 pointer-events-none mt-1" />
            <input
              value={maquina}
              onChange={(e) => setMaquina(e.target.value)}
              placeholder="Ex: Compressor 01"
              className="w-full pl-10 rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
          </div>

       
          <div className="flex flex-col relative">
            <label className="text-sm font-semibold text-zinc-300 mb-2">Técnico responsável</label>
            <User className="absolute left-3 top-[38px] w-5 h-5 text-zinc-500 pointer-events-none" />
            <select
              value={tecnico}
              onChange={(e) => setTecnico(e.target.value)}
              className="w-full pl-10 rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            >
              <option value="">Selecione um técnico</option>
              {tecnicos.map((tec) => (
                <option key={tec.id} value={tec.id}>{tec.nome}</option>
              ))}
            </select>
          </div>

        
          <div className="flex flex-col relative">
            <label className="text-sm font-semibold text-zinc-300 mb-2">Nível de prioridade</label>
            <AlertCircle className="absolute left-3 top-[38px] w-5 h-5 text-zinc-500 pointer-events-none" />
            <select
              value={urgencia}
              onChange={(e) => setUrgencia(e.target.value)}
              className="w-full pl-10 rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            >
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
            
            </select>
          </div>

          
          <div className="flex flex-col relative">
            <label className="text-sm font-semibold text-zinc-300 mb-2">Data do alerta</label>
            <Calendar className="absolute left-3 top-[38px] w-5 h-5 text-zinc-500 pointer-events-none" />
            <input
              type="text"
              value={dataRelato}
              onChange={(e) => setDataRelato(e.target.value)}
              placeholder="DD/MM/AAAA"
              className="w-full pl-10 rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
          </div>

          
          <div className="flex flex-col relative">
            <label className="text-sm font-semibold text-zinc-300 mb-2">Descrição do problema</label>
            <Edit3 className="absolute left-3 top-3 w-5 h-5 text-zinc-500 pointer-events-none mt-7" />
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva o problema..."
              className="w-full pl-10 rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition resize-none"
            />
          </div>


          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleCancelar}
              className="px-5 py-2 rounded-xl border border-zinc-700 text-zinc-300 hover:text-white transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={carregando}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition disabled:opacity-50"
            >
              {carregando ? "Enviando..." : "Enviar solicitação"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}