"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Menu, X, LayoutDashboard, Briefcase, Cpu, Users,
  MessageSquare, Bot, Settings, Bell, Search,
  ChevronRight, ChevronLeft, LogOut, ShieldCheck, User, Mail, Phone, Shield,
  Loader2, Check
} from "lucide-react";
import { useAuth } from "@/hooks/UseAuth";



export default function PremiumLayout({ children }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, updateUser, logout, getFotoUrl } = useAuth();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);


  const [nomeEdit, setNomeEdit] = useState("");
  const [telefoneEdit, setTelefoneEdit] = useState("");
  useEffect(() => {
    if (user) {
      setNomeEdit(user.nome || "");
      setTelefoneEdit(user.telefone || "");
    }
  }, [user]);
  const pathname = usePathname();
  const currentPath = pathname;

  const topNavItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { name: "Serviços", icon: Briefcase, href: "/services" },
    { name: "Motores", icon: Cpu, href: "/engines" },
    { name: "Usuários", icon: Users, href: "/usuarios" },
    { name: "Chat", icon: MessageSquare, href: "/chat" },
  ];

  const bottomNavItems = [
    { name: "Chat Robô", icon: Bot, href: "/chat-robo" },
    { name: "Configuração", icon: Settings, href: "/configuracao" },
  ];

  const handleSaveProfile = () => {
    setIsSaving(true);

    setTimeout(() => {
      updateUser({
        nome: nomeEdit,
        telefone: telefoneEdit,
      });

      setIsSaving(false);
      setIsSaved(true);

      setTimeout(() => {
        setIsProfileModalOpen(false);
        setTimeout(() => setIsSaved(false), 300);
      }, 1000);
    }, 1500);
  };
  const handleLogout = (e) => {
    e.stopPropagation();
    setIsLoggingOut(true);

    setTimeout(() => {
      logout();
      window.location.href = "/";
    }, 1000);
  };
  return (
    <div className="flex h-screen w-full bg-sidebar overflow-hidden font-sans">

      {/* OVERLAY MOBILE */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col text-sidebar-foreground transition-all duration-300 ease-in-out md:static
          ${isMobileOpen ? "translate-x-0 w-72 bg-sidebar border-r border-sidebar-border shadow-2xl" : "-translate-x-full w-72 md:translate-x-0 bg-transparent"}
          ${isCollapsed ? "md:w-20" : "md:w-72"}
        `}
      >
        {/* LOGO E NOME DO SISTEMA */}
        <div className={`flex h-20 items-center justify-between px-6 ${isCollapsed ? "justify-center px-0" : ""}`}>
          <div className="flex items-center gap-3">
            {/* Ícone Premium */}
            <div className="flex items-center justify-center shrink-0 size-10 rounded-xl bg-linear-to-br from-sidebar-primary to-blue-600 text-sidebar-primary-foreground shadow-lg shadow-sidebar-primary/30 ring-1 ring-white/10">
              <ShieldCheck className="size-5" strokeWidth={2.5} />
            </div>

            {!isCollapsed && (
              <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-sidebar-foreground to-sidebar-foreground/70 transition-opacity duration-300">
                PredictGuard
              </span>
            )}
          </div>
          <button className="md:hidden p-2 text-sidebar-foreground/70 hover:text-sidebar-foreground" onClick={() => setIsMobileOpen(false)}>
            <X className="size-6" />
          </button>
        </div>

        {/* Menu Superior - AGORA COM ISLAS EM ESTADO COLAPSADO */}
        <nav className={`space-y-3 px-4 py-4 mt-2 overflow-y-auto overflow-x-hidden ${isCollapsed ? "flex flex-col items-center" : "space-y-1.5"}`}>
          {topNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.href;
            return (
              <Link key={item.name} href={item.href}
                onClick={() => setIsMobileOpen(false)} // Fecha menu no mobile ao clicar
                className={`group flex items-center transition-all duration-200 
                  ${isCollapsed ? "size-12 justify-center rounded-xl border border-sidebar-border" : "gap-3 rounded-xl px-3 py-3 w-full"}
                  ${isActive
                    ? `bg-sidebar-primary text-sidebar-primary-foreground shadow-md shadow-sidebar-primary/15 ${isCollapsed ? "" : "font-semibold"}`
                    : `text-sidebar-foreground/70 ${isCollapsed ? "bg-sidebar-accent/50" : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground font-medium"}`
                  }`}
              >
                <Icon className={`size-5 shrink-0 transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
                {!isCollapsed && <span className="truncate">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="flex-1" />

        {/* Menu Inferior - AGORA COM ISLAS EM ESTADO COLAPSADO */}
        <nav className={`space-y-3 px-4 py-2 ${isCollapsed ? "flex flex-col items-center" : "space-y-1.5"}`}>
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.href;
            return (
              <Link key={item.name} href={item.href}
                onClick={() => setIsMobileOpen(false)} // Fecha menu no mobile ao clicar
                className={`group flex items-center transition-all duration-200
                   ${isCollapsed ? "size-12 justify-center rounded-xl border border-sidebar-border" : "gap-3 rounded-xl px-3 py-3 w-full"}
                  ${isActive
                    ? `bg-sidebar-primary text-sidebar-primary-foreground shadow-md shadow-sidebar-primary/15 ${isCollapsed ? "" : "font-semibold"}`
                    : `text-sidebar-foreground/70 ${isCollapsed ? "bg-sidebar-accent/50" : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground font-medium"}`
                  }`}
              >
                <Icon className={`size-5 shrink-0 transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
                {!isCollapsed && <span className="truncate">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Rodapé da Sidebar */}
        <div className={`p-4 mt-2 mb-2 ${isCollapsed ? "flex flex-col items-center gap-4" : ""}`}>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`hidden md:flex items-center justify-center gap-2 text-sidebar-foreground/50 hover:text-sidebar-accent-foreground hover:bg-sidebar-accent transition-colors 
              ${isCollapsed ? "size-12 rounded-xl" : "p-2 w-full rounded-lg"}`}
          >
            {isCollapsed ? <ChevronRight className="size-5" /> : <ChevronLeft className="size-5" />}
          </button>

          {/* Card de Perfil - AGORA SIMPLIFICADO E CENTRALIZADO NO MODO COLAPSADO */}
          <div
            onClick={() => setIsProfileModalOpen(true)}
            className={`flex items-center transition-all cursor-pointer shadow-sm ${isCollapsed ? "justify-center size-12" : "gap-3 p-3 bg-sidebar-accent/50 border border-sidebar-border rounded-xl hover:bg-sidebar-accent"}`}
            title="Ver Perfil"
          >
            {/* FOTO OU INICIAL */}
            <div className={`flex items-center justify-center rounded-full shrink-0 overflow-hidden ${isCollapsed ? "size-12 bg-sidebar-primary text-sidebar-primary-foreground font-bold text-lg" : "size-9 bg-sidebar-primary border-2 border-background text-sidebar-primary-foreground font-bold text-xs"}`}>
              {getFotoUrl(user?.foto) ? (
                <img
                  src={getFotoUrl(user?.foto)}
                  alt={user?.nome}
                  className="size-full object-cover"
                />
              ) : (
                <span>{user?.nome?.charAt(0).toUpperCase() ?? "?"}</span>
              )}
            </div>

            {/* NOME E CARGO */}
            {!isCollapsed && (
              <div className="flex flex-col flex-1 overflow-hidden">
                <span className="text-sm font-semibold text-sidebar-foreground truncate">
                  {user?.nome ?? "—"}
                </span>
                <span className="text-xs text-sidebar-foreground/60 truncate capitalize">
                  {user?.tipo === "admin" ? "Administrador" : user?.tipo ?? "—"}
                </span>
              </div>
            )}

            {/* BOTÃO DE LOGOUT */}
            {!isCollapsed && (
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="p-1.5 text-sidebar-foreground/50 hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors disabled:opacity-50"
                title="Sair"
              >
                {isLoggingOut ? <Loader2 className="size-4 animate-spin" /> : <LogOut className="size-4" />}
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 flex flex-col h-screen p-0 md:py-3 md:pr-3 md:pl-0 w-full min-w-0 transition-all">
        <div className="flex flex-1 flex-col bg-background text-foreground md:rounded-[2rem] shadow-xl overflow-hidden relative border border-border">

          {/* CABEÇALHO MOBILE (Adicionado para abrir o menu) */}
          <div className="flex items-center justify-between p-4 border-b border-border md:hidden bg-background">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center shrink-0 size-8 rounded-lg bg-linear-to-br from-sidebar-primary to-blue-600 text-sidebar-primary-foreground shadow-sm">
                <ShieldCheck className="size-4" />
              </div>
              <span className="text-lg font-bold">PredictGuard</span>
            </div>
            <button
              onClick={() => setIsMobileOpen(true)}
              className="p-2 -mr-2 text-foreground/70 hover:text-foreground rounded-lg hover:bg-secondary transition-colors"
            >
              <Menu className="size-6" />
            </button>
          </div>

          <div className="flex-1 overflow-auto p-4 md:p-8">
            {children}
          </div>

        </div>
      </main>

      {/* MODAL DE PERFIL */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
            onClick={() => !isSaving && setIsProfileModalOpen(false)}
          />

          <div className="relative w-full max-w-3xl max-h-[90vh] bg-background rounded-3xl shadow-2xl border border-border overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">

            {/* Capa e Foto */}
            <div className="h-32 w-full bg-gradient-to-br from-primary/30 to-primary/5 relative">
              <button
                onClick={() => setIsProfileModalOpen(false)}
                disabled={isSaving}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/20 text-white hover:bg-black/60 backdrop-blur-md transition-colors disabled:opacity-50"
              >
                <X className="size-5" />
              </button>

              <div className="absolute -bottom-12 left-4 md:left-8 flex items-end gap-4">
                {/* FOTO DO USUÁRIO */}
                <div className="size-20 md:size-24 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-2xl md:text-3xl shadow-xl border-4 border-background shrink-0 overflow-hidden">
                  {getFotoUrl(user?.foto) ? (
                    <img
                      src={getFotoUrl(user?.foto)}
                      alt={user?.nome}
                      className="size-full object-cover"
                    />
                  ) : (
                    <span>{user?.nome?.charAt(0).toUpperCase() ?? "?"}</span>
                  )}
                </div>

                <div className="mb-2">
                  {/* NOME DO BANCO */}
                  <h2 className="text-xl md:text-2xl font-bold text-foreground">
                    {user?.nome ?? "—"}
                  </h2>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold capitalize">
                    <Shield className="size-3" />
                    {user?.tipo === "admin" ? "Administrador" : user?.tipo ?? "—"}
                  </span>
                </div>
              </div>
            </div>

            <div className="h-16 w-full" />

            <div className="p-4 md:p-8 pt-0 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                {/* --- COLUNA ESQUERDA (Pode Editar) --- */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4 border-b border-border pb-2">
                      Informações Pessoais
                    </h3>
                    <div className="space-y-4">

                      {/* NOME EDITÁVEL */}
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground flex items-center gap-2">
                          <User className="size-4 text-muted-foreground" /> Nome Completo
                        </label>
                        <input
                          type="text"
                          value={nomeEdit}
                          onChange={(e) => setNomeEdit(e.target.value)}
                          disabled={isSaving}
                          className="w-full bg-transparent border border-input rounded-xl px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-ring focus:border-ring outline-none transition-all disabled:opacity-50"
                        />
                      </div>

                      {/* TELEFONE EDITÁVEL */}
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground flex items-center gap-2">
                          <Phone className="size-4 text-muted-foreground" /> Telefone / WhatsApp
                        </label>
                        <input
                          type="text"
                          value={telefoneEdit}
                          onChange={(e) => setTelefoneEdit(e.target.value)}
                          disabled={isSaving}
                          className="w-full bg-transparent border border-input rounded-xl px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-ring focus:border-ring outline-none transition-all disabled:opacity-50"
                        />
                      </div>

                    </div>
                  </div>
                </div>

                {/* --- COLUNA DIREITA (Bloqueado) --- */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4 border-b border-border pb-2">
                      Credenciais do Sistema
                    </h3>
                    <div className="space-y-4">

                      {/* E-MAIL BLOQUEADO */}
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <Mail className="size-4 text-muted-foreground" /> E-mail de Trabalho
                          </span>
                          <span className="text-[10px] uppercase tracking-wider bg-secondary text-secondary-foreground px-2 py-0.5 rounded-md font-bold">
                            Bloqueado
                          </span>
                        </label>
                        <input
                          type="email"
                          value={user?.email ?? ""}
                          disabled
                          readOnly
                          className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 text-sm text-muted-foreground cursor-not-allowed opacity-80"
                        />
                      </div>

                      {/* PRIVILÉGIO BLOQUEADO */}
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <Shield className="size-4 text-muted-foreground" /> Privilégio / Cargo
                          </span>
                          <span className="text-[10px] uppercase tracking-wider bg-secondary text-secondary-foreground px-2 py-0.5 rounded-md font-bold">
                            Bloqueado
                          </span>
                        </label>
                        <input
                          type="text"
                          value={user?.tipo === "admin" ? "Administrador" : user?.tipo ?? "—"}
                          disabled
                          readOnly
                          className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 text-sm text-muted-foreground cursor-not-allowed opacity-80"
                        />
                      </div>

                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Rodapé Animado */}
            <div className="flex items-center justify-end gap-3 p-4 md:p-6 pt-4 border-t border-border bg-background mt-auto flex-wrap">
              <button
                onClick={() => setIsProfileModalOpen(false)}
                disabled={isSaving}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-semibold text-foreground hover:bg-secondary hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={isSaving || isSaved}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-primary-foreground shadow-lg transition-all
                  ${isSaved
                    ? "bg-green-600 shadow-green-600/25"
                    : "bg-primary shadow-primary/25 hover:opacity-90 hover:scale-[1.02] active:scale-95"
                  }
                  disabled:opacity-80 disabled:scale-100 disabled:cursor-not-allowed
                `}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Salvando...
                  </>
                ) : isSaved ? (
                  <>
                    <Check className="size-4" />
                    Salvo!
                  </>
                ) : (
                  "Salvar Alterações"
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>

  );
}