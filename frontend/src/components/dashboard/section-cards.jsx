"use client"

import {
  IconActivity,
  IconAlertTriangle,
  IconSettings,
  IconTrendingDown,
  IconTrendingUp,
  IconUsers,
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"

import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { useDashboardData } from "@/hooks/useDashboardData"

export function SectionCards() {

  const {
    maquinasResumo,
    usuariosResumo,
    loading,
  } = useDashboardData()

  if (loading) {

    return (

      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">

        {[1, 2, 3, 4].map((item) => (

          <Card
            key={item}
            className="h-[180px] animate-pulse"
          >

            <CardHeader>

              <div className="h-4 w-32 rounded bg-muted" />

              <div className="h-8 w-20 rounded bg-muted mt-2" />

            </CardHeader>

          </Card>

        ))}

      </div>

    )
  }

  return (

    <div
      className="
      grid grid-cols-1 gap-4 px-4
      *:data-[slot=card]:bg-gradient-to-t
      *:data-[slot=card]:from-primary/5
      *:data-[slot=card]:to-card
      *:data-[slot=card]:shadow-xs
      lg:px-6
      @xl/main:grid-cols-2
      @5xl/main:grid-cols-4
      dark:*:data-[slot=card]:bg-card
    "
    >

      {/* MÁQUINAS ATIVAS */}

      <Card className="@container/card">

        <CardHeader>

          <CardDescription>
            Máquinas Ativas
          </CardDescription>

          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">

            {maquinasResumo.ativos}

          </CardTitle>

          <CardAction>

            <Badge
              variant="outline"
              className="text-emerald-500"
            >

              <IconTrendingUp className="size-4" />
              Online

            </Badge>

          </CardAction>

        </CardHeader>

        <CardFooter className="flex-col items-start gap-1.5 text-sm">

          <div className="flex gap-2 font-medium">

            Em funcionamento
            <IconActivity className="size-4 text-emerald-500" />

          </div>

          <div className="text-muted-foreground">

            Máquinas operando normalmente

          </div>

        </CardFooter>

      </Card>

   

      <Card className="@container/card">

        <CardHeader>

          <CardDescription>
            Máquinas Paradas
          </CardDescription>

          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">

            {maquinasResumo.inativos}

          </CardTitle>

          <CardAction>

            <Badge
              variant="outline"
              className="text-red-500"
            >

              <IconTrendingDown className="size-4" />
              Offline

            </Badge>

          </CardAction>

        </CardHeader>

        <CardFooter className="flex-col items-start gap-1.5 text-sm">

          <div className="flex gap-2 font-medium">

            Necessitam atenção
            <IconAlertTriangle className="size-4 text-red-500" />

          </div>

          <div className="text-muted-foreground">

            Máquinas fora de operação

          </div>

        </CardFooter>

      </Card>

     

      <Card className="@container/card">

        <CardHeader>

          <CardDescription>
            Em Manutenção
          </CardDescription>

          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">

            {maquinasResumo.manutencao}

          </CardTitle>

          <CardAction>

            <Badge
              variant="outline"
              className="text-yellow-500"
            >

              <IconSettings className="size-4" />
              Manutenção

            </Badge>

          </CardAction>

        </CardHeader>

        <CardFooter className="flex-col items-start gap-1.5 text-sm">

          <div className="flex gap-2 font-medium">

            Máquinas em análise
            <IconSettings className="size-4 text-yellow-500" />

          </div>

          <div className="text-muted-foreground">

            Equipamentos passando por manutenção

          </div>

        </CardFooter>

      </Card>

     

      <Card className="@container/card">

        <CardHeader>

          <CardDescription>
            Técnicos
          </CardDescription>

          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">

            {usuariosResumo.tecnicos}

          </CardTitle>

          <CardAction>

            <Badge
              variant="outline"
              className="text-blue-500"
            >

              <IconUsers className="size-4" />
              Equipe

            </Badge>

          </CardAction>

        </CardHeader>

        <CardFooter className="flex-col items-start gap-1.5 text-sm">

          <div className="flex gap-2 font-medium">

            Técnicos disponíveis
            <IconUsers className="size-4 text-blue-500" />

          </div>

          <div className="text-muted-foreground">

            Equipe responsável pelas manutenções

          </div>

        </CardFooter>

      </Card>

    </div>
  )
}