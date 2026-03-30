"use client"

import * as React from "react"
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
} from "@dnd-kit/core"
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import {
  Drawer, DrawerContent, DrawerHeader, DrawerTitle,
  DrawerTrigger, DrawerFooter, DrawerClose
} from "@/components/ui/drawer"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem
} from "@/components/ui/select"

import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem
} from "@/components/ui/dropdown-menu"

import {
  IconGripVertical,
  IconDotsVertical,
  IconPlus
} from "@tabler/icons-react"



function DragHandle({ id }) {
  const { attributes, listeners } = useSortable({ id })

  return (
    <Button {...attributes} {...listeners} variant="ghost" size="icon">
      <IconGripVertical />
    </Button>
  )
}



function getSensorColor(value) {
  if (value === 0) return "text-green-500"
  if (value <= 3) return "text-yellow-500"
  return "text-red-500"
}


const columns = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },

  {
    accessorKey: "nome",
    header: "Motor",
    cell: ({ row }) => <TableCellViewer item={row.original} />,
  },

  {
    accessorKey: "setor",
    header: "Setor",
    cell: ({ row }) => (
      <Badge>{row.original.setor}</Badge>
    ),
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant="outline">
        {row.original.status === "Ativo" ? "🟢 Ativo" : "🔴 Inativo"}
      </Badge>
    ),
  },

  {
    accessorKey: "sensores",
    header: "Sensor",
    cell: ({ row }) => (
      <div className={`font-bold ${getSensorColor(row.original.sensores)}`}>
        🚨 {row.original.sensores}
      </div>
    ),
  },

  {
    accessorKey: "Solicitação",
    header: "Solicitação Aberta",
    cell: ({ row }) => (
      <Badge variant={row.original.emChamada}>
        {row.original.emChamada ? " Sim" : " Não"}
      </Badge>
    ),
  },

  {
    id: "actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            <IconDotsVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Editar</DropdownMenuItem>
          <DropdownMenuItem>Excluir</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]


function DraggableRow({ row }) {
  const { setNodeRef, transform, transition } = useSortable({
    id: row.original.id,
  })

  return (
    <TableRow
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={row.original.sensores > 3 ? "bg-red-50" : ""}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}



export function DataTable() {
  const [data, setData] = React.useState([
    {
      id: 1,
      nome: "Motor A1",
      setor: "Linha 1",
      status: "Ativo",
      sensores: 2,
      emChamada: false,
    },
    {
      id: 2,
      nome: "Motor B2",
      setor: "Linha 2",
      status: "Ativo",
      sensores: 5,
      emChamada: true,
    },
    {
      id: 3,
      nome: "Motor C3",
      setor: "Linha 3",
      status: "Inativo",
      sensores: 0,
      emChamada: false,
    },
  ])

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  )

  const table = useReactTable({
    data,
    columns,
    getRowId: (row) => row.id.toString(),
    getCoreRowModel: getCoreRowModel(),
  })

  function handleDragEnd(event) {
    const { active, over } = event
    if (active.id !== over.id) {
      setData((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id)
        const newIndex = items.findIndex(i => i.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  return (
    <div className="p-4 space-y-4">

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            <SortableContext
              items={data.map(d => d.id)}
              strategy={verticalListSortingStrategy}
            >
              {table.getRowModel().rows.map((row) => (
                <DraggableRow key={row.id} row={row} />
              ))}
            </SortableContext>
          </TableBody>
        </Table>
      </DndContext>
    </div>
  )
}



function TableCellViewer({ item }) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="link">{item.nome}</Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{item.nome}</DrawerTitle>
        </DrawerHeader>

        <div className="p-4 space-y-4">

          <div>
            <Label>Nome</Label>
            <Input defaultValue={item.nome} />
          </div>

          <div>
            <Label>Setor</Label>
            <Input defaultValue={item.setor} />
          </div>

          <div>
            <Label>Status</Label>
            <Select defaultValue={item.status}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ativo">Ativo</SelectItem>
                <SelectItem value="Inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Sensor (alertas)</Label>
            <Input type="number" defaultValue={item.sensores} />
          </div>

          <div>
            <Label>Solicitação</Label>
            <Select defaultValue={item.emChamada ? "sim" : "nao"}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sim">Ativa</SelectItem>
                <SelectItem value="nao">Inativa</SelectItem>
              </SelectContent>
            </Select>
          </div>

        </div>

        <DrawerFooter>
          <Button>Salvar</Button>
          <DrawerClose asChild>
            <Button variant="outline">Fechar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}