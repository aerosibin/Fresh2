import { useAuth } from '@/contexts/AuthContext';
import { TrendingUp, DollarSign, Package, Users, BarChart, Zap, MapPin, Clock, Star, Headphones, Siren, AlertTriangle, GitFork } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || userRole !== 'admin')) {
      navigate('/');
    }
  }, [user, userRole, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user || userRole !== 'admin') {
    return null;
  }

  const stats = [
    { label: "Total Deliveries (30d)", value: "2,847", change: "+12.5%", icon: Package, color: "text-primary" },
    { label: "Avg Payout/Delivery (30d)", value: "$12.50", change: "+2.1%", icon: DollarSign, color: "text-secondary" },
    { label: "Avg Store Wait Time (30d)", value: "8 min", change: "-5.2%", icon: Clock, color: "text-destructive" },
    { label: "Avg Customer Rating (30d)", value: "4.8", change: "+0.5%", icon: Star, color: "text-yellow-500" },
    { label: "Total Online Hours (30d)", value: "1,234", change: "+8.2%", icon: Zap, color: "text-accent" },
    { label: "Total Sessions (30d)", value: "452", change: "+6.8%", icon: BarChart, color: "text-info" },
    { label: "Days Since Last Delivery", value: "2", change: "", icon: Clock, color: "text-gray-500" },
    { label: "Tenure in Days", value: "365", change: "", icon: Users, color: "text-gray-500" },
    { label: "Support Tickets (90d)", value: "12", change: "-15%", icon: Headphones, color: "text-red-500" },
  ];

  const crashAlerts = [
    { rider_id: 'rider_789', last_known_gps: '12.9750, 77.6000', status: 'UNRESPONSIVE' },
  ];

  const fraudCases = [
    { type: 'GPS_MISMATCH', rider_id: 'rider_123', delivery_id: 'order_456', distance_m: '5734m mismatch', status: 'PENDING_REVIEW' },
  ];

  const routeInefficiency = [
    { rider_id: 'rider_007', delivery_id: 'delivery_701', delta: 2.15 },
  ];

  const topProducts = [
    { name: "Organic Bananas", sales: 453, revenue: "$1,808", emoji: "🍌" },
    { name: "Fresh Milk", sales: 389, revenue: "$1,747", emoji: "🥛" },
    { name: "Free Range Eggs", sales: 342, revenue: "$2,049", emoji: "🥚" },
    { name: "Whole Wheat Bread", sales: 298, revenue: "$891", emoji: "🍞" },
    { name: "Avocados", sales: 267, revenue: "$1,866", emoji: "🥑" },
  ];

  const deliveryZones = [
    { zone: "Zone A", orders: 845, avgTime: "15 min", congestion: "Low", color: "bg-primary" },
    { zone: "Zone B", orders: 723, avgTime: "22 min", congestion: "Medium", color: "bg-accent" },
    { zone: "Zone C", orders: 612, avgTime: "28 min", congestion: "High", color: "bg-destructive" },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Real-time analytics and predictive insights</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <Card className="p-6 bg-destructive text-destructive-foreground border-0 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">!!! CRASH ALERTS !!!</h2>
                    <Siren className="w-6 h-6" />
                </div>
                <div className="space-y-3">
                    {crashAlerts.map((alert) => (
                        <div key={alert.rider_id} className="bg-destructive-foreground/10 rounded-lg p-3">
                            <div className="flex justify-between items-center">
                                <span className="font-bold">{alert.rider_id}</span>
                                <span className="text-sm">{alert.last_known_gps}</span>
                            </div>
                            <p className="text-xs opacity-80 mt-1">Status: {alert.status}</p>
                        </div>
                    ))}
                </div>
            </Card>

            <Card className="p-6 bg-card border-border">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-foreground">Fraud Cases for Review</h2>
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                </div>
                <div className="space-y-4">
                    {fraudCases.map((f_case) => (
                        <div key={f_case.delivery_id} className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center text-sm font-bold text-yellow-500">
                                <AlertTriangle className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-foreground">{f_case.rider_id}</p>
                                <p className="text-sm text-muted-foreground">{f_case.type} - {f_case.delivery_id}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-foreground">{f_case.distance_m}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="p-6 bg-card border-border hover:shadow-hover transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div className="flex items-center gap-1">
                  {stat.change && (
                    <>
                      <TrendingUp className={`w-4 h-4 ${stat.change.startsWith('+') ? 'text-primary' : 'text-destructive'}`} />
                      <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-primary' : 'text-destructive'}`}>
                        {stat.change}
                      </span>
                      <span className="text-sm text-muted-foreground">vs last month</span>
                    </>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Top Products */}
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">Top Products</h2>
              <BarChart className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    {index + 1}
                  </div>
                  <div className="text-3xl">{product.emoji}</div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.sales} sales</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-secondary">{product.revenue}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Delivery Zones */}
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">Delivery Zones Performance</h2>
              <MapPin className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="space-y-4">
              {deliveryZones.map((zone) => (
                <div key={zone.zone} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${zone.color}`}></div>
                      <span className="font-medium text-foreground">{zone.zone}</span>
                      <Badge variant="outline" className="text-xs">
                        {zone.congestion} Congestion
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">{zone.avgTime}</span>
                  </div>
                  <div className="flex items-center gap-4 ml-6">
                    <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full ${zone.color}`}
                        style={{ width: `${(zone.orders / 845) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-foreground">{zone.orders} orders</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

            <Card className="p-6 bg-card border-border">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-foreground">Route Inefficiency Flags</h2>
                    <GitFork className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="space-y-4">
                    {routeInefficiency.map((route) => (
                        <div key={route.delivery_id} className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-sm font-bold text-blue-500">
                                <GitFork className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-foreground">{route.rider_id}</p>
                                <p className="text-sm text-muted-foreground">{route.delivery_id}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-blue-500">{route.delta.toFixed(2)}x optimal</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;
