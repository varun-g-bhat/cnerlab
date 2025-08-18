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
import { ShoppingCart, Plus, Minus, Package } from "lucide-react";
import { toast, Toaster } from "sonner";
import { Link } from "react-router-dom";

interface Component {
  _id: string;
  componentType: string;
  componentName: string;
  image_url: string;
  quantity: number;
}

const Components: React.FC = () => {
  const [components, setComponents] = useState<Component[]>([]);
  const [cart, setCart] = useState<Map<string, number>>(new Map());
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState<Map<string, number>>(new Map());
  //   const toast = useToast();

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    fetchComponents();
  }, []);

  const fetchComponents = async () => {
    try {
      const response = await axios.get(
        "https://cnerlab.onrender.com/api/v1/components/"
      );
      setComponents(response.data);
    } catch (error) {
      toast.error("Failed to fetch components");
    } finally {
      setLoading(false);
    }
  };

  const groupedComponents = components.reduce((acc, component) => {
    if (!acc[component.componentType]) {
      acc[component.componentType] = [];
    }
    acc[component.componentType].push(component);
    return acc;
  }, {} as Record<string, Component[]>);

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
          "https://cnerlab.onrender.com/api/v1/cart/user",
          {
            componentId,
            quantity,
          },
          { withCredentials: true }
        );
      } else {
        await axios.put(
          "https://cnerlab.onrender.com/api/v1/cart/user",
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

  // const handleQuantityChange = (componentId: string, change: number) => {
  //   const currentQuantity = cart.get(componentId) || 0;
  //   const newQuantity = Math.max(0, currentQuantity + change);
  //   updateCart(componentId, newQuantity);
  // };

  const handleQuantityChange = (
    componentId: string,
    change: number,
    available: number
  ) => {
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
        <div className="text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Loading components...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
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
          {/* <Button
            variant="outline"
            className="bg-neutral-800 hover:bg-neutral-700 text-white rounded-full py-2 px-4 shadow-md flex items-center gap-2"
            onClick={() => (window.location.href = "/cart")}
          >
            <ShoppingCart className="h-4 w-4" />
            View Cart ({getTotalCartItems()})
          </Button> */}

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
        </div>

        {/* Components by Type */}
        <div className="space-y-8">
          {Object.entries(groupedComponents).map(([type, typeComponents]) => (
            <div key={type}>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">{type}</h2>
                <Badge
                  variant="secondary"
                  className="bg-gray-100 text-gray-700"
                >
                  {typeComponents.length} items
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {typeComponents.map((component) => (
                  <Card
                    key={component._id}
                    className="bg-white border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <CardHeader className="pb-3">
                      {/* <div className="aspect-square relative bg-gray-100 rounded-md overflow-hidden mb-3">
                        <img
                          src={component.image_url || "/placeholder.svg"}
                          alt={component.componentName}
                          className="object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src =
                              "/placeholder.svg?height=200&width=200";
                          }}
                        />
                      </div> */}
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
                          onClick={() => updateCart(component._id)}
                          disabled={quantities.get(component._id) === 0}
                          className="bg-gray-900 hover:bg-gray-800"
                        >
                          Add
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
          ))}
        </div>

        {components.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No components found
            </h3>
            <p className="text-gray-600">
              Check back later for new components.
            </p>
          </div>
        )}
      </div>

      <Toaster />
    </div>
  );
};

export default Components;
