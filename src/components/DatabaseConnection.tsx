import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Database, 
  Plus, 
  Play, 
  Check, 
  AlertCircle,
  Table,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DatabaseConnectionProps {
  onConnectionChange: (connected: boolean) => void;
}

interface DatabaseConfig {
  type: 'mysql' | 'postgresql' | 'sqlite' | 'mongodb';
  host: string;
  port: string;
  database: string;
  username: string;
  password: string;
}

interface QueryResult {
  query: string;
  result: any[];
  timestamp: Date;
}

const DatabaseConnection = ({ onConnectionChange }: DatabaseConnectionProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [config, setConfig] = useState<DatabaseConfig>({
    type: 'mysql',
    host: 'localhost',
    port: '3306',
    database: '',
    username: '',
    password: ''
  });
  const [customQuery, setCustomQuery] = useState('');
  const [queryResults, setQueryResults] = useState<QueryResult[]>([]);
  const [tables, setTables] = useState<string[]>([]);
  const { toast } = useToast();

  const databaseTypes = [
    { value: 'mysql', label: 'MySQL', defaultPort: '3306' },
    { value: 'postgresql', label: 'PostgreSQL', defaultPort: '5432' },
    { value: 'sqlite', label: 'SQLite', defaultPort: '' },
    { value: 'mongodb', label: 'MongoDB', defaultPort: '27017' }
  ];

  const handleConnect = async () => {
    if (!config.database || !config.username) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    setIsConnecting(true);

    // Simulation de connexion
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% de chance de succès
      
      if (success) {
        setIsConnected(true);
        setTables(['users', 'products', 'orders', 'categories', 'reviews']);
        onConnectionChange(true);
        toast({
          title: "Connexion réussie",
          description: `Connecté à la base de données ${config.database}`,
        });
      } else {
        toast({
          title: "Erreur de connexion",
          description: "Impossible de se connecter à la base de données",
          variant: "destructive"
        });
      }
      
      setIsConnecting(false);
    }, 2000);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setTables([]);
    setQueryResults([]);
    onConnectionChange(false);
    toast({
      title: "Déconnexion",
      description: "Déconnecté de la base de données",
    });
  };

  const executeQuery = async () => {
    if (!customQuery.trim()) {
      toast({
        title: "Requête vide",
        description: "Veuillez saisir une requête SQL",
        variant: "destructive"
      });
      return;
    }

    // Simulation d'exécution de requête
    const mockResults = [
      { id: 1, name: 'Utilisateur 1', email: 'user1@example.com', created_at: '2024-01-15' },
      { id: 2, name: 'Utilisateur 2', email: 'user2@example.com', created_at: '2024-01-16' },
      { id: 3, name: 'Utilisateur 3', email: 'user3@example.com', created_at: '2024-01-17' }
    ];

    const newResult: QueryResult = {
      query: customQuery,
      result: mockResults,
      timestamp: new Date()
    };

    setQueryResults(prev => [newResult, ...prev.slice(0, 4)]); // Garde seulement les 5 derniers
    setCustomQuery('');

    toast({
      title: "Requête exécutée",
      description: `${mockResults.length} résultat(s) trouvé(s)`,
    });
  };

  const suggestedQueries = [
    "SELECT * FROM users LIMIT 10",
    "SELECT COUNT(*) FROM products",
    "SELECT * FROM orders WHERE date >= '2024-01-01'",
    "SELECT category, COUNT(*) FROM products GROUP BY category"
  ];

  return (
    <div className="space-y-6">
      {/* Connection Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Database className="w-5 h-5" />
              <span>Connexion Base de Données</span>
            </div>
            {isConnected && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Check className="w-4 h-4 mr-1" />
                Connecté
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isConnected ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="db-type">Type de base de données</Label>
                  <select
                    id="db-type"
                    value={config.type}
                    onChange={(e) => {
                      const newType = e.target.value as DatabaseConfig['type'];
                      const defaultPort = databaseTypes.find(t => t.value === newType)?.defaultPort || '';
                      setConfig(prev => ({ ...prev, type: newType, port: defaultPort }));
                    }}
                    className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
                  >
                    {databaseTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="db-name">Nom de la base *</Label>
                  <Input
                    id="db-name"
                    value={config.database}
                    onChange={(e) => setConfig(prev => ({ ...prev, database: e.target.value }))}
                    placeholder="ma_base_de_donnees"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="db-host">Hôte</Label>
                  <Input
                    id="db-host"
                    value={config.host}
                    onChange={(e) => setConfig(prev => ({ ...prev, host: e.target.value }))}
                    placeholder="localhost"
                  />
                </div>
                
                <div>
                  <Label htmlFor="db-port">Port</Label>
                  <Input
                    id="db-port"
                    value={config.port}
                    onChange={(e) => setConfig(prev => ({ ...prev, port: e.target.value }))}
                    placeholder="3306"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="db-username">Nom d'utilisateur *</Label>
                  <Input
                    id="db-username"
                    value={config.username}
                    onChange={(e) => setConfig(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="username"
                  />
                </div>
                
                <div>
                  <Label htmlFor="db-password">Mot de passe</Label>
                  <Input
                    id="db-password"
                    type="password"
                    value={config.password}
                    onChange={(e) => setConfig(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <Button
                onClick={handleConnect}
                disabled={isConnecting}
                className="w-full bg-secondary hover:bg-secondary/90"
              >
                {isConnecting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Connexion en cours...
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4 mr-2" />
                    Se connecter
                  </>
                )}
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-green-900">Connexion active</h4>
                    <p className="text-sm text-green-700">
                      {config.type.toUpperCase()} - {config.database}@{config.host}:{config.port}
                    </p>
                  </div>
                </div>
                <Button onClick={handleDisconnect} variant="outline" size="sm">
                  Déconnecter
                </Button>
              </div>

              {/* Tables List */}
              {tables.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center">
                    <Table className="w-4 h-4 mr-2" />
                    Tables disponibles ({tables.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {tables.map(table => (
                      <Badge key={table} variant="outline" className="cursor-pointer hover:bg-muted">
                        {table}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Query Interface */}
      {isConnected && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Play className="w-5 h-5" />
              <span>Exécuter des requêtes</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Custom Query */}
            <div>
              <Label htmlFor="custom-query">Requête SQL personnalisée</Label>
              <Textarea
                id="custom-query"
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
                placeholder="SELECT * FROM users WHERE..."
                className="mt-1 font-mono text-sm"
                rows={3}
              />
              <Button
                onClick={executeQuery}
                className="mt-2 bg-secondary hover:bg-secondary/90"
                size="sm"
              >
                <Play className="w-4 h-4 mr-2" />
                Exécuter
              </Button>
            </div>

            {/* Suggested Queries */}
            <div>
              <Label>Requêtes suggérées</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                {suggestedQueries.map((query, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setCustomQuery(query)}
                    className="text-left justify-start h-auto p-2"
                  >
                    <code className="text-xs">{query}</code>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Query Results */}
      {queryResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Résultats des requêtes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {queryResults.map((result, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      {result.query}
                    </code>
                    <span className="text-xs text-muted-foreground">
                      {result.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="bg-muted/50 rounded p-3 max-h-40 overflow-auto">
                    <pre className="text-xs">
                      {JSON.stringify(result.result, null, 2)}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DatabaseConnection;