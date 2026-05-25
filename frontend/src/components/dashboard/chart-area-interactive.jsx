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

    return date.toLocaleDateString(
      "pt-BR",
      {
        day: "2-digit",
        month: "2-digit",
      }
    )
  }

  return date.toLocaleTimeString(
    "pt-BR",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  )
}

export function ChartAreaInteractive() {

  const {
    chartData,
    maquinas,
    loading
  } = useDashboardData()

  const [timeRange, setTimeRange] =
    React.useState("7d")

  const [setorFilter, setSetorFilter] =
    React.useState("todos")

  const [motorFilter, setMotorFilter] =
    React.useState("")

  const setores = React.useMemo(() => {

    return [
      ...new Set(
        maquinas.map((m) => m.setor)
      )
    ]

  }, [maquinas])

  const maquinasFiltradas =
    React.useMemo(() => {

      if (setorFilter === "todos") {
        return maquinas
      }

      return maquinas.filter(
        (m) => m.setor === setorFilter
      )

    }, [maquinas, setorFilter])

  React.useEffect(() => {

    const maquinaExiste =
      maquinasFiltradas.some(
        (m) => m.nome === motorFilter
      )

    if (
      !maquinaExiste &&
      maquinasFiltradas.length > 0
    ) {
      setMotorFilter(
        maquinasFiltradas[0].nome
      )
    }

  }, [
    maquinasFiltradas,
    motorFilter
  ])

  const filteredData =
    React.useMemo(() => {

      if (!chartData.length) {
        return []
      }

      const latestDate =
        new Date(
          Math.max(
            ...chartData.map((item) =>
              new Date(item.date).getTime()
            )
          )
        )

      let start =
        new Date(latestDate)

      if (timeRange === "1h") {

        start = new Date(
          latestDate.getTime() -
          60 * 60 * 1000
        )
      }

      if (timeRange === "1d") {

        start = new Date(
          latestDate
        )

        start.setHours(0)
        start.setMinutes(0)
        start.setSeconds(0)
        start.setMilliseconds(0)
      }

      if (timeRange === "7d") {

        start = new Date(
          latestDate
        )

        start.setDate(
          start.getDate() - 6
        )

        start.setHours(0)
        start.setMinutes(0)
        start.setSeconds(0)
        start.setMilliseconds(0)
      }

      const dadosFiltrados =
        chartData.filter((item) => {

          const itemDate =
            new Date(item.date)

          return (
            itemDate >= start &&
            (
              !motorFilter ||
              item.maquina === motorFilter
            )
          )
        })

      if (!dadosFiltrados.length) {
        return []
      }

      const grouped =
        new Map()

      dadosFiltrados.forEach((item) => {

        const itemDate =
          new Date(item.date)

        if (timeRange === "1h") {

          itemDate.setSeconds(0)
          itemDate.setMilliseconds(0)

          itemDate.setMinutes(
            Math.floor(
              itemDate.getMinutes() / 5
            ) * 5
          )
        }

        if (timeRange === "1d") {

          itemDate.setMinutes(0)
          itemDate.setSeconds(0)
          itemDate.setMilliseconds(0)
        }

        if (timeRange === "7d") {

          itemDate.setHours(0)
          itemDate.setMinutes(0)
          itemDate.setSeconds(0)
          itemDate.setMilliseconds(0)
        }

        const key =
          itemDate
            .toLocaleString("sv-SE")
            .replace(" ", "T")

        const existing =
          grouped.get(key)

        if (!existing) {

          grouped.set(key, {

            date: key,

            temperatura:
              item.temperatura ?? 0,

            vibracao:
              item.vibracao ?? 0,

            count: 1,

          })

        } else {

          grouped.set(key, {

            ...existing,

            temperatura:
              existing.temperatura +
              (item.temperatura ?? 0),

            vibracao:
              existing.vibracao +
              (item.vibracao ?? 0),

            count:
              existing.count + 1,

          })
        }

      })

      return Array
        .from(grouped.values())
        .map((item) => ({

          ...item,

          temperatura:
            item.temperatura /
            item.count,

          vibracao:
            item.vibracao /
            item.count,

        }))
        .sort(
          (a, b) =>
            new Date(a.date).getTime() -
            new Date(b.date).getTime()
        )

    }, [
      chartData,
      timeRange,
      motorFilter
    ])

  if (loading) {

    return (
      <Card>
        <CardContent className="h-[350px] flex items-center justify-center text-muted-foreground">
          Carregando gráfico...
        </CardContent>
      </Card>
    )
  }

  if (!filteredData.length) {

    return (
      <Card>
        <CardContent className="h-[350px] flex items-center justify-center text-center text-muted-foreground">
          Nenhum dado encontrado para esta máquina neste período.
        </CardContent>
      </Card>
    )
  }

  return (

    <Card className="@container/card overflow-hidden">

      <CardHeader className="border-b">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <CardTitle className="text-xl">
              Monitoramento das Máquinas
            </CardTitle>

            <CardDescription className="mt-1">
              Temperatura e vibração em tempo real
            </CardDescription>

          </div>

          <CardAction className="flex flex-wrap gap-2">

            <ToggleGroup
              type="single"
              value={timeRange}
              onValueChange={(value) => {

                if (value) {
                  setTimeRange(value)
                }
              }}
              variant="outline"
            >

              <ToggleGroupItem value="1h">
                Última 1h
              </ToggleGroupItem>

              <ToggleGroupItem value="1d">
                Último dia
              </ToggleGroupItem>

              <ToggleGroupItem value="7d">
                Últimos 7 dias
              </ToggleGroupItem>

            </ToggleGroup>

            <Select
              value={setorFilter}
              onValueChange={setSetorFilter}
            >

              <SelectTrigger className="w-44">
                <SelectValue placeholder="Setor" />
              </SelectTrigger>

              <SelectContent>

                <SelectItem value="todos">
                  Todos setores
                </SelectItem>

                {setores.map((setor) => (

                  <SelectItem
                    key={setor}
                    value={setor}
                  >
                    {setor
                      .replaceAll("_", " ")
                      .replace(
                        /\b\w/g,
                        (l) => l.toUpperCase()
                      )}
                  </SelectItem>

                ))}

              </SelectContent>

            </Select>

            <Select
              value={motorFilter}
              onValueChange={setMotorFilter}
            >

              <SelectTrigger className="w-52">
                <SelectValue placeholder="Máquina" />
              </SelectTrigger>

              <SelectContent>

                {maquinasFiltradas.map((maquina) => (

                  <SelectItem
                    key={maquina.id}
                    value={maquina.nome}
                  >
                    {maquina.nome}
                  </SelectItem>

                ))}

              </SelectContent>

            </Select>

          </CardAction>

        </div>

      </CardHeader>

      <CardContent className="pt-6">

        <ChartContainer
          config={chartConfig}
          className="h-[380px] w-full"
        >

          <ResponsiveContainer
            width="100%"
            height={380}
          >

            <AreaChart
              data={filteredData}
              margin={{
                left: 10,
                right: 10,
                top: 10,
                bottom: 0,
              }}
            >

              <defs>

                <linearGradient
                  id="fillTemperatura"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >

                  <stop
                    offset="5%"
                    stopColor="var(--chart-1)"
                    stopOpacity={0.35}
                  />

                  <stop
                    offset="95%"
                    stopColor="var(--chart-1)"
                    stopOpacity={0.02}
                  />

                </linearGradient>

                <linearGradient
                  id="fillVibracao"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >

                  <stop
                    offset="5%"
                    stopColor="var(--chart-2)"
                    stopOpacity={0.35}
                  />

                  <stop
                    offset="95%"
                    stopColor="var(--chart-2)"
                    stopOpacity={0.02}
                  />

                </linearGradient>

              </defs>

              <CartesianGrid
                vertical={false}
                strokeDasharray="4 4"
                opacity={0.2}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                width={40}
                tick={{ fontSize: 12 }}
              />

              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                minTickGap={24}
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"

                tickFormatter={(value) => {

                  const date =
                    new Date(
                      value.replace("Z", "")
                    )

                  return formatDateLabel(
                    date,
                    timeRange
                  )
                }}
              />

              <ChartTooltip

                cursor={{
                  stroke:
                    "hsl(var(--border))",
                  strokeWidth: 1,
                  strokeDasharray: "3 3",
                }}

                content={({
                  active,
                  payload,
                  label
                }) => {

                  if (
                    !active ||
                    !payload ||
                    !payload.length
                  ) {
                    return null
                  }

                  const date =
                    new Date(
                      label.replace("Z", "")
                    )

                  return (

                    <div className="min-w-[220px] rounded-xl border bg-background/95 backdrop-blur px-4 py-3 shadow-2xl">

                      <div className="mb-3 border-b pb-2">

                        <p className="text-sm font-semibold">

                          {date.toLocaleDateString(
                            "pt-BR",
                            {
                              weekday: "short",
                              day: "2-digit",
                              month: "long",
                            }
                          )}

                        </p>

                        <p className="text-xs text-muted-foreground">

                          {date.toLocaleTimeString(
                            "pt-BR",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}

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
                                style={{
                                  backgroundColor:
                                    entry.color,
                                }}
                              />

                              <span className="text-sm text-muted-foreground">

                                {
                                  chartConfig[
                                    entry.dataKey
                                  ]?.label
                                }

                              </span>

                            </div>

                            <span className="font-semibold tabular-nums">

                              {Number(
                                entry.value
                              ).toFixed(1)}

                            </span>

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
                activeDot={{
                  r: 5,
                  strokeWidth: 0,
                }}
              />

              <Area
                dataKey="vibracao"
                type="monotone"
                fill="url(#fillVibracao)"
                stroke="var(--chart-2)"
                strokeWidth={2.5}
                connectNulls
                dot={false}
                activeDot={{
                  r: 5,
                  strokeWidth: 0,
                }}
              />

            </AreaChart>

          </ResponsiveContainer>

        </ChartContainer>

      </CardContent>

    </Card>
  )
}