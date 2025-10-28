import { useState, useEffect } from "react";
import { MapPin, Clock, CheckCircle, Truck, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/Navbar";

const Tracking = () => {
  const [driverPosition, setDriverPosition] = useState(20);
  const [eta, setEta] = useState(18);
  const [status, setStatus] = useState<"preparing" | "on_the_way" | "nearby">("preparing");

  // Simulate driver movement
  useEffect(() => {
    const interval = setInterval(() => {
      setDriverPosition(prev => {
        const next = prev + 2;
        if (next >= 40 && next < 70) {
          setStatus("on_the_way");
        } else if (next >= 70) {
          setStatus("nearby");
        }
        if (next >= 100) {
          clearInterval(interval);
          return 100;
        }
        return next;
      });

      setEta(prev => Math.max(0, prev - 0.5));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const statusConfig = {
    preparing: {
      label: "Preparing Order",
      color: "bg-accent",
      icon: CheckCircle
    },
    on_the_way: {
      label: "On the Way",
      color: "bg-secondary",
      icon: Truck
    },
    nearby: {
      label: "Driver Nearby!",
      color: "bg-primary animate-pulse-glow",
      icon: MapPin
    }
  };

  const StatusIcon = statusConfig[status].icon;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="text-center mb-8">
          <Badge className={`${statusConfig[status].color} text-white border-0 px-4 py-2 text-base mb-4`}>
            <StatusIcon className="w-5 h-5 mr-2" />
            {statusConfig[status].label}
          </Badge>
          <h1 className="text-4xl font-bold mb-2 text-foreground">Order #12345</h1>
          <p className="text-xl text-muted-foreground">Your order is being delivered</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Map Simulation */}
          <Card className="p-6 bg-card border-border">
            <h2 className="text-lg font-semibold mb-4 text-foreground">Live Tracking</h2>
            <div className="relative h-80 bg-muted rounded-lg overflow-hidden">
              {/* Simulated map background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
              
              {/* Route line */}
              <div className="absolute top-1/4 left-4 right-4 h-1 bg-border">
                <div 
                  className="h-full bg-primary transition-all duration-1000"
                  style={{ width: `${driverPosition}%` }}
                ></div>
              </div>

              {/* Your location */}
              <div className="absolute top-1/4 left-4 -translate-y-1/2">
                <div className="w-4 h-4 bg-primary rounded-full border-4 border-card"></div>
                <p className="text-xs mt-2 font-medium text-foreground">You</p>
              </div>

              {/* Driver position */}
              <div 
                className="absolute top-1/4 -translate-y-1/2 transition-all duration-1000"
                style={{ left: `calc(4% + ${driverPosition}% - 12px)` }}
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-secondary rounded-full border-4 border-card flex items-center justify-center animate-pulse">
                    <Truck className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <p className="text-xs font-medium bg-card px-2 py-1 rounded text-foreground">Driver</p>
                  </div>
                </div>
              </div>

              {/* Destination */}
              <div className="absolute top-1/4 right-4 -translate-y-1/2">
                <div className="w-4 h-4 bg-destructive rounded-full border-4 border-card"></div>
                <p className="text-xs mt-2 font-medium text-foreground">Destination</p>
              </div>
            </div>
          </Card>

          {/* Order Details */}
          <div className="space-y-6">
            <Card className="p-6 bg-card border-border">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-primary">{Math.round(eta)} min</h3>
                  <p className="text-sm text-muted-foreground">Estimated Time</p>
                </div>
                <Clock className="w-12 h-12 text-primary" />
              </div>
              <Progress value={driverPosition} className="h-2" />
            </Card>

            <Card className="p-6 bg-card border-border">
              <h3 className="font-semibold mb-4 text-foreground">Driver Details</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-2xl">
                  👨‍🦱
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">John Doe</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <span>⭐</span>
                    <span>4.9 (2,345 deliveries)</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                <Phone className="w-4 h-4 mr-2" />
                Contact Driver
              </Button>
            </Card>

            <Card className="p-6 bg-card border-border">
              <h3 className="font-semibold mb-4 text-foreground">Order Items</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🍌</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Organic Bananas × 2</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🥛</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Fresh Milk × 1</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🍞</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Whole Wheat Bread × 1</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tracking;