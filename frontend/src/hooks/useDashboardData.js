"use client"

import {
  useEffect,
  useState
} from "react"

const API_URL =
  "http://localhost:3001"

export function useDashboardData({ timeRange = "7d" } = {}) {

  const [loading, setLoading] =
    useState(true)

  const [maquinasResumo,
    setMaquinasResumo] =
    useState({

      ativos: 0,
      inativos: 0,
      manutencao: 0,
      total: 0,
      saudaveis: 0,
      alerta: 0,

    })

  const [usuariosResumo,
    setUsuariosResumo] =
    useState({

      administradores: 0,
      tecnicos: 0,
      total: 0,

    })

  const [chartData,
    setChartData] =
    useState([])

  const [maquinas,
    setMaquinas] =
    useState([])

  useEffect(() => {

    async function fetchDashboard() {

      try {

        const rangeParams = new URLSearchParams()

        if (timeRange === "1h") {
          rangeParams.set("periodo_horas", "1")
          rangeParams.set("limite", "2000")
        } else if (timeRange === "1d") {
          rangeParams.set("periodo_dias", "1")
          rangeParams.set("bucket_minutos", "1")
          rangeParams.set("agregacao", "media-min-max")
          rangeParams.set("limite", "5000")
        } else {
          rangeParams.set("periodo_dias", "7")
          rangeParams.set("bucket_minutos", "5")
          rangeParams.set("agregacao", "media-min-max")
          rangeParams.set("limite", "5000")
        }

        const [

          maquinasResponse,
          usuariosResponse,
          leiturasResponse,
          maquinasListaResponse,

        ] = await Promise.all([

          fetch(
            `${API_URL}/maquinas/resumo-status`,
            { credentials: "include" }
          ),

          fetch(
            `${API_URL}/usuarios/resumo-tipos`,
            { credentials: "include" }
          ),

          fetch(
            `${API_URL}/leituras/serie?${rangeParams.toString()}`,
            { credentials: "include" }
          ),

          fetch(
            `${API_URL}/maquinas`,
            { credentials: "include" }
          ),

        ])

        const maquinasData =
          await maquinasResponse.json()

        const usuariosData =
          await usuariosResponse.json()

        const leiturasData =
          await leiturasResponse.json()

        const maquinasListaData =
          await maquinasListaResponse.json()

        setMaquinasResumo({

          ativos:
            maquinasData?.dados
              ?.statusOperacional
              ?.ativa || 0,

          inativos:
            maquinasData?.dados
              ?.statusOperacional
              ?.parada || 0,

          manutencao:
            maquinasData?.dados
              ?.statusOperacional
              ?.manutencao || 0,

          total:
            maquinasData?.dados
              ?.totalMaquinas || 0,

          saudaveis:
            maquinasData?.dados
              ?.statusSaude
              ?.ok || 0,

          alerta:
            maquinasData?.dados
              ?.statusSaude
              ?.alerta || 0,

        })

        setUsuariosResumo({

          administradores:
            usuariosData?.dados
              ?.totalAdmins || 0,

          tecnicos:
            usuariosData?.dados
              ?.totalTecnicos || 0,

          total:
            usuariosData?.dados
              ?.totalUsuarios || 0,

        })

        const listaMaquinas =
          maquinasListaData?.dados || []

        setMaquinas(listaMaquinas)

        const leituras =
          leiturasData?.dados
            ?.leituras || []

        console.log(
          "LEITURAS:",
          leituras
        )

        const mapaMaquinas = {}

        listaMaquinas.forEach((maq) => {

          mapaMaquinas[maq.id] = {

            nome: maq.nome,
            setor: maq.setor,

          }

        })

        const formatado =
          leituras.map((item) => ({
            
            date: item.data_leitura,
            maquinaId: item.maquina_id,
            maquina: mapaMaquinas[item.maquina_id]?.nome || "Máquina",
            setor: mapaMaquinas[item.maquina_id]?.setor || "",
            tipo_sensor: item.tipo_sensor,
            valor: Number(item.valor),
            valor_min: Number.isFinite(Number(item.valor_min)) ? Number(item.valor_min) : null,
            valor_max: Number.isFinite(Number(item.valor_max)) ? Number(item.valor_max) : null,
            unidade: item.unidade,
            
          }))
            .sort(
              (a, b) =>
                new Date(a.date) -
                new Date(b.date)
            )

        console.log(
          "FORMATADO:",
          formatado
        )

        setChartData(formatado)

      } catch (error) {

        console.error(
          "Erro dashboard:",
          error
        )

      } finally {

        setLoading(false)

      }
    }

    fetchDashboard()

  }, [timeRange])

  return {

    loading,

    maquinasResumo,

    usuariosResumo,

    chartData,

    maquinas,

  }
}