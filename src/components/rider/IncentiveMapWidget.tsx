import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

interface SurgeZone {
  id: string;
  zone_name: string;
  surge_multiplier: number;
  zone_bounds: any;
}

const IncentiveMapWidget = () => {
  const [surgeZones, setSurgeZones] = useState<SurgeZone[]>([]);

  useEffect(() => {
    loadSurgeZones();
  }, []);

  const loadSurgeZones = async () => {
    // @ts-ignore - Types will regenerate after migration
    const { data, error } = await supabase
      // @ts-ignore
      .from("surge_zones")
      .select("*")
      .eq("active", true)
      .order("surge_multiplier", { ascending: false });

    if (!error && data) {
      // @ts-ignore - Types will regenerate after migration
      setSurgeZones(data as SurgeZone[]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="bg-muted rounded-lg h-40 flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Map Widget</p>
      </div>

      {surgeZones.length > 0 ? (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Active Surge Zones</h4>
          {surgeZones.map((zone) => (
            <div
              key={zone.id}
              className="flex items-center justify-between p-2 bg-muted/50 rounded"
            >
              <span className="text-sm text-foreground">{zone.zone_name}</span>
              <Badge variant="default">
                +{((zone.surge_multiplier - 1) * 100).toFixed(0)}% Bonus
              </Badge>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center">
          No active surge zones at the moment
        </p>
      )}
    </div>
  );
};

export default IncentiveMapWidget;
