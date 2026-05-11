import { useState, useEffect, useCallback } from "react";

const API_URL = "http://localhost:3001/maquinas";

export function useMotors() {
  const [motores, setMotores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  function getToken() {
    return localStorage.getItem("token");
  }

  const fetchMotores = useCallback(async (page = pagina) => {
    setLoading(true);
    setErro(null);

    try {
      const res = await fetch(
        `${API_URL}?tipo=tecnico&pagina=${page}&limite=10`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      if (!res.ok) throw new Error("Erro ao buscar motores");

      const data = await res.json();

      setMotores(data.dados || []);
      setTotalPaginas(data.paginacao?.totalPaginas || 1);
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  }, [pagina]);

  useEffect(() => {
    fetchMotores(pagina);
  }, [pagina, fetchMotores]);

  function proximaPagina() {
    setPagina((prev) => Math.min(prev + 1, totalPaginas));
  }

  function paginaAnterior() {
    setPagina((prev) => Math.max(prev - 1, 1));
  }

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

    fetchMotores(pagina);
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

    fetchMotores(pagina);
    return data.dados;
  }

  async function deletarMotor(id) {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.mensagem || "Erro ao deletar motor");
    }

    fetchMotores(pagina);
  }

  return {
    motores,
    loading,
    erro,
    addMotor,
    updateMotor,
    deletarMotor,
    pagina,
    totalPaginas,
    proximaPagina,
    paginaAnterior,
  };
}