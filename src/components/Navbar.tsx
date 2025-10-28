import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingBag, BarChart3, Package, History, Heart, Settings, LogOut, User as UserIcon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userRole, signOut } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between h-16">
          <Link to={userRole === 'admin' ? '/admin' : '/'} className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-hero rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">FreshAI</span>
          </Link>

          <div className="flex items-center gap-6">
            {userRole !== 'admin' && (
              <>
                <Link to="/">
                  <Button 
                    variant={isActive("/") ? "default" : "ghost"}
                    className={isActive("/") ? "bg-primary hover:bg-primary-hover" : ""}
                  >
                    Shop
                  </Button>
                </Link>
                <Link to="/personalized">
                  <Button 
                    variant={isActive("/personalized") ? "default" : "ghost"}
                    className={isActive("/personalized") ? "bg-primary hover:bg-primary-hover" : ""}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    For You
                  </Button>
                </Link>
              </>
            )}
            <Link to="/tracking">
              <Button 
                variant={isActive("/tracking") ? "default" : "ghost"}
                className={isActive("/tracking") ? "bg-primary hover:bg-primary-hover" : ""}
              >
                <Package className="w-4 h-4 mr-2" />
                Track Order
              </Button>
            </Link>
            {userRole === 'admin' && (
              <Link to="/admin">
                <Button 
                  variant={isActive("/admin") ? "default" : "ghost"}
                  className={isActive("/admin") ? "bg-primary hover:bg-primary-hover" : ""}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Admin
                </Button>
              </Link>
            )}
            
            {!user ? (
              <Button onClick={() => navigate('/auth')}>
                <UserIcon className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            ) : (
              <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=FreshAI" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.email?.split('@')[0] || 'User'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    {userRole === 'admin' && (
                      <span className="text-xs font-semibold text-primary">Admin</span>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                 <div className="px-2 py-2">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Recent Orders</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors">
                      <div>
                        <p className="font-medium">Order #1234</p>
                        <p className="text-muted-foreground">5 items • ₹450</p>
                      </div>
                      <span className="text-green-600 font-medium">Delivered</span>
                    </div>
                    <div className="flex items-center justify-between text-xs p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors">
                      <div>
                        <p className="font-medium">Order #1233</p>
                        <p className="text-muted-foreground">3 items • ₹280</p>
                      </div>
                      <span className="text-green-600 font-medium">Delivered</span>
                    </div>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/personalized')}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  <span>For You</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/tracking')}>
                  <History className="mr-2 h-4 w-4" />
                  <span>Order History</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/saved-items')}>
                  <Heart className="mr-2 h-4 w-4" />
                  <span>Saved Items</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600" onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;