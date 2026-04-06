import { useState, useEffect } from "react";

export function useMotors(open) {
  const [motores, setMotores] = useState([]);
  const [loading, setLoading] = useState(false);

 
  useEffect(() => {
    async function fetchMotores() {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:3001/motores");
        if (!res.ok) throw new Error("Erro ao buscar motores");

        const data = await res.json();
        setMotores(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (open) fetchMotores();
  }, [open]);

  
  async function addMotor(novoMotor) {
    const res = await fetch("http://localhost:3001/motore", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(novoMotor),
    });

    if (!res.ok) throw new Error("Erro ao adicionar motor");

    const data = await res.json();
    setMotores((prev) => [...prev, data]);

    return data;
  }

  async function updateMotor(id, motorAtualizado) {
    const res = await fetch(`http://localhost:3001/motore/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(motorAtualizado),
    });

    if (!res.ok) throw new Error("Erro ao atualizar motor");

    const data = await res.json();

    setMotores((prev) =>
      prev.map((motor) => (motor.id === id ? data : motor))
    );

    return data;
  }


  async function deletarMotor(id) {
    const res = await fetch(`http://localhost:3001/motore/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Erro ao excluir motor");

    setMotores((prev) => prev.filter((motor) => motor.id !== id));
  }

  return {
    motores,
    loading,
    addMotor,
    updateMotor,
    deletarMotor,
  };
}