"use client";

import { useState, useEffect } from "react";
import {
  Factory, Info, Zap, Settings, ThermometerSun,
  Thermometer, Activity, Pencil, Trash2, X, ChevronDown, Image as ImageIcon
} from "lucide-react";
import { ModalExcluirMotor } from "./ModalExcluirMotor";

const inputCls = "w-full pl-3 pr-3 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-800 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition";
const selectCls = "w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-800 dark:text-zinc-100 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition";

const SectionCard = ({ icon: Icon, iconColor, title, children }) => (
  <div className="rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/30 p-4">
    <h3 className="flex items-center gap-2 text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider border-b border-gray-100 dark:border-zinc-800 pb-2.5 mb-3">
      <Icon className={`w-4 h-4 ${iconColor}`} />
      {title}
    </h3>
    <div className="grid grid-cols-2 gap-3">
      {children}
    </div>
  </div>
);

const Field = ({ label, value, name, isEditing, onChange, suffix = "", spanFull = false }) => (
  <div className={spanFull ? "col-span-2" : ""}>
    <span className="block text-xs text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-1">{label}</span>
    {isEditing ? (
      <input name={name} value={value || ""} onChange={onChange} className={inputCls} />
    ) : (
      <span className="font-medium text-sm text-gray-800 dark:text-zinc-100">{value}{suffix}</span>
    )}
  </div>
);

const SelectField = ({ label, name, value, isEditing, onChange, options, spanFull = false }) => (
  <div className={spanFull ? "col-span-2" : ""}>
    <span className="block text-xs text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-1">{label}</span>
    {isEditing ? (
      <div className="relative">
        <select name={name} value={value || ""} onChange={(e) => onChange(name, e.target.value)} className={selectCls}>
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 dark:text-zinc-500 pointer-events-none" />
      </div>
    ) : (
      <span className="font-medium text-sm text-gray-800 dark:text-zinc-100 capitalize">{value}</span>
    )}
  </div>
);

const criticidadeStyle = {
  alta: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800",
  media: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-800",
  baixa: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800",
};

const operacionalStyle = {
  ativa: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800",
  parada: "bg-gray-50 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 border border-gray-100 dark:border-zinc-700",
  manutencao: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-800",
};

export function ModalMotorDetalhes({ open, setOpen, motor, onUpdate, onDelete }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (motor) {
      setFormData(motor);
      setIsEditing(false);
    }
  }, [motor, open]);

  if (!open || !motor) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelect = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setFormData(prev => ({ ...prev, imagem: URL.createObjectURL(f) }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const form = new FormData();
      const { data_criacao, data_atualizacao, created_at, updated_at, ...rest } = formData;
      Object.keys(rest).forEach((key) => form.append(key, rest[key]));
      if (file) form.append("imagem", file);
      await onUpdate(formData.id, form);
      setIsEditing(false);
      setOpen(false);
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar motor");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await onDelete(motor.id);
      setIsDeleteDialogOpen(false);
      setOpen(false);
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir motor");
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="w-full max-w-6xl rounded-2xl bg-white dark:bg-zinc-900 shadow-2xl border border-gray-100 dark:border-zinc-700 flex flex-col lg:flex-row max-h-[90vh] overflow-hidden">

          {/* Painel esquerdo */}
          <div className="w-full lg:w-[30%] flex flex-col border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-zinc-800 flex-shrink-0">

            {/* Header com gradiente */}
            <div className="bg-gradient-to-r from-sky-500 to-sky-400 px-5 py-4 flex items-center gap-3 flex-shrink-0">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/20 flex-shrink-0">
                <Factory className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm leading-tight truncate">{formData.nome}</p>
                <p className="text-sky-100 text-xs truncate">{formData.cod_registro}</p>
              </div>
              <button
                onClick={() => { setOpen(false); setIsEditing(false); }}
                className="text-white/70 hover:text-white hover:bg-white/20 rounded-full p-1.5 transition flex-shrink-0"
              >
                <X size={16} />
              </button>
            </div>

            {/* Imagem */}
            <div className="h-48 bg-white dark:bg-zinc-800 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-center p-4 flex-shrink-0 relative overflow-hidden">
              <img
                src={formData.imagem}
                alt={formData.nome}
                className="w-full h-full object-contain"
              />
              {isEditing && (
                <label className="absolute bottom-2 right-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-xs font-medium cursor-pointer transition">
                  <ImageIcon size={12} />
                  Trocar foto
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              )}
            </div>

            {/* Badges de status */}
            <div className="p-5 space-y-3 flex-1 overflow-y-auto">
              <div className="space-y-2">
                <span className="block text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Status</span>
                <div className="flex flex-wrap gap-2">
                  {isEditing ? (
                    <>
                      <div className="relative w-full">
                        <select value={formData.status_operacional || ""} onChange={(e) => handleSelect("status_operacional", e.target.value)} className={selectCls}>
                          <option value="ativa">Ativa</option>
                          <option value="parada">Parada</option>
                          <option value="manutencao">Manutenção</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                      </div>
                      <div className="relative w-full">
                        <select value={formData.nivel_criticidade || ""} onChange={(e) => handleSelect("nivel_criticidade", e.target.value)} className={selectCls}>
                          <option value="baixa">Baixa</option>
                          <option value="media">Média</option>
                          <option value="alta">Alta</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                      </div>
                      <div className="relative w-full">
                        <select value={formData.status_saude || ""} onChange={(e) => handleSelect("status_saude", e.target.value)} className={selectCls}>
                          <option value="ok">OK</option>
                          <option value="alerta">Alerta</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                      </div>
                    </>
                  ) : (
                    <>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${operacionalStyle[formData.status_operacional] || ""}`}>
                        {formData.status_operacional}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${criticidadeStyle[formData.nivel_criticidade] || ""}`}>
                        Criticidade: {formData.nivel_criticidade}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${formData.status_saude === "ok"
                        ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800"
                        : "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-800"
                        }`}>
                        Saúde: {formData.status_saude}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Leituras */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50 p-3 flex flex-col items-center text-center">
                  <Thermometer className="w-5 h-5 text-orange-500 mb-1" />
                  <span className="text-lg font-bold text-gray-800 dark:text-zinc-100">{formData.temperatura ?? "—"}°C</span>
                  <span className="text-xs text-gray-400 dark:text-zinc-500">Temperatura</span>
                </div>
                <div className="rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50 p-3 flex flex-col items-center text-center">
                  <Activity className="w-5 h-5 text-sky-500 mb-1" />
                  <span className="text-lg font-bold text-gray-800 dark:text-zinc-100">{formData.vibracao ?? "—"}</span>
                  <span className="text-xs text-gray-400 dark:text-zinc-500">Vibração</span>
                </div>
              </div>
            </div>
          </div>

          {/* Painel direito */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-5 lg:p-6 space-y-4">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SectionCard icon={Info} iconColor="text-sky-500" title="Informações Gerais">
                  <Field label="Modelo" name="modelo" value={formData.modelo} isEditing={isEditing} onChange={handleChange} />
                  <Field label="Série" name="serie" value={formData.serie} isEditing={isEditing} onChange={handleChange} />
                  <Field label="Tipo" name="tipo" value={formData.tipo} isEditing={isEditing} onChange={handleChange} />
                  <Field label="Setor" name="setor" value={formData.setor} isEditing={isEditing} onChange={handleChange} />
                </SectionCard>

                <SectionCard icon={Zap} iconColor="text-amber-500" title="Elétrico / Performance">
                  <Field label="Potência (kW)" name="potencia_kw" value={formData.potencia_kw} isEditing={isEditing} onChange={handleChange} />
                  <Field label="Tensão" name="tensao_faixa" value={formData.tensao_faixa} isEditing={isEditing} onChange={handleChange} />
                  <Field label="Corrente (A)" name="corrente_nominal_a" value={formData.corrente_nominal_a} isEditing={isEditing} onChange={handleChange} />
                  <Field label="Frequência (Hz)" name="frequencia_hz" value={formData.frequencia_hz} isEditing={isEditing} onChange={handleChange} />
                  <Field label="Rotação (RPM)" name="rotacao_rpm" value={formData.rotacao_rpm} isEditing={isEditing} onChange={handleChange} spanFull />
                </SectionCard>

                <SectionCard icon={Settings} iconColor="text-slate-500" title="Especificações Técnicas">
                  <Field label="Proteção IP" name="grau_protecao_ip" value={formData.grau_protecao_ip} isEditing={isEditing} onChange={handleChange} />
                  <Field label="Isolamento" name="classe_isolamento" value={formData.classe_isolamento} isEditing={isEditing} onChange={handleChange} />
                  <Field label="Fator Serviço" name="fator_servico" value={formData.fator_servico} isEditing={isEditing} onChange={handleChange} />
                  <Field label="Rendimento" name="rendimento_percentual" value={formData.rendimento_percentual} isEditing={isEditing} onChange={handleChange} suffix="%" />
                  <Field label="Fator Potência" name="fator_potencia" value={formData.fator_potencia} isEditing={isEditing} onChange={handleChange} spanFull />
                </SectionCard>

                <SectionCard icon={ThermometerSun} iconColor="text-orange-400" title="Ambiente & Normas">
                  <Field label="Temp Mín" name="temperatura_ambiente_min_c" value={formData.temperatura_ambiente_min_c} isEditing={isEditing} onChange={handleChange} suffix="°C" />
                  <Field label="Temp Máx" name="temperatura_ambiente_max_c" value={formData.temperatura_ambiente_max_c} isEditing={isEditing} onChange={handleChange} suffix="°C" />
                  <Field label="Certificação" name="certificacao_norma" value={formData.certificacao_norma} isEditing={isEditing} onChange={handleChange} spanFull />
                </SectionCard>
              </div>

            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 dark:border-zinc-800 px-5 py-4 flex justify-end gap-3 flex-shrink-0">
              {isEditing ? (
                <>
                  <button
                    onClick={() => { setFormData(motor); setIsEditing(false); }}
                    className="px-5 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 text-sm font-medium text-gray-600 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="px-5 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold transition disabled:opacity-50"
                  >
                    {loading ? "Salvando..." : "Salvar Alterações"}
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg border dark:border-zinc-700 text-sm font-medium text-gray-600 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
                  >
                    Voltar
                  </button>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-sky-200 dark:border-sky-800 text-sky-500 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/30 text-sm font-medium transition"
                  >
                    <Pencil size={14} /> Editar
                  </button>
                  <button
                    onClick={() => setIsDeleteDialogOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-red-200 dark:border-red-800 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 text-sm font-medium transition"
                  >
                    <Trash2 size={14} /> Excluir
                  </button>
                </>
              )}
            </div>
          </div>

        </div>
      </div>

      <ModalExcluirMotor
        open={isDeleteDialogOpen}
        setOpen={setIsDeleteDialogOpen}
        motor={motor}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}