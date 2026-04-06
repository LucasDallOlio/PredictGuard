"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Zap, Settings, Info, ThermometerSun, Factory } from "lucide-react";

export function ModalCriarMotor({ open, setOpen, onSave }) {
    // ... (mantenha o seu initialState e funções de handle exatamente iguais)
    const initialState = { /* ... */ };
    const [formData, setFormData] = useState({});

    const handleChange = (e) => { /* ... */ };
    const handleSelectChange = (name, value) => { /* ... */ };
    const handleSubmit = (e) => { e.preventDefault(); setOpen(false); };

    // COMPONENTE DE SESSÃO (Para deixar o código DRY e elegante)
    const SectionTitle = ({ icon: Icon, title, iconColor }) => (
        <h3 className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 border-b pb-2">
            <Icon className={`w-4 h-4 ${iconColor}`} />
            {title}
        </h3>
    );

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {/* Fundo do modal limpo e bordas arredondadas suaves */}
            <DialogContent className="max-w-[95vw] lg:max-w-4xl p-0 overflow-hidden bg-background border-border shadow-lg sm:rounded-xl">
                <form onSubmit={handleSubmit}>
                    
                    {/* Header Minimalista */}
                    <DialogHeader className="p-6 bg-card border-b">
                        <DialogTitle className="flex items-center gap-2 text-xl font-bold tracking-tight">
                            <div className="p-2 bg-primary/10 rounded-md">
                                <Factory className="w-5 h-5 text-primary" />
                            </div>
                            Cadastrar Novo Motor
                        </DialogTitle>
                    </DialogHeader>

                    <ScrollArea className="max-h-[70vh] p-6 bg-slate-50/50 dark:bg-slate-900/20">
                        <div className="space-y-8 bg-card p-6 rounded-xl border border-border/50 shadow-sm">
                            
                            <section>
                                <SectionTitle icon={Info} title="Informações Gerais" iconColor="text-blue-500" />
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                    <div className="md:col-span-2 space-y-1.5">
                                        <Label className="text-slate-600 dark:text-slate-400">Nome do Ativo</Label>
                                        <Input name="nome" placeholder="Ex: Motor Exaustor Principal" required onChange={handleChange} className="bg-background" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-slate-600 dark:text-slate-400">Cód. Registro</Label>
                                        <Input name="cod_registro" placeholder="Ex: MOT-102" required onChange={handleChange} className="bg-background" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-slate-600 dark:text-slate-400">Modelo</Label>
                                        <Input name="modelo" placeholder="Ex: W22 Plus" onChange={handleChange} className="bg-background" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-slate-600 dark:text-slate-400">Série</Label>
                                        <Input name="serie" placeholder="Nº de Série" onChange={handleChange} className="bg-background" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-slate-600 dark:text-slate-400">Setor / Localização</Label>
                                        <Input name="setor" placeholder="Ex: Britagem" onChange={handleChange} className="bg-background" />
                                    </div>
                                </div>
                            </section>

                            <section>
                                <SectionTitle icon={Zap} title="Elétrico & Performance" iconColor="text-amber-500" />
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                                    <div className="space-y-1.5">
                                        <Label className="text-slate-600 dark:text-slate-400">Potência (kW)</Label>
                                        <Input name="potencia_kw" type="number" step="0.1" onChange={handleChange} className="bg-background" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-slate-600 dark:text-slate-400">Tensão (V)</Label>
                                        <Input name="tensao_faixa" placeholder="Ex: 220/380" onChange={handleChange} className="bg-background" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-slate-600 dark:text-slate-400">Corrente (A)</Label>
                                        <Input name="corrente_nominal_a" type="number" step="0.01" onChange={handleChange} className="bg-background" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-slate-600 dark:text-slate-400">Rotação (RPM)</Label>
                                        <Input name="rotacao_rpm" type="number" onChange={handleChange} className="bg-background" />
                                    </div>
                                </div>
                            </section>

                            <section>
                                <SectionTitle icon={Settings} title="Status & Especificações Técnicas" iconColor="text-emerald-500" />
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                    <div className="space-y-1.5">
                                        <Label className="text-slate-600 dark:text-slate-400">Status Operacional</Label>
                                        <Select onValueChange={(v) => handleSelectChange("status_operacional", v)} defaultValue="Operando">
                                            <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Operando">Operando</SelectItem>
                                                <SelectItem value="Parado">Parado</SelectItem>
                                                <SelectItem value="Manutenção">Manutenção</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-slate-600 dark:text-slate-400">Saúde do Ativo</Label>
                                        <Select onValueChange={(v) => handleSelectChange("status_saude", v)} defaultValue="Ok">
                                            <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Ok">Saúde Ok</SelectItem>
                                                <SelectItem value="Alerta">Alerta</SelectItem>
                                                <SelectItem value="Crítico">Crítico</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-slate-600 dark:text-slate-400">Grau Proteção (IP)</Label>
                                        <Input name="grau_protecao_ip" placeholder="Ex: IP55" onChange={handleChange} className="bg-background" />
                                    </div>
                                </div>
                            </section>

                            <section>
                                <SectionTitle icon={ThermometerSun} title="Ambiente & Normas" iconColor="text-rose-500" />
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                    <div className="space-y-1.5">
                                        <Label className="text-slate-600 dark:text-slate-400">Temp. Amb. Máx (°C)</Label>
                                        <Input name="temperatura_ambiente_max_c" type="number" onChange={handleChange} className="bg-background" />
                                    </div>
                                    <div className="md:col-span-2 space-y-1.5">
                                        <Label className="text-slate-600 dark:text-slate-400">URL da Imagem</Label>
                                        <Input name="imagem" placeholder="https://..." onChange={handleChange} className="bg-background" />
                                    </div>
                                </div>
                            </section>

                        </div>
                    </ScrollArea>

                    <DialogFooter className="p-6 bg-card border-t gap-3 sm:justify-end">
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" className="shadow-sm">
                            Salvar Motor
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}