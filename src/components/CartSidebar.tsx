import { X, Minus, Plus, Sparkles, TrendingUp, Heart, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CartItem, Product } from "@/types";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface CartSidebarProps {
  open: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

// Mock recommendations
const mockRecommendations = {
  habit: [
    { id: "r1", name: "Organic Eggs", price: 5.99, category: "Dairy", image: "🥚", unit: "dozen", inStock: true },
  ],
  pairing: [
    { id: "r2", name: "Peanut Butter", price: 4.99, category: "Pantry", image: "🥜", unit: "jar", inStock: true },
  ],
  trending: [
    { id: "r3", name: "Oat Milk", price: 3.99, category: "Dairy", image: "🥛", unit: "1L", inStock: true },
  ]
};

const CartSidebar = ({ open, onClose, cart, onUpdateQuantity }: CartSidebarProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleCheckout = () => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to proceed to checkout',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }
    onClose();
    navigate("/checkout", { state: { cart, subtotal } });
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg bg-card">
        <SheetHeader>
          <SheetTitle className="text-2xl text-foreground">Your Cart</SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-200px)] mt-6">
          <div className="space-y-6 pr-4">
            {/* Cart Items */}
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map(({ product, quantity }) => (
                  <Card key={product.id} className="p-4 bg-card border-border">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{product.image}</div>
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{product.name}</h4>
                        <p className="text-sm text-muted-foreground">₹{product.price}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center font-medium">{quantity}</span>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Smart Recommendations */}
            {cart.length > 0 && (
              <>
                <Separator className="my-6" />
                
                {/* Habit Reminders */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-destructive" />
                    <h3 className="font-semibold text-foreground">Forgot your usuals?</h3>
                  </div>
                  <div className="space-y-2">
                    {mockRecommendations.habit.map(product => (
                      <Card key={product.id} className="p-3 bg-muted/50 border-border hover:bg-muted transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{product.image}</div>
                          <div className="flex-1">
                            <p className="font-medium text-sm text-foreground">{product.name}</p>
                            <p className="text-xs text-muted-foreground">₹{product.price}</p>
                          </div>
                          <Button size="sm" variant="ghost" className="h-8 text-primary">
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Pairing Suggestions */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-accent" />
                    <h3 className="font-semibold text-foreground">Perfect pairings</h3>
                  </div>
                  <div className="space-y-2">
                    {mockRecommendations.pairing.map(product => (
                      <Card key={product.id} className="p-3 bg-muted/50 border-border hover:bg-muted transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{product.image}</div>
                          <div className="flex-1">
                            <p className="font-medium text-sm text-foreground">{product.name}</p>
                            <p className="text-xs text-muted-foreground">₹{product.price}</p>
                          </div>
                          <Button size="sm" variant="ghost" className="h-8 text-primary">
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Trending Now */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-secondary" />
                    <h3 className="font-semibold text-foreground">Trending now</h3>
                  </div>
                  <div className="space-y-2">
                    {mockRecommendations.trending.map(product => (
                      <Card key={product.id} className="p-3 bg-muted/50 border-border hover:bg-muted transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{product.image}</div>
                          <div className="flex-1">
                            <p className="font-medium text-sm text-foreground">{product.name}</p>
                            <p className="text-xs text-muted-foreground">₹{product.price}</p>
                          </div>
                          <Button size="sm" variant="ghost" className="h-8 text-primary">
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>

        {/* Checkout Section */}
        {cart.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-card border-t border-border">
            <div className="space-y-4">
              <div className="flex justify-between text-lg font-semibold">
                <span className="text-foreground">Subtotal</span>
                <span className="text-primary">₹{subtotal.toFixed(2)}</span>
              </div>
              <Button 
                onClick={handleCheckout} 
                className="w-full bg-secondary hover:bg-secondary-hover text-secondary-foreground"
                size="lg"
              >
                <Zap className="w-5 h-5 mr-2" />
                Proceed to Checkout
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartSidebar;