"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Mic, Volume2, Lock } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { generateMockResponse } from '@/lib/chatLogic';
import { AuthModal } from './AuthModal';
import { cn } from '@/lib/utils';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { ChatHeader } from './ChatHeader';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

export const ChatInterface = () => {
    const { user, selectedPastor } = useUser();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'assistant',
            content: `Olá! Sou o ${selectedPastor.name}. Como posso te ajudar hoje?`
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const { isListening, transcript, startListening, stopListening, resetTranscript, hasRecognitionSupport } = useSpeechRecognition();
    const { speak, cancel, isSpeaking, hasSynthesisSupport } = useTextToSpeech();

    // Update input with transcript
    useEffect(() => {
        if (transcript) {
            setInputValue(transcript);
        }
    }, [transcript]);

    // Handle Mic Click
    const handleMicClick = () => {
        if (isListening) {
            stopListening();
        } else {
            resetTranscript();
            startListening();
        }
    };

    // Handle Speaker Click (Read last assistant message)
    const handleSpeakerClick = () => {
        if (isSpeaking) {
            cancel();
        } else {
            const lastAssistantMessage = [...messages].reverse().find(m => m.role === 'assistant');
            if (lastAssistantMessage) {
                speak(lastAssistantMessage.content);
            }
        }
    };

    // Update welcome message when pastor changes
    useEffect(() => {
        // Only if the chat is empty or just has the welcome message
        if (messages.length <= 1) {
            setMessages([{
                id: 'welcome',
                role: 'assistant',
                content: `Olá! Sou o ${selectedPastor.name}. ${selectedPastor.description} Como posso te ajudar hoje?`
            }]);
        }
    }, [selectedPastor, messages.length]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        if (!user) {
            setIsAuthModalOpen(true);
            return;
        }

        const newMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: inputValue
        };

        setMessages(prev => [...prev, newMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await generateMockResponse(newMessage.content, selectedPastor);
            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response
            };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error("Error generating response", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="flex flex-col h-full max-w-4xl mx-auto w-full relative">
            <ChatHeader />

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {messages.map((msg) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                            "flex w-full",
                            msg.role === 'user' ? "justify-end" : "justify-start"
                        )}
                    >
                        <div
                            className={cn(
                                "max-w-[80%] rounded-2xl p-4 text-sm md:text-base leading-relaxed whitespace-pre-wrap shadow-sm",
                                msg.role === 'user'
                                    ? "bg-white dark:bg-zinc-800 text-grafite-profundo dark:text-white rounded-br-none"
                                    : "bg-cerulean dark:bg-zinc-900/50 border border-transparent dark:border-zinc-800 text-white dark:text-zinc-100 rounded-bl-none"
                            )}
                        >
                            {msg.role === 'assistant' && (
                                <div className="text-xs font-semibold text-white/80 dark:text-zinc-500 mb-2 uppercase tracking-wider">
                                    {selectedPastor.name}
                                </div>
                            )}
                            {msg.content}
                        </div>
                    </motion.div>
                ))}

                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start w-full"
                    >
                        <div className="bg-cerulean dark:bg-zinc-900/50 border border-transparent dark:border-zinc-800 rounded-2xl rounded-bl-none p-4 flex items-center gap-2 text-white/80 dark:text-zinc-400 text-sm shadow-sm">
                            <div className="w-2 h-2 bg-white dark:bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 bg-white dark:bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 bg-white dark:bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            <span className="ml-2">GospIA está buscando uma palavra...</span>
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 md:p-6 lg:p-8 pt-0 bg-transparent">
                <div className="w-full max-w-4xl mx-auto">
                    <div className="relative">
                        <Mic
                            size={20}
                            className={cn(
                                "absolute left-4 top-1/2 -translate-y-1/2 transition-colors cursor-pointer z-20",
                                isListening ? "text-red-500 animate-pulse" : "text-texto-cinza-claro hover:text-dourado-sol"
                            )}
                            onClick={handleMicClick}
                        />

                        <input
                            className="w-full bg-white dark:bg-zinc-900 border-borda-clara dark:border-zinc-800 rounded-full py-4 pl-12 pr-28 focus:ring-2 focus:ring-dourado-sol text-grafite-profundo dark:text-white placeholder:text-texto-cinza-claro shadow-sm"
                            placeholder={user ? "Digite sua mensagem..." : "Faça login para começar..."}
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={!user}
                        />

                        {/* Locked Overlay if not auth */}
                        {!user && (
                            <div
                                className="absolute inset-0 bg-white/60 dark:bg-black/60 z-10 flex items-center justify-center rounded-full cursor-pointer backdrop-blur-[1px]"
                                onClick={() => setIsAuthModalOpen(true)}
                            >
                                <div className="flex items-center gap-2 text-white font-medium bg-zinc-900 dark:bg-zinc-800 px-4 py-2 rounded-full shadow-lg hover:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors">
                                    <Lock size={16} />
                                    Entrar
                                </div>
                            </div>
                        )}

                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            <button
                                onClick={handleSpeakerClick}
                                className={cn(
                                    "p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors",
                                    isSpeaking ? "text-green-500" : "text-texto-cinza-claro"
                                )}
                                disabled={!hasSynthesisSupport}
                            >
                                <Volume2 size={20} />
                            </button>
                            <button
                                onClick={handleSendMessage}
                                disabled={!inputValue.trim() || isLoading}
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-cerulean dark:bg-white text-texto-branco dark:text-black hover:bg-dourado-sol dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                    <p className="text-xs text-center mt-3 text-texto-cinza-claro">GospIA pode cometer erros. Considere verificar informações importantes.</p>
                </div>
            </div>

            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </div>
    );
};
