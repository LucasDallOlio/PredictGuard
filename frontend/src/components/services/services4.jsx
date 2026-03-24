"use client";

import { Activity, Thermometer, Wrench, AlertTriangle, Shield, TrendingUp, AlertCircle, Gauge } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import ServiceRequestModal from "./solicitacao-servico";

const Services4 = ({ className }) => {

  const [openModal, setOpenModal] = useState(false);
  const [selectedService, setSelectedService] = useState("");
const services = [
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Manutenção Preventiva",
    description:
      "Ações programadas para evitar falhas e aumentar a vida útil dos equipamentos.",
    items: [
      "Inspeção periódica",
      "Lubrificação e limpeza",
      "Troca preventiva de componentes",
    ],
  },
  {
    icon: <TrendingUp className="h-6 w-6" />,
    title: "Manutenção Preditiva",
    description:
      "Análise baseada em dados para identificar falhas antes que ocorram.",
    items: [
      "Monitoramento de vibração",
      "Análise térmica",
      "Diagnóstico baseado em tendências",
    ],
  },
  {
    icon: <Gauge className="h-6 w-6" />,
    title: "Manutenção Corretiva",
    description:
      "Correção de falhas após a ocorrência de problemas no equipamento.",
    items: [
      "Identificação da falha",
      "Reparo técnico especializado",
      "Testes de funcionamento",
    ],
  },
  {
    icon: <AlertCircle className="h-6 w-6" />,
    title: "Análise de Falha",
    description:
      "Atendimento imediato para investigação de problemas críticos detectados.",
    items: [
      "Resposta emergencial",
      "Análise de causa raiz",
      "Intervenção corretiva rápida",
    ],
  },
];

  return (
    <section className={cn("py-10 px-10", className)}>
      <div className="container">
        <div className="mx-auto max-w-7xl space-y-12">

         <div className="text-center max-w-3xl mx-auto space-y-4">

  <div className="flex items-center justify-center gap-2">
    <Activity className="h-6 w-6 text-primary" />
    <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
      Solicitação de Serviços
    </h2>
  </div>

  <div className="w-16 h-1 bg-primary mx-auto rounded-full" />

  <p className="text-lg text-muted-foreground leading-relaxed">
    Nosso sistema monitora vibração e temperatura das máquinas em tempo real.
    Caso seja detectado algum comportamento anormal, solicite uma análise técnica.
  </p>

</div>

          <div className="grid grid-cols-1 gap-8  md:grid-cols-2 ">
            {services.map((service, index) => (
             <div
  key={index}
  className="flex flex-col space-y-6 rounded-lg border border-border p-8 hover:shadow-sm h-full"
>

                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-muted p-3">
                    {service.icon}
                  </div>

                  <h3 className="text-xl font-semibold">
                    {service.title}
                  </h3>
                </div>

                <p className="text-muted-foreground">
                  {service.description}
                </p>

                <div className="space-y-2">
                  {service.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-foreground" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setSelectedService(service.title);
                    setOpenModal(true);
                  }}
                  className="mt-auto w-full rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
                >
                  Solicitar serviço
                </button>

              </div>
            ))}
          </div>

        </div>
      </div>

      <ServiceRequestModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        service={selectedService}
      />

    </section>
  );
};

export { Services4 };