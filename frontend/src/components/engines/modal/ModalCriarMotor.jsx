"use client";

import { useState } from "react";
import {
  Factory, Info, Zap, Settings, ThermometerSun,
  AlertCircle, Image as ImageIcon, X, ChevronDown
} from "lucide-react";

const Section = ({ icon: Icon, title, iconColor, children }) => (
  <div className="rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50 p-4 space-y-3">
    <div className="flex items-center gap-2 border-b border-gray-200 dark:border-zinc-700 pb-2.5 mb-1">
      <Icon className={`w-4 h-4 ${iconColor}`} />
      <h3 className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">{title}</h3>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {children}
    </div>
  </div>
);

const inputCls = "w-full pl-3 pr-3 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-800 dark:text-zinc-100 text-sm placeholder:text-gray-300 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition";
const selectCls = "w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-800 dark:text-zinc-100 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition";

export function ModalCriarMotor({ open, setOpen, onSave }) {
  const initialState = {
    nome: "", cod_registro: "", modelo: "", serie: "", tipo: "", setor: "",
    potencia_kw: "", tensao_faixa: "", corrente_nominal_a: "", frequencia_hz: "",
    rotacao_rpm: "", grau_protecao_ip: "", classe_isolamento: "", fator_servico: "",
    rendimento_percentual: "", fator_potencia: "", temperatura_ambiente_min_c: "",
    temperatura_ambiente_max_c: "", certificacao_norma: "", imagem: "",
    nivel_criticidade: "", status_operacional: "", temperatura_limite_c: "",
    aceleracao_limite_mms: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [file, setFile] = useState(null);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelect = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  const validar = () => {
    if (!formData.nome || !formData.cod_registro || !formData.setor ||
        !formData.status_operacional || !formData.temperatura_limite_c ||
        !formData.aceleracao_limite_mms) {
      return "Preencha todos os campos obrigatórios.";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const erroValidacao = validar();
    if (erroValidacao) { setErro(erroValidacao); return; }
    setErro("");
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "status_saude") return;
        if (value !== null && value !== undefined) formDataToSend.append(key, value);
      });
      if (file) formDataToSend.append("imagem", file);
      await onSave(formDataToSend);
      setFormData(initialState);
      setFile(null);
      setOpen(false);
    } catch (err) {
      setErro("Erro ao salvar motor. Verifique os dados.");
    } finally {
      setLoading(false);
    }
  };

  const SelectField = ({ name, placeholder, options }) => (
    <div className="relative">
      <select
        value={formData[name]}
        onChange={(e) => handleSelect(name, e.target.value)}
        className={selectCls}
      >
        <option value="">{placeholder}</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 dark:text-zinc-500 pointer-events-none" />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-4xl rounded-2xl bg-white dark:bg-zinc-900 shadow-2xl border border-gray-100 dark:border-zinc-700 flex flex-col max-h-[90vh] overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-sky-500 to-sky-400 px-6 py-5 flex items-center gap-4 flex-shrink-0">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/20 flex-shrink-0">
            <Factory className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-white font-bold text-base leading-tight">Cadastrar Novo Motor</p>
            <p className="text-sky-100 text-xs mt-0.5">Preencha as informações da nova máquina</p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-white/70 hover:text-white hover:bg-white/20 rounded-full p-1.5 transition flex-shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Formulário */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {erro && (
            <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 px-4 py-3 rounded-lg">
              <AlertCircle size={16} className="flex-shrink-0" />
              {erro}
            </div>
          )}

          <Section icon={Info} title="Informações Gerais" iconColor="text-sky-500">
            <input className={inputCls} name="nome" value={formData.nome} placeholder="Nome *" onChange={handleChange} />
            <input className={inputCls} name="cod_registro" value={formData.cod_registro} placeholder="Código *" onChange={handleChange} />
            <input className={inputCls} name="modelo" value={formData.modelo} placeholder="Modelo" onChange={handleChange} />
            <input className={inputCls} name="serie" value={formData.serie} placeholder="Série" onChange={handleChange} />
            <input className={inputCls} name="tipo" value={formData.tipo} placeholder="Tipo" onChange={handleChange} />
            <SelectField name="setor" placeholder="Setor *" options={[
              { value: "linha_1", label: "Linha 1" },
              { value: "linha_2", label: "Linha 2" },
              { value: "linha_3", label: "Linha 3" },
            ]} />
          </Section>

          <Section icon={Zap} title="Elétrico / Performance" iconColor="text-amber-500">
            <input className={inputCls} name="potencia_kw" type="number" value={formData.potencia_kw} placeholder="Potência (kW)" onChange={handleChange} />
            <input className={inputCls} name="tensao_faixa" value={formData.tensao_faixa} placeholder="Tensão (V)" onChange={handleChange} />
            <input className={inputCls} name="corrente_nominal_a" type="number" value={formData.corrente_nominal_a} placeholder="Corrente (A)" onChange={handleChange} />
            <input className={inputCls} name="frequencia_hz" type="number" value={formData.frequencia_hz} placeholder="Frequência (Hz)" onChange={handleChange} />
            <input className={inputCls} name="rotacao_rpm" type="number" value={formData.rotacao_rpm} placeholder="RPM" onChange={handleChange} />
          </Section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Section icon={Settings} title="Técnico" iconColor="text-slate-500">
              <input className={inputCls} name="grau_protecao_ip" value={formData.grau_protecao_ip} placeholder="Proteção IP" onChange={handleChange} />
              <input className={inputCls} name="classe_isolamento" value={formData.classe_isolamento} placeholder="Isolamento" onChange={handleChange} />
              <input className={inputCls} name="fator_servico" type="number" step="0.01" value={formData.fator_servico} placeholder="Fator Serviço" onChange={handleChange} />
              <input className={inputCls} name="rendimento_percentual" type="number" value={formData.rendimento_percentual} placeholder="Rendimento %" onChange={handleChange} />
              <input className={inputCls} name="fator_potencia" type="number" step="0.01" value={formData.fator_potencia} placeholder="Fator Potência" onChange={handleChange} />
            </Section>

            <Section icon={ThermometerSun} title="Ambiente" iconColor="text-orange-500">
              <input className={inputCls} name="temperatura_ambiente_min_c" type="number" value={formData.temperatura_ambiente_min_c} placeholder="Temp Mín °C" onChange={handleChange} />
              <input className={inputCls} name="temperatura_ambiente_max_c" type="number" value={formData.temperatura_ambiente_max_c} placeholder="Temp Máx °C" onChange={handleChange} />
              <input className={inputCls} name="certificacao_norma" value={formData.certificacao_norma} placeholder="Norma" onChange={handleChange} />
              <label className="flex items-center justify-center gap-2 border border-dashed border-gray-200 dark:border-zinc-700 rounded-lg h-10 cursor-pointer text-xs text-gray-400 dark:text-zinc-500 hover:bg-gray-50 dark:hover:bg-zinc-800 transition col-span-full sm:col-span-1">
                <ImageIcon size={14} />
                {file ? file.name : "Anexar Foto"}
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            </Section>
          </div>

          <Section icon={Factory} title="Status e Limites de Monitoramento" iconColor="text-emerald-500">
            <SelectField name="status_operacional" placeholder="Operacional *" options={[
              { value: "ativa", label: "Ativa" },
              { value: "parada", label: "Parada" },
              { value: "manutencao", label: "Manutenção" },
            ]} />
            <SelectField name="nivel_criticidade" placeholder="Criticidade" options={[
              { value: "baixa", label: "Baixa" },
              { value: "media", label: "Média" },
              { value: "alta", label: "Alta" },
            ]} />
            <input className={inputCls} name="temperatura_limite_c" type="number" value={formData.temperatura_limite_c} placeholder="Limite Temp °C *" onChange={handleChange} />
            <input className={inputCls} name="aceleracao_limite_mms" type="number" step="0.1" value={formData.aceleracao_limite_mms} placeholder="Limite MM/S *" onChange={handleChange} />
          </Section>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 dark:border-zinc-700 px-6 py-4 flex gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex-1 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 text-sm font-medium text-gray-600 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Salvando..." : "Salvar Motor"}
          </button>
        </div>

      </div>
    </div>
  );
}