"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, Volume2, Lock } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { generateMockResponse } from '@/lib/chatLogic';
import { AuthModal } from './AuthModal';
import { cn } from '@/lib/utils';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';

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
    }, [selectedPastor]);

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
        <div className="flex flex-col h-full max-w-4xl mx-auto w-full">
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
                                "max-w-[80%] rounded-2xl p-4 text-sm md:text-base leading-relaxed whitespace-pre-wrap",
                                msg.role === 'user'
                                    ? "bg-zinc-800 text-white rounded-br-none"
                                    : "bg-zinc-900/50 border border-zinc-800 text-zinc-100 rounded-bl-none"
                            )}
                        >
                            {msg.role === 'assistant' && (
                                <div className="text-xs font-semibold text-zinc-500 mb-2 uppercase tracking-wider">
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
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl rounded-bl-none p-4 flex items-center gap-2 text-zinc-400 text-sm">
                            <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            <span className="ml-2">GospIA está buscando uma palavra...</span>
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-zinc-800 bg-black/50 backdrop-blur-md">
                <div className="relative flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl p-2 focus-within:border-zinc-600 transition-colors">

                    {/* Locked Overlay if not auth */}
                    {!user && (
                        <div
                            className="absolute inset-0 bg-black/60 z-10 flex items-center justify-center rounded-xl cursor-pointer backdrop-blur-[1px]"
                            onClick={() => setIsAuthModalOpen(true)}
                        >
                            <div className="flex items-center gap-2 text-white font-medium bg-zinc-800 px-4 py-2 rounded-full shadow-lg hover:bg-zinc-700 transition-colors">
                                <Lock size={16} />
                                Entrar para conversar
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleMicClick}
                        className={cn(
                            "p-2 transition-colors rounded-lg hover:bg-zinc-800",
                            isListening ? "text-red-500 animate-pulse" : "text-zinc-400 hover:text-white"
                        )}
                        disabled={!hasRecognitionSupport}
                        title={hasRecognitionSupport ? "Falar" : "Navegador não suporta reconhecimento de voz"}
                    >
                        <Mic size={20} />
                    </button>

                    <textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={user ? "Digite sua mensagem..." : "Faça login para começar..."}
                        className="flex-1 bg-transparent text-white placeholder-zinc-500 focus:outline-none resize-none max-h-32 py-2"
                        rows={1}
                        disabled={!user}
                    />

                    <button
                        onClick={handleSpeakerClick}
                        className={cn(
                            "p-2 transition-colors rounded-lg hover:bg-zinc-800",
                            isSpeaking ? "text-green-500" : "text-zinc-400 hover:text-white"
                        )}
                        disabled={!hasSynthesisSupport}
                        title={hasSynthesisSupport ? "Ouvir última mensagem" : "Navegador não suporta síntese de voz"}
                    >
                        <Volume2 size={20} />
                    </button>

                    <button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || isLoading}
                        className="p-2 bg-white text-black rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send size={20} />
                    </button>
                </div>
                <div className="text-center mt-2 text-xs text-zinc-600">
                    GospIA pode cometer erros. Considere verificar informações importantes.
                </div>
            </div>

            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </div>
    );
};
