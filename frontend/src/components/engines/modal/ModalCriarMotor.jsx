"use client";

import { useState } from "react";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";

import {
    Factory,
    Info,
    Zap,
    Settings,
    ThermometerSun,
    AlertCircle,
    Image as ImageIcon
} from "lucide-react";


const Section = ({ icon: Icon, title, color, children, className = "" }) => (
    <div className={`bg-card border rounded-xl p-4 shadow-sm space-y-3 ${className}`}>
        <div className="flex items-center gap-2 border-b pb-2 mb-2">
            <Icon className={`w-5 h-5 ${color}`} />
            <h3 className="font-semibold text-sm">{title}</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {children}
        </div>
    </div>
);

export function ModalCriarMotor({ open, setOpen, onSave }) {
    const initialState = {
        nome: "",
        cod_registro: "",
        modelo: "",
        serie: "",
        tipo: "",
        setor: "",
        potencia_kw: "",
        tensao_faixa: "",
        corrente_nominal_a: "",
        frequencia_hz: "",
        rotacao_rpm: "",
        grau_protecao_ip: "",
        classe_isolamento: "",
        fator_servico: "",
        rendimento_percentual: "",
        fator_potencia: "",
        temperatura_ambiente_min_c: "",
        temperatura_ambiente_max_c: "",
        certificacao_norma: "",
        imagem: "",
        nivel_criticidade: "",
        status_operacional: "",
        status_saude: "",
        temperatura_limite_c: "",
        aceleracao_limite_g: "",
    };

    const [formData, setFormData] = useState(initialState);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, imagem: file ? file.name : "maquina_placeholder.jpg"}));
        }
    };

    const validar = () => {
        if (!formData.nome || !formData.cod_registro || !formData.setor) {
            return "Preencha os campos obrigatórios: Nome, Código e Setor.";
        }
        return "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const erroValidacao = validar();
        if (erroValidacao) {
            setErro(erroValidacao);
            return;
        }

        setErro("");
        setLoading(true);

        try {
            const formatado = {
                ...formData,
                potencia_kw: formData.potencia_kw ? Number(formData.potencia_kw) : null,
                corrente_nominal_a: formData.corrente_nominal_a ? Number(formData.corrente_nominal_a) : null,
                frequencia_hz: formData.frequencia_hz ? Number(formData.frequencia_hz) : null,
                rotacao_rpm: formData.rotacao_rpm ? Number(formData.rotacao_rpm) : null,
                fator_servico: formData.fator_servico ? Number(formData.fator_servico) : null,
                rendimento_percentual: formData.rendimento_percentual ? Number(formData.rendimento_percentual) : null,
                fator_potencia: formData.fator_potencia ? Number(formData.fator_potencia) : null,
                temperatura_ambiente_min_c: formData.temperatura_ambiente_min_c ? Number(formData.temperatura_ambiente_min_c) : null,
                temperatura_ambiente_max_c: formData.temperatura_ambiente_max_c ? Number(formData.temperatura_ambiente_max_c) : null,
                temperatura_limite_c: formData.temperatura_limite_c ? Number(formData.temperatura_limite_c) : null,
                aceleracao_limite_g: formData.aceleracao_limite_g ? Number(formData.aceleracao_limite_g) : null,
            };

            await onSave(formatado);
            setFormData(initialState);
            setOpen(false);
        } catch (err) {
            setErro("Erro ao salvar motor. Verifique os dados.");
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = "w-full h-9 text-sm bg-background border border-input rounded-md px-3 focus:ring-1 focus:ring-primary";

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-[90vw] md:max-w-[80vw] lg:max-w-[1000px] max-h-[90vh] flex flex-col p-0 overflow-hidden">
                
                <DialogHeader className="p-6 border-b bg-muted/20">
                    <DialogTitle className="flex items-center gap-3 text-xl font-bold">
                        <Factory className="w-6 h-6 text-primary" />
                        Cadastrar Novo Motor
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                    {erro && (
                        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 px-4 py-3 rounded-lg">
                            <AlertCircle size={18} />
                            {erro}
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-6">
                        
                        <Section icon={Info} title="Informações Gerais" color="text-blue-500">
                            <Input className={inputStyle} name="nome" value={formData.nome} placeholder="Nome *" onChange={handleChange} />
                            <Input className={inputStyle} name="cod_registro" value={formData.cod_registro} placeholder="Código *" onChange={handleChange} />
                            <Input className={inputStyle} name="modelo" value={formData.modelo} placeholder="Modelo" onChange={handleChange} />
                            <Input className={inputStyle} name="serie" value={formData.serie} placeholder="Série" onChange={handleChange} />
                            <Input className={inputStyle} name="tipo" value={formData.tipo} placeholder="Tipo" onChange={handleChange} />
                            <Select value={formData.setor} onValueChange={(v) => handleSelectChange("setor", v)}>
                                <SelectTrigger className={inputStyle}>
                                    <SelectValue placeholder="Setor *" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Linha 1">Linha 1</SelectItem>
                                    <SelectItem value="Linha 2">Linha 2</SelectItem>
                                    <SelectItem value="Linha 3">Linha 3</SelectItem>
                                </SelectContent>
                            </Select>
                        </Section>

                  
                        <Section icon={Zap} title="Elétrico / Performance" color="text-amber-500">
                            <Input className={inputStyle} name="potencia_kw" type="number" value={formData.potencia_kw} placeholder="Potência (kW)" onChange={handleChange} />
                            <Input className={inputStyle} name="tensao_faixa" value={formData.tensao_faixa} placeholder="Tensão (V)" onChange={handleChange} />
                            <Input className={inputStyle} name="corrente_nominal_a" type="number" value={formData.corrente_nominal_a} placeholder="Corrente (A)" onChange={handleChange} />
                            <Input className={inputStyle} name="frequencia_hz" type="number" value={formData.frequencia_hz} placeholder="Frequência (Hz)" onChange={handleChange} />
                            <Input className={inputStyle} name="rotacao_rpm" type="number" value={formData.rotacao_rpm} placeholder="RPM" onChange={handleChange} />
                        </Section>

                      
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Section icon={Settings} title="Técnico" color="text-slate-500" className="md:col-span-1">
                                <Input className={inputStyle} name="grau_protecao_ip" value={formData.grau_protecao_ip} placeholder="IP" onChange={handleChange} />
                                <Input className={inputStyle} name="classe_isolamento" value={formData.classe_isolamento} placeholder="Isolamento" onChange={handleChange} />
                                <Input className={inputStyle} name="fator_servico" type="number" step="0.01" value={formData.fator_servico} placeholder="FS" onChange={handleChange} />
                                <Input className={inputStyle} name="rendimento_percentual" type="number" value={formData.rendimento_percentual} placeholder="Rendimento %" onChange={handleChange} />
                                <Input className={inputStyle} name="fator_potencia" type="number" step="0.01" value={formData.fator_potencia} placeholder="FP" onChange={handleChange} />
                            </Section>

                            <Section icon={ThermometerSun} title="Ambiente" color="text-orange-500" className="md:col-span-1">
                                <Input className={inputStyle} name="temperatura_ambiente_min_c" type="number" value={formData.temperatura_ambiente_min_c} placeholder="Temp Mín °C" onChange={handleChange} />
                                <Input className={inputStyle} name="temperatura_ambiente_max_c" type="number" value={formData.temperatura_ambiente_max_c} placeholder="Temp Máx °C" onChange={handleChange} />
                                <Input className={inputStyle} name="certificacao_norma" value={formData.certificacao_norma} placeholder="Norma" onChange={handleChange} />
                                <label className="flex items-center justify-center gap-2 border border-dashed rounded-md h-9 cursor-pointer text-xs hover:bg-muted/50 transition-colors">
                                    <ImageIcon size={14} />
                                    {formData.imagem ? "Imagem Selecionada" : "Anexar Foto"}
                                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                </label>
                            </Section>
                        </div>

                       
                        <Section icon={Factory} title="Status e Limites de Monitoramento" color="text-emerald-500">
                            <Select value={formData.status_operacional} onValueChange={(v) => handleSelectChange("status_operacional", v)}>
                                <SelectTrigger className={inputStyle}>
                                    <SelectValue placeholder="Operacional" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Ativa">Ativa</SelectItem>
                                    <SelectItem value="Parada">Parada</SelectItem>
                                  <SelectItem value="Manutenção">Manutenção</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={formData.status_saude} onValueChange={(v) => handleSelectChange("status_saude", v)}>
                                <SelectTrigger className={inputStyle}>
                                    <SelectValue placeholder="Saúde" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Ok">Ok</SelectItem>
                                    <SelectItem value="Alerta">Alerta</SelectItem>
                               
                                </SelectContent>
                            </Select>

                            <Select value={formData.nivel_criticidade} onValueChange={(v) => handleSelectChange("nivel_criticidade", v)}>
                                <SelectTrigger className={inputStyle}>
                                    <SelectValue placeholder="Criticidade" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Baixa">Baixa</SelectItem>
                                    <SelectItem value="Média">Média</SelectItem>
                                    <SelectItem value="Alta">Alta</SelectItem>
                                </SelectContent>
                            </Select>

                            <Input className={inputStyle} name="temperatura_limite_c" type="number" value={formData.temperatura_limite_c} placeholder="Limite Temp °C" onChange={handleChange} />
                            <Input className={inputStyle} name="aceleracao_limite_g" type="number" step="0.1" value={formData.aceleracao_limite_g} placeholder="Limite G" onChange={handleChange} />
                        </Section>
                    </div>
                </form>

                <DialogFooter className="p-6 border-t bg-muted/20 gap-2">
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                        Cancelar
                    </Button>
                    <Button type="submit" onClick={handleSubmit} disabled={loading} className="min-w-[100px]">
                        {loading ? "Salvando..." : "Salvar Motor"}
                    </Button>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    );
}