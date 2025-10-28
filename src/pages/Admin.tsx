import { useAuth } from '@/contexts/AuthContext';
import { TrendingUp, DollarSign, Package, Users, BarChart, Zap, MapPin } from "lucide-react";
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
  // Mock data for analytics
  const stats = [
    { label: "Total Orders", value: "2,847", change: "+12.5%", icon: Package, color: "text-primary" },
    { label: "Revenue", value: "$45,382", change: "+8.2%", icon: DollarSign, color: "text-secondary" },
    { label: "Active Users", value: "1,234", change: "+5.7%", icon: Users, color: "text-accent" },
    { label: "Avg Delivery Time", value: "18 min", change: "-2.3%", icon: Zap, color: "text-destructive" },
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

  const pricingInsights = [
    { metric: "Avg Base Fee", value: "$20.00", trend: "stable" },
    { metric: "Avg Distance Fee", value: "$35.00", trend: "up" },
    { metric: "Avg Surge Fee", value: "$10.00", trend: "up" },
    { metric: "Rocket Premium", value: "$6.00", trend: "stable" },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Real-time analytics and predictive insights</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                  <TrendingUp className={`w-4 h-4 ${stat.change.startsWith('+') ? 'text-primary' : 'text-destructive'}`} />
                  <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-primary' : 'text-destructive'}`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-muted-foreground">vs last month</span>
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
        </div>

        {/* Pricing Insights */}
        <Card className="p-6 bg-gradient-accent text-secondary-foreground border-0 shadow-pricing">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Dynamic Pricing Insights</h2>
            <Badge className="bg-secondary-foreground/20 text-secondary-foreground border-0">
              Last 30 Days
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingInsights.map((insight) => (
              <div key={insight.metric} className="bg-secondary-foreground/10 rounded-lg p-4">
                <p className="text-sm mb-2 opacity-90">{insight.metric}</p>
                <div className="flex items-end justify-between">
                  <p className="text-2xl font-bold">{insight.value}</p>
                  {insight.trend === 'up' && (
                    <TrendingUp className="w-5 h-5 text-accent-foreground" />
                  )}
                  {insight.trend === 'stable' && (
                    <div className="w-5 h-0.5 bg-secondary-foreground/40"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* AI Predictions */}
        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold text-foreground">Predicted Demand Surge</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Today 6PM - 8PM</span>
                <Badge className="bg-destructive text-destructive-foreground">High</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Tomorrow 12PM - 2PM</span>
                <Badge className="bg-accent text-accent-foreground">Medium</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Tomorrow 8PM - 10PM</span>
                <Badge className="bg-primary text-primary-foreground">Low</Badge>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Stock Recommendations</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🍌</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Organic Bananas</p>
                  <p className="text-xs text-muted-foreground">Restock in 2 days</p>
                </div>
                <Badge variant="outline" className="text-xs">+15%</Badge>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🥛</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Fresh Milk</p>
                  <p className="text-xs text-muted-foreground">Restock in 1 day</p>
                </div>
                <Badge variant="outline" className="text-xs">+8%</Badge>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🥑</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Avocados</p>
                  <p className="text-xs text-muted-foreground">Trending up</p>
                </div>
                <Badge variant="outline" className="text-xs">+22%</Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;