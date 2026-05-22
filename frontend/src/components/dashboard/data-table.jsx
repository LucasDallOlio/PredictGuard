"use client"

import * as React from "react"

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  AlertTriangle,
  Shield,
  Thermometer,
  Activity,
  Factory,
  Siren,
  Calendar,
  Eye,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { useAlertas } from "@/hooks/usealertas"

export function DataTable() {

  const {
    alertas,
    loading,
    erro,
    pagina,
    totalPaginas,
    proximaPagina,
    paginaAnterior,
  } = useAlertas()

  const [alertaSelecionado, setAlertaSelecionado] = React.useState(null)

  const columns = [
    {
      accessorKey: "maquina",
      header: "Máquina",

      cell: ({ row }) => (
        <div className="flex items-center gap-2 font-medium">
          <Factory className="w-4 h-4 text-primary" />

          <span>
            {row.original.maquina}
          </span>
        </div>
      ),
    },

    {
      accessorKey: "maquina_setor",
      header: "Setor",

      cell: ({ row }) => (
        <Badge variant="outline">
          {row.original.maquina_setor
            ?.replaceAll("_", " ")
            ?.replace(/\b\w/g, (l) => l.toUpperCase())}
        </Badge>
      ),
    },

    {
      accessorKey: "tipo_alerta",
      header: "Tipo",

      cell: ({ row }) => {

        const tipo = row.original.tipo_alerta

        return (
          <div className="flex items-center gap-2">

            {tipo === "temperatura" && (
              <Thermometer className="w-4 h-4 text-orange-500" />
            )}

            {tipo === "vibracao" && (
              <Activity className="w-4 h-4 text-blue-500" />
            )}

            {tipo === "offline" && (
              <Siren className="w-4 h-4 text-red-500" />
            )}

            {tipo === "tendencia" && (
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
            )}

            <span className="capitalize font-medium">
              {tipo}
            </span>

          </div>
        )
      },
    },

    {
      accessorKey: "severidade",
      header: "Severidade",

      cell: ({ row }) => {

        const severidade = row.original.severidade

        return (
          <Badge
            className={
              severidade === "critica"
                ? "bg-red-500/10 text-red-500 border-red-500/20"
                : severidade === "alta"
                ? "bg-orange-500/10 text-orange-500 border-orange-500/20"
                : severidade === "media"
                ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                : "bg-green-500/10 text-green-500 border-green-500/20"
            }
          >

            {(severidade === "critica" ||
              severidade === "alta" ||
              severidade === "media") && (
              <AlertTriangle className="w-3 h-3 mr-1" />
            )}

            {severidade === "baixa" && (
              <Shield className="w-3 h-3 mr-1" />
            )}

            <span className="capitalize">
              {severidade}
            </span>

          </Badge>
        )
      },
    },

    {
      accessorKey: "valor_detectado",
      header: "Valor",

      cell: ({ row }) => (
        <div className="font-semibold">
          {row.original.valor_detectado ?? "--"}{" "}
          {row.original.unidade ?? ""}
        </div>
      ),
    },

    {
      accessorKey: "data_alerta",
      header: "Data",

      cell: ({ row }) => {

        const data = new Date(row.original.data_alerta)

        return (
          <div className="flex items-center gap-2 text-sm">

            <Calendar className="w-4 h-4 text-muted-foreground" />

            <span>
              {data.toLocaleDateString("pt-BR")}{" "}
              {data.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>

          </div>
        )
      },
    },

    {
      id: "acoes",
      header: "Ações",

      cell: ({ row }) => (

        <Button
          size="icon"
          variant="outline"
          onClick={() => setAlertaSelecionado(row.original)}
        >
          <Eye className="w-4 h-4" />
        </Button>

      ),
    },
  ]

  const table = useReactTable({
    data: alertas || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (loading) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Carregando alertas...
      </div>
    )
  }

  if (erro) {
    return (
      <div className="p-6 text-center text-red-500">
        {erro}
      </div>
    )
  }

  return (
    <>
      <div className="rounded-xl border bg-background mx-4 lg:mx-6 overflow-hidden">

        <Table>

          <TableHeader>

            {table.getHeaderGroups().map((headerGroup) => (

              <TableRow key={headerGroup.id}>

                {headerGroup.headers.map((header) => (

                  <TableHead key={header.id}>

                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}

                  </TableHead>

                ))}

              </TableRow>

            ))}

          </TableHeader>

          <TableBody>

            {table.getRowModel().rows?.length ? (

              table.getRowModel().rows.map((row) => (

                <TableRow key={row.id}>

                  {row.getVisibleCells().map((cell) => (

                    <TableCell key={cell.id}>

                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}

                    </TableCell>

                  ))}

                </TableRow>

              ))

            ) : (

              <TableRow>

                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nenhum alerta encontrado.
                </TableCell>

              </TableRow>

            )}

          </TableBody>

        </Table>

        <div className="flex items-center justify-between p-4 border-t">

          <span className="text-sm text-muted-foreground">
            Página {pagina} de {totalPaginas}
          </span>

          <div className="flex gap-2">

            <Button
              variant="outline"
              onClick={paginaAnterior}
              disabled={pagina === 1}
            >
              Anterior
            </Button>

            <Button
              variant="outline"
              onClick={proximaPagina}
              disabled={pagina === totalPaginas}
            >
              Próxima
            </Button>

          </div>

        </div>

      </div>

      <Dialog
        open={!!alertaSelecionado}
        onOpenChange={() => setAlertaSelecionado(null)}
      >

        <DialogContent className="max-w-2xl">

          <DialogHeader>

            <DialogTitle>
              Detalhes do Alerta
            </DialogTitle>

          </DialogHeader>

         {alertaSelecionado && (

  <div className="space-y-5 py-2">

    <div className="flex items-center justify-between rounded-2xl border bg-muted/30 p-5">

      <div className="space-y-2">

        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">

            <Factory className="w-6 h-6 text-primary" />

          </div>

          <div>

            <h2 className="text-xl font-bold leading-none">
              {alertaSelecionado.maquina}
            </h2>

            <p className="text-sm text-muted-foreground mt-1">
              {alertaSelecionado.maquina_setor}
            </p>

          </div>

        </div>

      </div>

      <Badge
        className={
          alertaSelecionado.severidade === "critica"
            ? "bg-red-500 text-white"
            : alertaSelecionado.severidade === "alta"
            ? "bg-orange-500 text-white"
            : alertaSelecionado.severidade === "media"
            ? "bg-yellow-500 text-black"
            : "bg-green-500 text-white"
        }
      >
        {alertaSelecionado.severidade}
      </Badge>

    </div>

    <div className="grid grid-cols-2 gap-4">

      <div className="rounded-xl border p-4 hover:bg-muted/40 transition">

        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
          Tipo do alerta
        </p>

        <div className="flex items-center gap-2">

          {alertaSelecionado.tipo_alerta === "temperatura" && (
            <Thermometer className="w-5 h-5 text-orange-500" />
          )}

          {alertaSelecionado.tipo_alerta === "vibracao" && (
            <Activity className="w-5 h-5 text-blue-500" />
          )}

          {alertaSelecionado.tipo_alerta === "offline" && (
            <Siren className="w-5 h-5 text-red-500" />
          )}

          {alertaSelecionado.tipo_alerta === "tendencia" && (
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
          )}

          <span className="font-semibold capitalize">
            {alertaSelecionado.tipo_alerta}
          </span>

        </div>

      </div>

      <div className="rounded-xl border p-4 hover:bg-muted/40 transition">

        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
          Data do alerta
        </p>

        <div className="flex items-center gap-2">

          <Calendar className="w-4 h-4 text-muted-foreground" />

          <span className="font-semibold">
            {new Date(alertaSelecionado.data_alerta)
              .toLocaleDateString("pt-BR")}{" "}

            {new Date(alertaSelecionado.data_alerta)
              .toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
          </span>

        </div>

      </div>

      <div className="rounded-xl border p-4 hover:bg-muted/40 transition">

        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
          Valor detectado
        </p>

        <span className="text-2xl font-bold">
          {alertaSelecionado.valor_detectado ?? "--"}{" "}
          {alertaSelecionado.unidade ?? ""}
        </span>

      </div>

      <div className="rounded-xl border p-4 hover:bg-muted/40 transition">

        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
          Limite configurado
        </p>

        <span className="text-2xl font-bold text-muted-foreground">
          {alertaSelecionado.limite_configurado ?? "--"}{" "}
          {alertaSelecionado.unidade ?? ""}
        </span>

      </div>

    </div>

    <div className="rounded-2xl border p-5">

      <p className="text-xs uppercase tracking-wide text-muted-foreground mb-3">
        Mensagem do sistema
      </p>

      <div className="rounded-xl bg-muted/40 p-4 leading-relaxed text-sm">

        {alertaSelecionado.mensagem}

      </div>

    </div>

  </div>

)}

        </DialogContent>

      </Dialog>
    </>
  )
}