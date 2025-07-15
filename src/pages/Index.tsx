import { useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import WelcomeScreen from "@/components/WelcomeScreen";

const Index = () => {
  const [showLoading, setShowLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showMainApp, setShowMainApp] = useState(false);

  const handleLoadingComplete = () => {
    setShowLoading(false);
    setShowWelcome(true);
  };

  const handleGetStarted = () => {
    setShowWelcome(false);
    setShowMainApp(true);
  };

  if (showLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  if (showWelcome) {
    return <WelcomeScreen onGetStarted={handleGetStarted} />;
  }

  if (showMainApp) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-8">
          <div className="text-center space-y-6">
            <h1 className="text-4xl font-bold text-primary">
              Interface principale en développement...
            </h1>
            <p className="text-xl text-muted-foreground">
              L'interface de chat IA et d'upload de documents sera ajoutée dans la prochaine étape !
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Index;
