"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

const API_URL = "http://localhost:3001/alertas";

export function useAlertas() {

  const [alertas, setAlertas] = useState([]);

  const [loading, setLoading] = useState(false);

  const [erro, setErro] = useState(null);

  const [pagina, setPagina] = useState(1);

  const [totalPaginas, setTotalPaginas] = useState(1);

  const fetchAlertas = useCallback(async (page = pagina) => {

    setLoading(true);

    setErro(null);

    try {

      console.log("Buscando alertas...");

      const res = await fetch(
        `${API_URL}?page=${page}&limit=10`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Status busca:", res.status);

      if (!res.ok) {
        throw new Error("Erro ao buscar alertas");
      }

      const data = await res.json();

      console.log("Alertas recebidos:", data);

      setAlertas(data.dados || []);

      setTotalPaginas(
        Math.ceil(
          (data.total || 0) / (data.limit || 10)
        ) || 1
      );

    } catch (err) {

      console.error("Erro fetchAlertas:", err);

      setErro(err.message);

    } finally {

      setLoading(false);

    }

  }, [pagina]);

  useEffect(() => {

    fetchAlertas(pagina);

  }, [pagina, fetchAlertas]);

  function proximaPagina() {

    setPagina((prev) =>
      Math.min(prev + 1, totalPaginas)
    );
  }

  function paginaAnterior() {

    setPagina((prev) =>
      Math.max(prev - 1, 1)
    );
  }

  async function criarAlerta(novoAlerta) {

    try {

      const res = await fetch(API_URL, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        credentials: "include",

        body: JSON.stringify(novoAlerta),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.mensagem || "Erro ao criar alerta"
        );
      }

      fetchAlertas(pagina);

      return data;

    } catch (err) {

      console.error("Erro criarAlerta:", err);

      throw err;

    }

  }

  async function atualizarAlerta(id, atualizacoes) {

    try {

      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        credentials: "include",

        body: JSON.stringify(atualizacoes),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.mensagem || "Erro ao atualizar alerta"
        );
      }

      fetchAlertas(pagina);

      return data;

    } catch (err) {

      console.error("Erro atualizarAlerta:", err);

      throw err;

    }

  }

  async function excluirAlerta(id) {

    try {

      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {

        const data = await res.json();

        throw new Error(
          data.mensagem || "Erro ao excluir alerta"
        );
      }

      fetchAlertas(pagina);

    } catch (err) {

      console.error("Erro excluirAlerta:", err);

      throw err;

    }

  }

  const alertasCriticos = useMemo(() => {

    return alertas.filter(
      (a) => a.severidade === "critica"
    );

  }, [alertas]);

  const alertasAlta = useMemo(() => {

    return alertas.filter(
      (a) => a.severidade === "alta"
    );

  }, [alertas]);

  const totalAlertas = useMemo(() => {

    return alertas.length;

  }, [alertas]);

  return {

    alertas,

    loading,

    erro,

    pagina,

    totalPaginas,

    proximaPagina,

    paginaAnterior,

    fetchAlertas,

    criarAlerta,

    atualizarAlerta,

    excluirAlerta,

    totalAlertas,

    alertasCriticos,

    alertasAlta,
  };
}