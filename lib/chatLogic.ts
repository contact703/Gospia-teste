import { Pastor } from './personas';



const SAFETY_KEYWORDS = ['suicídio', 'suicidio', 'se matar', 'me matar', 'morte', 'morrer', 'cortar', 'abuso', 'violência', 'violencia'];

const SAFETY_RESPONSE = `🚨 **ATENÇÃO: Risco Identificado**

Sua vida é preciosa. Por favor, busque ajuda imediata:

*   **SAMU:** 192
*   **Polícia:** 190
*   **Bombeiros:** 193
*   **CVV:** 188 (Apoio Emocional 24h)

Não hesite em ligar para esses números. Deus te ama e há esperança.`;

export async function generateMockResponse(userMessage: string, pastor: Pastor): Promise<string> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const lowerMsg = userMessage.toLowerCase();

    // 1. Safety Protocol
    if (SAFETY_KEYWORDS.some(keyword => lowerMsg.includes(keyword))) {
        return SAFETY_RESPONSE;
    }

    // 2. Persona-based response
    // This is a very simple mock. In a real app, this would call an LLM.

    let intro = `A paz do Senhor. Sou o ${pastor.name}.`;
    let body = "Entendo o que você está passando. A Bíblia nos ensina a confiar no Senhor em todos os momentos.";
    let scripture = "> \"Confia no Senhor de todo o teu coração e não te estribes no teu próprio entendimento.\" (Provérbios 3:5)";
    const prayer = "Vamos orar: Senhor, abençoe esta vida, traga paz e direção. Em nome de Jesus, Amém.";

    if (pastor.id === 'eduardo') {
        intro = "Graça e paz. Vamos olhar para as Escrituras com profundidade.";
        body = "A teologia reformada nos lembra da soberania de Deus sobre todas as coisas.";
        scripture = "> \"Porque dele, e por ele, e para ele são todas as coisas.\" (Romanos 11:36)";
    } else if (pastor.id === 'mario') {
        intro = "Olá, família. Como posso ajudar seu lar hoje?";
        body = "A família é o primeiro ministério. Precisamos cuidar do nosso lar com amor e paciência.";
    } else if (pastor.id === 'tiago') {
        intro = "E aí! Tamo junto.";
        body = "A vida é cheia de desafios, mas você tem um propósito gigante.";
    }

    return `${intro}\n\n${body}\n\n${scripture}\n\n${prayer}`;
}
