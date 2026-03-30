"use client";

import { useState } from "react";
import {
  Activity,
  AlertTriangle,
  Shield,
  EllipsisVertical,
  Eye,
  Trash2
} from "lucide-react";

import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/ui/table";

import { Checkbox } from "@/components/ui/checkbox";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Card, CardHeader,
  CardTitle, CardContent,
  CardDescription
} from "@/components/ui/card";

import { cn } from "@/lib/utils";


import DetalhesSolicitacaoModal from "./DetalhesSolicitacaoModal";

const TableComp = () => {

  const [data, setData] = useState([
    {
      id: 1,
      service: "Manutenção Preditiva",
      type: "Análise de vibração",
      technician: "Carlos Silva",
      status: "alerta",
      icon: Activity,
    },
    {
      id: 2,
      service: "Manutenção Preventiva",
      type: "Inspeção periódica",
      technician: "Fernanda Costa",
      status: "normal",
      icon: Shield,
    },
    {
      id: 3,
      service: "Análise de Falha",
      type: "Temperatura elevada",
      technician: "Lucas Mendes",
      status: "critico",
      icon: AlertTriangle,
    },
  ]);

 
  const [openModal, setOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  
  const getStatus = (status) => {
    switch (status) {
      case "critico":
        return "bg-red-500/10 text-red-400 border border-red-500/20";
      case "alerta":
        return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20";
      default:
        return "bg-green-500/10 text-green-400 border border-green-500/20";
    }
  };

  
  const handleView = (item) => {
    setSelectedItem(item);
    setOpenModal(true);
  };

  // 🗑️ deletar
  const handleDelete = (id) => {
    setData(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 py-10">

      <div className="max-w-7xl mx-auto">

        <Card className="border border-border/50 bg-background/70 backdrop-blur">

          <CardHeader className="border-b border-border/50">

            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <Activity className="h-5 w-5 text-primary" />
              Histórico de Solicitações
            </CardTitle>

            <CardDescription className="text-xs">
              Monitoramento e registros de solicitações anteriores
            </CardDescription>

          </CardHeader>

          <CardContent className="p-0">

            <div className="w-full overflow-x-auto">

              <Table className="min-w-[800px]">

                <TableHeader>
                  <TableRow>

                    <TableHead className="w-[50px] pl-6">
                      <Checkbox />
                    </TableHead>

                    <TableHead>Serviço</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Técnico</TableHead>
                    <TableHead>Status</TableHead>

                    <TableHead className="text-right pr-6">
                      Ações
                    </TableHead>

                  </TableRow>
                </TableHeader>

                <TableBody>

                  {data.map((item) => (

                    <TableRow
                      key={item.id}
                      className="hover:bg-muted/30 transition"
                    >

                      <TableCell className="pl-6">
                        <Checkbox />
                      </TableCell>

                 
                      <TableCell>
                        <div className="flex items-center gap-3">

                          <div className="p-2 rounded-md bg-muted">
                            <item.icon className="h-4 w-4 text-primary" />
                          </div>

                          <span className="font-medium">
                            {item.service}
                          </span>

                        </div>
                      </TableCell>

                     
                      <TableCell className="text-muted-foreground text-sm">
                        {item.type}
                      </TableCell>

                      <TableCell className="text-sm">
                        {item.technician}
                      </TableCell>

                      
                      <TableCell>
                        <span className={cn(
                          "px-2 py-1 rounded-md text-xs font-medium",
                          getStatus(item.status)
                        )}>
                          {item.status.toUpperCase()}
                        </span>
                      </TableCell>

                
                      <TableCell className="text-right pr-6">

                        <DropdownMenu>

                          <DropdownMenuTrigger asChild>
                            <button className="p-2 rounded-md hover:bg-muted">
                              <EllipsisVertical size={18} />
                            </button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">

                            <DropdownMenuItem
                              onClick={() => handleView(item)}
                              className="flex gap-2 cursor-pointer"
                            >
                              <Eye size={16} />
                              Ver detalhes
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => handleDelete(item.id)}
                              className="flex gap-2 cursor-pointer text-red-400"
                            >
                              <Trash2 size={16} />
                              Excluir
                            </DropdownMenuItem>

                          </DropdownMenuContent>

                        </DropdownMenu>

                      </TableCell>

                    </TableRow>

                  ))}

                </TableBody>

              </Table>

            </div>

          </CardContent>

        </Card>

      </div>

      <DetalhesSolicitacaoModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        data={selectedItem}
      />

    </div>
  );
};

export default TableComp;