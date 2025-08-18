"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

export function ViewCartButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show button after scrolling a bit
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-6 right-6 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <Button className="bg-neutral-800 hover:bg-neutral-700 text-white rounded-full py-2 px-4 shadow-md flex items-center gap-2">
        <ShoppingCart
          className="h-5 w-5"
          onClick={() => (window.location.href = "/cart")}
        />
        <span>View Cart</span>
      </Button>
    </div>
  );
}
