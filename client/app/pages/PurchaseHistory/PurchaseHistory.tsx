"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Package,
  Clock,
  CheckCircle,
  ArrowUpDown,
  Filter,
  Calendar,
  FileText,
  AlertTriangle,
} from "lucide-react";

interface Purchase {
  _id: string;
  userId: string;
  userName: string;
  componentName: string;
  permissionId: string;
  returned: boolean;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

type SortOrder = "asc" | "desc";
type FilterType = "all" | "pending" | "returned";

const PurchaseHistoryPage: React.FC = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [filteredPurchases, setFilteredPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [filter, setFilter] = useState<FilterType>("all");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserPurchases();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [purchases, filter, sortOrder]);

  const fetchUserPurchases = async () => {
    try {
      const response = await axios.get(
        "https://cnerlab-kf0v.onrender.com/api/v1/purchase/user"
      );
      setPurchases(
        Array.isArray(response.data) ? response.data : [response.data]
      );
      setError(null);
    } catch (error) {
      setError("Failed to fetch your purchase history");
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...purchases];

    // Apply filter
    if (filter === "pending") {
      filtered = filtered.filter((purchase) => !purchase.returned);
    } else if (filter === "returned") {
      filtered = filtered.filter((purchase) => purchase.returned);
    }

    // Apply sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    setFilteredPurchases(filtered);
  };

  const getStatusBadge = (purchase: Purchase) => {
    if (purchase.returned) {
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200"
        >
          <CheckCircle className="h-3 w-3 mr-1" />
          Returned
        </Badge>
      );
    }

    const dueDate = new Date(purchase.dueDate);
    const today = new Date();
    const daysDiff = Math.ceil(
      (dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24)
    );

    if (daysDiff < 0) {
      return (
        <Badge variant="destructive">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Overdue ({Math.abs(daysDiff)} days)
        </Badge>
      );
    } else if (daysDiff <= 3) {
      return (
        <Badge
          variant="outline"
          className="bg-yellow-50 text-yellow-700 border-yellow-200"
        >
          <Clock className="h-3 w-3 mr-1" />
          Due Soon ({daysDiff} days)
        </Badge>
      );
    }

    return (
      <Badge
        variant="outline"
        className="bg-blue-50 text-blue-700 border-blue-200"
      >
        <Clock className="h-3 w-3 mr-1" />
        Active
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getOverdueItems = () => {
    const today = new Date();
    return purchases.filter((p) => !p.returned && new Date(p.dueDate) < today);
  };

  const getDueSoonItems = () => {
    const today = new Date();
    const threeDaysFromNow = new Date(
      today.getTime() + 3 * 24 * 60 * 60 * 1000
    );
    return purchases.filter(
      (p) =>
        !p.returned &&
        new Date(p.dueDate) >= today &&
        new Date(p.dueDate) <= threeDaysFromNow
    );
  };

  const getCounts = () => {
    const pending = purchases.filter((p) => !p.returned).length;
    const returned = purchases.filter((p) => p.returned).length;
    const overdue = getOverdueItems().length;
    const dueSoon = getDueSoonItems().length;
    return { pending, returned, total: purchases.length, overdue, dueSoon };
  };

  const counts = getCounts();
  const overdueItems = getOverdueItems();
  const dueSoonItems = getDueSoonItems();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Loading your purchase history...</p>
            </div>
          </div>
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
            Back
          </Button> */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              My Purchase History
            </h1>
            <p className="text-gray-600">
              Track your borrowed components and return dates
            </p>
          </div>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Alerts for Overdue/Due Soon */}
        {overdueItems.length > 0 && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              You have {overdueItems.length} overdue item
              {overdueItems.length > 1 ? "s" : ""}. Please return them as soon
              as possible.
            </AlertDescription>
          </Alert>
        )}

        {dueSoonItems.length > 0 && (
          <Alert className="mb-6 border-yellow-200 bg-yellow-50">
            <Clock className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              You have {dueSoonItems.length} item
              {dueSoonItems.length > 1 ? "s" : ""} due within 3 days.
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Purchases
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {counts.total}
                  </p>
                </div>
                <Package className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Borrows
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {counts.pending}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Returned</p>
                  <p className="text-2xl font-bold text-green-600">
                    {counts.returned}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Overdue</p>
                  <p className="text-2xl font-bold text-red-600">
                    {counts.overdue}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Sort */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <Select
                  value={filter}
                  onValueChange={(value: FilterType) => setFilter(value)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Purchases</SelectItem>
                    <SelectItem value="pending">Active Only</SelectItem>
                    <SelectItem value="returned">Returned Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                className="flex items-center gap-2"
              >
                <ArrowUpDown className="h-4 w-4" />
                Due Date ({sortOrder === "asc" ? "Oldest" : "Newest"})
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Purchase List */}
        <div className="space-y-4">
          {filteredPurchases.map((purchase) => (
            <Card key={purchase._id} className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-semibold text-gray-900">
                        Purchase #{purchase.componentName}
                      </h3>
                      {getStatusBadge(purchase)}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        Permission: {purchase.componentName}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Purchased: {formatDate(purchase.createdAt)}
                      </div>
                      {!purchase.returned && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Due: {formatDate(purchase.dueDate)}
                        </div>
                      )}
                      {purchase.returned && (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-4 w-4" />
                          Returned: {formatDate(purchase.updatedAt)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredPurchases.length === 0 && (
            <Card className="bg-white">
              <CardContent className="text-center py-12">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No purchases found
                </h3>
                <p className="text-gray-600">
                  {filter === "all"
                    ? "You haven't made any purchases yet."
                    : `No ${filter} purchases found.`}
                </p>
                <Button
                  className="mt-4"
                  onClick={() => (window.location.href = "/components")}
                >
                  Browse Components
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchaseHistoryPage;
