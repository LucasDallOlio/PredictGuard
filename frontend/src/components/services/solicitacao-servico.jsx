"use client";

import { useEffect, useState } from "react";

import {
  User,
  Calendar,
  AlertCircle,
  Edit3,
  Cpu,
} from "lucide-react";

import { useService } from "@/hooks/useServiceRequest";
import { useTechnicians } from "@/hooks/useTechnicians";
import { useMotors } from "@/hooks/useMotors";

export default function ModalSolicitacaoServico({
  open,
  onClose,
  service,
}) {

  const [maquina, setMaquina] = useState("");
  const [descricao, setDescricao] = useState("");
  const [urgencia, setUrgencia] = useState("media");
  const [dataRelato, setDataRelato] = useState("");
  const [tecnico, setTecnico] = useState("");
  const [sucesso, setSucesso] = useState(false);


  const {
    enviarSolicitacao,
    loading,
    erro,
  } = useService();


  const {
    tecnicos = [],
    loading: loadingTecnicos,
  } = useTechnicians(open);


  const {
    motores = [],
    fetchMotores,
    loading: loadingMotores,
  } = useMotors();

  useEffect(() => {
    if (open) {
      fetchMotores(1);
    }
  }, [open, fetchMotores]);


  function resetForm() {
    setMaquina("");
    setDescricao("");
    setUrgencia("media");
    setDataRelato("");
    setTecnico("");
    setSucesso(false);
  }


  function handleCancelar() {
    resetForm();
    onClose();
  }

async function handleEnviarSolicitacao(e) {

  e.preventDefault();

  try {

    const tiposFormatados = {
      "Manutenção Preditiva":
        "manutencao_preditiva",

      "Manutenção Preventiva":
        "manutencao_preventiva",

      "Manutenção Corretiva":
        "manutencao_corretiva",

      "Análise de Falha":
        "analise_de_falha",
    };

    const dados = {

      maquina_id: Number(maquina),

      usuario_responsavel_id:
        Number(tecnico),

      tipo: tiposFormatados[service],

      servico_status: "solicitado",

      descricao,

      observacao:
        `Prioridade ${urgencia}`,

      data_alerta: dataRelato
        ? dataRelato.replace("T", " ")
            + ":00"
        : null,
    };

    await enviarSolicitacao(dados);

    window.dispatchEvent(
      new Event("servico-criado")
    );

    setSucesso(true);

    setTimeout(() => {

      resetForm();

      onClose();

    }, 2000);

  } catch (err) {

    console.error(err);

    alert(
      err.message ||
      "Erro ao enviar solicitação"
    );
  }
}

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-md p-4">

      <div className="w-full max-w-lg rounded-lg bg-card border border-border p-8 shadow-2xl">


        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
          Solicitar {service}
        </h2>


        <form
          onSubmit={handleEnviarSolicitacao}
          className="space-y-5"
        >


          <div className="flex flex-col relative">

            <label className="text-sm font-semibold mb-2">
              Máquina
            </label>

            <Cpu className="absolute left-3 top-[38px] w-5 h-5 text-muted-foreground mt-1" />

            <select
              value={maquina}
              onChange={(e) => setMaquina(e.target.value)}
              disabled={loadingMotores}
              required
              className="w-full pl-10 appearance-none rounded-md bg-background border border-input px-4 py-3 focus:outline-none focus:ring-1 focus:ring-ring"
            >

              <option value="">
                {loadingMotores
                  ? "Carregando máquinas..."
                  : "Selecione uma máquina"}
              </option>

              {motores.map((motor) => (
                <option
                  key={motor.id}
                  value={motor.id}
                >
                  {motor.nome}
                </option>
              ))}

            </select>
          </div>


          <div className="flex flex-col relative">

            <label className="text-sm font-semibold mb-2">
              Técnico responsável
            </label>

            <User className="absolute left-3 top-[38px] w-5 h-5 text-muted-foreground mt-1" />

            <select
              value={tecnico}
              onChange={(e) => setTecnico(e.target.value)}
              disabled={loadingTecnicos}
              required
              className="w-full pl-10 appearance-none rounded-md bg-background border border-input px-4 py-3 focus:outline-none focus:ring-1 focus:ring-ring"
            >

              <option value="">
                {loadingTecnicos
                  ? "Carregando técnicos..."
                  : "Selecione um técnico"}
              </option>

              {tecnicos.map((tec) => (
                <option
                  key={tec.id}
                  value={tec.id}
                >
                  {tec.nome}
                </option>
              ))}

            </select>
          </div>


          <div className="flex flex-col relative">

            <label className="text-sm font-semibold mb-2">
              Prioridade
            </label>

            <AlertCircle className="absolute left-3 top-[38px] w-5 h-5 text-muted-foreground mt-1" />

            <select
              value={urgencia}
              onChange={(e) => setUrgencia(e.target.value)}
              className="w-full pl-10 appearance-none rounded-md bg-background border border-input px-4 py-3 focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
            </select>

          </div>


          <div className="flex flex-col relative">

            <label className="text-sm font-semibold mb-2">
              Data do alerta
            </label>

            <Calendar className="absolute left-3 top-[38px] w-5 h-5 text-muted-foreground mt-1" />

            <input
              type="datetime-local"
              value={dataRelato}
              onChange={(e) => setDataRelato(e.target.value)}
              required
              className="w-full pl-10 rounded-md bg-background border border-input px-4 py-3 focus:outline-none focus:ring-1 focus:ring-ring"
            />

          </div>

          <div className="flex flex-col relative">

            <label className="text-sm font-semibold mb-2">
              Descrição do problema
            </label>

            <Edit3 className="absolute left-3 top-10 w-5 h-5 text-muted-foreground" />

            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva o problema..."
              required
              rows={4}
              className="w-full pl-10 rounded-md bg-background border border-input px-4 py-3 resize-none focus:outline-none focus:ring-1 focus:ring-ring"
            />

          </div>

          {erro && (
            <p className="text-sm text-red-500">
              {erro}
            </p>
          )}

          {sucesso && (
            <div className="rounded-md bg-green-500/10 border border-green-500/20 p-3">
              <p className="text-sm text-green-500 font-medium">
                Solicitação enviada com sucesso!
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">

            <button
              type="button"
              onClick={handleCancelar}
              className="px-5 py-2 rounded-md border border-input bg-background hover:bg-accent transition"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition disabled:opacity-50"
            >
              {loading
                ? "Enviando..."
                : "Enviar solicitação"}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}