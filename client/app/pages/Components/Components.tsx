"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import "./Components.css";
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
  Star,
  Zap,
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
          <div className="relative">
            <Package className="h-16 w-16 text-blue-500 mx-auto mb-4 animate-pulse" />
            <div className="absolute inset-0 bg-blue-400 rounded-full opacity-20 animate-ping"></div>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Loading Components
          </h3>
          <p className="text-gray-600">
            Fetching the latest electronic components...
          </p>
          <div className="mt-4 flex justify-center">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 custom-scrollbar">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg
          width="60"
          height="60"
          viewBox="0 0 60 60"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g fill="none" fillRule="evenodd">
            <g fill="#3b82f6" fillOpacity="0.1">
              <circle cx="30" cy="30" r="2" />
            </g>
          </g>
        </svg>
      </div>

      <div className="container mx-auto px-4 py-8 relative">
        {/* Scroll Progress Indicator */}
        <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
            style={{ width: "0%" }}
          ></div>
        </div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-25"></div>
            <div className="relative bg-white p-6 rounded-lg border border-gray-200 shadow-lg">
              <h1 className="text-3xl font-bold gradient-text mb-2">
                Electronic Components
              </h1>
              <p className="text-gray-600 flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-500 float" />
                Browse and add components to your cart
              </p>
            </div>
          </div>

          {isLoggedIn && (
            <Link
              to="/cart"
              className={`relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full py-3 px-6 shadow-lg flex items-center gap-3 transition-all duration-300 transform hover:scale-105 ${
                isActive("/cart") ? "ring-2 ring-blue-300 ring-offset-2" : ""
              }`}
            >
              <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity duration-300"></div>
              <ShoppingCart className="h-5 w-5 relative z-10" />
              <span className="relative z-10 font-medium">
                View Cart ({getTotalCartItems()})
              </span>
              {getTotalCartItems() > 0 && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
                  {getTotalCartItems()}
                </div>
              )}
            </Link>
          )}
        </div>

        {/* Login prompt for non-logged-in users */}
        {!isLoggedIn && (
          <div className="mb-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-10 rounded-2xl"></div>
            <div className="relative bg-white/70 backdrop-blur-sm border border-blue-200 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-full">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Ready to lease components?
                    </h3>
                    <p className="text-gray-700 mt-1">
                      Login to add items to your cart and place orders.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Link to="/auth/login">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-blue-300 text-blue-600 hover:bg-blue-50 transition-all duration-300"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link to="/auth/signup">
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg"
                    >
                      Sign Up
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter Bar */}
        <div className="mb-8 bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md w-full">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-20 rounded-lg blur"></div>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Search components by name or type..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-4 py-3 w-full border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-lg transition-all duration-300"
                  />
                </div>
              </div>
              {searchQuery && (
                <p className="text-sm text-gray-600 mt-2 flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                    {filteredComponents.length}
                  </span>
                  component(s) found for "{searchQuery}"
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
                  className="bg-white border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
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
                      ? "bg-white shadow-md text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-all duration-300 ${
                    viewMode === "list"
                      ? "bg-white shadow-md text-blue-600"
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
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-20 rounded-lg blur"></div>
                      <h2 className="relative text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent px-4 py-2">
                        {type}
                      </h2>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border border-blue-200 px-3 py-1 text-sm font-medium"
                    >
                      {typeComponents.length} items
                    </Badge>
                  </div>
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
                      className="group relative bg-white/70 backdrop-blur-sm border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 rounded-2xl overflow-hidden card-hover animate-fade-in-scale"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      <CardHeader className="relative pb-3">
                        <div className="aspect-square relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden mb-4 shadow-inner">
                          <img
                            src={component.image_url || "/placeholder.svg"}
                            alt={component.componentName}
                            className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-110"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src =
                                "/placeholder.svg?height=200&width=200";
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>

                        <CardTitle className="relative text-lg text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                          {component.componentName}
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="relative pb-4">
                        <div className="flex items-center justify-between mb-4">
                          <Badge
                            variant="outline"
                            className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-blue-200 text-xs font-medium"
                          >
                            {component.componentType}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Package className="h-3 w-3 text-gray-400" />
                            <span className="text-sm text-gray-600 font-medium">
                              {component.quantity} available
                            </span>
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter className="relative pt-0 pb-4">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
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
                              className="h-8 w-8 p-0 border-gray-300 hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition-all duration-300"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>

                            <span className="min-w-[2.5rem] text-center text-sm font-bold text-gray-800 bg-white px-2 py-1 rounded border">
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
                              className="h-8 w-8 p-0 border-gray-300 hover:border-green-300 hover:bg-green-50 hover:text-green-600 transition-all duration-300"
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
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg transition-all duration-300 transform hover:scale-105 ripple"
                          >
                            {isLoggedIn ? (
                              <>
                                <ShoppingCart className="h-3 w-3 mr-1" />
                                Add
                              </>
                            ) : (
                              "Login to Add"
                            )}
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
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full p-4 shadow-2xl transition-all duration-300 transform hover:scale-110 z-50 animate-fade-in-scale"
        >
          <div className="relative">
            <ShoppingCart className="h-6 w-6" />
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
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
