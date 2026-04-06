"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { 
    Thermometer, 
    Activity, 
    Zap, 
    Settings, 
    Info, 
    ThermometerSun
} from "lucide-react";

import { useState, useEffect } from "react";
import { ModalExcluirMotor } from "./ModalExcluirMotor";
import { useMotors } from "@/hooks/useMotors"; 
export function ModalMotorDetalhes({ open, setOpen, motor }) {

    const { updateMotor, deletarMotor } = useMotors(open); 

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (motor) {
            setFormData(motor);
            setIsEditing(false);
        }
    }, [motor, open]);

   
    const handleConfirmDelete = async () => {
        try {
            await deletarMotor(motor.id);
            setIsDeleteDialogOpen(false);
            setOpen(false);
        } catch (err) {
            console.error(err);
            alert("Erro ao excluir motor");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    
    const handleSave = async () => {
        setLoading(true);
        try {
            await updateMotor(formData.id, formData);
            setIsEditing(false);
        } catch (err) {
            console.error(err);
            alert("Erro ao atualizar motor");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData(motor);
        setIsEditing(false);
    };

    if (!motor) return null;

    const renderField = (label, name, spanTwo = false, suffix = "") => (
        <div className={spanTwo ? "col-span-2" : ""}>
            <span className="text-[10px] lg:text-xs text-muted-foreground block uppercase tracking-wider mb-1">
                {label}
            </span>

            {isEditing ? (
                <Input 
                    name={name} 
                    value={formData[name] || ""} 
                    onChange={handleChange} 
                    className="h-8 text-sm w-full bg-white text-black"
                />
            ) : (
                <span className="font-medium text-sm">
                    {formData[name]}{suffix}
                </span>
            )}
        </div>
    );

    return (
        <Dialog open={open} onOpenChange={(val) => {
            setOpen(val);
            if (!val) setIsEditing(false);
        }}>
            <DialogContent className="max-w-[95vw] lg:max-w-7xl p-0 overflow-hidden bg-background">
                
                <DialogHeader className="sr-only">
                    <DialogTitle>{formData.nome} - Detalhes</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col lg:flex-row w-full h-full max-h-[90vh] overflow-y-auto lg:overflow-visible">
                    
                    {/* ESQUERDA */}
                    <div className="w-full lg:w-[35%] bg-muted/10 border-b lg:border-b-0 lg:border-r flex flex-col shrink-0">
                        <div className="h-56 lg:h-72 bg-white p-4 shrink-0 border-b relative">
                            <img
                                src={formData.imagem}
                                alt={formData.nome}
                                className="w-full h-full object-contain"
                            />
                        </div>

                        <div className="p-6 lg:p-8 flex flex-col grow">
                            
                            {isEditing ? (
                                <Input 
                                    name="nome" 
                                    value={formData.nome || ""} 
                                    onChange={handleChange} 
                                    className="text-xl lg:text-2xl font-bold mb-2 bg-white text-black"
                                />
                            ) : (
                                <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-primary">
                                    {formData.nome}
                                </h2>
                            )}

                            {isEditing ? (
                                <div className="flex items-center gap-2 mt-1 mb-6">
                                    <span className="text-sm font-medium text-muted-foreground">CÓDIGO:</span>
                                    <Input 
                                        name="cod_registro" 
                                        value={formData.cod_registro || ""} 
                                        onChange={handleChange} 
                                        className="h-8 w-32 text-sm bg-white text-black"
                                    />
                                </div>
                            ) : (
                                <p className="text-sm font-medium text-muted-foreground mt-1 mb-6">
                                    CÓDIGO: {formData.cod_registro}
                                </p>
                            )}

                            <div className="flex flex-wrap lg:flex-col gap-2 lg:gap-3">
                                <Badge variant="secondary" className="w-fit px-3 py-1 text-sm">
                                    {formData.status_operacional}
                                </Badge>
                                <Badge variant="outline" className="w-fit px-3 py-1 text-sm">
                                    Criticidade: {formData.nivel_criticidade}
                                </Badge>
                                <Badge
                                    className={`w-fit px-3 py-1 text-sm ${
                                        formData.status_saude === "Ok"
                                            ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                            : "bg-amber-100 text-amber-800 border-amber-300"
                                    }`}
                                >
                                    Saúde: {formData.status_saude}
                                </Badge>
                            </div>

                            <div className="mt-8 grid grid-cols-2 gap-4">
                                <div className="bg-background p-4 rounded-xl border flex flex-col items-center justify-center text-center shadow-sm">
                                    <Thermometer className="w-6 h-6 text-orange-500 mb-1" />
                                    <span className="text-xl lg:text-2xl font-bold">{formData.temperatura}°C</span>
                                </div>
                                <div className="bg-background p-4 rounded-xl border flex flex-col items-center justify-center text-center shadow-sm">
                                    <Activity className="w-6 h-6 text-blue-500 mb-1" />
                                    <span className="text-xl lg:text-2xl font-bold">{formData.vibracao}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                   
                    <div className="w-full lg:w-[65%] p-6 lg:p-8 flex flex-col bg-background">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 grow">
                            
                            <div className="p-5 lg:p-6 rounded-xl border bg-card/50">
                                <h3 className="font-semibold text-base lg:text-lg mb-4 flex items-center gap-2 border-b pb-3">
                                    <Info className="w-5 h-5 text-primary" />
                                    Informações Gerais
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {renderField("Modelo", "modelo")}
                                    {renderField("Série", "serie")}
                                    {renderField("Tipo", "tipo")}
                                    {renderField("Setor", "setor")}
                                </div>
                            </div>

                            <div className="p-5 lg:p-6 rounded-xl border bg-card/50">
                                <h3 className="font-semibold text-base lg:text-lg mb-4 flex items-center gap-2 border-b pb-3">
                                    <Zap className="w-5 h-5 text-yellow-500" />
                                    Elétrico / Performance
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {renderField("Potência (kW)", "potencia_kw")}
                                    {renderField("Tensão", "tensao_faixa")}
                                    {renderField("Corrente (A)", "corrente_nominal_a")}
                                    {renderField("Frequência (Hz)", "frequencia_hz")}
                                    {renderField("Rotação (RPM)", "rotacao_rpm", true)}
                                </div>
                            </div>

                            <div className="p-5 lg:p-6 rounded-xl border bg-card/50">
                                <h3 className="font-semibold text-base lg:text-lg mb-4 flex items-center gap-2 border-b pb-3">
                                    <Settings className="w-5 h-5 text-slate-500" />
                                    Especificações Técnicas
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {renderField("Proteção", "grau_protecao_ip")}
                                    {renderField("Isolamento", "classe_isolamento")}
                                    {renderField("Fator Serviço", "fator_servico")}
                                    {renderField("Rendimento", "rendimento_percentual", false, "%")}
                                    {renderField("Fator Potência", "fator_potencia", true)}
                                </div>
                            </div>

                            <div className="p-5 lg:p-6 rounded-xl border bg-card/50">
                                <h3 className="font-semibold text-base lg:text-lg mb-4 flex items-center gap-2 border-b pb-3">
                                    <ThermometerSun className="w-5 h-5 text-orange-400" />
                                    Ambiente & Normas
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {renderField("Operação (Mín)", "temperatura_ambiente_min_c", false, "°C")}
                                    {renderField("Operação (Máx)", "temperatura_ambiente_max_c", false, "°C")}
                                    {renderField("Certificação", "certificacao_norma", true)}
                                </div>
                            </div>

                        </div>

                        <div className="flex justify-end gap-3 mt-8 pt-6 border-t shrink-0">
                            {isEditing ? (
                                <>
                                    <Button variant="outline" onClick={handleCancel}>
                                        Cancelar
                                    </Button>
                                    <Button onClick={handleSave} disabled={loading}>
                                        {loading ? "Salvando..." : "Salvar Alterações"}
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button variant="secondary" onClick={() => setIsEditing(true)}>
                                        Editar
                                    </Button>
                                    <Button 
                                        variant="destructive" 
                                        onClick={() => setIsDeleteDialogOpen(true)}
                                    >
                                        Excluir
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>

                </div>
            </DialogContent>

            <ModalExcluirMotor
                open={isDeleteDialogOpen} 
                setOpen={setIsDeleteDialogOpen} 
                motor={motor} 
                onConfirm={handleConfirmDelete} 
            />
        </Dialog>
    );
}