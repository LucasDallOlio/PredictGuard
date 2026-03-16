"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, UserPlus, Users } from "lucide-react" 
import ModalAdicionarTecnico from "@/components/modal-tecnico" 

const initialUsers = [
  {
    id: "1",
    name: "Philip George",
    src: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png",
    fallback: "PG",
    email: "philipgeorge20@gmail.com",
    area: "Manutenção",
    status: "Ativo",
  },
  {
    id: "2",
    name: "Tiana Curtis",
    src: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-2.png",
    fallback: "TC",
    email: "tiana12@yahoo.com",
    area: "Suporte",
    status: "Inativo",
  },
  {
    id: "3",
    name: "Jaylon Donin",
    src: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-3.png",
    fallback: "JD",
    email: "jaylon23d.@outlook.com",
    area: "Operações",
    status: "Ativo",
  },
]

export default function UsersTable() {
  const [users, setUsers] = useState(initialUsers)
  const [modalOpen, setModalOpen] = useState(false)

  function deleteUser(id) {
    setUsers(users.filter(user => user.id !== id))
  }

  function toggleStatus(id) {
    setUsers(
      users.map(user =>
        user.id === id
          ? { ...user, status: user.status === "Ativo" ? "Inativo" : "Ativo" }
          : user
      )
    )
  }

  function addUser(novoTecnico) {
    setUsers([...users, novoTecnico])
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-10 px-4 md:px-6 space-y-8">
      
      <ModalAdicionarTecnico
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAddTecnico={addUser}
      />

     
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-6 h-6 text-blue-500" />
            <h1 className="text-3xl font-extrabold tracking-tight ">Gestão de Tecnicos</h1>
          </div>
          <p className="text-zinc-400">Visualize e gerencie as permissões dos técnicos do sistema</p>
        </div>

        <Button
          onClick={() => setModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 h-11 px-6 transition-all"
        >
          <UserPlus size={18} />
          <span>Adicionar Técnico</span>
        </Button>
      </div>

      <div className="rounded-xl border border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto"> 
          <Table>
            <TableHeader className="bg-blue">
              <TableRow className="hover:bg-transparent border-zinc-800">
                <TableHead className="text-zinc-300 font-semibold py-4">Usuário</TableHead>
                <TableHead className="text-zinc-300 font-semibold">Email</TableHead>
                <TableHead className="text-zinc-300 font-semibold">Área</TableHead>
                <TableHead className="text-zinc-300 font-semibold">Status</TableHead>
                <TableHead className="text-zinc-300 font-semibold text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {users.map(user => (
                <TableRow key={user.id} className="border-zinc-800 hover:bg-zinc-800/30 transition-colors">
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-zinc-700">
                        <AvatarImage src={user.src} />
                        <AvatarFallback>{user.fallback}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-zinc-100 whitespace-nowrap">{user.name}</span>
                    </div>
                  </TableCell>

                  <TableCell className="text-zinc-400 whitespace-nowrap">{user.email}</TableCell>
                  <TableCell className="text-zinc-400">{user.area}</TableCell>

                  <TableCell>
                    <Badge 
                      variant={user.status === "Ativo" ? "default" : "secondary"}
                      className={user.status === "Ativo" ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20" : "bg-zinc-700 text-zinc-300"}
                    >
                      {user.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleStatus(user.id)}
                        className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                      >
                        {user.status === "Ativo" ? "Desativar" : "Ativar"}
                      </Button>

                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => deleteUser(user.id)}
                        className="h-8 w-8"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}