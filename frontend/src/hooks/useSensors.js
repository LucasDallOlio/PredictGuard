// hooks/useSensors.js

import { useState, useEffect, useCallback } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const POR_PAGINA = 10;

export function useSensors() {
  const [sensores, setSensores] = useState([]);
  const [maquinas, setMaquinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  // ─── LEITURA ────────────────────────────────────────────────────────────────

  const fetchSensores = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API}/sensores?pagina=${pagina}&limite=${POR_PAGINA}`,
        { credentials: "include" }
      );
      const data = await res.json();

      if (!data.sucesso) throw new Error(data.mensagem);

      setSensores(data.dados);
      setTotalPaginas(data.paginacao?.totalPaginas ?? 1);
    } catch (err) {
      console.error("Erro ao buscar sensores:", err);
    } finally {
      setLoading(false);
    }
  }, [pagina]);

  const fetchMaquinas = useCallback(async () => {
    try {
      const res = await fetch(`${API}/maquinas?pagina=1&limite=999`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!data.sucesso) throw new Error(data.mensagem);
      setMaquinas(data.dados ?? []);
    } catch (err) {
      console.error("Erro ao buscar máquinas:", err);
    }
  }, []);

  useEffect(() => { fetchSensores(); }, [fetchSensores]);
  useEffect(() => { fetchMaquinas(); }, [fetchMaquinas]);

  // ─── CRUD ───────────────────────────────────────────────────────────────────

  const adicionarSensor = async (payload) => {
    const res = await fetch(`${API}/sensores`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok || !data.sucesso) throw new Error(data.mensagem ?? "Erro ao adicionar sensor");
    await fetchSensores();
  };

  const removerSensor = async (id) => {
    const res = await fetch(`${API}/sensores/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok || !data.sucesso) throw new Error(data.mensagem ?? "Erro ao remover sensor");
    await fetchSensores();
  };

  const atualizarSensor = async (id, payload) => {
    const res = await fetch(`${API}/sensores/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok || !data.sucesso) throw new Error(data.mensagem ?? "Erro ao atualizar sensor");
    await fetchSensores();
  };

  // ─── PAGINAÇÃO ──────────────────────────────────────────────────────────────

  const proximaPagina = () => {
    if (pagina < totalPaginas) setPagina((p) => p + 1);
  };

  const paginaAnterior = () => {
    if (pagina > 1) setPagina((p) => p - 1);
  };

  return {
    sensores,
    maquinas,
    loading,
    adicionarSensor,
    removerSensor,
    atualizarSensor,
    pagina,
    totalPaginas,
    proximaPagina,
    paginaAnterior,
  };
}