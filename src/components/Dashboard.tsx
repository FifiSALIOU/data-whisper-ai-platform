import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  FileText, 
  Database, 
  MessageSquare, 
  Star,
  TrendingUp,
  Clock,
  Shield,
  Zap,
  Users,
  BarChart3
} from "lucide-react";

interface DashboardProps {
  uploadedFiles: File[];
  databaseConnected: boolean;
}

const Dashboard = ({ uploadedFiles, databaseConnected }: DashboardProps) => {
  const stats = {
    totalQueries: 47,
    documentsProcessed: uploadedFiles.length,
    averageResponseTime: '1.2s',
    accuracyRate: 96,
    totalUsers: 156,
    activeToday: 23
  };

  const recentActivity = [
    { time: '14:32', action: 'Document PDF analysé', file: 'rapport_2024.pdf' },
    { time: '14:28', action: 'Requête en wolof traitée', query: 'Naka nga def...' },
    { time: '14:15', action: 'Nouvelle connexion DB', database: 'users_db' },
    { time: '13:45', action: 'Chat multilingue', languages: ['FR', 'EN'] },
    { time: '13:30', action: 'Upload réussi', file: 'contrat.docx' }
  ];

  const aiCapabilities = [
    { name: 'Traitement PDF', progress: 98, color: 'bg-green-500' },
    { name: 'Analyse Word', progress: 95, color: 'bg-blue-500' },
    { name: 'Français', progress: 99, color: 'bg-purple-500' },
    { name: 'Wolof', progress: 85, color: 'bg-yellow-500' },
    { name: 'Anglais', progress: 97, color: 'bg-red-500' },
    { name: 'Espagnol', progress: 92, color: 'bg-indigo-500' }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-hero rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Tableau de Bord IA
            </h1>
            <p className="text-white/80 text-lg">
              Votre assistant IA personnel est prêt à analyser vos données
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{new Date().toLocaleDateString()}</div>
            <div className="text-white/60">{new Date().toLocaleTimeString()}</div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Requêtes Totales</p>
                <p className="text-2xl font-bold text-blue-900">{stats.totalQueries}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Documents</p>
                <p className="text-2xl font-bold text-green-900">{stats.documentsProcessed}</p>
              </div>
              <FileText className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Temps Réponse</p>
                <p className="text-2xl font-bold text-purple-900">{stats.averageResponseTime}</p>
              </div>
              <Zap className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">Précision</p>
                <p className="text-2xl font-bold text-orange-900">{stats.accuracyRate}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>État du Système</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-green-600" />
                <span>IA Locale</span>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                🟢 Active
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span>Traitement Documents</span>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                🟢 Opérationnel
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Database className="w-5 h-5 text-purple-600" />
                <span>Base de Données</span>
              </div>
              <Badge variant={databaseConnected ? "secondary" : "outline"} 
                     className={databaseConnected ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}>
                {databaseConnected ? '🟢 Connectée' : '🔴 Non connectée'}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-orange-600" />
                <span>Chat Multilingue</span>
              </div>
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                🟢 4 langues
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Capacités IA</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {aiCapabilities.map((capability, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{capability.name}</span>
                  <span className="text-sm text-muted-foreground">{capability.progress}%</span>
                </div>
                <Progress value={capability.progress} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Activité Récente</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
                <div className="text-sm text-muted-foreground font-mono">
                  {activity.time}
                </div>
                <div className="flex-1">
                  <span className="font-medium">{activity.action}</span>
                  {activity.file && (
                    <span className="text-sm text-muted-foreground ml-2">
                      ({activity.file})
                    </span>
                  )}
                  {activity.query && (
                    <span className="text-sm text-muted-foreground ml-2 italic">
                      "{activity.query}"
                    </span>
                  )}
                  {activity.database && (
                    <span className="text-sm text-muted-foreground ml-2">
                      ({activity.database})
                    </span>
                  )}
                  {activity.languages && (
                    <div className="flex space-x-1 mt-1">
                      {activity.languages.map(lang => (
                        <Badge key={lang} variant="outline" className="text-xs">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center p-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="font-semibold mb-2">100% Sécurisé</h3>
          <p className="text-sm text-muted-foreground">
            Vos données restent locales, aucune fuite possible
          </p>
        </Card>

        <Card className="text-center p-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="font-semibold mb-2">Ultra Rapide</h3>
          <p className="text-sm text-muted-foreground">
            Réponses instantanées avec traitement local
          </p>
        </Card>

        <Card className="text-center p-6">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="font-semibold mb-2">Multilingue</h3>
          <p className="text-sm text-muted-foreground">
            Support français, wolof, anglais, espagnol
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;