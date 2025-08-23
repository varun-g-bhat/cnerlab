"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
import { Package, FileText, Users, TrendingUp } from "lucide-react";
// import AdminLayout from "@/layout/AdminLayout";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
  createdAt?: string;
  approvedDate?: string;
  rejectedDate?: string;
}

export default function AdminDashboard() {
  // const [permissions, setPermissions] = useState<Permission[]>([]);

  // const fetchData = async () => {
  //   try {
  //     const [componentsResponse, activeUsersResponse, approvalRateResponse] =
  //       await Promise.all([
  //         axios.get("http://localhost:5050/api/v1/components/all/count"),

  //         axios.get("http://localhost:5050/api/v1/statistics/visitorcount"),
  //         100,
  //       ]);

  //     const response = await axios.get(
  //       "http://localhost:5050/api/v1/permission/pending"
  //     );
  //     setPermissions(response.data);

  //     const pendingRequestsResponse = permissions.filter(
  //       (p) => p.status === "pending"
  //     ).length;

  //     const totalComponents = componentsResponse.data.totalComponents || 0;
  //     const pendingRequests = pendingRequestsResponse || 0;
  //     const activeUsers = activeUsersResponse.data.count || 0;
  //     const approvalRate = approvalRateResponse;

  //     return {
  //       totalComponents,
  //       pendingRequests,
  //       activeUsers,
  //       approvalRate,
  //     };
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     return {
  //       totalComponents: 0,
  //       pendingRequests: 0,
  //       activeUsers: 0,
  //       approvalRate: 0,
  //     };
  //   }
  // };

  // fetchData();

  const [_, setPermissions] = useState<Permission[]>([]);
  const [fetchingData, setFetchingData] = useState(true);
  const [totalComponents, setTotalComponents] = useState<number>(0);
  const [pendingRequests, setPendingRequests] = useState<number>(0);
  const [activeUsers, setActiveUsers] = useState<number>(0);
  const [approvalRate, setApprovalRate] = useState<number>(0);

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [componentsResponse, activeUsersResponse, approvalRateResponse] =
          await Promise.all([
            axios.get(
              "https://cnerlab-1.onrender.com/api/v1/components/all/count"
            ),
            axios.get(
              "https://cnerlab-1.onrender.com/api/v1/statistics/usercount"
            ),
            100,
          ]);

        const response = await axios.get(
          "https://cnerlab-1.onrender.com/api/v1/permission/",
          { withCredentials: true }
        );

        setPermissions(response.data);

        const pendingRequestsResponse = response.data.filter(
          (p: Permission) => p.status === "pending"
        ).length;

        setTotalComponents(componentsResponse.data.totalComponents || 0);
        setPendingRequests(pendingRequestsResponse || 0);
        setActiveUsers(activeUsersResponse.data.userCount || 0);
        setApprovalRate(approvalRateResponse);

        setFetchingData(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setFetchingData(false);
      }
    };

    fetchData();
  }, []);
  if (fetchingData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {/* <AdminLayout> */}
      <div className="space-y-6 p-4">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">
            Welcome to the electronics component management system
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Components
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalComponents}</div>
              <p className="text-xs text-muted-foreground">
                Components in inventory
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Requests
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingRequests}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Users
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeUsers}</div>
              <p className="text-xs text-muted-foreground">
                Users with cart items
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Approval Rate
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvalRate}%</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Component Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Add, edit, and manage electronic components in your inventory.
              </p>
              {/* <Button
                onClick={() =>
                  (window.location.href = "/cnerlabs/admin/components")
                }
              >
                Manage Components
              </Button> */}

              <Link
                to="/admin-components"
                className={`flex items-center justify-center gap-2 px-4 py-2 border rounded-lg transition-colors bg-black text-white ${
                  isActive("/admin-components")
                    ? "text-blue-600 font-bold border-blue-600"
                    : "text-muted-foreground border-muted"
                }`}
              >
                Manage Components
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Permission Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Review and approve component access requests from users.
              </p>
              {/* <Button
                onClick={() =>
                  (window.location.href = "/cnerlabs/admin/permissions")
                }
              >
                Review Requests
              </Button> */}

              <Link
                to="/admin-permissions"
                className={`flex items-center justify-center gap-2 px-4 py-2 border rounded-lg transition-colors bg-black text-white ${
                  isActive("/admin-permissions")
                    ? "text-blue-600 font-bold border-blue-600"
                    : "text-muted-foreground border-muted"
                }`}
              >
                Review Requests
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Purchase History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Supervise the component and the return date
              </p>
              {/* <Button
                onClick={() =>
                  (window.location.href = "/cnerlabs/admin/permissions")
                }
              >
                Review History
              </Button> */}

              <Link
                to="/admin-purchases"
                className={`flex items-center justify-center gap-2 px-4 py-2 border rounded-lg transition-colors bg-black text-white ${
                  isActive("/admin-purchases")
                    ? "text-blue-600 font-bold border-blue-600"
                    : "text-muted-foreground border-muted"
                }`}
              >
                Review History
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* </AdminLayout> */}
    </>
  );
}
