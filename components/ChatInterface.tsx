'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { generateMockResponse } from '@/lib/chatLogic';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { ChatHeader } from './ChatHeader';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

export const ChatInterface = () => {
    const { user, tier, selectedPastor } = useUser();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'assistant',
            content: `Olá! Sou o ${selectedPastor.name}. Como posso te ajudar hoje?`
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { speak, isSpeaking, cancel } = useTextToSpeech();
    const { isListening, startListening, stopListening, hasRecognitionSupport, transcript, resetTranscript } = useSpeechRecognition();

    const sendMessage = async (text: string) => {
        const newMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: text
        };

        setMessages(prev => [...prev, newMessage]);
        setIsLoading(true);

        try {
            const response = await generateMockResponse(text, selectedPastor);
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

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    useEffect(() => {
        if (transcript) {
            setInput(transcript);
        }
    }, [transcript]);

    const handleSend = async () => {
        if (!input.trim()) return;
        const currentInput = input;
        setInput('');
        await sendMessage(currentInput);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const toggleListening = () => {
        if (isListening) {
            stopListening();
        } else {
            resetTranscript();
            startListening();
        }
    };

    const toggleSpeech = (text: string) => {
        if (isSpeaking) {
            cancel();
        } else {
            speak(text);
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full relative">
            {/* Header */}
            <header className="flex items-center justify-between p-4 border-b border-b-transparent lg:border-none">
                <button className="p-2 rounded-lg lg:hidden hover:bg-gray-100" id="menu-btn">
                    <span className="material-symbols-outlined">menu</span>
                </button>
                <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                    <span className="text-lg font-semibold">{selectedPastor.name}</span>
                    <span className="material-symbols-outlined">expand_more</span>
                </div>
                <button className="p-2 rounded-lg lg:hidden opacity-0" disabled>
                    <span className="material-symbols-outlined">menu</span>
                </button>
            </header>

            {/* Messages Area */}
            <div className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 overflow-y-auto">
                <div className="w-full max-w-4xl mx-auto flex flex-col gap-4 justify-end min-h-full">
                    {messages.length === 0 ? (
                        <div className="flex">
                            <div className="bg-cerulean rounded-lg p-4 max-w-2xl">
                                <p className="font-bold text-sm uppercase tracking-wider text-white/80 mb-2">{selectedPastor.name}</p>
                                <p className="text-texto-branco">{selectedPastor.description}</p>
                            </div>
                        </div>
                    ) : (
                        messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`rounded-lg p-4 max-w-2xl ${msg.role === 'user'
                                    ? 'bg-white text-grafite-profundo border border-borda-clara'
                                    : 'bg-cerulean text-texto-branco'
                                    }`}>
                                    {msg.role === 'assistant' && (
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="font-bold text-sm uppercase tracking-wider text-white/80">{selectedPastor.name}</p>
                                            <button
                                                onClick={() => toggleSpeech(msg.content)}
                                                className="p-1 hover:bg-white/10 rounded-full transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-sm">
                                                    {isSpeaking ? 'volume_off' : 'volume_up'}
                                                </span>
                                            </button>
                                        </div>
                                    )}
                                    <p className="whitespace-pre-wrap">{msg.content}</p>
                                </div>
                            </div>
                        ))
                    )}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-cerulean rounded-lg p-4 max-w-2xl">
                                <p className="font-bold text-sm uppercase tracking-wider text-white/80 mb-2">{selectedPastor.name}</p>
                                <div className="flex gap-2">
                                    <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                    <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                    <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <footer className="p-4 md:p-6 lg:p-8 pt-0">
                <div className="w-full max-w-4xl mx-auto">
                    {/* Locked Overlay for Free Tier accessing Pro Pastors */}
                    {tier === 'Free' && selectedPastor.tier === 'Pro' ? (
                        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
                            <div className="bg-white p-6 rounded-xl shadow-xl text-center max-w-md mx-4">
                                <span className="material-symbols-outlined text-4xl text-dourado-sol mb-2">lock</span>
                                <h3 className="text-xl font-bold text-grafite-profundo mb-2">Pastor Exclusivo Pro</h3>
                                <p className="text-texto-cinza-claro mb-4">Faça upgrade para conversar com {selectedPastor.name} e desbloquear todos os pastores.</p>
                                <a href="/pricing" className="inline-flex items-center justify-center px-6 py-3 bg-dourado-sol text-white font-semibold rounded-lg hover:bg-dourado-sol/90 transition-colors">
                                    Assinar Pro
                                </a>
                            </div>
                        </div>
                    ) : null}

                    <div className="relative">
                        <button
                            onClick={toggleListening}
                            className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isListening ? 'text-red-500 animate-pulse' : 'text-texto-cinza-claro hover:text-cerulean'}`}
                        >
                            <span className="material-symbols-outlined">mic</span>
                        </button>

                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={isListening ? "Ouvindo..." : "Digite sua mensagem..."}
                            className="w-full bg-white border-borda-clara rounded-full py-4 pl-12 pr-28 focus:ring-2 focus:ring-dourado-sol text-grafite-profundo placeholder:text-texto-cinza-claro shadow-sm outline-none transition-all"
                            disabled={isLoading || (tier === 'Free' && selectedPastor.tier === 'Pro')}
                        />

                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            <button className="p-2 rounded-full hover:bg-gray-100 text-texto-cinza-claro transition-colors">
                                <span className="material-symbols-outlined">volume_up</span>
                            </button>
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-cerulean text-texto-branco hover:bg-dourado-sol transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="material-symbols-outlined">send</span>
                            </button>
                        </div>
                    </div>
                    <p className="text-xs text-center mt-3 text-texto-cinza-claro">GospIA pode cometer erros. Considere verificar informações importantes.</p>
                </div>
            </footer>
        </div>
    );
};
