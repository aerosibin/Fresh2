import { useEffect, useRef } from "react";

interface DeliveryMapProps {
  pickupCoords: { lat: number; lng: number };
  dropoffCoords: { lat: number; lng: number };
  currentStep: "pickup" | "delivery";
}

const DeliveryMap = ({
  pickupCoords,
  dropoffCoords,
  currentStep,
}: DeliveryMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Map integration would go here (Google Maps, Mapbox, etc.)
    // For now, showing a placeholder
  }, [pickupCoords, dropoffCoords, currentStep]);

  return (
    <div
      ref={mapRef}
      className="w-full h-full bg-muted flex items-center justify-center relative"
    >
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-2">Map View</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-foreground">
              Pickup: {pickupCoords.lat.toFixed(4)}, {pickupCoords.lng.toFixed(4)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-foreground">
              Dropoff: {dropoffCoords.lat.toFixed(4)}, {dropoffCoords.lng.toFixed(4)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Current Step: {currentStep === "pickup" ? "Pickup" : "Delivery"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeliveryMap;
