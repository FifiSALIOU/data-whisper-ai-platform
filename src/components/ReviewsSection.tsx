import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  Send,
  Filter,
  TrendingUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  date: Date;
  likes: number;
  dislikes: number;
  language: string;
  category: 'ui' | 'ai' | 'performance' | 'features' | 'general';
}

const ReviewsSection = () => {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      userName: 'Amadou Diallo',
      rating: 5,
      title: 'Excellent pour l\'analyse de documents',
      comment: 'Cette plateforme IA est vraiment impressionnante ! Elle analyse mes documents PDF en français et en wolof avec une précision remarquable. L\'interface est intuitive et les réponses sont très pertinentes.',
      date: new Date('2024-01-15'),
      likes: 12,
      dislikes: 1,
      language: 'fr',
      category: 'ai'
    },
    {
      id: '2',
      userName: 'Fatou Sow',
      rating: 4,
      title: 'Dañuy def ci wolof!',
      comment: 'IA bi dañ ko def lool! Man naa ko jënd ak sama documents yi te mu tontu ci wolof. Waaye bëgg naa ni ñu yokk ko lu gën a gàcce.',
      date: new Date('2024-01-14'),
      likes: 8,
      dislikes: 0,
      language: 'wo',
      category: 'features'
    },
    {
      id: '3',
      userName: 'John Smith',
      rating: 5,
      title: 'Perfect for multilingual document analysis',
      comment: 'Amazing platform! The AI understands multiple languages perfectly and provides accurate responses based on uploaded documents. The local processing is a great security feature.',
      date: new Date('2024-01-13'),
      likes: 15,
      dislikes: 2,
      language: 'en',
      category: 'ai'
    },
    {
      id: '4',
      userName: 'Maria Garcia',
      rating: 4,
      title: 'Excelente para el análisis de documentos',
      comment: 'La plataforma es muy buena para analizar documentos en español. La IA local es rápida y segura. Me gusta mucho la interfaz de usuario, aunque podría mejorar la velocidad de carga.',
      date: new Date('2024-01-12'),
      likes: 6,
      dislikes: 1,
      language: 'es',
      category: 'ui'
    }
  ]);

  const [newReview, setNewReview] = useState({
    userName: '',
    rating: 5,
    title: '',
    comment: '',
    language: 'fr',
    category: 'general' as Review['category']
  });

  const [filter, setFilter] = useState<{
    rating?: number;
    category?: Review['category'];
    language?: string;
  }>({});

  const { toast } = useToast();

  const categories = [
    { value: 'general', label: 'Général', icon: '💬' },
    { value: 'ai', label: 'IA', icon: '🤖' },
    { value: 'ui', label: 'Interface', icon: '🎨' },
    { value: 'performance', label: 'Performance', icon: '⚡' },
    { value: 'features', label: 'Fonctionnalités', icon: '✨' },
  ];

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'wo', name: 'Wolof', flag: '🇸🇳' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
  ];

  const handleSubmitReview = () => {
    if (!newReview.userName.trim() || !newReview.title.trim() || !newReview.comment.trim()) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    const review: Review = {
      id: Date.now().toString(),
      ...newReview,
      date: new Date(),
      likes: 0,
      dislikes: 0
    };

    setReviews(prev => [review, ...prev]);
    setNewReview({
      userName: '',
      rating: 5,
      title: '',
      comment: '',
      language: 'fr',
      category: 'general'
    });

    toast({
      title: "Avis ajouté",
      description: "Merci pour votre retour !",
    });
  };

  const handleLike = (reviewId: string) => {
    setReviews(prev => 
      prev.map(review => 
        review.id === reviewId 
          ? { ...review, likes: review.likes + 1 }
          : review
      )
    );
  };

  const handleDislike = (reviewId: string) => {
    setReviews(prev => 
      prev.map(review => 
        review.id === reviewId 
          ? { ...review, dislikes: review.dislikes + 1 }
          : review
      )
    );
  };

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={() => interactive && onRatingChange?.(star)}
          />
        ))}
      </div>
    );
  };

  const filteredReviews = reviews.filter(review => {
    if (filter.rating && review.rating !== filter.rating) return false;
    if (filter.category && review.category !== filter.category) return false;
    if (filter.language && review.language !== filter.language) return false;
    return true;
  });

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const totalReviews = reviews.length;

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-secondary">{averageRating.toFixed(1)}</div>
            <div className="flex justify-center mt-1">
              {renderStars(Math.round(averageRating))}
            </div>
            <div className="text-sm text-muted-foreground mt-1">Note moyenne</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{totalReviews}</div>
            <div className="text-sm text-muted-foreground mt-1">Total avis</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {Math.round((reviews.filter(r => r.rating >= 4).length / totalReviews) * 100)}%
            </div>
            <div className="text-sm text-muted-foreground mt-1">Satisfaction</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">4</div>
            <div className="text-sm text-muted-foreground mt-1">Langues</div>
          </CardContent>
        </Card>
      </div>

      {/* Add Review Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5" />
            <span>Partager votre avis</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="user-name">Nom *</Label>
              <Input
                id="user-name"
                value={newReview.userName}
                onChange={(e) => setNewReview(prev => ({ ...prev, userName: e.target.value }))}
                placeholder="Votre nom"
              />
            </div>
            
            <div>
              <Label htmlFor="review-language">Langue</Label>
              <select
                id="review-language"
                value={newReview.language}
                onChange={(e) => setNewReview(prev => ({ ...prev, language: e.target.value }))}
                className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Note *</Label>
              <div className="mt-2">
                {renderStars(newReview.rating, true, (rating) => 
                  setNewReview(prev => ({ ...prev, rating }))
                )}
              </div>
            </div>
            
            <div>
              <Label htmlFor="review-category">Catégorie</Label>
              <select
                id="review-category"
                value={newReview.category}
                onChange={(e) => setNewReview(prev => ({ ...prev, category: e.target.value as Review['category'] }))}
                className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="review-title">Titre *</Label>
            <Input
              id="review-title"
              value={newReview.title}
              onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Titre de votre avis"
            />
          </div>

          <div>
            <Label htmlFor="review-comment">Commentaire *</Label>
            <Textarea
              id="review-comment"
              value={newReview.comment}
              onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
              placeholder="Partagez votre expérience avec la plateforme..."
              rows={4}
            />
          </div>

          <Button
            onClick={handleSubmitReview}
            className="bg-secondary hover:bg-secondary/90"
          >
            <Send className="w-4 h-4 mr-2" />
            Publier l'avis
          </Button>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filtrer les avis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div>
              <Label>Note</Label>
              <select
                value={filter.rating || ''}
                onChange={(e) => setFilter(prev => ({ ...prev, rating: e.target.value ? parseInt(e.target.value) : undefined }))}
                className="mt-1 px-3 py-2 border border-border rounded-md bg-background"
              >
                <option value="">Toutes</option>
                <option value="5">5 étoiles</option>
                <option value="4">4 étoiles</option>
                <option value="3">3 étoiles</option>
                <option value="2">2 étoiles</option>
                <option value="1">1 étoile</option>
              </select>
            </div>

            <div>
              <Label>Catégorie</Label>
              <select
                value={filter.category || ''}
                onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value as Review['category'] || undefined }))}
                className="mt-1 px-3 py-2 border border-border rounded-md bg-background"
              >
                <option value="">Toutes</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label>Langue</Label>
              <select
                value={filter.language || ''}
                onChange={(e) => setFilter(prev => ({ ...prev, language: e.target.value || undefined }))}
                className="mt-1 px-3 py-2 border border-border rounded-md bg-background"
              >
                <option value="">Toutes</option>
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={() => setFilter({})}
                variant="outline"
                size="sm"
              >
                Réinitialiser
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Avis des utilisateurs ({filteredReviews.length})</span>
            <Badge variant="outline">
              <TrendingUp className="w-4 h-4 mr-1" />
              Récents
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {filteredReviews.map((review) => (
              <div key={review.id} className="border-b border-border pb-6 last:border-b-0 last:pb-0">
                <div className="flex items-start space-x-4">
                  <Avatar>
                    <AvatarImage src={review.userAvatar} />
                    <AvatarFallback>
                      {review.userName.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{review.userName}</h4>
                        <Badge variant="outline" className="text-xs">
                          {languages.find(l => l.code === review.language)?.flag}
                          {languages.find(l => l.code === review.language)?.name}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {categories.find(c => c.value === review.category)?.icon}
                          {categories.find(c => c.value === review.category)?.label}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {review.date.toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {renderStars(review.rating)}
                      <h3 className="font-medium">{review.title}</h3>
                    </div>
                    
                    <p className="text-muted-foreground leading-relaxed">
                      {review.comment}
                    </p>
                    
                    <div className="flex items-center space-x-4 pt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(review.id)}
                        className="text-muted-foreground hover:text-green-600"
                      >
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        {review.likes}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDislike(review.id)}
                        className="text-muted-foreground hover:text-red-600"
                      >
                        <ThumbsDown className="w-4 h-4 mr-1" />
                        {review.dislikes}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewsSection;