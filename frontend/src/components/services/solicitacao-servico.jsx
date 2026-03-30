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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 min-h-screen">
      <div className="w-full max-w-lg rounded-[var(--radius)] bg-card border border-border p-8 shadow-2xl relative">

        <h2 className="text-2xl md:text-3xl font-bold text-card-foreground mb-6 text-center">
          Solicitar {service}
        </h2>

        <form onSubmit={enviarSolicitacao} className="space-y-5">

          <div className="flex flex-col relative">
            <label className="text-sm font-semibold text-foreground mb-2">Máquina</label>
            <Cpu className="absolute left-3 top-[38px] w-5 h-5 text-muted-foreground pointer-events-none mt-1" />
            <input
              value={maquina}
              onChange={(e) => setMaquina(e.target.value)}
              placeholder="Ex: Compressor 01"
              className="w-full pl-10 rounded-[calc(var(--radius)-4px)] bg-background border border-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring transition"
            />
          </div>

          <div className="flex flex-col relative">
            <label className="text-sm font-semibold text-foreground mb-2">Técnico responsável</label>
            <User className="absolute left-3 top-[38px] w-5 h-5 text-muted-foreground pointer-events-none mt-1" />
            <select
              value={tecnico}
              onChange={(e) => setTecnico(e.target.value)}
              className="w-full pl-10 appearance-none rounded-[calc(var(--radius)-4px)] bg-background border border-input px-4 py-3 text-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring transition"
            >
              <option value="">Selecione um técnico</option>
              {tecnicos.map((tec) => (
                <option key={tec.id} value={tec.id}>{tec.nome}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col relative">
            <label className="text-sm font-semibold text-foreground mb-2">Nível de prioridade</label>
            <AlertCircle className="absolute left-3 top-[38px] w-5 h-5 text-muted-foreground pointer-events-none mt-1" />
            <select
              value={urgencia}
              onChange={(e) => setUrgencia(e.target.value)}
              className="w-full pl-10 appearance-none rounded-[calc(var(--radius)-4px)] bg-background border border-input px-4 py-3 text-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring transition"
            >
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
            </select>
          </div>

          <div className="flex flex-col relative">
            <label className="text-sm font-semibold text-foreground mb-2">Data do reporte</label>
            <Calendar className="absolute left-3 top-[38px] w-5 h-5 text-muted-foreground pointer-events-none mt-1" />
            <input
              type="text"
              value={dataRelato}
              onChange={(e) => setDataRelato(e.target.value)}
              placeholder="DD/MM/AAAA"
              className="w-full pl-10 rounded-[calc(var(--radius)-4px)] bg-background border border-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring transition"
            />
          </div>

          <div className="flex flex-col relative">
            <label className="text-sm font-semibold text-foreground mb-2">Descrição do problema</label>
            <Edit3 className="absolute left-3 top-3 w-5 h-5 text-muted-foreground pointer-events-none mt-7" />
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva o problema..."
              className="w-full pl-10 rounded-[calc(var(--radius)-4px)] bg-background border border-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring transition resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleCancelar}
              className="px-5 py-2 rounded-[calc(var(--radius)-4px)] border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={carregando}
              className="px-5 py-2 rounded-[calc(var(--radius)-4px)] bg-primary text-primary-foreground hover:bg-primary/90 font-semibold transition disabled:opacity-50"
            >
              {carregando ? "Enviando..." : "Enviar solicitação"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}