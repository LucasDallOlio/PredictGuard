import ChatApp from "@/components/chat/chatApp";

export default function Page() {
  return (
    // h-screen trava a página. overflow-hidden impede o scroll "de fora".
    <main className="flex flex-col h-full overflow-hidden bg-background">
      <div className="flex-1 min-h-0 w-full flex"> 
        <ChatApp />
      </div>
    </main>
  );
}