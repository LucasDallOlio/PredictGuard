import { ChatMain } from "@/components/chat-main";
import { ChatSidebar } from "@/components/chat-sidebae";


export default function Home() {
  return (
    <div className="flex h-screen">
      <ChatSidebar />
      <ChatMain/>
    </div>
  );
}