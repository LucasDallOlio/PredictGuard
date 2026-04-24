import { useState, useEffect } from "react";

const API_URL = "http://localhost:3001/usuarios";

export function useTechnicians() {
  const [tecnicos, setTecnicos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  function getToken() {
    return localStorage.getItem("token");
  }

  useEffect(() => {
    let ativo = true;

    async function buscarTecnicos() {
      setLoading(true);
      setErro(null);

      try {
        const res = await fetch(`${API_URL}?tipo=técnico`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });

        if (!res.ok) throw new Error("Erro ao buscar técnicos");

        const data = await res.json();

        if (ativo) setTecnicos(data.dados);
      } catch (err) {
        if (ativo) setErro(err.message);
      } finally {
        if (ativo) setLoading(false);
      }
    }

    buscarTecnicos();

    return () => {
      ativo = false;
    };
  }, []);

  async function adicionarTecnico(novoTecnico) {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(novoTecnico),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.mensagem || "Erro ao adicionar técnico");

    setTecnicos((prev) => [...prev, data.dados]);
    return data.dados;
  }

  async function removerTecnico(id) {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.mensagem || "Erro ao remover técnico");

    setTecnicos((prev) => prev.filter((tec) => tec.id !== id));
  }

  async function atualizarTecnico(id, atualizacoes) {
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

    setTecnicos((prev) =>
      prev.map((tec) => (tec.id === id ? data.dados : tec))
    );

    return data.dados;
  }

  return {
    tecnicos,
    loading,
    erro,
    adicionarTecnico,
    removerTecnico,
    atualizarTecnico,
  };
}