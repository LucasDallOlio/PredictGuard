import { useState, useEffect } from "react";

export function useTechnicians(open) {
  const [tecnicos, setTecnicos] = useState([]);
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    async function buscarTecnicos() {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:3001/usuarios");
        if (!res.ok) throw new Error("Erro ao buscar técnicos");
        const data = await res.json();
        setTecnicos(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (open) buscarTecnicos();
  }, [open]);

 
  async function adicionarTecnico(novoTecnico) {
    const res = await fetch("http://localhost:3001/usuarios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(novoTecnico),
    });

    if (!res.ok) throw new Error("Erro ao adicionar técnico");

    const data = await res.json();
    setTecnicos((prev) => [...prev, data]);
    return data;
  }

 
  async function removerTecnico(id) {
    const res = await fetch(`http://localhost:3001/usuarios/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Erro ao remover técnico");

    setTecnicos((prev) => prev.filter((tec) => tec.id !== id));
  }

  // 
  async function atualizarTecnico(id, atualizacoes) {
    const res = await fetch(`http://localhost:3001/usuarios/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(atualizacoes),
    });

    if (!res.ok) throw new Error("Erro ao atualizar técnico");

    const atualizado = await res.json();
    setTecnicos((prev) =>
      prev.map((tec) => (tec.id === id ? atualizado : tec))
    );

    return atualizado;
  }

  return { 
    tecnicos, 
    loading, 
    adicionarTecnico, 
    removerTecnico, 
    atualizarTecnico, 
    setTecnicos 
  };
}