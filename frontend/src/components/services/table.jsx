"use client";

import { useState, useEffect } from "react";
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

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import DetalhesSolicitacaoModal from "./DetalhesSolicitacaoModal";

import { useService } from "@/hooks/useServiceRequest"; 

const TableComp = () => {
  const { getServicos, deletarServico, loading } = useService(); 
  const [data, setData] = useState([]);

  const [openModal, setOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);


  const carregarServicos = async () => {
    try {
      const result = await getServicos();
      setData(result);
    } catch (error) {
      console.error("Erro ao buscar serviços:", error);
    }
  };

  useEffect(() => {
    carregarServicos();
  }, []);


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

  const getIcon = (status) => {
    switch (status) {
      case "critico":
        return AlertTriangle;
      case "alerta":
        return Activity;
      default:
        return Shield;
    }
  };

  const handleView = (item) => {
    setSelectedItem(item);
    setOpenModal(true);
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setOpenConfirm(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deletarServico(itemToDelete.id); 
      setData(prev => prev.filter(item => item.id !== itemToDelete.id));
    } catch (error) {
      console.error("Erro ao excluir:", error);
    }
    setOpenConfirm(false);
    setItemToDelete(null);
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
              {loading ? (
                <div className="p-6 text-center text-muted-foreground">
                  Carregando solicitações...
                </div>
              ) : (
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
                      <TableHead className="text-right pr-6">Ações</TableHead>
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
                              {(() => {
                                const Icon = getIcon(item.status);
                                return <Icon className="h-4 w-4 text-primary" />;
                              })()}
                            </div>
                            <span className="font-medium">{item.service}</span>
                          </div>
                        </TableCell>

                        <TableCell className="text-muted-foreground text-sm">
                          {item.type}
                        </TableCell>

                        <TableCell className="text-sm">{item.technician}</TableCell>

                        <TableCell>
                          <span
                            className={cn(
                              "px-2 py-1 rounded-md text-xs font-medium",
                              getStatus(item.status)
                            )}
                          >
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
                                <Eye size={16} /> Ver detalhes
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => handleDeleteClick(item)}
                                className="flex gap-2 cursor-pointer text-red-400"
                              >
                                <Trash2 size={16} /> Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <DetalhesSolicitacaoModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        data={selectedItem}
      />

      <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-500">Confirmar exclusão</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Tem certeza que deseja excluir a solicitação{" "}
            <span className="font-semibold text-foreground">{itemToDelete?.service}</span>?
          </p>
          <DialogFooter className="mt-4 flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setOpenConfirm(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TableComp;