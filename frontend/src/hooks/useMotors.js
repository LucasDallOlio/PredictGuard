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

      console.log("Buscando motores...");

      const res = await fetch(
        `${API_URL}?pagina=${page}&limite=10`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      console.log("Status busca:", res.status);

      if (!res.ok) {
        throw new Error("Erro ao buscar motores");
      }

      const data = await res.json();

      console.log("Motores recebidos:", data);

      setMotores(data.dados || []);
      setTotalPaginas(data.paginacao?.totalPaginas || 1);

    } catch (err) {

      console.error("Erro fetchMotores:", err);

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

    try {

      console.log("=== INICIANDO CADASTRO MOTOR ===");

      if (novoMotor instanceof FormData) {

        console.log("Dados enviados:");

        for (const [key, value] of novoMotor.entries()) {
          console.log(key, value);
        }

      }

      const token = getToken();

      console.log("Token:", token);

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: novoMotor,
      });

      console.log("Status resposta:", res.status);

      const text = await res.text();

      console.log("Resposta bruta:", text);

      let data;

      try {

        data = JSON.parse(text);
        console.log("JSON convertido:", data);

      } catch (jsonError) {

        console.error("Erro ao converter JSON:", jsonError);

        throw new Error("Resposta inválida da API");

      }

      if (!res.ok) {

        console.error("Erro backend:", data);

        throw new Error(
          data.mensagem ||
          data.erro ||
          "Erro ao adicionar motor"
        );

      }

      console.log("Motor criado com sucesso!");

      fetchMotores(pagina);

      return data.dados;

    } catch (err) {

      console.error("Erro addMotor:", err);

      setErro(err.message);

      throw err;

    }

  }

  async function updateMotor(id, atualizacoes) {

    try {

      const isFormData = atualizacoes instanceof FormData;

      console.log("Atualizando motor:", id);

      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          ...(isFormData ? {} : { "Content-Type": "application/json" }),
        },
        body: isFormData
          ? atualizacoes
          : JSON.stringify(atualizacoes),
      });

      console.log("Status update:", res.status);

      const data = await res.json();

      console.log("Resposta update:", data);

      if (!res.ok) {
        throw new Error(
          data.mensagem ||
          "Erro ao atualizar motor"
        );
      }

      fetchMotores(pagina);

      return data.dados;

    } catch (err) {

      console.error("Erro updateMotor:", err);

      throw err;

    }

  }

  async function deletarMotor(id) {

    try {

      console.log("Deletando motor:", id);

      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      console.log("Status delete:", res.status);

      if (!res.ok) {

        const data = await res.json();

        console.error("Erro delete:", data);

        throw new Error(
          data.mensagem ||
          "Erro ao deletar motor"
        );

      }

      console.log("Motor deletado!");

      fetchMotores(pagina);

    } catch (err) {

      console.error("Erro deletarMotor:", err);

      throw err;

    }

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

    fetchMotores,
  };
}