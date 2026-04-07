"use client";

import { useState, useEffect } from "react";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem("user");

    if (usuarioSalvo) {
      setUser(JSON.parse(usuarioSalvo));
    }

    setCarregando(false);
  }, []);


  async function login(email, senha) {
    try {
      setCarregando(true);

    
      const usuarios = JSON.parse(localStorage.getItem("tecnicos")) || [];

      const usuarioEncontrado = usuarios.find(
        (u) => u.email === email && u.senha === senha
      );

      if (!usuarioEncontrado) {
        throw new Error("Email ou senha inválidos");
      }

      localStorage.setItem("user", JSON.stringify(usuarioEncontrado));
      setUser(usuarioEncontrado);

      return usuarioEncontrado;
    } catch (erro) {
      throw erro;
    } finally {
      setCarregando(false);
    }
  }

 
  function logout() {
    localStorage.removeItem("user");
    setUser(null);
  }

  
  const isAuthenticated = !!user;

  return {
    user,
    carregando,
    login,
    logout,
    isAuthenticated,
  };
}