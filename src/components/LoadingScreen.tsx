import { useEffect, useState } from "react";
import { Bot, Brain, FileText } from "lucide-react";

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { text: "Initialisation de l'IA...", icon: Brain },
    { text: "Préparation de l'interface...", icon: Bot },
    { text: "Chargement des fonctionnalités...", icon: FileText },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 2;
        
        // Change step based on progress
        if (newProgress >= 33 && currentStep === 0) {
          setCurrentStep(1);
        } else if (newProgress >= 66 && currentStep === 1) {
          setCurrentStep(2);
        }
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return newProgress;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [currentStep, onComplete]);

  const CurrentIcon = steps[currentStep].icon;

  return (
    <div className="fixed inset-0 bg-gradient-hero flex items-center justify-center z-50">
      <div className="text-center space-y-8 animate-fade-in">
        {/* Logo/Title */}
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-white mb-2">
            Plateforme_IA_CSS
          </h1>
          <p className="text-xl text-white/80">
            Intelligence Artificielle Locale Avancée
          </p>
        </div>

        {/* Animated Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center animate-pulse-glow">
              <CurrentIcon className="w-12 h-12 text-white animate-scale-in" />
            </div>
            {/* Rotating ring */}
            <div className="absolute inset-0 w-24 h-24 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-80 mx-auto space-y-4">
          <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-white to-secondary transition-all duration-300 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Current Step */}
          <div className="flex items-center justify-center space-x-2 text-white/90">
            <CurrentIcon className="w-5 h-5" />
            <span className="text-lg">{steps[currentStep].text}</span>
          </div>
          
          {/* Progress Percentage */}
          <div className="text-white/60 text-sm">
            {progress}%
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-secondary/50 rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-32 left-40 w-2 h-2 bg-white/40 rounded-full animate-pulse delay-700"></div>
        <div className="absolute bottom-20 right-20 w-4 h-4 bg-secondary/40 rounded-full animate-pulse delay-500"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;