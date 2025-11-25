import { useState, useEffect, useCallback } from 'react';

interface TextToSpeechHook {
    speak: (text: string) => void;
    cancel: () => void;
    isSpeaking: boolean;
    hasSynthesisSupport: boolean;
}

export const useTextToSpeech = (): TextToSpeechHook => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [synthesis, setSynthesis] = useState<SpeechSynthesis | null>(null);
    const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            setSynthesis(window.speechSynthesis);

            const loadVoices = () => {
                const voices = window.speechSynthesis.getVoices();
                // Prefer a male Portuguese voice if possible, or any Portuguese voice
                const ptVoice = voices.find(v => v.lang.includes('pt-BR') && v.name.toLowerCase().includes('google')) ||
                    voices.find(v => v.lang.includes('pt-BR'));
                setVoice(ptVoice || null);
            };

            loadVoices();
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }
    }, []);

    const speak = useCallback((text: string) => {
        if (synthesis) {
            // Cancel any current speaking
            synthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            if (voice) {
                utterance.voice = voice;
            }
            utterance.lang = 'pt-BR';
            utterance.rate = 1.0;
            utterance.pitch = 1.0;

            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);

            synthesis.speak(utterance);
        }
    }, [synthesis, voice]);

    const cancel = useCallback(() => {
        if (synthesis) {
            synthesis.cancel();
            setIsSpeaking(false);
        }
    }, [synthesis]);

    return {
        speak,
        cancel,
        isSpeaking,
        hasSynthesisSupport: !!synthesis
    };
};
