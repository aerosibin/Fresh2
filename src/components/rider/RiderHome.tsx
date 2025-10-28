import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Star, TrendingUp, DollarSign, MapPin } from "lucide-react";
import IncentiveMapWidget from "./IncentiveMapWidget";
import OrderAssignmentCard from "./OrderAssignmentCard";

interface RiderHomeProps {
  onStartDelivery: (orderId: string) => void;
}

interface RiderMetrics {
  rating: number;
  deliveries_today: number;
  earnings_today: number;
  driving_hours_today: number;
}

interface RiderStatus {
  available: boolean;
}

const RiderHome = ({ onStartDelivery }: RiderHomeProps) => {
  const [isOnline, setIsOnline] = useState(false);
  const [metrics, setMetrics] = useState<RiderMetrics | null>(null);
  const [pendingOrder, setPendingOrder] = useState<any>(null);
  const [wsConnection, setWsConnection] = useState<WebSocket | null>(null);

  useEffect(() => {
    loadRiderData();
    setupWebSocket();

    return () => {
      if (wsConnection) {
        wsConnection.close();
      }
    };
  }, []);

  const loadRiderData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Load metrics
    // @ts-ignore - Types will regenerate after migration
    const { data: metricsData } = await supabase
      // @ts-ignore
      .from("rider_metrics")
      .select("*")
      .eq("rider_id", user.id)
      .maybeSingle();

    if (metricsData) {
      // @ts-ignore - Types will regenerate after migration
      setMetrics(metricsData as RiderMetrics);
    }

    // Load status
    // @ts-ignore - Types will regenerate after migration
    const { data: statusData } = await supabase
      // @ts-ignore
      .from("rider_status")
      .select("*")
      .eq("rider_id", user.id)
      .maybeSingle();

    if (statusData) {
      setIsOnline((statusData as any).available || false);
    }
  };

  const setupWebSocket = () => {
    // WebSocket connection for real-time order assignments
    const ws = new WebSocket(
      `wss://zcsccthlywhrrbgvfmto.supabase.co/functions/v1/rider-ws`
    );

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "assigned") {
        setPendingOrder(data);
        toast.info("New delivery request!");
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    setWsConnection(ws);
  };

  const toggleOnlineStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const newStatus = !isOnline;

    // @ts-ignore - Types will regenerate after migration
    const { error } = await supabase
      // @ts-ignore
      .from("rider_status")
      .upsert({
        rider_id: user.id,
        available: newStatus,
        updated_at: new Date().toISOString(),
      } as any);

    if (error) {
      toast.error("Failed to update status");
      return;
    }

    setIsOnline(newStatus);
    toast.success(newStatus ? "You are now online" : "You are now offline");
  };

  const getFatigueStatus = () => {
    if (!metrics) return { color: "text-green-500", label: "Good" };
    const hours = metrics.driving_hours_today;
    if (hours < 4) return { color: "text-green-500", label: "Good" };
    if (hours < 7) return { color: "text-yellow-500", label: "Moderate" };
    return { color: "text-red-500", label: "High Fatigue" };
  };

  const fatigueStatus = getFatigueStatus();

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Rider Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Fatigue Status: <span className={fatigueStatus.color}>{fatigueStatus.label}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {isOnline ? "Online" : "Offline"}
          </span>
          <Switch checked={isOnline} onCheckedChange={toggleOnlineStatus} />
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="text-xs text-muted-foreground">Rating</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {metrics?.rating?.toFixed(1) || "0.0"}
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">Today</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {metrics?.deliveries_today || 0}
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-green-500" />
            <span className="text-xs text-muted-foreground">Earnings</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            ₹{metrics?.earnings_today || 0}
          </p>
        </Card>
      </div>

      {/* Incentive Map Widget */}
      <Card className="mb-6 p-4">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Surge Zones</h2>
        </div>
        <IncentiveMapWidget />
      </Card>

      {/* Pending Order Assignment */}
      {pendingOrder && (
        <OrderAssignmentCard
          order={pendingOrder}
          onAccept={(orderId) => {
            setPendingOrder(null);
            onStartDelivery(orderId);
          }}
          onDecline={() => setPendingOrder(null)}
        />
      )}

      {/* Empty State */}
      {!pendingOrder && isOnline && (
        <Card className="p-8 text-center">
          <div className="animate-pulse mb-4">
            <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto flex items-center justify-center">
              <MapPin className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Waiting for Orders
          </h3>
          <p className="text-sm text-muted-foreground">
            You'll receive notifications when new orders are available
          </p>
        </Card>
      )}

      {!isOnline && (
        <Card className="p-8 text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            You're Offline
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Toggle the switch above to start receiving orders
          </p>
        </Card>
      )}
    </div>
  );
};

export default RiderHome;
