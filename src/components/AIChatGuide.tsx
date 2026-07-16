// src/components/AIChatGuide.tsx - Emerald/Green Theme
import { useState, useRef, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare,
  Send,
  Bot,
  User,
  X,
  Sparkles,
  Maximize2,
  Minimize2,
  ChevronDown,
  Loader2,
  Wifi,
  WifiOff,
  RefreshCw
} from 'lucide-react';
import { ChatMessage } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  getAIResponse,
  getAIResponseStream,
  getFallbackResponse,
  testGitHubConnection,
} from '../services/aiService';

const SUGGESTIONS_EN = [
  "When is Tuesday Market day and what is sold?",
  "Tell me about trekking Mount Choke biosphere",
  "What support is there for eco-lodge investors?",
  "What is the history of Digo Tsion Saint Mary?"
];

const SUGGESTIONS_AM = [
  "የማክሰኞ ገበያ ቀን መቼ ነው? ምንስ ይሸጣል?",
  "ስለ ጮቄ ተራራ ጉዞ ይንገሩኝ",
  "ለኢኮ-ሎጅ ባለሀብቶች ምን ዓይነት ድጋፍ አለ?",
  "የድጎ ጽዮን ቅድስት ማርያም ታሪክ ምንድነው?"
];

export default function AIChatGuide({ embedMode = false }: { embedMode?: boolean }) {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [streamingContent, setStreamingContent] = useState<string>('');
  const [useStreaming, setUseStreaming] = useState<boolean>(true);

  const [aiStatus, setAiStatus] = useState<{ success: boolean; message: string }>({
    success: false,
    message: 'Checking connection...'
  });
  const [isCheckingConnection, setIsCheckingConnection] = useState<boolean>(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Initialize welcome message
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: 'bot_init',
      sender: 'assistant',
      text: language === 'en'
        ? "Welcome! I am DigoAI, your resident virtual assistant for Digo Tsion and Bibugn Wereda. Ask me anything about our magnificent Choke Mountains, Tuesday Market, local Gojjam riding sports, or agribusiness investments! 🌿"
        : "እንኳን ወደ ቢቡኝ ወረዳ ድጎ ጽዮን በደህና መጡ! እኔ ዲጎ አይ (DigoAI) ነኝ፤ ስለ ጮቄ ተራራ፥ ማክሰኞ ገበያ፥ ባህላዊ የፈረስ ጉግስ ስፖርት እና የኢንቨስትመንት አማራጮች ማንኛውንም ጥያቄ ይጠይቁኝ! 🌿",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([welcomeMessage]);

    // Check AI connection
    checkConnection();
  }, [language]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, streamingContent]);

  const checkConnection = async () => {
    setIsCheckingConnection(true);
    const result = await testGitHubConnection();
    setAiStatus(result);
    setIsCheckingConnection(false);
  };

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    // User message
    const userMsg: ChatMessage = {
      id: 'user_' + Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);
    setStreamingContent('');

    const systemContext = language === 'en'
      ? 'You are DigoAI, a helpful virtual assistant for Digo Tsion and Bibugn Wereda, Ethiopia. Provide concise, informative responses about Mount Choke, cultural events, tourism, and investment opportunities. If asked about topics outside this scope, politely say you specialize in Digo Tsion and related topics.'
      : 'አንተ ዲጎአይ ነህ፣ ለድጎ ጽዮን እና ቢቡኝ ወረዳ ረዳት ነህ። ስለ ጮቄ ተራራ፣ ባህላዊ ዝግጅቶች፣ ቱሪዝም እና ኢንቨስትመንት አማራጮች አጭር እና መረጃ ሰጭ መልስ ስጥ።';

    try {
      if (useStreaming && aiStatus.success) {
        // Streaming response
        let fullResponse = '';
        let botMessageId = 'bot_' + Date.now();

        setMessages(prev => [...prev, {
          id: botMessageId,
          sender: 'assistant',
          text: '',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);

        await getAIResponseStream(
          textToSend,
          (chunk: string) => {
            fullResponse += chunk;
            setStreamingContent(fullResponse);
            setMessages(prev => {
              const updated = [...prev];
              const lastIndex = updated.length - 1;
              if (updated[lastIndex]?.id === botMessageId) {
                updated[lastIndex] = {
                  ...updated[lastIndex],
                  text: fullResponse
                };
              }
              return updated;
            });
          },
          systemContext
        );
      } else {
        // Non-streaming response
        const response = await getAIResponse(textToSend, systemContext);

        const botResponse: ChatMessage = {
          id: 'bot_' + Date.now(),
          sender: 'assistant',
          text: response,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botResponse]);
      }
    } catch (err) {
      console.warn('AI API error, using fallback:', err);
      const fallbackResponse = getFallbackResponse(textToSend);
      const botResponse: ChatMessage = {
        id: 'bot_fallback_' + Date.now(),
        sender: 'assistant',
        text: fallbackResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botResponse]);
    } finally {
      setIsLoading(false);
      setStreamingContent('');
    }
  };

  const triggerSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    handleSend(inputText);
  };

  const suggestions = language === 'en' ? SUGGESTIONS_EN : SUGGESTIONS_AM;
  const placeholderText = language === 'en'
    ? "Ask DigoAI (e.g. altitude of Mount Choke, Tuesday market honey)..."
    : "ዲጎ አይን ይጠይቁ (ለምሳሌ የጮቄ ተራራ ከፍታ፣ የማክሰኞ ገበያ ማር)...";

  // Status indicator component
  const StatusIndicator = () => (
    <div className="flex items-center gap-1.5">
      {isCheckingConnection ? (
        <Loader2 className="w-3 h-3 animate-spin text-stone-400" />
      ) : aiStatus.success ? (
        <>
          <Wifi className="w-3 h-3 text-emerald-500" />
          <span className="text-[9px] text-emerald-600 font-mono">AI Online</span>
        </>
      ) : (
        <>
          <WifiOff className="w-3 h-3 text-amber-500" />
          <span className="text-[9px] text-amber-600 font-mono">Offline Mode</span>
        </>
      )}
      <button
        onClick={checkConnection}
        disabled={isCheckingConnection}
        className="p-0.5 hover:bg-stone-200 rounded transition-all"
        title="Check connection"
      >
        <RefreshCw className={`w-3 h-3 text-stone-400 ${isCheckingConnection ? 'animate-spin' : ''}`} />
      </button>
    </div>
  );

  // Embed Mode View - Emerald Theme
  if (embedMode) {
    return (
      <div className="bg-white border border-emerald-200 rounded-3xl overflow-hidden shadow-xl h-[580px] flex flex-col">
        {/* Chat Header - Emerald Theme */}
        <div className="bg-emerald-700 p-5 border-b border-emerald-600 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center border border-white/30">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-sm font-serif font-bold text-white uppercase tracking-wider leading-none">
                {language === 'en' ? 'DigoAI Local Specialist' : 'ዲጎ አይ የአገር በቀል እውቀት መመሪያ'}
              </h4>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse"></span>
                <span className="text-[10px] text-emerald-200 font-mono">
                  {aiStatus.success ? 'AI ACTIVE' : 'OFFLINE MODE'}
                </span>
                <StatusIndicator />
              </div>
            </div>
          </div>
          <Sparkles className="w-4 h-4 text-emerald-200" />
        </div>

        {/* Suggestion Chips - Emerald Theme */}
        <div className="bg-emerald-50/40 p-3 flex flex-wrap gap-1.5 border-b border-emerald-100/60 overflow-x-auto">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSend(s)}
              className="text-[10px] bg-white hover:bg-emerald-100 text-emerald-800 font-mono py-1 px-2.5 rounded-lg border border-emerald-200 whitespace-nowrap transition-colors cursor-pointer"
            >
              🌿 {s}
            </button>
          ))}
        </div>

        {/* Messages body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-emerald-50/20">
          {messages.map(msg => {
            const isBot = msg.sender === 'assistant';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${isBot ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isBot ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                  {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${isBot
                  ? 'bg-white border border-emerald-200 text-stone-700'
                  : 'bg-emerald-600 text-white font-medium'
                  }`}>
                  <p className="font-sans whitespace-pre-wrap">{msg.text}</p>
                  <span className="text-[9px] font-mono opacity-60 block text-right mt-1.5">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}
          {isLoading && (
            <div className="flex gap-3 mr-auto">
              <div className="h-8 w-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-emerald-200 p-3 rounded-2xl flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 bg-emerald-600 rounded-full animate-bounce"></span>
                <span className="h-1.5 w-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="h-1.5 w-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Form Input - Emerald Theme */}
        <form onSubmit={triggerSubmit} className="p-4 bg-white border-t border-emerald-200 flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={placeholderText}
            className="flex-1 bg-emerald-50 text-stone-800 placeholder-stone-400 border border-emerald-200 rounded-xl p-3 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-sans"
          />
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 rounded-xl flex items-center justify-center transition-all disabled:opacity-40 cursor-pointer"
            disabled={!inputText.trim() || isLoading}
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 stroke-[2.5]" />}
          </button>
        </form>
      </div>
    );
  }

  // Floating Widget View - Emerald Theme
  return (
    <>
      <div className="fixed bottom-6 right-6 z-90">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="h-14 w-14 bg-emerald-600 hover:bg-emerald-700 hover:scale-105 active:scale-95 text-white rounded-full shadow-2xl flex items-center justify-center border-2 border-emerald-400 transition-all cursor-pointer"
        >
          {isOpen ? <X className="w-6 h-6 stroke-[2.5]" /> : <MessageSquare className="w-6 h-6 stroke-[2.5]" />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 20 }}
            className={`fixed bottom-24 right-6 z-95 bg-white border border-emerald-200 rounded-3xl overflow-hidden shadow-2xl flex flex-col transition-all ${isExpanded
              ? 'w-[420px] sm:w-[500px] h-[650px]'
              : 'w-[320px] sm:w-[380px] h-[480px]'
              }`}
          >
            {/* Header - Emerald Theme */}
            <div className="bg-emerald-700 p-4 border-b border-emerald-600 flex items-center justify-between whitespace-nowrap">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-white" />
                <div>
                  <h4 className="text-xs font-serif font-bold text-white uppercase tracking-wider">
                    {language === 'en' ? 'DigoAI Local Guide' : 'ዲጎ አይ የአከባቢ አስጎብኚ'}
                  </h4>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] text-emerald-200 font-mono">
                      {aiStatus.success ? 'AI Online' : 'Offline Mode'}
                    </span>
                    <StatusIndicator />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1.5 text-emerald-200 hover:text-white rounded-lg hover:bg-emerald-600 transition-all cursor-pointer"
                  title={isExpanded ? 'Minimize width' : 'Maximize width'}
                >
                  {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-emerald-200 hover:text-white rounded-lg hover:bg-emerald-600 transition-all cursor-pointer"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Helper Chip selector - Emerald Theme */}
            <div className="bg-emerald-50/50 p-2.5 flex gap-1.5 border-b border-emerald-100/40 overflow-x-auto scrollbar-none">
              {suggestions.slice(0, 3).map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(s)}
                  className="text-[9px] bg-white hover:bg-emerald-100 text-emerald-800 font-mono py-1 px-2 rounded-md border border-emerald-200 whitespace-nowrap cursor-pointer"
                >
                  🌿 {s.substring(0, 15) + '...'}
                </button>
              ))}
            </div>

            {/* Messages Content scroll */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-emerald-50/20">
              {messages.map(msg => {
                const isBot = msg.sender === 'assistant';
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-2 max-w-[85%] ${isBot ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
                  >
                    <div className={`h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0 ${isBot ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                      {isBot ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                    </div>

                    <div className={`p-3 rounded-2xl text-[11px] leading-relaxed ${isBot
                      ? 'bg-white border border-emerald-200 text-stone-700 font-sans'
                      : 'bg-emerald-600 text-white font-medium'
                      }`}>
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                      <span className="text-[8px] font-mono opacity-60 block text-right mt-1">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}
              {isLoading && (
                <div className="flex gap-2 mr-auto">
                  <div className="h-7 w-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="bg-white border border-emerald-200 p-2.5 rounded-2xl flex items-center gap-1">
                    <span className="h-1 bg-emerald-600 rounded-full animate-bounce w-1"></span>
                    <span className="h-1 bg-emerald-600 rounded-full animate-bounce w-1 [animation-delay:0.2s]"></span>
                    <span className="h-1 bg-emerald-600 rounded-full animate-bounce w-1 [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Small Input Area - Emerald Theme */}
            <form onSubmit={triggerSubmit} className="p-3 bg-white border-t border-emerald-200 flex gap-1.5">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={placeholderText}
                className="flex-1 bg-emerald-50 text-stone-800 placeholder-stone-400 border border-emerald-200 rounded-xl p-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans"
              />
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 rounded-xl flex items-center justify-center disabled:opacity-40 cursor-pointer"
                disabled={!inputText.trim() || isLoading}
              >
                {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5 stroke-[2.5]" />}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}