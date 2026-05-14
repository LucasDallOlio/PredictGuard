"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";

import {
  Activity,
  AlertTriangle,
  Shield,
} from "lucide-react";

const DetalhesSolicitacaoModal = ({
  open,
  onClose,
  data,
}) => {

  if (!data) return null;

  function getStatusColor(status) {

    switch (status?.toLowerCase()) {

      case "crítico":
      case "critico":

        return `
          bg-red-500/10
          text-red-400
          border border-red-500/20
        `;

      case "em andamento":
      case "alerta":

        return `
          bg-yellow-500/10
          text-yellow-400
          border border-yellow-500/20
        `;

      case "concluído":
      case "concluido":

        return `
          bg-green-500/10
          text-green-400
          border border-green-500/20
        `;

      case "cancelado":

        return `
          bg-gray-500/10
          text-gray-400
          border border-gray-500/20
        `;

      default:

        return `
          bg-blue-500/10
          text-blue-400
          border border-blue-500/20
        `;
    }
  }

  function getIcon(status) {

    switch (status?.toLowerCase()) {

      case "crítico":
      case "critico":

        return AlertTriangle;

      case "em andamento":
      case "alerta":

        return Activity;

      default:

        return Shield;
    }
  }

  const Icon = getIcon(
    data.servico_status
  );

  return (

    <Dialog
      open={open}
      onOpenChange={onClose}
    >

      <DialogContent className="sm:max-w-lg">

        <DialogHeader>

          <DialogTitle className="
            flex items-center gap-2
          ">

            <Icon className="
              h-5 w-5 text-primary
            " />

            Detalhes da Solicitação

          </DialogTitle>

        </DialogHeader>

        <div className="space-y-5 text-sm">

          <div>

            <p className="
              text-muted-foreground
            ">

              Serviço

            </p>

            <p className="font-medium">

              {data.tipo || "Não informado"}

            </p>

          </div>

          <div>

            <p className="
              text-muted-foreground
            ">

              Máquina

            </p>

            <p>

              {data.maquina || "Não informado"}

            </p>

          </div>

          <div>

            <p className="
              text-muted-foreground
            ">

              Descrição

            </p>

            <p className="
              break-words
            ">

              {data.descricao || "Não informado"}

            </p>

          </div>

          <div>

            <p className="
              text-muted-foreground
            ">

              Técnico Responsável

            </p>

            <p>

              {data.usuario_responsavel ||
                "Não informado"}

            </p>

          </div>

          <div>

            <p className="
              text-muted-foreground mb-2
            ">

              Status

            </p>

            <Badge
              className={getStatusColor(
                data.servico_status
              )}
            >

              {data.servico_status ||
                "Não informado"}

            </Badge>

          </div>

        </div>

      </DialogContent>

    </Dialog>
  );
};

export default DetalhesSolicitacaoModal;