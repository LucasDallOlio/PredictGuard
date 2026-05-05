import { useState, useEffect, useCallback } from "react";

const API_URL = "http://localhost:3001/maquinas";

export function useMotors() {
  const [motores, setMotores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  function getToken() {
    return localStorage.getItem("token");
  }


  const fetchMotores = useCallback(async () => {
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
      setMotores(data.dados || []);
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMotores();
  }, [fetchMotores]);


  async function addMotor(novoMotor) {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      body: novoMotor,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.mensagem || "Erro ao adicionar motor");
    }

    
    await fetchMotores();

    return data.dados;
  }

async function updateMotor(id, atualizacoes) {
  const isFormData = atualizacoes instanceof FormData;

  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
    },
    body: isFormData ? atualizacoes : JSON.stringify(atualizacoes),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.mensagem || "Erro ao atualizar motor");
  }

  setMotores((prev) =>
    prev.map((m) => (m.id === id ? data.dados : m))
  );

  await fetchMotores();

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
    fetchMotores, 
  };
}