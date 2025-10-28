import { Plus, Heart, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const getFoodTypeColor = (foodType: Product['foodType']) => {
  switch (foodType) {
    case 'veg':
      return 'text-green-600 fill-green-600';
    case 'non-veg':
      return 'text-red-600 fill-red-600';
    case 'dairy':
      return 'text-white fill-white';
  }
};

interface ProductGridProps {
  onAddToCart: (product: Product) => void;
  products?: Product[];
  loading?: boolean;
}

const ProductGrid = ({ onAddToCart, products: externalProducts, loading = false }: ProductGridProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [savingItem, setSavingItem] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [fetchingProducts, setFetchingProducts] = useState(false);

  // Fetch products from database if not provided externally
  useEffect(() => {
    if (externalProducts) {
      setProducts(externalProducts);
      return;
    }

    const fetchProducts = async () => {
      setFetchingProducts(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('in_stock', true)
          .limit(20);

        if (error) throw error;

        const formattedProducts: Product[] = (data || []).map((p: any) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          category: p.category,
          image: p.image,
          unit: p.unit,
          inStock: p.in_stock,
          foodType: p.food_type as 'veg' | 'non-veg' | 'dairy',
          tags: p.tags,
        }));

        setProducts(formattedProducts);
      } catch (error: any) {
        console.error('Error fetching products:', error);
        toast({
          title: 'Error loading products',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setFetchingProducts(false);
      }
    };

    fetchProducts();
  }, [externalProducts, toast]);

  const handleSaveItem = async (product: Product) => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to save items',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }

    setSavingItem(product.id);
    try {
      // @ts-ignore - Types will regenerate after migration
      const { error } = await supabase
        // @ts-ignore
        .from('saved_items')
        .insert({
          user_id: user.id,
          product_name: product.name,
          product_price: product.price,
          product_image: product.image,
        } as any);

      if (error) {
        if (error.message.includes('duplicate')) {
          toast({
            title: 'Already saved',
            description: 'This item is already in your saved items',
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: 'Saved!',
          description: 'Item added to your saved items',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSavingItem(null);
    }
  };
  const isLoading = loading || fetchingProducts;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-16 bg-muted rounded mb-4" />
            <div className="h-4 bg-muted rounded mb-2 w-20" />
            <div className="h-6 bg-muted rounded mb-3 w-32" />
            <div className="h-8 bg-muted rounded" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Card 
          key={product.id} 
          className="group overflow-hidden hover:shadow-hover transition-all duration-300 hover:-translate-y-1 bg-card border-border"
        >
          <div className="p-6">
            <div className="text-6xl mb-4 text-center">{product.image}</div>
            <Badge variant="secondary" className="mb-2 bg-muted text-muted-foreground">
              {product.category}
            </Badge>
            <div className="flex items-center gap-2 mb-1">
              <Circle className={`w-3 h-3 ${getFoodTypeColor(product.foodType)}`} />
              <h3 className="font-semibold text-lg text-foreground">{product.name}</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{product.unit}</p>
            <div className="flex items-center justify-between gap-2">
              <span className="text-2xl font-bold text-primary">₹{product.price}</span>
              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => handleSaveItem(product)}
                  disabled={savingItem === product.id}
                  className="hover:text-primary"
                >
                  <Heart className="w-4 h-4" />
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => onAddToCart(product)}
                  className="bg-primary hover:bg-primary-hover"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ProductGrid;