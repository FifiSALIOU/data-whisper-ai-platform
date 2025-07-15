import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Bot, 
  User, 
  Languages,
  Mic,
  MicOff,
  FileText,
  Database
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  language?: string;
}

interface ChatInterfaceProps {
  uploadedFiles: File[];
  databaseConnected: boolean;
}

const ChatInterface = ({ uploadedFiles, databaseConnected }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Bonjour ! Je suis votre assistant IA local. Je peux analyser vos documents uploadés et répondre à vos questions en français, wolof, anglais ou espagnol. Comment puis-je vous aider ?',
      sender: 'ai',
      timestamp: new Date(),
      language: 'fr'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('fr');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'wo', name: 'Wolof', flag: '🇸🇳' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulated AI responses based on language
  const getAIResponse = (userMessage: string, language: string): string => {
    const responses = {
      fr: {
        greeting: "Bonjour ! Comment puis-je vous aider avec vos documents ?",
        help: "Je peux analyser vos fichiers PDF/Word et répondre à vos questions basées sur leur contenu.",
        files: `J'ai accès à ${uploadedFiles.length} document(s) uploadé(s). Posez-moi une question sur leur contenu !`,
        database: databaseConnected ? "La base de données est connectée. Je peux analyser vos données." : "Aucune base de données connectée pour le moment.",
        default: "Je comprends votre question. Basé sur vos documents, voici ma réponse..."
      },
      wo: {
        greeting: "Asalaam aleekum! Naka nga def ak sa documents yi?",
        help: "Man naa ko defar sa fichiers PDF/Word yi te tontu sa lakk yi.",
        files: `Am naa ${uploadedFiles.length} fichier(s) yu uploadé. Lakk ma ci seen contenu!`,
        database: databaseConnected ? "Database bi connecté na. Man naa ko analyser sa données yi." : "Amul database bu connecté.",
        default: "Degoon naa sa lakk. Ci sa documents yi, men naa ko tontu..."
      },
      en: {
        greeting: "Hello! How can I help you with your documents?",
        help: "I can analyze your PDF/Word files and answer questions based on their content.",
        files: `I have access to ${uploadedFiles.length} uploaded document(s). Ask me anything about their content!`,
        database: databaseConnected ? "Database is connected. I can analyze your data." : "No database connected at the moment.",
        default: "I understand your question. Based on your documents, here's my response..."
      },
      es: {
        greeting: "¡Hola! ¿Cómo puedo ayudarte con tus documentos?",
        help: "Puedo analizar tus archivos PDF/Word y responder preguntas basadas en su contenido.",
        files: `Tengo acceso a ${uploadedFiles.length} documento(s) subido(s). ¡Pregúntame sobre su contenido!`,
        database: databaseConnected ? "La base de datos está conectada. Puedo analizar tus datos." : "No hay base de datos conectada por el momento.",
        default: "Entiendo tu pregunta. Basado en tus documentos, aquí está mi respuesta..."
      }
    };

    const langResponses = responses[language as keyof typeof responses] || responses.fr;
    
    if (userMessage.toLowerCase().includes('bonjour') || userMessage.toLowerCase().includes('hello')) {
      return langResponses.greeting;
    }
    if (userMessage.toLowerCase().includes('aide') || userMessage.toLowerCase().includes('help')) {
      return langResponses.help;
    }
    if (userMessage.toLowerCase().includes('fichier') || userMessage.toLowerCase().includes('document')) {
      return langResponses.files;
    }
    if (userMessage.toLowerCase().includes('database') || userMessage.toLowerCase().includes('base')) {
      return langResponses.database;
    }
    
    return langResponses.default;
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
      language: selectedLanguage
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // Simulate AI processing time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(inputText, selectedLanguage),
        sender: 'ai',
        timestamp: new Date(),
        language: selectedLanguage
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleVoiceRecording = () => {
    setIsListening(!isListening);
    if (!isListening) {
      toast({
        title: "Reconnaissance vocale",
        description: "Fonction en développement - Utilisez le clavier pour le moment",
      });
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[800px]">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Assistant IA Local</h3>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>🟢 En ligne</span>
              {uploadedFiles.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  <FileText className="w-3 h-3 mr-1" />
                  {uploadedFiles.length} doc(s)
                </Badge>
              )}
              {databaseConnected && (
                <Badge variant="secondary" className="text-xs">
                  <Database className="w-3 h-3 mr-1" />
                  DB connectée
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Language Selector */}
        <div className="flex items-center space-x-2">
          <Languages className="w-4 h-4 text-muted-foreground" />
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="text-sm bg-background border border-border rounded-md px-2 py-1"
          >
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.sender === 'user'
                  ? 'bg-secondary text-secondary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              <div className="flex items-start space-x-2">
                {message.sender === 'ai' && (
                  <Bot className="w-5 h-5 mt-0.5 text-primary" />
                )}
                <div className="flex-1">
                  <p className="text-sm">{message.text}</p>
                  <span className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                {message.sender === 'user' && (
                  <User className="w-5 h-5 mt-0.5" />
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg p-3 max-w-[80%]">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-primary" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200"></div>
                </div>
                <span className="text-sm text-muted-foreground">
                  L'IA analyse votre question...
                </span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex space-x-2">
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Posez votre question en ${languages.find(l => l.code === selectedLanguage)?.name}...`}
            className="flex-1 min-h-[40px] max-h-[120px] resize-none"
            disabled={isLoading}
          />
          <div className="flex flex-col space-y-2">
            <Button
              onClick={toggleVoiceRecording}
              variant="outline"
              size="sm"
              className={isListening ? 'bg-red-100' : ''}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isLoading}
              size="sm"
              className="bg-secondary hover:bg-secondary/90"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;