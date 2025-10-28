import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import {
  MapPin,
  Navigation,
  Phone,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
} from "lucide-react";
import DeliveryMap from "./DeliveryMap";
import RouteFeedbackDialog from "./RouteFeedbackDialog";

interface RiderDeliveryProps {
  orderId: string;
  onComplete: () => void;
}

interface Order {
  id: string;
  status: string;
  pickup_address: string;
  pickup_coords: { lat: number; lng: number };
  dropoff_address: string;
  dropoff_coords: { lat: number; lng: number };
  customer_name: string;
  customer_phone: string;
  delivery_instructions: string;
  payout: number;
}

const RiderDelivery = ({ orderId, onComplete }: RiderDeliveryProps) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [currentStep, setCurrentStep] = useState<"pickup" | "delivery">("pickup");
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    loadOrder();
    subscribeToOrderUpdates();
  }, [orderId]);

  const loadOrder = async () => {
    // @ts-ignore - Types will regenerate after migration
    const { data, error } = await supabase
      // @ts-ignore
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .maybeSingle();

    if (error) {
      toast.error("Failed to load order");
      return;
    }

    if (!data) {
      toast.error("Order not found");
      onComplete();
      return;
    }

    // @ts-ignore - Types will regenerate after migration
    setOrder(data as Order);
    setCurrentStep((data as any).status === "picked_up" ? "delivery" : "pickup");
  };

  const subscribeToOrderUpdates = () => {
    const channel = supabase
      .channel("order-updates")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          setOrder(payload.new as Order);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const updateOrderStatus = async (newStatus: string) => {
    const updates: any = {
      status: newStatus,
    };

    if (newStatus === "picked_up") {
      updates.picked_up_at = new Date().toISOString();
    } else if (newStatus === "delivered") {
      updates.delivered_at = new Date().toISOString();
    }

    // @ts-ignore - Types will regenerate after migration
    const { error } = await supabase
      // @ts-ignore
      .from("orders")
      // @ts-ignore
      .update(updates)
      .eq("id", orderId);

    if (error) {
      toast.error("Failed to update order status");
      return;
    }

    if (newStatus === "picked_up") {
      setCurrentStep("delivery");
      toast.success("Order picked up!");
    } else if (newStatus === "delivered") {
      await updateMetrics();
      toast.success("Order delivered!");
      onComplete();
    }
  };

  const updateMetrics = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !order) return;

    // @ts-ignore - Types will regenerate after migration
    const { data: metrics } = await supabase
      // @ts-ignore
      .from("rider_metrics")
      .select("*")
      .eq("rider_id", user.id)
      .maybeSingle();

    if (metrics) {
      // @ts-ignore - Types will regenerate after migration
      await supabase
        // @ts-ignore
        .from("rider_metrics")
        // @ts-ignore
        .update({
          // @ts-ignore - Types will regenerate after migration
          deliveries_today: ((metrics as any).deliveries_today || 0) + 1,
          earnings_today: ((metrics as any).earnings_today || 0) + order.payout,
          total_deliveries: ((metrics as any).total_deliveries || 0) + 1,
          total_earnings: ((metrics as any).total_earnings || 0) + order.payout,
          updated_at: new Date().toISOString(),
        })
        .eq("rider_id", user.id);
    }
  };

  const openNavigation = (coords: { lat: number; lng: number }) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`;
    window.open(url, "_blank");
  };

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const currentLocation =
    currentStep === "pickup" ? order.pickup_coords : order.dropoff_coords;
  const currentAddress =
    currentStep === "pickup" ? order.pickup_address : order.dropoff_address;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Map Section */}
      <div className="h-1/2 relative">
        <DeliveryMap
          pickupCoords={order.pickup_coords}
          dropoffCoords={order.dropoff_coords}
          currentStep={currentStep}
        />
      </div>

      {/* Details Section */}
      <div className="flex-1 p-4 overflow-y-auto">
        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === "pickup" || order.status === "delivered"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              1
            </div>
            <span className="text-sm font-medium">Pickup</span>
          </div>
          <div className="flex-1 h-1 bg-muted mx-2">
            <div
              className={`h-full transition-all ${
                currentStep === "delivery" || order.status === "delivered"
                  ? "bg-primary w-full"
                  : "bg-muted w-0"
              }`}
            />
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === "delivery"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              2
            </div>
            <span className="text-sm font-medium">Delivery</span>
          </div>
        </div>

        {/* Current Task */}
        <Card className="p-4 mb-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-foreground mb-1">
                {currentStep === "pickup" ? "Pickup from Store" : "Deliver to Customer"}
              </h3>
              <p className="text-sm text-muted-foreground">{currentAddress}</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => openNavigation(currentLocation)}
            >
              <Navigation className="h-4 w-4 mr-1" />
              Navigate
            </Button>
          </div>

          {currentStep === "delivery" && (
            <div className="space-y-2 mb-3">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{order.customer_phone}</span>
              </div>
              {order.delivery_instructions && (
                <div className="flex items-start gap-2 text-sm">
                  <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="text-foreground">{order.delivery_instructions}</span>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t">
            <span className="text-sm text-muted-foreground">Payout</span>
            <span className="text-lg font-bold text-foreground">₹{order.payout}</span>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          {currentStep === "pickup" && (
            <Button
              className="w-full"
              size="lg"
              onClick={() => updateOrderStatus("picked_up")}
            >
              <CheckCircle2 className="mr-2 h-5 w-5" />
              Confirm Pickup
            </Button>
          )}

          {currentStep === "delivery" && (
            <Button
              className="w-full"
              size="lg"
              onClick={() => updateOrderStatus("delivered")}
            >
              <CheckCircle2 className="mr-2 h-5 w-5" />
              Confirm Delivery
            </Button>
          )}

          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowFeedback(true)}
          >
            <AlertCircle className="mr-2 h-4 w-4" />
            Report Route Issue
          </Button>
        </div>
      </div>

      <RouteFeedbackDialog
        orderId={orderId}
        open={showFeedback}
        onClose={() => setShowFeedback(false)}
      />
    </div>
  );
};

export default RiderDelivery;
