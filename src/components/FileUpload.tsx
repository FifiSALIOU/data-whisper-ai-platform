import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  FileText, 
  File, 
  X, 
  Check,
  AlertCircle,
  Download,
  Eye
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onFilesUploaded: (files: File[]) => void;
}

interface UploadedFile {
  file: File;
  status: 'uploading' | 'processing' | 'ready' | 'error';
  progress: number;
  extractedText?: string;
  error?: string;
}

const FileUpload = ({ onFilesUploaded }: FileUploadProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const acceptedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      if (!acceptedTypes.includes(file.type)) {
        toast({
          title: "Fichier non supporté",
          description: `${file.name} n'est pas un format supporté`,
          variant: "destructive"
        });
        return false;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "Fichier trop volumineux",
          description: `${file.name} dépasse la limite de 10MB`,
          variant: "destructive"
        });
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    const newFiles: UploadedFile[] = validFiles.map(file => ({
      file,
      status: 'uploading',
      progress: 0
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
    processFiles(newFiles);
    onFilesUploaded(validFiles);
  };

  const processFiles = async (files: UploadedFile[]) => {
    for (const uploadedFile of files) {
      try {
        // Simulate upload progress
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setUploadedFiles(prev => 
            prev.map(f => 
              f.file === uploadedFile.file 
                ? { ...f, progress }
                : f
            )
          );
        }

        // Change to processing
        setUploadedFiles(prev => 
          prev.map(f => 
            f.file === uploadedFile.file 
              ? { ...f, status: 'processing', progress: 100 }
              : f
          )
        );

        // Simulate text extraction
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const extractedText = await extractText(uploadedFile.file);
        
        setUploadedFiles(prev => 
          prev.map(f => 
            f.file === uploadedFile.file 
              ? { ...f, status: 'ready', extractedText }
              : f
          )
        );

        toast({
          title: "Fichier traité",
          description: `${uploadedFile.file.name} est prêt pour l'analyse IA`,
        });

      } catch (error) {
        setUploadedFiles(prev => 
          prev.map(f => 
            f.file === uploadedFile.file 
              ? { ...f, status: 'error', error: 'Erreur lors du traitement' }
              : f
          )
        );
        
        toast({
          title: "Erreur",
          description: `Impossible de traiter ${uploadedFile.file.name}`,
          variant: "destructive"
        });
      }
    }
  };

  const extractText = async (file: File): Promise<string> => {
    // Simulation d'extraction de texte
    // Dans une vraie application, on utiliserait des libraries comme pdf-parse, mammoth, etc.
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (file.type === 'text/plain') {
          resolve(reader.result as string);
        } else {
          // Simulation pour PDF/Word
          resolve(`Contenu extrait de ${file.name}:\n\nCeci est un exemple de texte extrait du document. L'IA peut maintenant analyser ce contenu et répondre à vos questions basées sur cette information.`);
        }
      };
      
      if (file.type === 'text/plain') {
        reader.readAsText(file);
      } else {
        // Pour PDF/Word, on simule juste le contenu
        setTimeout(() => resolve(`Contenu extrait de ${file.name}`), 1000);
      }
    });
  };

  const removeFile = (fileToRemove: File) => {
    setUploadedFiles(prev => prev.filter(f => f.file !== fileToRemove));
    const remainingFiles = uploadedFiles
      .filter(f => f.file !== fileToRemove)
      .map(f => f.file);
    onFilesUploaded(remainingFiles);
  };

  const getFileIcon = (file: File) => {
    if (file.type === 'application/pdf') return '📄';
    if (file.type.includes('word')) return '📝';
    if (file.type === 'text/plain') return '📄';
    return '📄';
  };

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return <div className="w-4 h-4 border-2 border-secondary border-t-transparent rounded-full animate-spin" />;
      case 'ready':
        return <Check className="w-4 h-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
    }
  };

  const getStatusText = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading': return 'Upload en cours...';
      case 'processing': return 'Traitement IA...';
      case 'ready': return 'Prêt';
      case 'error': return 'Erreur';
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="w-5 h-5" />
            <span>Upload de Documents</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
              isDragging
                ? 'border-secondary bg-secondary/10'
                : 'border-border hover:border-secondary/50'
            }`}
          >
            <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Glissez vos documents ici
            </h3>
            <p className="text-muted-foreground mb-4">
              Formats supportés: PDF, Word (.doc, .docx), Texte (.txt)
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Taille maximale: 10MB par fichier
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
            >
              <FileText className="w-4 h-4 mr-2" />
              Choisir des fichiers
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <File className="w-5 h-5" />
                <span>Documents Uploadés ({uploadedFiles.length})</span>
              </div>
              <Badge variant="secondary">
                {uploadedFiles.filter(f => f.status === 'ready').length} prêt(s)
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadedFiles.map((uploadedFile, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getFileIcon(uploadedFile.file)}</span>
                      <div>
                        <h4 className="font-medium text-sm">{uploadedFile.file.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(uploadedFile.status)}
                      <span className="text-sm">{getStatusText(uploadedFile.status)}</span>
                      <Button
                        onClick={() => removeFile(uploadedFile.file)}
                        variant="ghost"
                        size="sm"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {(uploadedFile.status === 'uploading' || uploadedFile.status === 'processing') && (
                    <Progress value={uploadedFile.progress} className="h-2" />
                  )}
                  
                  {uploadedFile.status === 'error' && (
                    <div className="text-red-600 text-sm mt-2">
                      {uploadedFile.error}
                    </div>
                  )}
                  
                  {uploadedFile.status === 'ready' && uploadedFile.extractedText && (
                    <div className="mt-3 p-3 bg-muted rounded-md">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Aperçu du contenu extrait:</span>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-3">
                        {uploadedFile.extractedText.substring(0, 200)}...
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FileUpload;