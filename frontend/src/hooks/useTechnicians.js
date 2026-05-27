import { useState, useEffect } from "react";

const API_URL = "http://localhost:3001/usuarios";

export function useTechnicians() {
  const [tecnicos, setTecnicos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [filtroTipo, setFiltroTipo] = useState("");

  async function buscarTecnicos(paginaAtual, tipo = filtroTipo) {
    setLoading(true);
    setErro(null);

    try {
      const queryTipo = tipo ? `&tipo=${tipo}` : "";

      const res = await fetch(
        `${API_URL}?pagina=${paginaAtual}&limite=10${queryTipo}`,
        {
          credentials: "include",
          cache: "no-store",
        }
      );

      if (!res.ok) throw new Error("Erro ao buscar usuários");

      const data = await res.json();

      setTecnicos(data.dados);
      setTotalPaginas(data.paginacao?.totalPaginas || 1);
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    buscarTecnicos(pagina, filtroTipo);
  }, [pagina, filtroTipo]);

  function proximaPagina() {
    setPagina((prev) => Math.min(prev + 1, totalPaginas));
  }

  function paginaAnterior() {
    setPagina((prev) => Math.max(prev - 1, 1));
  }

  function alterarFiltro(tipo) {
    setPagina(1);
    setFiltroTipo(tipo);
  }

  async function adicionarTecnico(formData) {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok)
        throw new Error(data.mensagem || "Erro ao adicionar técnico");

      setPagina(1);
      await buscarTecnicos(1);

      return data.dados;
    } catch (err) {
      console.error("🚨 ERRO:", err);
      throw err;
    }
  }

  async function removerTecnico(id) {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Erro ao remover técnico");

      await buscarTecnicos(pagina);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async function atualizarTecnico(id, atualizacoes) {
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

      if (!res.ok)
        throw new Error(data.mensagem || "Erro ao atualizar técnico");

      await buscarTecnicos(pagina);

      return data.dados;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  return {
    tecnicos,
    loading,
    erro,
    adicionarTecnico,
    removerTecnico,
    atualizarTecnico,
    pagina,
    totalPaginas,
    proximaPagina,
    paginaAnterior,
    filtroTipo,
    alterarFiltro,
  };
}