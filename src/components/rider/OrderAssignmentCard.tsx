import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Clock, DollarSign } from "lucide-react";

interface OrderAssignmentCardProps {
  order: {
    order_id: string | string[];
    pickup_coords: { lat: number; lng: number };
    dropoff_coords: { lat: number; lng: number }[];
    estimated_payout: number;
    pickup_time: number;
  };
  onAccept: (orderId: string) => void;
  onDecline: () => void;
}

const OrderAssignmentCard = ({
  order,
  onAccept,
  onDecline,
}: OrderAssignmentCardProps) => {
  const orderId = Array.isArray(order.order_id)
    ? order.order_id[0]
    : order.order_id;
  const isBatch = Array.isArray(order.order_id) && order.order_id.length > 1;

  return (
    <div className="fixed inset-0 bg-background/95 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 animate-in slide-in-from-bottom">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            New Delivery Request!
          </h2>
          {isBatch && (
            <p className="text-sm text-muted-foreground">
              Batch Order - {(order.order_id as string[]).length} deliveries
            </p>
          )}
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <span className="text-sm text-foreground">Pickup Time</span>
            </div>
            <span className="font-semibold text-foreground">
              ~{order.pickup_time} min
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              <span className="text-sm text-foreground">Estimated Payout</span>
            </div>
            <span className="font-semibold text-foreground">
              ₹{order.estimated_payout}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <span className="text-sm text-foreground">Stops</span>
            </div>
            <span className="font-semibold text-foreground">
              {isBatch ? order.dropoff_coords.length + 1 : 2}
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            size="lg"
            onClick={onDecline}
          >
            Decline
          </Button>
          <Button
            className="flex-1"
            size="lg"
            onClick={() => onAccept(orderId)}
          >
            Accept
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default OrderAssignmentCard;
