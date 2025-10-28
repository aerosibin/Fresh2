import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MapPin, Cloud, TrendingUp, Zap, Check, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import { CartItem } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const checkoutSchema = z.object({
  address: z.string().min(10, { message: "Address must be at least 10 characters" }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits" }),
  notes: z.string().optional(),
});

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { cart, subtotal } = location.state as { cart: CartItem[], subtotal: number };

  const [isRocket, setIsRocket] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  // Mock dynamic pricing calculation
  const baseFee = 20.0;
  const distanceFee = 7 * 5; // 7km * $5/km
  const surgeFee = baseFee * 0.5; // 50% surge
  const weatherFee = baseFee * 0.15; // 15% for rain
  const rocketFee = isRocket ? baseFee * 0.3 : 0; // 30% premium
  const totalDeliveryFee = baseFee + distanceFee + surgeFee + weatherFee + rocketFee;
  const grandTotal = subtotal + totalDeliveryFee;

  const handlePlaceOrder = () => {
    try {
      checkoutSchema.parse({ address, phone, notes });
      navigate("/tracking");
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'Validation error',
          description: error.errors[0].message,
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Shop
        </Button>

        <h1 className="text-3xl font-bold mb-8 text-foreground">Checkout</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Delivery Details */}
          <div className="space-y-6">
            <Card className="p-6 bg-card border-border">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Delivery Details</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="address" className="text-foreground">
                    Delivery Address <span className="text-destructive">*</span>
                  </Label>
                  <Input 
                    id="address" 
                    placeholder="Building, Street, Area, City" 
                    className="mt-1"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-foreground">
                    Phone Number <span className="text-destructive">*</span>
                  </Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    placeholder="+91 XXXXX XXXXX" 
                    className="mt-1"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="notes" className="text-foreground">Delivery Instructions (Optional)</Label>
                  <Input 
                    id="notes" 
                    placeholder="Leave at door" 
                    className="mt-1"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card border-border">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Delivery Speed</h2>
              <div className="space-y-3">
                <div 
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    !isRocket ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setIsRocket(false)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">Standard Delivery</p>
                        <p className="text-sm text-muted-foreground">45-60 minutes</p>
                      </div>
                    </div>
                    {!isRocket && <Check className="w-5 h-5 text-primary" />}
                  </div>
                </div>

                <div 
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    isRocket ? 'border-secondary bg-secondary/5' : 'border-border hover:border-secondary/50'
                  }`}
                  onClick={() => setIsRocket(true)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-secondary" />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground">Rocket Delivery</p>
                          <Badge className="bg-secondary text-secondary-foreground">+30%</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">15-20 minutes</p>
                      </div>
                    </div>
                    {isRocket && <Check className="w-5 h-5 text-secondary" />}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="p-6 bg-card border-border">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Order Summary</h2>
              <div className="space-y-3">
                {cart.map(({ product, quantity }) => (
                  <div key={product.id} className="flex justify-between text-sm">
                    <span className="text-foreground">{product.name} × {quantity}</span>
                    <span className="font-medium text-foreground">₹{(product.price * quantity).toFixed(2)}</span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between font-medium">
                  <span className="text-foreground">Subtotal</span>
                  <span className="text-foreground">₹{subtotal.toFixed(2)}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-accent text-secondary-foreground shadow-pricing border-0">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-xl font-semibold">Dynamic Delivery Fee</h2>
                <Button 
                  size="sm" 
                  variant="secondary"
                  onClick={() => setShowPricing(!showPricing)}
                  className="bg-secondary-foreground/10 hover:bg-secondary-foreground/20 text-secondary-foreground"
                >
                  {showPricing ? "Hide" : "Show"} Breakdown
                </Button>
              </div>

              {showPricing && (
                <div className="space-y-2 mb-4 text-sm bg-secondary-foreground/10 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-secondary-foreground rounded-full"></div>
                      <span>Base Fee</span>
                    </div>
                    <span>₹{baseFee.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>Distance Fee (7km)</span>
                    </div>
                    <span>₹{distanceFee.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      <span>High Demand Surge</span>
                    </div>
                    <span className="text-accent-foreground">+₹{surgeFee.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Cloud className="w-4 h-4" />
                      <span>Weather Factor (Rain)</span>
                    </div>
                    <span>+₹{weatherFee.toFixed(2)}</span>
                  </div>
                  {isRocket && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        <span>Rocket Premium</span>
                      </div>
                      <span className="text-accent-foreground">+₹{rocketFee.toFixed(2)}</span>
                    </div>
                  )}
                  <Separator className="my-2 bg-secondary-foreground/20" />
                </div>
              )}

              <div className="flex justify-between text-2xl font-bold">
                <span>Delivery Fee</span>
                <span>₹{totalDeliveryFee.toFixed(2)}</span>
              </div>
            </Card>

            <Card className="p-6 bg-card border-border">
              <div className="flex justify-between text-xl font-bold mb-6">
                <span className="text-foreground">Grand Total</span>
                <span className="text-primary">₹{grandTotal.toFixed(2)}</span>
              </div>
              <Button 
                onClick={handlePlaceOrder}
                className="w-full bg-primary hover:bg-primary-hover text-primary-foreground"
                size="lg"
              >
                <Check className="w-5 h-5 mr-2" />
                Place Order
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;