"use client"

import {
  useEffect,
  useState
} from "react"

const API_URL =
  "http://localhost:3001"

export function useDashboardData() {

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

        const token =
          localStorage.getItem("token")

        const headers = {

          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${token}`,

        }

        const [

          maquinasResponse,
          usuariosResponse,
          leiturasResponse,
          maquinasListaResponse,

        ] = await Promise.all([

          fetch(
            `${API_URL}/maquinas/resumo-status`,
            { headers }
          ),

          fetch(
            `${API_URL}/usuarios/resumo-tipos`,
            { headers }
          ),

          fetch(
            `${API_URL}/leituras/serie?limite=2000`,
            { headers }
          ),

          fetch(
            `${API_URL}/maquinas`,
            { headers }
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

        const agrupado = {}

        leituras.forEach((item) => {

          const data =
            new Date(item.data_leitura)

          const minuto =
            `${data.getFullYear()}-${data.getMonth()}-${data.getDate()}-${data.getHours()}-${data.getMinutes()}`

          const key =
            `${item.maquina_id}_${minuto}`

          if (!agrupado[key]) {

            agrupado[key] = {

              date:
                item.data_leitura,

              maquinaId:
                item.maquina_id,

              maquina:
                mapaMaquinas[item.maquina_id]
                  ?.nome || "Máquina",

              setor:
                mapaMaquinas[item.maquina_id]
                  ?.setor || "",

              temperatura: null,
              vibracao: null,

            }

          }

          if (
            item.tipo_sensor ===
            "temperatura"
          ) {

            agrupado[key].temperatura =
              Number(item.valor)

          }

          if (
            item.tipo_sensor ===
            "acelerometro"
          ) {

            agrupado[key].vibracao =
              Number(item.valor)

          }

        })

        const formatado =
          Object.values(agrupado)
            .filter(
              (item) =>
                item.temperatura !== null ||
                item.vibracao !== null
            )
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

  }, [])

  return {

    loading,

    maquinasResumo,

    usuariosResumo,

    chartData,

    maquinas,

  }
}