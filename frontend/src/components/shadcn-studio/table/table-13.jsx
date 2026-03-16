"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2 } from "lucide-react"

const initialUsers = [
  {
    id: "1",
    name: "Philip George",
    src: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png",
    fallback: "PG",
    email: "philipgeorge20@gmail.com",
    location: "Mumbai, India",
    status: "Ativo",
  },
  {
    id: "2",
    name: "Tiana Curtis",
    src: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-2.png",
    fallback: "TC",
    email: "tiana12@yahoo.com",
    location: "New York, US",
    status: "Inativo",
  },
  {
    id: "3",
    name: "Jaylon Donin",
    src: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-3.png",
    fallback: "JD",
    email: "jaylon23d.@outlook.com",
    location: "Washington, US",
    status: "Ativo",
  },
]

export default function UsersTable() {
  const [users, setUsers] = useState(initialUsers)

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

  return (
    <div className="w-full max-w-7xl mx-auto py-10 space-y-6">

      {/* Título */}
      <div>
        <h1 className="text-2xl font-bold">Técnicos</h1>
        <p className="text-muted-foreground">
          Gerencie os técnicos do sistema
        </p>
      </div>

      {/* Tabela */}
      <div className="border rounded-xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuário</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Localização</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>

                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.src} />
                      <AvatarFallback>{user.fallback}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user.name}</span>
                  </div>
                </TableCell>

                <TableCell>{user.email}</TableCell>

                <TableCell>{user.location}</TableCell>

                <TableCell>
                  <Badge variant={user.status === "Ativo" ? "default" : "secondary"}>
                    {user.status}
                  </Badge>
                </TableCell>

                <TableCell className="text-right space-x-2">

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleStatus(user.id)}
                  >
                    {user.status === "Ativo" ? "Desativar" : "Ativar"}
                  </Button>

                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => deleteUser(user.id)}
                  >
                    <Trash2 size={16} />
                  </Button>

                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

    </div>
  )
}