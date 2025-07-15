import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, Brain, FileText, MessageSquare, Upload, Database, Star } from "lucide-react";

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

const WelcomeScreen = ({ onGetStarted }: WelcomeScreenProps) => {
  const [isHovering, setIsHovering] = useState(false);

  const features = [
    {
      icon: Brain,
      title: "IA Locale",
      description: "Intelligence artificielle qui fonctionne uniquement avec vos données"
    },
    {
      icon: FileText,
      title: "Documents PDF/Word",
      description: "Uploadez et analysez vos documents facilement"
    },
    {
      icon: Database,
      title: "Base de données",
      description: "Connectez votre base de données pour des réponses précises"
    },
    {
      icon: MessageSquare,
      title: "Chat Multilingue",
      description: "Français, Wolof, Anglais, Espagnol et plus"
    },
    {
      icon: Star,
      title: "Système d'avis",
      description: "Partagez vos opinions et expériences"
    },
    {
      icon: Upload,
      title: "Sécurité totale",
      description: "Vos données restent locales, aucune fuite possible"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="max-w-6xl mx-auto text-center space-y-12 animate-fade-in">
        {/* Hero Section */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h1 className="text-7xl font-bold text-white mb-4 tracking-tight">
              Bienvenue dans
            </h1>
            <div className="relative">
              <h2 className="text-6xl font-bold bg-gradient-to-r from-white to-secondary bg-clip-text text-transparent">
                Plateforme_IA_CSS
              </h2>
              <div className="absolute -inset-2 bg-white/10 blur-xl rounded-lg -z-10"></div>
            </div>
          </div>
          
          <p className="text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Votre assistant IA personnel qui analyse uniquement vos données locales
            pour des réponses sécurisées et précises
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto">
                    <Icon className="w-8 h-8 text-secondary" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="space-y-8">
          <div 
            className="relative"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <Button 
              onClick={onGetStarted}
              size="lg"
              className="bg-secondary hover:bg-secondary/90 text-white px-12 py-6 text-xl font-semibold rounded-xl shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-orange-500/25"
            >
              <Bot className="w-6 h-6 mr-3" />
              Commencer maintenant
            </Button>
            
            {isHovering && (
              <div className="absolute inset-0 bg-secondary/20 rounded-xl blur-xl animate-pulse-glow -z-10"></div>
            )}
          </div>
          
          <p className="text-white/60 text-sm">
            🔒 100% sécurisé • 🌍 Multilingue • ⚡ Ultra rapide
          </p>
        </div>

        {/* Decorative Background Elements */}
        <div className="fixed inset-0 pointer-events-none -z-10">
          <div className="absolute top-1/4 left-10 w-32 h-32 bg-secondary/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-3/4 right-10 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-24 h-24 bg-secondary/15 rounded-full blur-lg animate-pulse delay-500"></div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;