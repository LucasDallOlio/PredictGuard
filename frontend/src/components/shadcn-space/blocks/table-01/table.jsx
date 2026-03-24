"use client";

import { useEffect, useState } from "react";
import { EllipsisVertical, Loader2 } from "lucide-react";

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card, CardHeader, CardTitle, CardContent, CardDescription
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const TableComp = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("http://localhost:3000/solicitacoes");
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 py-6">
      <div className="max-w-7xl mx-auto">

        <Card className="w-full shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl font-semibold">
              Histórico de Solicitações
            </CardTitle>
            <CardDescription>
              Acompanhe os chamados em tempo real
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0">
            <div className="w-full overflow-x-auto">

              <Table className="min-w-[700px] sm:min-w-full">

                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px] pl-4">
                      <Checkbox />
                    </TableHead>
                    <TableHead>Serviço</TableHead>
                    <TableHead className="hidden sm:table-cell">Motor</TableHead>
                    <TableHead className="hidden md:table-cell">Setor</TableHead>
                    <TableHead className="hidden lg:table-cell">Técnico</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Prioridade</TableHead>
                    <TableHead className="text-right pr-4">Ações</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>

                  {loading && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-10">
                        <Loader2 className="animate-spin mx-auto" />
                      </TableCell>
                    </TableRow>
                  )}

                  {!loading && data.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-10">
                        Nenhuma solicitação encontrada
                      </TableCell>
                    </TableRow>
                  )}

                  {!loading && data.map((item) => (

                    <TableRow key={item.id}>

                      <TableCell className="pl-4">
                        <Checkbox />
                      </TableCell>

                      <TableCell>
                        <div>
                          <p className="font-medium">{item.servico}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.data}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell className="hidden sm:table-cell font-medium">
                        ⚙️ {item.motor}
                      </TableCell>

                      <TableCell className="hidden md:table-cell">
                        <span className="bg-muted px-2 py-1 rounded-md text-xs">
                          {item.setor}
                        </span>
                      </TableCell>

                      <TableCell className="hidden lg:table-cell">
                        <div className="flex items-center gap-2">

                          <img
                            src={item.avatar || "https://i.pravatar.cc/150?img=5"}
                            alt={item.tecnico}
                            className="w-8 h-8 rounded-full object-cover border"
                          />

                          <span className="text-sm font-medium">
                            {item.tecnico}
                          </span>

                        </div>
                      </TableCell>

                      <TableCell>
                        <span
                          className={cn(
                            "px-2 py-1 rounded-md text-xs sm:text-sm",
                            item.status === "Concluído" && "bg-green-100 text-green-700",
                            item.status === "Em andamento" && "bg-yellow-100 text-yellow-700",
                            item.status === "Pendente" && "bg-red-100 text-red-700"
                          )}
                        >
                          {item.status}
                        </span>
                      </TableCell>

                      <TableCell>
                        <span
                          className={cn(
                            "px-2 py-1 rounded-md text-xs sm:text-sm",
                            item.prioridade === "Alta" && "bg-red-100 text-red-700",
                            item.prioridade === "Média" && "bg-yellow-100 text-yellow-700",
                            item.prioridade === "Baixa" && "bg-green-100 text-green-700"
                          )}
                        >
                          {item.prioridade}
                        </span>
                      </TableCell>

                      <TableCell className="text-right pr-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-2 rounded-md hover:bg-muted">
                              <EllipsisVertical size={18} />
                            </button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Ver</DropdownMenuItem>
                            <DropdownMenuItem>Editar</DropdownMenuItem>
                            <DropdownMenuItem>Excluir</DropdownMenuItem>
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
    </div>
  );
};

export default TableComp;