"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast, Toaster } from "sonner";
import {
  Check,
  X,
  Clock,
  FileText,
  User,
  Package,
  Loader2,
} from "lucide-react";
// import AdminLayout from "@/layout/AdminLayout";

axios.defaults.withCredentials = true;

interface componentId {
  _id: string;
  componentName: string;
}
interface Permission {
  _id: string;
  userId: string;
  componentId: componentId;
  componentName?: string;
  userName: string;
  quantity: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  approvedDate?: string;
  rejectedDate?: string;
}

const AdminPermission: React.FC = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);

  useEffect(() => {
    fetchPermissions();
  }, [activeTab]);

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      let url = "https://cnerlab.onrender.com/api/v1/permission/";

      switch (activeTab) {
        case "pending":
          url = "https://cnerlab.onrender.com/api/v1/permission/pending";
          break;
        case "approved":
          url = "https://cnerlab.onrender.com/api/v1/permission/approved";
          break;
        case "rejected":
          url = "https://cnerlab.onrender.com/api/v1/permission/rejected";
          break;
      }

      const response = await axios.get(url);
      setPermissions(response.data);
    } catch (error) {
      toast.error("Failed to fetch permissions");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (permissionId: string) => {
    setProcessingId(permissionId);
    try {
      await axios.put(
        `https://cnerlab.onrender.com/api/v1/permission/approve/${permissionId}`,
        { withCredentials: true }
      );
      toast.success("Permission approved successfully");

      await axios.post(
        "https://cnerlab.onrender.com/api/v1/purchase/",
        { permissionId },
        {
          withCredentials: true,
        }
      );
      fetchPermissions();
    } catch (error) {
      toast.error("Failed to approve permission");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (permissionId: string) => {
    setProcessingId(permissionId);
    try {
      await axios.put(
        `https://cnerlab.onrender.com/api/v1/permission/reject/${permissionId}`,
        { withCredentials: true }
      );
      toast.success("Permission rejected successfully");
      fetchPermissions();
    } catch (error) {
      toast.error("Failed to reject permission");
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            <Check className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            <X className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const fetchAllPermissions = async () => {
    try {
      const allPermissions = await axios.get(
        "https://cnerlab.onrender.com/api/v1/permission/"
      );
      setAllPermissions(allPermissions.data);
    } catch (error) {
      console.error("Failed to fetch all permissions:", error);
      return [];
    }
  };
  const getPermissionCounts = () => {
    fetchAllPermissions();
    const all = allPermissions.length;
    const pending = allPermissions.filter((p) => p.status === "pending").length;
    const approved = allPermissions.filter(
      (p) => p.status === "approved"
    ).length;
    const rejected = allPermissions.filter(
      (p) => p.status === "rejected"
    ).length;
    return { all, pending, approved, rejected };
  };

  const counts = getPermissionCounts();

  if (loading) {
    return (
      <>
        {/* <AdminLayout> */}
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Loading permissions...</p>
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
          <h1 className="text-2xl font-bold text-gray-900">
            Permission Management
          </h1>
          <p className="text-gray-600">
            Review and manage component access requests
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Requests
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {counts.all}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
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
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-green-600">
                    {counts.approved}
                  </p>
                </div>
                <Check className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">
                    {counts.rejected}
                  </p>
                </div>
                <X className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Permissions Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4">
            <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({counts.pending})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved ({counts.approved})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected ({counts.rejected})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <div className="space-y-4">
              {permissions.map((permission) => (
                <Card key={permission._id} className="bg-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900">
                              {typeof permission.componentId.componentName ===
                              "string"
                                ? permission.componentId.componentName
                                : permission.componentId._id ||
                                  "Unknown Component"}
                            </h3>
                            {getStatusBadge(permission.status)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              User Name: {permission.userName}
                            </div>
                            <div className="flex items-center gap-1">
                              <Package className="h-4 w-4" />
                              Quantity: {permission.quantity}
                            </div>
                            <div>
                              Requested:{" "}
                              {new Date(
                                permission.createdAt
                              ).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>

                      {permission.status === "pending" && (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReject(permission._id)}
                            disabled={processingId === permission._id}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            {processingId === permission._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <X className="h-4 w-4" />
                            )}
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleApprove(permission._id)}
                            disabled={processingId === permission._id}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {processingId === permission._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Check className="h-4 w-4" />
                            )}
                            Approve
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {permissions.length === 0 && (
                <Card className="bg-white">
                  <CardContent className="text-center py-12">
                    <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No permissions found
                    </h3>
                    <p className="text-gray-600">
                      {activeTab === "all"
                        ? "No permission requests have been made yet."
                        : `No ${activeTab} permission requests found.`}
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

export default AdminPermission;
