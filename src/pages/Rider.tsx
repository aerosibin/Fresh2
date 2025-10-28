import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import RiderHome from "@/components/rider/RiderHome";
import RiderDelivery from "@/components/rider/RiderDelivery";

type RiderView = "home" | "delivery";

const Rider = () => {
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<RiderView>("home");
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/auth");
      } else if (userRole !== "rider") {
        navigate("/");
      }
    }
  }, [user, userRole, loading, navigate]);

  const handleStartDelivery = (orderId: string) => {
    setActiveOrderId(orderId);
    setCurrentView("delivery");
  };

  const handleCompleteDelivery = () => {
    setActiveOrderId(null);
    setCurrentView("home");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {currentView === "home" ? (
        <RiderHome onStartDelivery={handleStartDelivery} />
      ) : (
        <RiderDelivery
          orderId={activeOrderId!}
          onComplete={handleCompleteDelivery}
        />
      )}
    </div>
  );
};

export default Rider;
