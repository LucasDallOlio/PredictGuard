import ChatApp from "@/components/chat/chatApp"; // Ajuste o caminho

export default function Page() {
  return (
    // h-screen trava o tamanho na tela inteira, overflow-hidden corta o scroll global
    <main className="flex flex-col h-screen overflow-hidden">
      {/* O container que abraça o ChatApp pega o resto do espaço */}
      <div className="flex-1 min-h-0 w-full">
        <ChatApp />
      </div>

    </main>
  );
}