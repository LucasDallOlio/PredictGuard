"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const router = useRouter();

  // Ao iniciar, verifica se já tem token salvo
  useEffect(() => {
    const token = localStorage.getItem("token");
    const usuarioSalvo = localStorage.getItem("usuario");

    if (token && usuarioSalvo) {
      try {
        setUsuario(JSON.parse(usuarioSalvo));
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
      }
    }

    setCarregando(false);
  }, []);

  async function login(email, senha) {
    const resposta = await fetch("http://localhost:3001/usuarios/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha, canal: "web" }),
    });

    const dados = await resposta.json();

    if (!resposta.ok || !dados.sucesso) {
      throw new Error(dados.mensagem || "Email ou senha incorretos");
    }

    const { token, usuario } = dados.dados;

    localStorage.setItem("token", token);
    localStorage.setItem("usuario", JSON.stringify(usuario));
    setUsuario(usuario);

    router.push("/dashboard");
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setUsuario(null);
    router.push("/");
  }

  // Retorna o token salvo para usar nas requisições
  function getToken() {
    return localStorage.getItem("token");
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout, getToken, carregando }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para usar em qualquer componente
export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error("useAuth deve ser usado dentro do AuthProvider");
  }
  return contexto;
}