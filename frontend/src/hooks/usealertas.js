"use client"

import {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react"

const API_URL =
  "http://localhost:3001/alertas"

export function useAlertas() {

  const [alertas, setAlertas] =
    useState([])

  const [loading, setLoading] =
    useState(false)

  const [erro, setErro] =
    useState(null)

  const [pagina, setPagina] =
    useState(1)

  const [limite] =
    useState(10)

  const [totalPaginas, setTotalPaginas] =
    useState(1)

  const fetchAlertas =
    useCallback(async (page = 1) => {

      try {

        setLoading(true)

        setErro(null)

        const res = await fetch(
          `${API_URL}?pagina=${page}&limite=${limite}&ordem=desc`,
          {
            credentials: "include",
          }
        )

        if (!res.ok) {

          throw new Error(
            "Erro ao buscar alertas"
          )
        }

        const data =
          await res.json()

        console.log(data)

        setAlertas(
          data.dados || []
        )

        setTotalPaginas(
          data.paginacao?.totalPaginas || 1
        )

      } catch (err) {

        console.error(err)

        setErro(
          err.message
        )

      } finally {

        setLoading(false)

      }

    }, [limite])

  useEffect(() => {

    fetchAlertas(pagina)

  }, [pagina, fetchAlertas])

  function proximaPagina() {

    if (pagina < totalPaginas) {

      setPagina((prev) => prev + 1)

    }
  }

  function paginaAnterior() {

    if (pagina > 1) {

      setPagina((prev) => prev - 1)

    }
  }

  const alertasCriticos =
    useMemo(() => {

      return alertas.filter(
        (a) =>
          a.severidade === "critica"
      )

    }, [alertas])

  const alertasAlta =
    useMemo(() => {

      return alertas.filter(
        (a) =>
          a.severidade === "alta"
      )

    }, [alertas])

  return {

    alertas,

    loading,

    erro,

    pagina,

    limite,

    totalPaginas,

    proximaPagina,

    paginaAnterior,

    fetchAlertas,

    alertasCriticos,

    alertasAlta,
  }
}