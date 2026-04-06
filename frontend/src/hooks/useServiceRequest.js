"use client";

import { useState } from "react";

export function useService() {
  const [loading, setLoading] = useState(false);

  
  async function listarServicos() {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/servicos");
      if (!res.ok) throw new Error("Erro ao listar serviços");
      return await res.json();
    } finally {
      setLoading(false);
    }
  }

  async function enviarSolicitacao(dados) {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/servicos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });
      if (!res.ok) throw new Error("Erro ao enviar solicitação");
      return await res.json();
    } finally {
      setLoading(false);
    }
  }

  async function deletarServico(id) {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/servicos/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erro ao deletar solicitação");
      return true;
    } finally {
      setLoading(false);
    }
  }

  return { listarServicos, enviarSolicitacao, deletarServico, loading };
}