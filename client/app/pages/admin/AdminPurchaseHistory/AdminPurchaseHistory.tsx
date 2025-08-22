import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast, Toaster } from "sonner";
import {
  Package,
  Clock,
  CheckCircle,
  RefreshCw,
  ArrowUpDown,
  Filter,
  Calendar,
  User,
  FileText,
  Loader2,
  AlertTriangle,
} from "lucide-react";
// import AdminLayout from "@/layout/AdminLayout";

interface Purchase {
  _id: string;
  userId: string;
  permissionId: string;
  userName: string;
  componentName: string;
  returned: boolean;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

type SortOrder = "asc" | "desc";
type FilterType = "all" | "pending" | "returned";

const AdminPurchaseHistoryPage: React.FC = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [filteredPurchases, setFilteredPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [filter, setFilter] = useState<FilterType>("all");
  const [activeTab, setActiveTab] = useState("pending");
  useEffect(() => {
    fetchPurchases();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [purchases, filter, sortOrder]);

  const fetchPurchases = async () => {
    try {
      const response = await axios.get(
        "https://cnerlab-kf0v.onrender.com/api/v1/purchase/"
      );

      setPurchases(response.data);
    } catch (error) {
      toast.error("Failed to fetch purchase history");
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

  const handleRenewal = async (purchaseId: string) => {
    setProcessingId(purchaseId);
    try {
      await axios.post(
        `https://cnerlab-kf0v.onrender.com/api/v1/purchase/renewal/${purchaseId}`
      );
      toast.success("Purchase renewed successfully");

      fetchPurchases();
    } catch (error) {
      toast.error("Failed to renew purchase");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReturn = async (purchaseId: string) => {
    setProcessingId(purchaseId);
    try {
      await axios.post(
        `https://cnerlab-kf0v.onrender.com/api/v1/purchase/return/${purchaseId}`
      );
      toast.success("Item marked as returned");
      fetchPurchases();
    } catch (error) {
      toast.error("Failed to mark as returned");
    } finally {
      setProcessingId(null);
    }
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
    const isOverdue = dueDate < today;

    if (isOverdue) {
      return (
        <Badge variant="destructive">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Overdue
        </Badge>
      );
    }

    return (
      <Badge
        variant="outline"
        className="bg-yellow-50 text-yellow-700 border-yellow-200"
      >
        <Clock className="h-3 w-3 mr-1" />
        Pending
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

  const getTabCounts = () => {
    const pending = purchases.filter((p) => !p.returned).length;
    const returned = purchases.filter((p) => p.returned).length;
    return { pending, returned, total: purchases.length };
  };

  const counts = getTabCounts();

  if (loading) {
    return (
      <>
        {/* <AdminLayout> */}
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Loading purchase history...</p>
          </div>
        </div>
        {/* </AdminLayout> */}
      </>
    );
  }

  return (
    <>
      {/* <AdminLayout> */}
      <div className="space-y-6 p-4">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Purchase History</h1>
          <p className="text-gray-600">
            Manage all component purchases and returns
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    Pending Returns
                  </p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {counts.pending}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-400" />
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
        </div>

        {/* Filters and Sort */}
        <Card>
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
                    <SelectItem value="pending">Pending Only</SelectItem>
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

        {/* Purchase Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pending">
              Pending Returns ({counts.pending})
            </TabsTrigger>
            <TabsTrigger value="returned">
              Returned ({counts.returned})
            </TabsTrigger>
          </TabsList>

          {/* <TabsContent value="pending" className="mt-6">
            <div className="space-y-4">
              {filteredPurchases
                .filter((p) => !p.returned)
                .map((purchase) => (
                  <Card key={purchase._id} className="bg-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">
                              Purchase #{purchase.componentName}
                            </h3>
                            {getStatusBadge(purchase)}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              User: {purchase.userName}
                            </div>
                            <div className="flex items-center gap-1">
                              <FileText className="h-4 w-4" />
                              Permission: {purchase.componentName}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Purchased: {formatDate(purchase.createdAt)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              Due: {formatDate(purchase.dueDate)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={processingId === purchase._id}
                              >
                                {processingId === purchase._id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <RefreshCw className="h-4 w-4" />
                                )}
                                Renew
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Renew Purchase
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to renew this purchase?
                                  This will extend the due date.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleRenewal(purchase._id)}
                                >
                                  Renew
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                disabled={processingId === purchase._id}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                {processingId === purchase._id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <CheckCircle className="h-4 w-4" />
                                )}
                                Mark Returned
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Mark as Returned
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to mark this item as
                                  returned? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleReturn(purchase._id)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  Mark Returned
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

              {filteredPurchases.filter((p) => !p.returned).length === 0 && (
                <Card className="bg-white">
                  <CardContent className="text-center py-12">
                    <CheckCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No pending returns
                    </h3>
                    <p className="text-gray-600">
                      All components have been returned.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent> */}

          <TabsContent value="pending" className="mt-6">
            <div className="space-y-4">
              {filteredPurchases
                .filter((p) => !p.returned)
                .map((purchase) => (
                  <Card key={purchase._id} className="bg-white">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900 text-base sm:text-lg">
                              Purchase #{purchase.componentName}
                            </h3>
                            <div className="mt-1 sm:mt-0">
                              {getStatusBadge(purchase)}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              User: {purchase.userName}
                            </div>
                            <div className="flex items-center gap-1">
                              <FileText className="h-4 w-4" />
                              Permission: {purchase.componentName}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Purchased: {formatDate(purchase.createdAt)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              Due: {formatDate(purchase.dueDate)}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-4 sm:mt-0 sm:ml-4">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={processingId === purchase._id}
                                className="flex items-center gap-1"
                              >
                                {processingId === purchase._id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <RefreshCw className="h-4 w-4" />
                                )}
                                Renew
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Renew Purchase
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to renew this purchase?
                                  This will extend the due date.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleRenewal(purchase._id)}
                                >
                                  Renew
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                disabled={processingId === purchase._id}
                                className="bg-green-600 hover:bg-green-700 flex items-center gap-1"
                              >
                                {processingId === purchase._id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <CheckCircle className="h-4 w-4" />
                                )}
                                Mark Returned
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Mark as Returned
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to mark this item as
                                  returned? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleReturn(purchase._id)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  Mark Returned
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

              {filteredPurchases.filter((p) => !p.returned).length === 0 && (
                <Card className="bg-white">
                  <CardContent className="text-center py-12">
                    <CheckCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No pending returns
                    </h3>
                    <p className="text-gray-600">
                      All components have been returned.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="returned" className="mt-6">
            <div className="space-y-4">
              {filteredPurchases
                .filter((p) => p.returned)
                .map((purchase) => (
                  <Card key={purchase._id} className="bg-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">
                              Purchase #{purchase.componentName}
                            </h3>
                            {getStatusBadge(purchase)}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              User: {purchase.userName}
                            </div>
                            <div className="flex items-center gap-1">
                              <FileText className="h-4 w-4" />
                              Permission: {purchase.componentName}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Purchased: {formatDate(purchase.createdAt)}
                            </div>
                            <div className="flex items-center gap-1">
                              <CheckCircle className="h-4 w-4" />
                              Returned: {formatDate(purchase.updatedAt)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

              {filteredPurchases.filter((p) => p.returned).length === 0 && (
                <Card className="bg-white">
                  <CardContent className="text-center py-12">
                    <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No returned items
                    </h3>
                    <p className="text-gray-600">
                      No components have been returned yet.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Toaster />
      {/* </AdminLayout> */}
    </>
  );
};

export default AdminPurchaseHistoryPage;
