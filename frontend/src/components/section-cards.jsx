import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 
    *:data-[slot=card]:bg-gradient-to-t 
    *:data-[slot=card]:from-primary/5 
    *:data-[slot=card]:to-card 
    *:data-[slot=card]:shadow-xs 
    lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 
    dark:*:data-[slot=card]:bg-card">

      {/* MOTORES ATIVOS */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Motores Ativos</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            120
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +8%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">
            Em funcionamento <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Total de motores ativos no sistema
          </div>
        </CardFooter>
      </Card>

      {/* SOLICITAÇÕES */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total de Solicitações</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            342
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +15%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">
            Aumento de chamados <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Solicitações registradas recentemente
          </div>
        </CardFooter>
      </Card>

      {/* TÉCNICOS */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total de Técnicos</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            25
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +2
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">
            Equipe disponível <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Técnicos cadastrados no sistema
          </div>
        </CardFooter>
      </Card>

      {/* MOTORES INATIVOS */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Motores Inativos</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            18
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingDown />
              -5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">
            Necessitam manutenção <IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Motores fora de operação
          </div>
        </CardFooter>
      </Card>

    </div>
  );
}