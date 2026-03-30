"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";

const DetalhesSolicitacaoModal = ({ open, onClose, data }) => {

  if (!data) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case "critico":
        return "bg-red-500/10 text-red-400";
      case "alerta":
        return "bg-yellow-500/10 text-yellow-400";
      default:
        return "bg-green-500/10 text-green-400";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>

      <DialogContent className="sm:max-w-md">

        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Detalhes da Solicitação
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm">

          <div>
            <p className="text-muted-foreground">Serviço</p>
            <p className="font-medium">{data.service}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Tipo</p>
            <p>{data.type}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Técnico</p>
            <p>{data.technician}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Status</p>
            <Badge className={getStatusColor(data.status)}>
              {data.status.toUpperCase()}
            </Badge>
          </div>

        </div>

      </DialogContent>

    </Dialog>
  );
};

export default DetalhesSolicitacaoModal;