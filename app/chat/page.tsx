import { ChatInterface } from "@/components/ChatInterface";

export default function ChatPage() {
    return (
        <main className="flex h-[100dvh] flex-col items-center justify-between p-4 md:p-8 bg-black overflow-hidden">
            <ChatInterface />
        </main>
    );
}
