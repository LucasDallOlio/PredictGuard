"use client";

import { useEffect, useState } from "react";

import {
  Activity,
  AlertTriangle,
  Shield,
  EllipsisVertical,
  Eye,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Checkbox } from "@/components/ui/checkbox";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

import DetalhesSolicitacaoModal from "./DetalhesSolicitacaoModal";

import { useService } from "@/hooks/useServiceRequest";

const STATUS_CONFIG = {
  solicitado: {
    label: "Solicitado",

    className: `
      bg-blue-500/10
      text-blue-400
      border border-blue-500/20
    `,

    icon: Shield,
  },

  em_andamento: {
    label: "Em Andamento",

    className: `
      bg-yellow-500/10
      text-yellow-400
      border border-yellow-500/20
    `,

    icon: Activity,
  },

  alerta: {
    label: "Alerta",

    className: `
      bg-orange-500/10
      text-orange-400
      border border-orange-500/20
    `,

    icon: AlertTriangle,
  },

  critico: {
    label: "Crítico",

    className: `
      bg-red-500/10
      text-red-400
      border border-red-500/20
    `,

    icon: AlertTriangle,
  },

  concluido: {
    label: "Concluído",

    className: `
      bg-green-500/10
      text-green-400
      border border-green-500/20
    `,

    icon: Shield,
  },

  cancelado: {
    label: "Cancelado",

    className: `
      bg-gray-500/10
      text-gray-400
      border border-gray-500/20
    `,

    icon: Shield,
  },
};

const TIPOS_LABELS = {
  analise_de_falha: "Análise de Falha",

  manutencao_preventiva:
    "Manutenção Preventiva",

  manutencao_preditiva:
    "Manutenção Preditiva",

  manutencao_corretiva:
    "Manutenção Corretiva",
};

const TableComp = () => {

  const {
    servicos,
    listarServicos,
    loading,
    erro,
    pagina,
    totalPaginas,
    atualizarStatusServico,
    proximaPagina,
    paginaAnterior,
  } = useService();

  const [openModal, setOpenModal] =
    useState(false);

  const [selectedItem, setSelectedItem] =
    useState(null);

  async function carregarServicos() {

    try {

      await listarServicos(pagina);

    } catch (error) {

      console.error(
        "Erro ao buscar serviços:",
        error
      );
    }
  }

  useEffect(() => {

    carregarServicos();

    function atualizarTabela() {

      carregarServicos();
    }

    window.addEventListener(
      "servico-criado",
      atualizarTabela
    );

    return () => {

      window.removeEventListener(
        "servico-criado",
        atualizarTabela
      );
    };

  }, [pagina]);

  function formatarTexto(texto) {

    if (!texto) return "Não informado";

    return texto
      .replace(/_/g, " ")
      .toLowerCase()
      .split(" ")
      .map((palavra) =>
        palavra.charAt(0).toUpperCase() +
        palavra.slice(1)
      )
      .join(" ");
  }

  function formatarTipo(tipo) {

    if (!tipo) return "Não informado";

    return (
      TIPOS_LABELS[tipo] ||
      formatarTexto(tipo)
    );
  }

  function getStatusInfo(status) {

    if (!status) {

      return {
        label: "Não informado",

        className: `
          bg-gray-500/10
          text-gray-400
          border border-gray-500/20
        `,

        icon: Shield,
      };
    }

    const key = status
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "_");

    return (
      STATUS_CONFIG[key] || {
        label: formatarTexto(status),

        className: `
          bg-blue-500/10
          text-blue-400
          border border-blue-500/20
        `,

        icon: Shield,
      }
    );
  }

  function handleView(item) {

    setSelectedItem(item);

    setOpenModal(true);
  }


  return (

    <div className="w-full px-4 sm:px-6 lg:px-10 py-10">

      <div className="max-w-7xl mx-auto">

        <Card className="
          border border-border/50
          bg-background/70
          backdrop-blur
        ">

          <CardHeader className="
            border-b border-border/50
          ">

            <CardTitle className="
              flex items-center gap-2
              text-lg font-semibold
            ">

              <Activity className="
                h-5 w-5 text-primary
              " />

              Histórico de Solicitações

            </CardTitle>

            <CardDescription className="text-xs">

              Monitoramento e registros
              de solicitações anteriores

            </CardDescription>

          </CardHeader>

          <CardContent className="p-0">

            <div className="w-full overflow-x-auto">

              {loading ? (

                <div className="
                  p-6 text-center
                  text-muted-foreground
                ">

                  Carregando solicitações...

                </div>

              ) : erro ? (

                <div className="
                  p-6 text-center text-red-500
                ">

                  {erro}

                </div>

              ) : (

                <>

                  <Table className="min-w-[800px]">

                    <TableHeader>

                      <TableRow>

                        <TableHead className="
                          w-[50px] pl-6
                        ">

                          <Checkbox />

                        </TableHead>

                        <TableHead>
                          Serviço
                        </TableHead>

                        <TableHead>
                          Máquina
                        </TableHead>

                        <TableHead>
                          Descrição
                        </TableHead>

                        <TableHead>
                          Técnico
                        </TableHead>

                        <TableHead>
                          Status
                        </TableHead>

                        <TableHead className="
                          text-right pr-6
                        ">

                          Ações

                        </TableHead>

                      </TableRow>

                    </TableHeader>

                    <TableBody>

                      {servicos.length > 0 ? (

                        servicos.map((item) => {

                          const statusInfo =
                            getStatusInfo(
                              item.servico_status
                            );

                          const Icon =
                            statusInfo.icon;

                          return (

                            <TableRow
                              key={item.id}
                              className="
                                hover:bg-muted/30
                                transition
                              "
                            >

                              <TableCell className="pl-6">

                                <Checkbox />

                              </TableCell>

                              <TableCell>

                                <div className="
                                  flex items-center gap-3
                                ">

                                  <div className="
                                    p-2 rounded-md bg-muted
                                  ">

                                    <Icon className="
                                      h-4 w-4 text-primary
                                    " />

                                  </div>

                                  <span className="font-medium">

                                    {formatarTipo(
                                      item.tipo
                                    )}

                                  </span>

                                </div>

                              </TableCell>

                              <TableCell className="text-sm">

                                {formatarTexto(
                                  item.maquina
                                )}

                              </TableCell>

                              <TableCell className="
                                text-muted-foreground
                                text-sm
                                max-w-[300px]
                                truncate
                              ">

                                {item.descricao ||
                                  "Não informado"}

                              </TableCell>

                              <TableCell className="text-sm">

                                {formatarTexto(
                                  item.usuario_responsavel
                                )}

                              </TableCell>

                              <TableCell>

                                <span
                                  className={cn(
                                    `
                                      px-2 py-1
                                      rounded-md
                                      text-xs
                                      font-medium
                                    `,
                                    statusInfo.className
                                  )}
                                >

                                  {statusInfo.label}

                                </span>

                              </TableCell>

                              <TableCell className="
                                text-right pr-6
                              ">

                                <DropdownMenu>

                                  <DropdownMenuTrigger asChild>

                                    <button className="
                                      p-2 rounded-md
                                      hover:bg-muted
                                    ">

                                      <EllipsisVertical
                                        size={18}
                                      />

                                    </button>

                                  </DropdownMenuTrigger>

                                  <DropdownMenuContent
                                    align="end"
                                  >

                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleView(item)
                                      }
                                      className="
                                        flex gap-2
                                        cursor-pointer
                                      "
                                    >

                                      <Eye size={16} />

                                      Ver detalhes

                                    </DropdownMenuItem>

                                    {statusInfo.label !==
                                      "Cancelado" && (

                                        <DropdownMenuItem
                                          onClick={async () => {
                                            try {
                                              await atualizarStatusServico(
                                                item.id,
                                                "cancelado"
                                              );
                                            } catch (error) {
                                              console.error(
                                                "Erro ao cancelar serviço:",
                                                error
                                              );
                                            }
                                          }}
                                          className="
                                            flex gap-2
                                            cursor-pointer
                                            text-red-400
                                          "
                                        >

                                          <AlertTriangle
                                            size={16}
                                          />

                                          Cancelar serviço

                                        </DropdownMenuItem>
                                      )}

                                  </DropdownMenuContent>

                                </DropdownMenu>

                              </TableCell>

                            </TableRow>
                          );
                        })

                      ) : (

                        <TableRow>

                          <TableCell
                            colSpan={7}
                            className="
                              text-center py-10
                              text-muted-foreground
                            "
                          >

                            Nenhuma solicitação encontrada.

                          </TableCell>

                        </TableRow>
                      )}

                    </TableBody>

                  </Table>

                  <div className="
                    flex justify-end items-center
                    gap-4 p-4 border-t
                  ">

                    <Button
                      variant="outline"
                      onClick={paginaAnterior}
                      disabled={pagina === 1}
                    >

                      Anterior

                    </Button>

                    <span className="
                      text-sm text-muted-foreground
                    ">

                      Página {pagina} de{" "}
                      {totalPaginas}

                    </span>

                    <Button
                      variant="outline"
                      onClick={proximaPagina}
                      disabled={
                        pagina === totalPaginas
                      }
                    >

                      Próxima

                    </Button>

                  </div>

                </>
              )}

            </div>

          </CardContent>

        </Card>

      </div>

      <DetalhesSolicitacaoModal
        open={openModal}
        onClose={() =>
          setOpenModal(false)
        }
        data={selectedItem}
      />

    </div>
  );
};

export default TableComp;