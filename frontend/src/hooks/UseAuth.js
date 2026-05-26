"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:3001/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem("usuario");

    if (usuarioSalvo) {
      try {
        setUsuario(JSON.parse(usuarioSalvo));
      } catch {
        localStorage.removeItem("usuario");
      }
    }

    setCarregando(false);
  }, []);

  async function login(email, senha) {
    const resposta = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, senha, canal: "web" }),
    });

    const dados = await resposta.json();

    if (!resposta.ok || !dados.sucesso) {
      throw new Error(dados.mensagem || "Email ou senha incorretos");
    }

    const { usuario } = dados.dados;

    localStorage.setItem("usuario", JSON.stringify(usuario));
    setUsuario(usuario);

    router.push("/dashboard");
  }

  function logout() {
    localStorage.removeItem("usuario");
    setUsuario(null);
    router.push("/");
  }

  // Atualiza nome e telefone do usuário logado no banco e no estado
  async function updateUser(dados) {
    const resposta = await fetch(`${API_URL}/${usuario.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(dados),
    });

    const result = await resposta.json();

    if (!resposta.ok || !result.sucesso) {
      throw new Error(result.mensagem || "Erro ao atualizar perfil");
    }

    const usuarioAtualizado = { ...usuario, ...dados };
    setUsuario(usuarioAtualizado);
    localStorage.setItem("usuario", JSON.stringify(usuarioAtualizado));

    return usuarioAtualizado;
  }

  async function setUserLocal(dados) {
  const usuarioAtualizado = { ...usuario, ...dados };
  setUsuario({ ...usuarioAtualizado }); // spread extra força novo objeto
  localStorage.setItem("usuario", JSON.stringify(usuarioAtualizado));
  return usuarioAtualizado;
}

  // Monta a URL completa da foto do usuário
  function getFotoUrl(foto) {
    if (!foto) return null;
    if (foto.startsWith("http") || foto.startsWith("blob:")) return foto;
    return `http://localhost:3001/uploads/${foto}`;
  }

  return (
    <AuthContext.Provider value={{
      usuario,
      user: usuario,
      login,
      logout,
      updateUser,
      setUserLocal,
      getFotoUrl,
      carregando,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error("useAuth deve ser usado dentro do AuthProvider");
  }
  return contexto;
}