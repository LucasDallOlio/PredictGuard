import { useState, useCallback } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

/**
 * Converte o campo `foto` do usuário (nome de arquivo ou URL completa)
 * em uma URL absoluta pronta para uso em <img src>.
 * Retorna null se não houver foto ou se for o placeholder.
 */
export function getFotoUrl(foto) {
  if (!foto) return null;
  if (foto.startsWith('http')) return foto;
  if (foto === 'profile_placeholder.jpg') return null;
  return `${API_URL}/uploads/${foto}`;
}

/**
 * useEditarPerfil
 *
 * @param {object} user        - Usuário autenticado vindo do contexto/estado global
 * @param {function} setUser   - Setter para atualizar o usuário no estado global após salvar
 *
 * @returns Estados e handlers prontos para conectar ao modal de perfil
 */
export function useEditarPerfil(user, setUser) {
  // ── Campos editáveis ────────────────────────────────────────────────────────
  const [nomeEdit, setNomeEdit] = useState(user?.nome ?? '');
  const [telefoneEdit, setTelefoneEdit] = useState(user?.telefone ?? '');
  const [senhaEdit, setSenhaEdit] = useState('');

  // ── Foto ────────────────────────────────────────────────────────────────────
  const [fotoFile, setFotoFile] = useState(null);       // File object a enviar
  const [fotoPreview, setFotoPreview] = useState(null); // URL local para preview

  // ── UI ──────────────────────────────────────────────────────────────────────
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [erro, setErro] = useState(null);

  // ── Handlers ────────────────────────────────────────────────────────────────

  /** Chamado quando o usuário seleciona uma nova foto */
  const handleFotoChange = useCallback((file) => {
    if (!file) return;
    setFotoFile(file);
    // Gera preview local sem precisar de upload prévio
    const objectUrl = URL.createObjectURL(file);
    setFotoPreview(objectUrl);
  }, []);

  /** Reseta todos os estados ao abrir/fechar o modal */
  const resetarEdicao = useCallback(() => {
    setNomeEdit(user?.nome ?? '');
    setTelefoneEdit(user?.telefone ?? '');
    setSenhaEdit('');
    setFotoFile(null);
    if (fotoPreview) URL.revokeObjectURL(fotoPreview);
    setFotoPreview(null);
    setIsSaving(false);
    setIsSaved(false);
    setErro(null);
  }, [user, fotoPreview]);

  /** Envia os dados alterados para PATCH /auth/usuario */
  const handleSaveProfile = useCallback(async () => {
    setErro(null);

    // Monta apenas os campos que o usuário tocou
    const formData = new FormData();
    let temAlteracao = false;

    if (nomeEdit.trim() && nomeEdit.trim() !== user?.nome) {
      formData.append('nome', nomeEdit.trim());
      temAlteracao = true;
    }
    if (telefoneEdit.trim() !== (user?.telefone ?? '')) {
      formData.append('telefone', telefoneEdit.trim());
      temAlteracao = true;
    }
    if (senhaEdit.trim()) {
      formData.append('senha', senhaEdit.trim());
      temAlteracao = true;
    }
    if (fotoFile) {
      formData.append('foto', fotoFile);
      temAlteracao = true;
    }

    if (!temAlteracao) {
      setErro('Nenhuma alteração detectada.');
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(`${API_URL}/auth/usuario`, {
        method: 'PATCH',
        credentials: 'include', // envia o cookie auth_token automaticamente
        body: formData,
        // NÃO definir Content-Type: o browser seta multipart/form-data com boundary sozinho
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.mensagem ?? 'Erro ao salvar perfil.');
      }

      // Atualiza o usuário no estado global com os novos valores
      setUser((prev) => ({
        ...prev,
        ...(nomeEdit.trim() !== prev?.nome ? { nome: nomeEdit.trim() } : {}),
        ...(telefoneEdit.trim() !== prev?.telefone ? { telefone: telefoneEdit.trim() } : {}),
        // A foto atualizada vem do servidor na próxima chamada a /auth/usuario,
        // mas podemos mostrar o preview local imediatamente
        ...(fotoFile ? { foto: fotoPreview } : {}),
      }));

      setIsSaved(true);

      // Reseta o flag "Salvo!" após 2s para permitir nova edição
      setTimeout(() => setIsSaved(false), 2000);
    } catch (err) {
      setErro(err.message);
    } finally {
      setIsSaving(false);
      setFotoFile(null);
    }
  }, [nomeEdit, telefoneEdit, senhaEdit, fotoFile, fotoPreview, user, setUser]);

  return {
    // Campos
    nomeEdit,
    setNomeEdit,
    telefoneEdit,
    setTelefoneEdit,
    senhaEdit,
    setSenhaEdit,

    // Foto
    fotoPreview,
    handleFotoChange,

    // UI
    isSaving,
    isSaved,
    erro,

    // Ações
    handleSaveProfile,
    resetarEdicao,
  };
}