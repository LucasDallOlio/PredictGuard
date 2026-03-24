"use client";
 
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  ImageIcon,
  MoreVertical,
  Search,
  User,
  Users,
  ChevronLeft,
} from "lucide-react";
 
// --- Sub-componentes ---
 
const MessageBubble = ({ message, isUserMessage, avatarSrc }) => (
  <div className={cn("flex items-start gap-3", isUserMessage ? "justify-end" : "")}>
    {!isUserMessage && (
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarImage src={avatarSrc || "/placeholder.svg"} alt="User Avatar" />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
    )}
    <div
      className={cn(
        "max-w-[70%] rounded-lg p-3",
        isUserMessage
          ? "bg-primary text-primary-foreground rounded-br-none"
          : "bg-muted rounded-bl-none"
      )}
    >
      <p className="text-sm">{message}</p>
    </div>
  </div>
);
 
const ChatContact = ({
  id,
  name,
  avatarSrc,
  lastMessage,
  timestamp,
  hasUnread,
  isActive,
  onClick,
}) => (
  <div
    className={cn(
      "hover:bg-muted flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors",
      isActive && "bg-muted"
    )}
    onClick={() => onClick(id)}
  >
    <Avatar className="shrink-0">
      <AvatarImage src={avatarSrc} alt={name} />
      <AvatarFallback>{name.charAt(0)}</AvatarFallback>
    </Avatar>
 
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between">
        <span className="font-medium truncate">{name}</span>
        <span className="text-muted-foreground text-xs whitespace-nowrap ml-2">{timestamp}</span>
      </div>
 
      <div className="text-muted-foreground flex items-center justify-between text-sm mt-1">
        <p className="truncate pr-2">{lastMessage}</p>
        {hasUnread && <div className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />}
      </div>
    </div>
  </div>
);
 
// --- Dados Fictícios ---
 
const chatContacts = [
  { id: "1", name: "Shannon Baker", avatarSrc: "/placeholder.svg?height=40&width=40", lastMessage: "Will do. Appreciate it!", timestamp: "07:39 AM", hasUnread: false },
  { id: "2", name: "Jessica Wells", avatarSrc: "/placeholder.svg?height=40&width=40", lastMessage: "Perfect. I'll pack...", timestamp: "05:39 PM", hasUnread: true },
  { id: "3", name: "Arlene Pierce", avatarSrc: "/placeholder.svg?height=40&width=40", lastMessage: "Okay, Thanks 👋", timestamp: "03:49 PM", hasUnread: false },
  { id: "4", name: "Max Alexander", avatarSrc: "/placeholder.svg?height=40&width=40", lastMessage: "I'd love that! Let's ...", timestamp: "01:59 PM", hasUnread: false },
  { id: "5", name: "Jeremiah Minsk", avatarSrc: "/placeholder.svg?height=40&width=40", lastMessage: "No problem. G... 😬", timestamp: "02:59 AM", hasUnread: false },
  { id: "6", name: "Camila Simmons", avatarSrc: "/placeholder.svg?height=40&width=40", lastMessage: "True! I'll be more c...", timestamp: "10:19 PM", hasUnread: false },
];
 
const messages = [
  { id: "m1", sender: "other", avatarSrc: "/placeholder.svg?height=32&width=32", content: "I think you should go for it. You're more than capable and it sounds like a great opportunity for growth." },
  { id: "m2", sender: "user", content: "It's a bigger company and a more challenging role. I'm worried it might be too much to handle." },
  { id: "m3", sender: "user", content: "Thanks, Mark. I needed that encouragement. I'll start working on my application tonight." },
  { id: "m4", sender: "other", avatarSrc: "/placeholder.svg?height=32&width=32", content: "Anytime! Let me know if you need any help with your resume or cover letter." },
  { id: "m5", sender: "user", content: "Will do. Appreciate it!" },
  { id: "m6", sender: "other", avatarSrc: "/placeholder.svg?height=32&width=32", content: "Did you check the job requirements?" },
  { id: "m7", sender: "user", content: "Yes, I meet most of them. Just a bit rusty on some of the older tech stack they mentioned." },
  { id: "m8", sender: "other", avatarSrc: "/placeholder.svg?height=32&width=32", content: "Don't sweat it. You learn fast." },
  { id: "m9", sender: "user", content: "True. I'll brush up on it this weekend." },
  { id: "m10", sender: "other", avatarSrc: "/placeholder.svg?height=32&width=32", content: "Let's grab a coffee next week to celebrate when you submit it!" },
];
 
// --- Componente Principal ---
 
export default function ChatApp() {
  const [activeTab, setActiveTab] = useState("personal");
  const [activeChatId, setActiveChatId] = useState(null);
 
  const currentChatUser = activeChatId
    ? chatContacts.find((c) => c.id === activeChatId)
    : chatContacts[0];
 
  return (
    // h-screen + overflow-hidden: trava o layout na viewport, sem scroll global
    <div className="flex h-screen w-full overflow-hidden bg-background">
 
      {/* --- SIDEBAR --- */}
      <div
        className={cn(
          "flex flex-col border-r w-full md:w-80 shrink-0",
          activeChatId ? "hidden md:flex" : "flex"
        )}
      >
        <div className="p-4 shrink-0">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Chat</h1>
            <Button variant="ghost" size="icon">
              <Search className="text-muted-foreground h-5 w-5" />
            </Button>
          </div>
 
          <div className="flex rounded-lg border p-1">
            <Button
              variant="ghost"
              className={cn(
                "h-9 flex-1 rounded-md text-sm font-medium",
                activeTab === "personal"
                  ? "shadow-sm bg-background"
                  : "text-muted-foreground hover:bg-transparent"
              )}
              onClick={() => setActiveTab("personal")}
            >
              <User className="mr-2 h-4 w-4" />
              Personal
            </Button>
 
            <Button
              variant="ghost"
              className={cn(
                "h-9 flex-1 rounded-md text-sm font-medium",
                activeTab === "groups"
                  ? "shadow-sm bg-background"
                  : "text-muted-foreground hover:bg-transparent"
              )}
              onClick={() => setActiveTab("groups")}
            >
              <Users className="mr-2 h-4 w-4" />
              Groups
            </Button>
          </div>
        </div>
 
        {/* Lista de contatos: flex-1 + min-h-0 + overflow-y-auto = scroll isolado aqui */}
        <div className="flex-1 overflow-y-auto px-2 min-h-0 space-y-1">
          {chatContacts.map((contact) => (
            <ChatContact
              key={contact.id}
              {...contact}
              isActive={contact.id === activeChatId}
              onClick={setActiveChatId}
            />
          ))}
        </div>
 
        <div className="p-4 border-t shrink-0">
          <Button className="w-full">New chat</Button>
        </div>
      </div>
 
      {/* --- MAIN CHAT AREA --- */}
      <div
        className={cn(
          "flex flex-1 flex-col min-w-0 min-h-0 bg-background",
          !activeChatId ? "hidden md:flex" : "flex"
        )}
      >
        {activeChatId ? (
          <>
            {/* Header fixo */}
            <div className="flex items-center justify-between border-b p-4 shrink-0 bg-background">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden mr-1"
                  onClick={() => setActiveChatId(null)}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
 
                <Avatar className="h-10 w-10">
                  <AvatarImage src={currentChatUser?.avatarSrc} alt={currentChatUser?.name} />
                  <AvatarFallback>{currentChatUser?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold">{currentChatUser?.name}</h2>
                  <p className="text-muted-foreground text-sm">last seen recently</p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <MoreVertical className="text-muted-foreground h-5 w-5" />
              </Button>
            </div>
 
            {/* Mensagens: ÚNICO elemento que rola — flex-1 + min-h-0 + overflow-y-auto */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 min-h-0">
              {messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg.content}
                  isUserMessage={msg.sender === "user"}
                  avatarSrc={msg.avatarSrc}
                />
              ))}
            </div>
 
            {/* Input fixo no rodapé */}
            <div className="p-4 border-t shrink-0 bg-background">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="shrink-0">
                  <ImageIcon className="text-muted-foreground h-5 w-5" />
                </Button>
                <Input
                  placeholder="Enter a prompt here"
                  className="flex-1 border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-muted/50"
                />
                <Button size="icon" className="rounded-full shrink-0">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center flex-col text-muted-foreground">
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <User className="h-10 w-10" />
            </div>
            <p className="text-lg font-medium">Select a chat to start messaging</p>
          </div>
        )}
      </div>
 
    </div>
  );
}