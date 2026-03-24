"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
    Thermometer, 
    Activity, 
    Zap, 
    Settings, 
    Info, 
    ThermometerSun
} from "lucide-react";

import { useState } from "react";
import { ModalExcluirMotor } from "./ModalExcluirMotor"; // Ajuste o caminho do import se precisar

// Recebendo a prop onDelete para acionar a exclusão do banco/estado
export function ModalMotorDetalhes({ open, setOpen, motor, onDelete }) {
    // Estado para controlar a abertura do modal de exclusão
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    // Função que roda quando o usuário clica "Sim, excluir" lá no ModalExcluirMotor
    const handleConfirmDelete = (id) => {
        onDelete(id); // Executa a função que veio do componente pai
        setIsDeleteDialogOpen(false); // Fecha o modal de alerta
        setOpen(false); // Fecha este modal gigante de detalhes
    };

    if (!motor) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-[95vw] lg:max-w-7xl p-0 overflow-hidden bg-background">
                
                <DialogHeader className="sr-only">
                    <DialogTitle>{motor.nome} - Detalhes</DialogTitle>
                </DialogHeader>

                {/* Container principal: Rola no mobile, fica fixo no desktop */}
                <div className="flex flex-col lg:flex-row w-full h-full max-h-[90vh] overflow-y-auto lg:overflow-visible">
                    
                    {/* COLUNA ESQUERDA: Imagem e Info Principal */}
                    <div className="w-full lg:w-[35%] bg-muted/10 border-b lg:border-b-0 lg:border-r flex flex-col shrink-0">
                        <div className="h-56 lg:h-72 bg-white p-4 shrink-0 border-b relative">
                            <img
                                src={motor.imagem}
                                alt={motor.nome}
                                className="w-full h-full object-contain"
                            />
                        </div>

                        <div className="p-6 lg:p-8 flex flex-col grow">
                            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-primary">
                                {motor.nome}
                            </h2>
                            <p className="text-sm font-medium text-muted-foreground mt-1 mb-6">
                                CÓDIGO: {motor.cod_registro}
                            </p>

                            <div className="flex flex-wrap lg:flex-col gap-2 lg:gap-3">
                                <Badge variant="secondary" className="w-fit px-3 py-1 text-sm">
                                    {motor.status_operacional}
                                </Badge>
                                <Badge variant="outline" className="w-fit px-3 py-1 text-sm">
                                    Criticidade: {motor.nivel_criticidade}
                                </Badge>
                                <Badge
                                    className={`w-fit px-3 py-1 text-sm ${
                                        motor.status_saude === "Ok"
                                            ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                            : "bg-amber-100 text-amber-800 border-amber-300"
                                    }`}
                                >
                                    Saúde: {motor.status_saude}
                                </Badge>
                            </div>

                            {/* Status de Tempo Real */}
                            <div className="mt-8 grid grid-cols-2 gap-4">
                                <div className="bg-background p-4 rounded-xl border flex flex-col items-center justify-center text-center shadow-sm">
                                    <Thermometer className="w-6 h-6 text-orange-500 mb-1" />
                                    <span className="text-xl lg:text-2xl font-bold">{motor.temperatura}°C</span>
                                </div>
                                <div className="bg-background p-4 rounded-xl border flex flex-col items-center justify-center text-center shadow-sm">
                                    <Activity className="w-6 h-6 text-blue-500 mb-1" />
                                    <span className="text-xl lg:text-2xl font-bold">{motor.vibracao}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* COLUNA DIREITA: Dados Técnicos */}
                    <div className="w-full lg:w-[65%] p-6 lg:p-8 flex flex-col bg-background">
                        
                        {/* Grid de Cards Técnicos */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 grow">
                            
                            {/* INFORMAÇÕES GERAIS */}
                            <div className="p-5 lg:p-6 rounded-xl border bg-card/50">
                                <h3 className="font-semibold text-base lg:text-lg mb-4 flex items-center gap-2 border-b pb-3">
                                    <Info className="w-5 h-5 text-primary" />
                                    Informações Gerais
                                </h3>
                                <div className="grid grid-cols-2 gap-y-4">
                                    <div><span className="text-[10px] lg:text-xs text-muted-foreground block uppercase tracking-wider mb-1">Modelo</span><span className="font-medium text-sm">{motor.modelo}</span></div>
                                    <div><span className="text-[10px] lg:text-xs text-muted-foreground block uppercase tracking-wider mb-1">Série</span><span className="font-medium text-sm">{motor.serie}</span></div>
                                    <div><span className="text-[10px] lg:text-xs text-muted-foreground block uppercase tracking-wider mb-1">Tipo</span><span className="font-medium text-sm">{motor.tipo}</span></div>
                                    <div><span className="text-[10px] lg:text-xs text-muted-foreground block uppercase tracking-wider mb-1">Setor</span><span className="font-medium text-sm">{motor.setor}</span></div>
                                </div>
                            </div>

                            {/* ELÉTRICO */}
                            <div className="p-5 lg:p-6 rounded-xl border bg-card/50">
                                <h3 className="font-semibold text-base lg:text-lg mb-4 flex items-center gap-2 border-b pb-3">
                                    <Zap className="w-5 h-5 text-yellow-500" />
                                    Elétrico / Performance
                                </h3>
                                <div className="grid grid-cols-2 gap-y-4">
                                    <div><span className="text-[10px] lg:text-xs text-muted-foreground block uppercase tracking-wider mb-1">Potência</span><span className="font-medium text-sm">{motor.potencia_kw} kW</span></div>
                                    <div><span className="text-[10px] lg:text-xs text-muted-foreground block uppercase tracking-wider mb-1">Tensão</span><span className="font-medium text-sm">{motor.tensao_faixa}</span></div>
                                    <div><span className="text-[10px] lg:text-xs text-muted-foreground block uppercase tracking-wider mb-1">Corrente</span><span className="font-medium text-sm">{motor.corrente_nominal_a} A</span></div>
                                    <div><span className="text-[10px] lg:text-xs text-muted-foreground block uppercase tracking-wider mb-1">Frequência</span><span className="font-medium text-sm">{motor.frequencia_hz} Hz</span></div>
                                    <div className="col-span-2"><span className="text-[10px] lg:text-xs text-muted-foreground block uppercase tracking-wider mb-1">Rotação</span><span className="font-medium text-sm">{motor.rotacao_rpm} RPM</span></div>
                                </div>
                            </div>

                            {/* ESPECIFICAÇÕES */}
                            <div className="p-5 lg:p-6 rounded-xl border bg-card/50">
                                <h3 className="font-semibold text-base lg:text-lg mb-4 flex items-center gap-2 border-b pb-3">
                                    <Settings className="w-5 h-5 text-slate-500" />
                                    Especificações Técnicas
                                </h3>
                                <div className="grid grid-cols-2 gap-y-4">
                                    <div><span className="text-[10px] lg:text-xs text-muted-foreground block uppercase tracking-wider mb-1">Proteção</span><span className="font-medium text-sm">{motor.grau_protecao_ip}</span></div>
                                    <div><span className="text-[10px] lg:text-xs text-muted-foreground block uppercase tracking-wider mb-1">Isolamento</span><span className="font-medium text-sm">{motor.classe_isolamento}</span></div>
                                    <div><span className="text-[10px] lg:text-xs text-muted-foreground block uppercase tracking-wider mb-1">Fator Serviço</span><span className="font-medium text-sm">{motor.fator_servico}</span></div>
                                    <div><span className="text-[10px] lg:text-xs text-muted-foreground block uppercase tracking-wider mb-1">Rendimento</span><span className="font-medium text-sm">{motor.rendimento_percentual}%</span></div>
                                    <div className="col-span-2"><span className="text-[10px] lg:text-xs text-muted-foreground block uppercase tracking-wider mb-1">Fator Potência</span><span className="font-medium text-sm">{motor.fator_potencia}</span></div>
                                </div>
                            </div>

                            {/* AMBIENTE */}
                            <div className="p-5 lg:p-6 rounded-xl border bg-card/50">
                                <h3 className="font-semibold text-base lg:text-lg mb-4 flex items-center gap-2 border-b pb-3">
                                    <ThermometerSun className="w-5 h-5 text-orange-400" />
                                    Ambiente & Normas
                                </h3>
                                <div className="grid grid-cols-2 gap-y-4">
                                    <div><span className="text-[10px] lg:text-xs text-muted-foreground block uppercase tracking-wider mb-1">Operação (Mín)</span><span className="font-medium text-sm">{motor.temperatura_ambiente_min_c}°C</span></div>
                                    <div><span className="text-[10px] lg:text-xs text-muted-foreground block uppercase tracking-wider mb-1">Operação (Máx)</span><span className="font-medium text-sm">{motor.temperatura_ambiente_max_c}°C</span></div>
                                    <div className="col-span-2"><span className="text-[10px] lg:text-xs text-muted-foreground block uppercase tracking-wider mb-1">Certificação</span><span className="font-medium text-sm">{motor.certificacao_norma}</span></div>
                                </div>
                            </div>

                        </div>

                        {/* AÇÕES FIXAS APENAS EDITAR E EXCLUIR */}
                        <div className="flex justify-end gap-3 mt-8 pt-6 border-t shrink-0">
                            <Button variant="secondary">Editar</Button>
                            {/* Botão agora abre o modal de exclusão */}
                            <Button 
                                variant="destructive" 
                                onClick={() => setIsDeleteDialogOpen(true)}
                            >
                                Excluir
                            </Button>
                        </div>
                    </div>

                </div>
            </DialogContent>

            {/* Injetando o componente ModalExcluirMotor aqui */}
            <ModalExcluirMotor
                open={isDeleteDialogOpen} 
                setOpen={setIsDeleteDialogOpen} 
                motor={motor} 
                onConfirm={handleConfirmDelete} 
            />
        </Dialog>
    );
}