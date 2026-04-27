import { useState, useEffect } from "react";

const API_URL = "http://localhost:3001/maquinas";

export function useMotors() {
  const [motores, setMotores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  async function tratarResposta(res) {
    const contentType = res.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      return await res.json();
    } else {
      const text = await res.text();
      return { mensagem: text };
    }
  }

 
  useEffect(() => {
    let ativo = true;

    async function fetchMotores() {
      setLoading(true);
      setErro(null);

      try {
        const res = await fetch(API_URL);
        const data = await tratarResposta(res);

        if (!res.ok) {
          throw new Error(data.mensagem || "Erro ao buscar motores");
        }

        if (ativo) {
          setMotores(data.dados || data || []);
        }
      } catch (err) {
        if (ativo) setErro(err.message);
        console.error(err);
      } finally {
        if (ativo) setLoading(false);
      }
    }

    fetchMotores();

    return () => {
      ativo = false;
    };
  }, []);


  async function addMotor(novoMotor) {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(novoMotor),
    });

    const data = await tratarResposta(res);

    if (!res.ok) {
      throw new Error(data.mensagem || "Erro ao adicionar motor");
    }

    const novo = data.dados || data;

    setMotores((prev) => [...prev, novo]);

    return novo;
  }


async function updateMotor(id, motorAtualizado) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(motorAtualizado),
  });

  const data = await tratarResposta(res);

  if (!res.ok) {
    throw new Error(data.mensagem || "Erro ao atualizar motor");
  }

  const atualizado = data.dados || data;

  setMotores((prev) =>
    prev.map((motor) =>
      motor.id == id ? { ...motor, ...atualizado } : motor
    )
  );

  return atualizado;
}

  async function deletarMotor(id) {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    const data = await tratarResposta(res);

    if (!res.ok) {
      throw new Error(data.mensagem || "Erro ao excluir motor");
    }

    setMotores((prev) =>
      prev.filter((motor) => motor.id !== id)
    );
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