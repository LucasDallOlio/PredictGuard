"use client";

import { Activity, Thermometer, Wrench, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import ServiceRequestModal from "./solicitacao-servico";

const Services4 = ({ className }) => {

  const [openModal, setOpenModal] = useState(false);
  const [selectedService, setSelectedService] = useState("");

  const services = [
    {
      icon: <Activity className="h-6 w-6" />,
      title: "Análise de Vibração",
      description:
        "Solicite uma análise detalhada de vibração para identificar desalinhamentos ou desgaste mecânico.",
      items: [
        "Diagnóstico de vibração",
        "Detecção de falhas mecânicas",
        "Relatório técnico",
      ],
    },
    {
      icon: <Thermometer className="h-6 w-6" />,
      title: "Análise de Temperatura",
      description:
        "Verificação de anomalias térmicas que podem indicar sobrecarga ou falhas.",
      items: [
        "Monitoramento térmico",
        "Identificação de superaquecimento",
        "Relatório de temperatura",
      ],
    },
    {
      icon: <Wrench className="h-6 w-6" />,
      title: "Manutenção Preventiva",
      description:
        "Solicite uma manutenção preventiva para evitar falhas nas máquinas.",
      items: [
        "Inspeção geral",
        "Ajustes e calibração",
        "Substituição preventiva de peças",
      ],
    },
    {
      icon: <AlertTriangle className="h-6 w-6" />,
      title: "Alerta de Falha Detectada",
      description:
        "Abra uma solicitação imediata quando o sistema detectar problema.",
      items: [
        "Resposta rápida",
        "Análise do problema",
        "Intervenção técnica",
      ],
    },
  ];

  return (
    <section className={cn("py-10 px-10", className)}>
      <div className="container">
        <div className="mx-auto max-w-6xl space-y-12">

          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-semibold md:text-4xl">
              Solicitação de Serviços
            </h2>

            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Nosso sistema monitora vibração e temperatura das máquinas em
              tempo real. Caso seja detectado algum comportamento anormal,
              solicite uma análise técnica.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {services.map((service, index) => (
              <div
                key={index}
                className="space-y-6 rounded-lg border border-border p-8 hover:shadow-sm"
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
                  className="mt-4 w-full rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
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