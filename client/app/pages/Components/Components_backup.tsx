"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  ShoppingCart,
  Plus,
  Minus,
  Package,
  Search,
  Filter,
  Grid3X3,
  List,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

interface Component {
  _id: string;
  componentType: string;
  componentName: string;
  image_url: string;
  quantity: number;
}

const Components: React.FC = () => {
  const [components, setComponents] = useState<Component[]>([]);
  const [filteredComponents, setFilteredComponents] = useState<Component[]>([]);
  const [cart, setCart] = useState<Map<string, number>>(new Map());
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState<Map<string, number>>(new Map());
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showFloatingCart, setShowFloatingCart] = useState(false);

  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    fetchComponents();

    // Add scroll listener for floating cart
    const handleScroll = () => {
      setShowFloatingCart(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    let filtered = components;

    // Filter by search query
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(
        (component) =>
          component.componentName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          component.componentType
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (component) => component.componentType === selectedCategory
      );
    }

    setFilteredComponents(filtered);
  }, [components, searchQuery, selectedCategory]);

  const fetchComponents = async () => {
    try {
      const response = await axios.get(
        "https://cnerlab-kf0v.onrender.com/api/v1/components/"
      );
      setComponents(response.data);
    } catch (error) {
      toast.error("Failed to fetch components");
    } finally {
      setLoading(false);
    }
  };

  const groupedComponents = filteredComponents.reduce((acc, component) => {
    if (!acc[component.componentType]) {
      acc[component.componentType] = [];
    }
    acc[component.componentType].push(component);
    return acc;
  }, {} as Record<string, Component[]>);

  const checkAuthAndProceed = (callback: () => void) => {
    if (!isLoggedIn) {
      toast.error("Please login to add items to cart");
      navigate("/auth/login");
      return;
    }
    callback();
  };

  const updateCart = async (componentId: string) => {
    const quantity = quantities.get(componentId) || 0;

    if (quantity <= 0) {
      setCart((prev) => {
        const updated = new Map(prev);
        updated.delete(componentId);
        return updated;
      });
      return;
    }

    const isNewItem = !cart.has(componentId);

    try {
      if (isNewItem) {
        await axios.post(
          "https://cnerlab-kf0v.onrender.com/api/v1/cart/user",
          {
            componentId,
            quantity,
          },
          { withCredentials: true }
        );
      } else {
        await axios.put(
          "https://cnerlab-kf0v.onrender.com/api/v1/cart/user",
          {
            componentId,
            quantity,
          },
          { withCredentials: true }
        );
      }

      setCart((prev) => new Map(prev.set(componentId, quantity)));
      toast.success("Cart updated successfully");
    } catch (error) {
      toast.error("Failed to update cart");
    }
  };

  const handleQuantityChange = (
    componentId: string,
    change: number,
    available: number
  ) => {
    if (!isLoggedIn) {
      toast.error("Please login to select quantities");
      navigate("/auth/login");
      return;
    }

    setQuantities((prev) => {
      const updated = new Map(prev);
      const currentQuantity = updated.get(componentId) || 0;
      const newQuantity = Math.min(
        available,
        Math.max(0, currentQuantity + change)
      );
      updated.set(componentId, newQuantity);
      return updated;
    });
  };

  const getTotalCartItems = () => {
    return Array.from(cart.values()).reduce(
      (sum, quantity) => sum + quantity,
      0
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
          <div className="relative">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4 animate-pulse" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Loading Components
          </h3>
          <p className="text-gray-600">
            Fetching the latest electronic components...
          </p>
          <div className="mt-4 flex justify-center">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 custom-scrollbar">
      <div className="container mx-auto px-4 py-8 relative">
        {/* Scroll Progress Indicator */}
        <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
          <div
            className="h-full bg-gray-800 transition-all duration-300"
            style={{ width: "0%" }}
          ></div>
        </div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Electronic Components
            </h1>
            <p className="text-gray-600">
              Browse and add components to your cart
            </p>
          </div>

          {isLoggedIn && (
            <Link
              to="/cart"
              className={`bg-neutral-800 hover:bg-neutral-700 text-white rounded-full py-2 px-4 shadow-md flex items-center gap-2 ${
                isActive("/cart")
                  ? "text-blue-600 font-bold border-blue-600"
                  : "text-muted-foreground border-muted"
              }`}
            >
              <ShoppingCart className="h-4 w-4" />
              View Cart ({getTotalCartItems()})
            </Link>
          )}
        </div>

        {/* Login prompt for non-logged-in users */}
        {!isLoggedIn && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-blue-900">
                  Ready to lease components?
                </h3>
                <p className="text-blue-700">
                  Login to add items to your cart and place orders.
                </p>
              </div>
              <div className="flex gap-2">
                <Link to="/auth/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/auth/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter Bar */}
        <div className="mb-8 bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search components..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {searchQuery && (
                <p className="text-sm text-gray-600 mt-2 text-center">
                  {filteredComponents.length} component(s) found for "{searchQuery}"
                </p>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  {Object.keys(groupedComponents).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-all duration-300 ${
                    viewMode === "grid"
                      ? "bg-white shadow-md text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-all duration-300 ${
                    viewMode === "list"
                      ? "bg-white shadow-md text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Components by Type */}
        <div className="space-y-12">
          {Object.entries(groupedComponents).map(([type, typeComponents]) => {
            // Skip if category filter is active and doesn't match
            if (selectedCategory !== "all" && selectedCategory !== type) {
              return null;
            }

            return (
              <div key={type} className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">{type}</h2>
                  <Badge
                    variant="secondary"
                    className="bg-gray-100 text-gray-700"
                  >
                    {typeComponents.length} items
                  </Badge>
                </div>

                <div
                  className={`grid gap-6 ${
                    viewMode === "grid"
                      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                      : "grid-cols-1"
                  }`}
                >
                  {typeComponents.map((component, index) => (
                    <Card
                      key={component._id}
                      className="bg-white border-gray-200 hover:shadow-md transition-shadow"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <CardHeader className="pb-3">
                        <div className="aspect-square relative bg-gray-100 rounded-md overflow-hidden mb-3">
                          <img
                            src={component.image_url || "/placeholder.svg"}
                            alt={component.componentName}
                            className="object-contain w-full h-full"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src =
                                "/placeholder.svg?height=200&width=200";
                            }}
                          />
                        </div>

                        <CardTitle className="text-lg text-gray-900 line-clamp-2">
                          {component.componentName}
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="pb-3">
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant="outline" className="text-xs">
                            {component.componentType}
                          </Badge>
                          <span className="text-sm text-gray-600">
                            {component.quantity} available
                          </span>
                        </div>
                      </CardContent>

                      <CardFooter className="pt-0">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleQuantityChange(
                                  component._id,
                                  -1,
                                  component.quantity
                                )
                              }
                              disabled={
                                (quantities.get(component._id) || 0) === 0
                              }
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>

                            <span className="min-w-[2rem] text-center text-sm font-medium">
                              {quantities.get(component._id) || 0}
                            </span>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleQuantityChange(
                                  component._id,
                                  1,
                                  component.quantity
                                )
                              }
                              disabled={
                                component.quantity === 0 ||
                                (quantities.get(component._id) || 0) >=
                                  component.quantity
                              }
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          <Button
                            size="sm"
                            onClick={() =>
                              checkAuthAndProceed(() =>
                                updateCart(component._id)
                              )
                            }
                            disabled={quantities.get(component._id) === 0}
                            className="bg-gray-900 hover:bg-gray-800"
                          >
                            {isLoggedIn ? "Add" : "Login to Add"}
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>

                {Object.keys(groupedComponents).indexOf(type) <
                  Object.keys(groupedComponents).length - 1 && (
                  <Separator className="mt-8" />
                )}
              </div>
            );
          })}
        </div>

        {filteredComponents.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 opacity-20 rounded-full blur-xl"></div>
              <Package className="relative h-20 w-20 text-gray-400 mx-auto mb-6 animate-pulse" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {searchQuery || selectedCategory !== "all"
                ? "No components found"
                : "No components available"}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchQuery
                ? `No components match "${searchQuery}". Try a different search term.`
                : selectedCategory !== "all"
                ? `No components found in "${selectedCategory}" category.`
                : "Check back later for new components."}
            </p>
            {(searchQuery || selectedCategory !== "all") && (
              <div className="flex gap-3 justify-center">
                {searchQuery && (
                  <Button
                    variant="outline"
                    onClick={() => setSearchQuery("")}
                    className="border-blue-300 text-blue-600 hover:bg-blue-50"
                  >
                    Clear Search
                  </Button>
                )}
                {selectedCategory !== "all" && (
                  <Button
                    variant="outline"
                    onClick={() => setSelectedCategory("all")}
                    className="border-purple-300 text-purple-600 hover:bg-purple-50"
                  >
                    Show All Categories
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Cart Button */}
      {isLoggedIn && showFloatingCart && getTotalCartItems() > 0 && (
        <Link
          to="/cart"
          className="fixed bottom-6 right-6 bg-neutral-800 hover:bg-neutral-700 text-white rounded-full p-4 shadow-2xl transition-all duration-300 z-50"
        >
          <div className="relative">
            <ShoppingCart className="h-6 w-6" />
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {getTotalCartItems()}
            </div>
          </div>
        </Link>
      )}

      <Toaster />
    </div>
  );
};

export default Components;
