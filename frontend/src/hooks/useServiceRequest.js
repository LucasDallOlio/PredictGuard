"use client";

import { useState, useEffect } from "react";

const API_URL = "http://localhost:3001/servicos";

export function useService() {
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  const limite = 5;

  function getToken() {
    return localStorage.getItem("token");
  }

  async function listarServicos(page = 1) {
    setLoading(true);
    setErro(null);

    try {
      const res = await fetch(
        `${API_URL}?pagina=${page}&limite=${limite}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      if (!res.ok) {
        const erroApi = await res.json();
        throw new Error(
          erroApi.mensagem || "Erro ao listar serviços"
        );
      }

      const data = await res.json();
      

      setServicos(data.dados || []);
      setTotalPaginas(
        data.paginacao?.totalPaginas || 1
      );

      return data;
    } catch (err) {
      setErro(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    listarServicos(pagina);
  }, [pagina]);

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

  async function enviarSolicitacao(dados) {
    setLoading(true);
    setErro(null);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(dados),
      });

      if (!res.ok) {
        const erroApi = await res.json();
        throw new Error(
          erroApi.mensagem ||
            "Erro ao enviar solicitação"
        );
      }

      const data = await res.json();

      await listarServicos(pagina);

      return data;
    } catch (err) {
      setErro(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function atualizarStatusServico(id, status) {
    setLoading(true);
    setErro(null);

    try {
      const statusFormatado = status
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "_");

      const res = await fetch(
        `${API_URL}/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({
            servico_status: statusFormatado,
          }),
        }
      );

      if (!res.ok) {
        const erroApi = await res.json();
        throw new Error(
          erroApi.mensagem ||
            "Erro ao atualizar status"
        );
      }

      await listarServicos(pagina);

      return true;
    } catch (err) {
      setErro(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return {
    servicos,
    loading,
    erro,
    pagina,
    totalPaginas,
    listarServicos,
    enviarSolicitacao,
    atualizarStatusServico,
    proximaPagina,
    paginaAnterior,
  };
}