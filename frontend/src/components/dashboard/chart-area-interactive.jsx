"use client"

import * as React from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

import { useDashboardData } from "@/hooks/useDashboardData"

const chartConfig = {
  temperatura: {
    label: "Temperatura",
    color: "var(--chart-1)",
  },
  vibracao: {
    label: "Vibração",
    color: "var(--chart-2)",
  },
}

function formatDateLabel(date, timeRange) {
  if (timeRange === "7d") {
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    })
  } else if (timeRange === "1d") {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
}

export function ChartAreaInteractive() {

  const [timeRange, setTimeRange] = React.useState("7d")
  const { chartData = [], maquinas = [], loading } = useDashboardData({ timeRange }) || {}
  const [setorFilter, setSetorFilter] = React.useState("todos")
  const [motorFilter, setMotorFilter] = React.useState("")


  const setores = React.useMemo(() => {
    if (!maquinas) return []
    return [...new Set(maquinas.map((m) => m.setor))].filter(Boolean)
  }, [maquinas])


  const maquinasFiltradas = React.useMemo(() => {
    if (!maquinas) return []
    if (setorFilter === "todos") return maquinas
    return maquinas.filter((m) => m.setor === setorFilter)
  }, [maquinas, setorFilter])

 
  React.useEffect(() => {
    if (maquinasFiltradas && maquinasFiltradas.length > 0) {
      const maquinaExiste = maquinasFiltradas.some((m) => m.nome === motorFilter)
      if (!maquinaExiste) {
        setMotorFilter(maquinasFiltradas[0].nome)
      }
    } else {
      setMotorFilter("")
    }
  }, [maquinasFiltradas, motorFilter])

  

  const filteredData = React.useMemo(() => {
    if (!chartData || !chartData.length) return []

    const maxTimestamp = Math.max(...chartData.map(item => new Date(item.date).getTime()))
    const latestDate = new Date(maxTimestamp)
    let start = new Date(latestDate)

    if (timeRange === "1h") {
      start = new Date(latestDate.getTime() - 60 * 60 * 1000)
    } else if (timeRange === "1d") {
      start.setHours(0, 0, 0, 0)
    } else if (timeRange === "7d") {
      start.setDate(start.getDate() - 6)
      start.setHours(0, 0, 0, 0)
    }

    const grouped = new Map()

    for (let i = 0; i < chartData.length; i++) {
      const item = chartData[i]
      const itemDate = new Date(item.date)

      if (itemDate < start) continue
      if (motorFilter && item.maquina !== motorFilter) continue

      const key = item.date
      const existing = grouped.get(key)

      if (!existing) {
        grouped.set(key, {
          date: key,
          temperatura: null,
          temperaturaMin: null,
          temperaturaMax: null,
          vibracao: null,
          vibracaoMin: null,
          vibracaoMax: null,
        })
      }

      if (item.tipo_sensor === "temperatura") {
        grouped.get(key).temperatura = item.valor
        grouped.get(key).temperaturaMin = item.valor_min
        grouped.get(key).temperaturaMax = item.valor_max
      } else if (item.tipo_sensor === "acelerometro") {
        grouped.get(key).vibracao = item.valor
        grouped.get(key).vibracaoMin = item.valor_min
        grouped.get(key).vibracaoMax = item.valor_max
      }
    }

    if (grouped.size === 0) return []

    return Array.from(grouped.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [chartData, timeRange, motorFilter])


  if (loading && (!chartData || !chartData.length)) {
    return (
      <Card>
        <CardContent className="h-[450px] flex items-center justify-center text-muted-foreground">
          Carregando dashboard...
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="@container/card overflow-hidden">
      <CardHeader className="border-b">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle className="text-xl">Monitoramento das Máquinas</CardTitle>
            <CardDescription className="mt-1">
              Temperatura e vibração em tempo real
            </CardDescription>
          </div>

          <CardAction className="flex flex-wrap gap-2">
            <ToggleGroup
              type="single"
              value={timeRange}
              onValueChange={(value) => {
                if (value) setTimeRange(value)
              }}
              variant="outline"
            >
              <ToggleGroupItem value="1h">Última 1h</ToggleGroupItem>
              <ToggleGroupItem value="1d">Último dia</ToggleGroupItem>
              <ToggleGroupItem value="7d">Últimos 7 dias</ToggleGroupItem>
            </ToggleGroup>

            <Select value={setorFilter} onValueChange={setSetorFilter}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Setor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos setores</SelectItem>
                {setores.map((setor) => (
                  <SelectItem key={setor} value={setor}>
                    {setor.replaceAll("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={motorFilter} onValueChange={setMotorFilter}>
              <SelectTrigger className="w-52">
                <SelectValue placeholder="Máquina" />
              </SelectTrigger>
              <SelectContent>
                {maquinasFiltradas.length === 0 ? (
                  <SelectItem value="none" disabled>
                    Nenhuma máquina neste setor
                  </SelectItem>
                ) : (
                  maquinasFiltradas.map((maquina) => (
                    <SelectItem key={maquina.id || maquina.nome} value={maquina.nome}>
                      {maquina.nome}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </CardAction>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
      
        {!filteredData || filteredData.length === 0 ? (
          <div className="h-[380px] flex items-center justify-center text-center text-muted-foreground border border-dashed rounded-xl">
            Nenhum dado encontrado para esta máquina neste período.
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height={380}>
              <AreaChart
                data={filteredData}
                margin={{ left: 10, right: 10, top: 10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="fillTemperatura" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="fillVibracao" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="4 4" opacity={0.2} />
                <YAxis tickLine={false} axisLine={false} width={40} tick={{ fontSize: 12 }} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  minTickGap={24}
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                  tickFormatter={(value) => {
                    if (!value) return ""
                    const date = new Date(value.replace("Z", ""))
                    return formatDateLabel(date, timeRange)
                  }}
                />
                <ChartTooltip
                  cursor={{
                    stroke: "hsl(var(--border))",
                    strokeWidth: 1,
                    strokeDasharray: "3 3",
                  }}
                  content={({ active, payload, label }) => {
                    if (!active || !payload || !payload.length || !label) return null
                    const date = new Date(label.replace("Z", ""))
                    return (
                      <div className="min-w-[220px] rounded-xl border bg-background/95 backdrop-blur px-4 py-3 shadow-2xl">
                        <div className="mb-3 border-b pb-2">
                          <p className="text-sm font-semibold">
                            {date.toLocaleDateString("pt-BR", {
                              weekday: "short",
                              day: "2-digit",
                              month: "long",
                            })}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {date.toLocaleTimeString("pt-BR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <div className="space-y-2">
                          {payload.map((entry) => (
                            <div
                              key={entry.dataKey}
                              className="flex items-center justify-between gap-6"
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className="h-2.5 w-2.5 rounded-full"
                                  style={{ backgroundColor: entry.color }}
                                />
                                <span className="text-sm text-muted-foreground">
                                  {chartConfig[entry.dataKey]?.label}
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="font-semibold tabular-nums">
                                  {Number(entry.value).toFixed(1)}
                                </span>
                                {(() => {
                                  const payloadItem = entry.payload || {}
                                  const minKey = entry.dataKey === "temperatura"
                                    ? "temperaturaMin"
                                    : "vibracaoMin"
                                  const maxKey = entry.dataKey === "temperatura"
                                    ? "temperaturaMax"
                                    : "vibracaoMax"
                                  const minValue = payloadItem[minKey]
                                  const maxValue = payloadItem[maxKey]
                                  if (!Number.isFinite(minValue) || !Number.isFinite(maxValue)) {
                                    return null
                                  }
                                  return (
                                    <div className="text-xs text-muted-foreground tabular-nums">
                                      min/max: {minValue.toFixed(1)} / {maxValue.toFixed(1)}
                                    </div>
                                  )
                                })()}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  }}
                />
                <Area
                  dataKey="temperatura"
                  type="monotone"
                  fill="url(#fillTemperatura)"
                  stroke="var(--chart-1)"
                  strokeWidth={2.5}
                  connectNulls
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
                <Area
                  dataKey="vibracao"
                  type="monotone"
                  fill="url(#fillVibracao)"
                  stroke="var(--chart-2)"
                  strokeWidth={2.5}
                  connectNulls
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}