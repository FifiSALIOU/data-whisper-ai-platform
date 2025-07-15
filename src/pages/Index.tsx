import { useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import WelcomeScreen from "@/components/WelcomeScreen";
import Navigation from "@/components/Navigation";
import Dashboard from "@/components/Dashboard";
import ChatInterface from "@/components/ChatInterface";
import FileUpload from "@/components/FileUpload";
import DatabaseConnection from "@/components/DatabaseConnection";
import ReviewsSection from "@/components/ReviewsSection";

const Index = () => {
  const [showLoading, setShowLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showMainApp, setShowMainApp] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [databaseConnected, setDatabaseConnected] = useState(false);

  const handleLoadingComplete = () => {
    setShowLoading(false);
    setShowWelcome(true);
  };

  const handleGetStarted = () => {
    setShowWelcome(false);
    setShowMainApp(true);
  };

  const handleFilesUploaded = (files: File[]) => {
    setUploadedFiles(files);
  };

  const handleDatabaseConnection = (connected: boolean) => {
    setDatabaseConnected(connected);
  };

  const renderMainContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard uploadedFiles={uploadedFiles} databaseConnected={databaseConnected} />;
      case 'chat':
        return <ChatInterface uploadedFiles={uploadedFiles} databaseConnected={databaseConnected} />;
      case 'upload':
        return <FileUpload onFilesUploaded={handleFilesUploaded} />;
      case 'database':
        return <DatabaseConnection onConnectionChange={handleDatabaseConnection} />;
      case 'reviews':
        return <ReviewsSection />;
      default:
        return <Dashboard uploadedFiles={uploadedFiles} databaseConnected={databaseConnected} />;
    }
  };

  if (showLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  if (showWelcome) {
    return <WelcomeScreen onGetStarted={handleGetStarted} />;
  }

  if (showMainApp) {
    return (
      <div className="min-h-screen bg-background flex">
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 lg:ml-64 p-6">
          {renderMainContent()}
        </main>
      </div>
    );
  }

  return null;
};

export default Index;
