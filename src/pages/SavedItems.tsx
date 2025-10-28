import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface SavedItem {
  id: string;
  product_name: string;
  product_price: number;
  product_image: string | null;
  created_at: string;
}

const SavedItems = () => {
  const { user, loading } = useAuth();
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchSavedItems();
    }
  }, [user]);

  const fetchSavedItems = async () => {
    try {
      // @ts-ignore - Types will regenerate after migration
      const { data, error } = await supabase
        // @ts-ignore
        .from('saved_items')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedItems(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeSavedItem = async (itemId: string) => {
    try {
      // @ts-ignore - Types will regenerate after migration
      const { error } = await supabase
        // @ts-ignore
        .from('saved_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      setSavedItems(savedItems.filter(item => item.id !== itemId));
      toast({
        title: 'Removed',
        description: 'Item removed from saved items',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center gap-2 mb-8">
        <Heart className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold">Saved Items</h1>
      </div>

      {savedItems.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No saved items yet</h2>
            <p className="text-muted-foreground mb-4">
              Start adding products to your favorites to see them here
            </p>
            <Button onClick={() => navigate('/')}>Browse Products</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="aspect-square bg-muted">
                {item.product_image ? (
                  <img
                    src={item.product_image}
                    alt={item.product_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Heart className="w-16 h-16 text-muted-foreground" />
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">{item.product_name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">
                    ₹{item.product_price.toFixed(0)}
                  </span>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeSavedItem(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedItems;
