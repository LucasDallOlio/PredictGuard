"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

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
  ChartTooltipContent,
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

export const description = "An interactive area chart"

const chartData = [
  { date: "2026-05-25T10:00:00", desktop: 222, mobile: 150, motor: "Motor A" },
  { date: "2026-05-25T11:00:00", desktop: 97, mobile: 180, motor: "Motor B" },
  { date: "2026-05-25T12:00:00", desktop: 167, mobile: 120, motor: "Motor A" },
  { date: "2026-05-25T13:00:00", desktop: 242, mobile: 260, motor: "Motor B" },
  { date: "2026-05-25T14:00:00", desktop: 373, mobile: 290, motor: "Motor A" },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--primary)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--primary)",
  },
}

export function ChartAreaInteractive() {
  const [timeRange, setTimeRange] = React.useState("24h")
  const [motorFilter, setMotorFilter] = React.useState("all")

  const parseDate = (dateString) => {
    return new Date(dateString)
  }

  const filteredData = React.useMemo(() => {
    const referenceDate = new Date()

    let hoursToSubtract = 24

    if (timeRange === "12h") hoursToSubtract = 12
    if (timeRange === "6h") hoursToSubtract = 6
    if (timeRange === "1h") hoursToSubtract = 1

    const startDate = new Date(referenceDate)

    startDate.setHours(
      startDate.getHours() - hoursToSubtract
    )

    return chartData.filter((item) => {
      const date = parseDate(item.date)

      const matchMotor =
        motorFilter === "all" ||
        item.motor === motorFilter

      return date >= startDate && matchMotor
    })
  }, [timeRange, motorFilter])

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Motores</CardTitle>

        <CardDescription>
          Últimas horas
        </CardDescription>

        <CardAction className="flex gap-2">
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={(value) => {
              if (value) setTimeRange(value)
            }}
            variant="outline"
            className="hidden @[767px]/card:flex"
          >
            <ToggleGroupItem value="24h">
              Últimas 24h
            </ToggleGroupItem>

            <ToggleGroupItem value="12h">
              Últimas 12h
            </ToggleGroupItem>

            <ToggleGroupItem value="6h">
              Últimas 6h
            </ToggleGroupItem>

            <ToggleGroupItem value="1h">
              Última hora
            </ToggleGroupItem>
          </ToggleGroup>

          <Select
            value={motorFilter}
            onValueChange={setMotorFilter}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Motor" />
            </SelectTrigger>

            <SelectContent className="rounded-xl">
              <SelectItem value="all">
                Todos os motores
              </SelectItem>

              <SelectItem value="Motor A">
                Motor A
              </SelectItem>

              <SelectItem value="Motor B">
                Motor B
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient
                id="fillDesktop"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={1}
                />

                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>

              <linearGradient
                id="fillMobile"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />

                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = parseDate(value)

                return date.toLocaleTimeString(
                  "pt-BR",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )
              }}
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  labelFormatter={(value) => {
                    return parseDate(
                      value
                    ).toLocaleString(
                      "pt-BR",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )
                  }}
                />
              }
            />

            <Area
              dataKey="mobile"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-mobile)"
              stackId="a"
            />

            <Area
              dataKey="desktop"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--color-desktop)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}