// "use client";

// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { ArrowLeft, ShoppingCart } from "lucide-react";

// const CartPage: React.FC = () => {
//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="container mx-auto px-4 py-8">
//         <div className="flex items-center gap-4 mb-8">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => window.history.back()}
//             className="flex items-center gap-2"
//           >
//             <ArrowLeft className="h-4 w-4" />
//             Back
//           </Button>
//           <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
//         </div>

//         <Card className="bg-white border-gray-200">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <ShoppingCart className="h-5 w-5" />
//               Your Cart
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-center py-12">
//               <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
//               <h3 className="text-lg font-medium text-gray-900 mb-2">
//                 Cart functionality
//               </h3>
//               <p className="text-gray-600">
//                 This page would display cart items and checkout options.
//               </p>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default CartPage;

"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { toast, Toaster } from "sonner";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Package,
  AlertCircle,
  CheckCircle,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

interface CartItem {
  _id: string;
  userId: string;
  componentId: {
    _id: string;
    componentName: string;
    image_url: string;
    quantity: number;
  };
  quantity: number;
}

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get(
        "https://cnerlab-1.onrender.com/api/v1/cart/user",
        { withCredentials: true }
      );
      setCartItems(response.data);
    } catch (error) {
      toast.error("Failed to load cart items");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (componentId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeItem(componentId);
      return;
    }

    setUpdating(componentId);
    try {
      await axios.put(
        "https://cnerlab-1.onrender.com/api/v1/cart/user",
        {
          componentId,
          quantity: newQuantity,
        },
        { withCredentials: true }
      );

      setCartItems((prev) =>
        prev.map((item) =>
          item.componentId._id === componentId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
      toast.success("Quantity updated successfully");
    } catch (error) {
      toast.error("Failed to update quantity");
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (componentId: string) => {
    setUpdating(componentId);
    try {
      await axios.delete(
        "https://cnerlab-1.onrender.com/api/v1/cart/user/component",
        {
          data: { componentId },
          withCredentials: true,
        }
      );

      setCartItems((prev) =>
        prev.filter((item) => item.componentId._id !== componentId)
      );
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Failed to remove item");
    } finally {
      setUpdating(null);
    }
  };

  const clearCart = async () => {
    setUpdating("clear");
    try {
      await axios.delete("https://cnerlab-1.onrender.com/api/v1/cart/user", {
        withCredentials: true,
      });
      setCartItems([]);
      toast.success("Cart cleared successfully");
    } catch (error) {
      toast.error("Failed to clear cart");
    } finally {
      setUpdating(null);
    }
  };

  const requestPermission = async () => {
    if (cartItems.length === 0) return;

    setCheckingOut(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const item of cartItems) {
        try {
          await axios.post(
            "https://cnerlab-1.onrender.com/api/v1/permission/user/add",
            {
              componentId: item.componentId._id,
              quantity: item.quantity,
            },
            { withCredentials: true }
          );
          successCount++;
        } catch (error) {
          errorCount++;
        }
      }

      if (errorCount === 0) {
        toast.success("Permission request successful for all items");
        // Clear cart after successful permission request
        setCartItems([]);
      } else {
        toast.error(
          `Partial Success: ${successCount} items processed, ${errorCount} failed`
        );
      }
    } catch (error) {
      toast.error("Failed to request permission");
    } finally {
      setCheckingOut(false);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getUnavailableItems = () => {
    return cartItems.filter(
      (item) => item.quantity > item.componentId.quantity
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          {/* <Button
            variant="outline"
            size="sm"
            onClick={() => window.history.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Components
          </Button> */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-600">
              {cartItems.length === 0
                ? "Your cart is empty"
                : `${getTotalItems()} items in cart`}
            </p>
          </div>
        </div>

        {/* Availability Warning */}
        {getUnavailableItems().length > 0 && (
          <Alert className="mb-6 border-amber-200 bg-amber-50">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              Some items in your cart exceed available quantity. Please adjust
              quantities before requesting permission.
            </AlertDescription>
          </Alert>
        )}

        {cartItems.length === 0 ? (
          /* Empty Cart */
          <Card className="bg-white border-gray-200">
            <CardContent className="text-center py-16">
              <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-600 mb-6">
                Add some components to get started
              </p>
              {/* <Button onClick={() => (window.location.href = "/components")}>
                Browse Components
              </Button> */}

              {/* <Link
                to="/components"
                className={`flex items-center justify-center gap-2 px-4 py-2 border rounded-lg w-24 transition-colors bg-black text-white ${
                  isActive("/components")
                    ? "text-blue-600 font-bold border-blue-600"
                    : "text-muted-foreground border-muted"
                }`}
              >
                Browse Components
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link> */}

              <Link
                to="/components"
                className={`flex items-center justify-center gap-2 px-4 py-2 border rounded-lg transition-colors bg-black text-white mx-auto ${
                  isActive("/components")
                    ? "text-blue-600 font-bold border-blue-600"
                    : "text-muted-foreground border-muted"
                }`}
              >
                Browse Components
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Cart Items */}
            <div className="space-y-4">
              {cartItems.map((item) => (
                <Card key={item._id} className="bg-white border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Image */}
                      <div className="w-full sm:w-24 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                        <img
                          src={item.componentId.image_url || "/placeholder.svg"}
                          alt={item.componentId.componentName}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder.svg?height=96&width=96";
                          }}
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 space-y-2">
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {item.componentId.componentName}
                        </h3>

                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            Available: {item.componentId.quantity}
                          </Badge>
                          {item.quantity > item.componentId.quantity && (
                            <Badge variant="destructive" className="text-xs">
                              Exceeds availability
                            </Badge>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                updateQuantity(
                                  item.componentId._id,
                                  item.quantity - 1
                                )
                              }
                              disabled={updating === item.componentId._id}
                              className="h-8 w-8 p-0"
                            >
                              {updating === item.componentId._id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Minus className="h-3 w-3" />
                              )}
                            </Button>

                            <span className="min-w-[3rem] text-center font-medium">
                              {item.quantity}
                            </span>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                updateQuantity(
                                  item.componentId._id,
                                  item.quantity + 1
                                )
                              }
                              disabled={
                                updating === item.componentId._id ||
                                item.quantity >= item.componentId.quantity
                              }
                              className="h-8 w-8 p-0"
                            >
                              {updating === item.componentId._id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Plus className="h-3 w-3" />
                              )}
                            </Button>
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeItem(item.componentId._id)}
                            disabled={updating === item.componentId._id}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            {updating === item.componentId._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Cart Actions */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">Cart Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600">Total Items:</span>
                  <span className="font-semibold">{getTotalItems()}</span>
                </div>
                <Separator className="my-4" />
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    onClick={clearCart}
                    disabled={updating === "clear"}
                    className="flex items-center gap-2"
                  >
                    {updating === "clear" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                    Clear Cart
                  </Button>

                  <Button
                    onClick={requestPermission}
                    disabled={checkingOut || getUnavailableItems().length > 0}
                    className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800"
                  >
                    {checkingOut ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                    Ask for Permission
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <Toaster />
    </div>
  );
};

export default CartPage;
