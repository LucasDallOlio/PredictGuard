import { useState, useEffect } from "react";

const API_URL = "http://localhost:3001/maquinas";

export function useMotors() {
  const [motores, setMotores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  function getToken() {
    return localStorage.getItem("token");
  }

  useEffect(() => {
    let ativo = true;

    async function buscarMotores() {
      setLoading(true);
      setErro(null);

      try {
        const res = await fetch(API_URL, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });

        if (!res.ok) throw new Error("Erro ao buscar motores");

        const data = await res.json();

        if (ativo) {
          setMotores(data.dados || []);
        }
      } catch (err) {
        if (ativo) setErro(err.message);
      } finally {
        if (ativo) setLoading(false);
      }
    }

    buscarMotores();

    return () => {
      ativo = false;
    };
  }, []);

  
  async function addMotor(novoMotor) {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(novoMotor),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.mensagem || "Erro ao adicionar motor");
    }

    const novo = {
      id: data.dados.id,
      ...novoMotor,
    };

    setMotores((prev) => [...prev, novo]);

    return novo;
  }

  
  async function updateMotor(id, atualizacoes) {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(atualizacoes),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.mensagem || "Erro ao atualizar motor");
    }

    setMotores((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, ...atualizacoes } : m
      )
    );

    return data.dados;
  }

  
  async function deletarMotor(id) {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.mensagem || "Erro ao deletar motor");
    }

    setMotores((prev) => prev.filter((m) => m.id !== id));
  }

  return {
    motores,
    loading,
    erro,
    addMotor,
    updateMotor,
    deletarMotor,
  };
}