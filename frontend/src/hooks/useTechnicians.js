import { useState, useEffect } from "react";

const API_URL = "http://localhost:3001/usuarios";

export function useTechnicians() {
  const [tecnicos, setTecnicos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  function getToken() {
    return localStorage.getItem("token");
  }

  async function buscarTecnicos(paginaAtual) {
    setLoading(true);
    setErro(null);
    try {
      const res = await fetch(`${API_URL}?tipo=tecnico&pagina=${paginaAtual}&limite=10`, {
        headers: { Authorization: `Bearer ${getToken()}` },
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Erro ao buscar técnicos");
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
    buscarTecnicos(pagina);
  }, [pagina]);

  function proximaPagina() {
    setPagina((prev) => Math.min(prev + 1, totalPaginas));
  }

  function paginaAnterior() {
    setPagina((prev) => Math.max(prev - 1, 1));
  }

  async function adicionarTecnico(formData) {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.mensagem || "Erro ao adicionar técnico");
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
        headers: { Authorization: `Bearer ${getToken()}` },
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
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(atualizacoes),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.mensagem || "Erro ao atualizar técnico");
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
  };
}
