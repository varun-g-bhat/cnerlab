"use client";

import type React from "react";

import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster, toast } from "sonner";
import { Plus, Edit, Trash2, Package, Loader2 } from "lucide-react";
// import AdminLayout from "@/layout/AdminLayout";
import { useNavigate } from "react-router-dom";

interface Component {
  _id: string;
  componentType: string;
  componentName: string;
  image_url: string;
  quantity: number;
}

interface ComponentForm {
  componentType: string;
  componentName: string;
  image_url: string;
  quantity: number;
}

interface IsAdmin {
  role: string;
}

const componentTypes = [
  "SENSORS",
  "MICROCONTROLLERS",
  "ACTUATORS",
  "DISPLAYS",
  "COMMUNICATION",
  "POWER",
  "PASSIVE",
];

const AdminComponents: React.FC = () => {
  const [components, setComponents] = useState<Component[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingComponent, setEditingComponent] = useState<Component | null>(
    null
  );
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  const [formData, setFormData] = useState<ComponentForm>({
    componentType: "",
    componentName: "",
    image_url: "",
    quantity: 0,
  });

  // const { user, isLoggedIn, userProfile } = useSelector(
  //   (state: RootState) => state.auth
  // );

  const navigate = useNavigate();

  // if (!isLoggedIn || !userProfile) {
  //   navigate("/auth/login");
  // }

  useEffect(() => {
    fetchRole();
    fetchComponents();
  }, []);

  const fetchRole = async () => {
    try {
      const response = await axios.get<IsAdmin>(
        "https://cnerlab.onrender.com/api/v1/auth/isAdmin"
      );

      setRole(response.data.role); // Store the role
    } catch (error) {
      toast.error("Failed to fetch user role");
    }
  };

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

  useEffect(() => {
    // Wait until role is fetched
    if (role !== "admin") {
      // navigate("/"); // Redirect to home if not an admin
    }
  }, [role, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.componentType ||
      !formData.componentName ||
      formData.quantity < 0
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(
        "https://cnerlab.onrender.com/api/v1/components/",
        formData
      );
      toast.success("Component added successfully");
      setShowAddDialog(false);
      resetForm();
      fetchComponents();
    } catch (error) {
      toast.error("Failed to add component");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingComponent || !formData.componentType || formData.quantity < 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      await axios.put(
        `https://cnerlab.onrender.com/api/v1/components/${editingComponent.componentName}`,
        {
          componentType: formData.componentType,
          image_url: formData.image_url,
          quantity: formData.quantity,
        }
      );
      toast.success("Component updated successfully");
      setShowEditDialog(false);
      setEditingComponent(null);
      resetForm();
      fetchComponents();
    } catch (error) {
      toast.error("Failed to update component");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (componentName: string) => {
    try {
      await axios.delete(
        `https://cnerlab.onrender.com/api/v1/components/${componentName}`
      );
      toast.success("Component deleted successfully");
      fetchComponents();
    } catch (error) {
      toast.error("Failed to delete component");
    }
  };

  const openEditDialog = (component: Component) => {
    setEditingComponent(component);
    setFormData({
      componentType: component.componentType,
      componentName: component.componentName,
      image_url: component.image_url,
      quantity: component.quantity,
    });
    setShowEditDialog(true);
  };

  const resetForm = () => {
    setFormData({
      componentType: "",
      componentName: "",
      image_url: "",
      quantity: 0,
    });
  };

  if (loading) {
    return (
      <>
        {/* <AdminLayout> */}
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Loading components...</p>
          </div>
        </div>
        {/* </AdminLayout> */}
      </>
    );
  }

  if (role === "admin") {
    return (
      <>
        {/*  <AdminLayout> */}
        <div className="space-y-6 p-4">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Component Management
              </h1>
              <p className="text-gray-600">
                Manage electronic components inventory
              </p>
            </div>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Component
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Component</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="componentType">Component Type</Label>
                  <Select
                    value={formData.componentType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, componentType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {componentTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="componentName">Component Name</Label>
                  <Input
                    id="componentName"
                    value={formData.componentName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        componentName: e.target.value,
                      })
                    }
                    placeholder="Enter component name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    type="url"
                    value={formData.image_url}
                    onChange={(e) =>
                      setFormData({ ...formData, image_url: e.target.value })
                    }
                    placeholder="Enter image URL"
                  />
                </div>
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="0"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quantity: Number.parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="Enter quantity"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    Add Component
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* Components List */}
          {/* <div className="grid gap-4">
            {components.map((component) => (
              <Card key={component._id} className="bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={component.image_url || "/placeholder.svg"}
                        alt={component.componentName}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder.svg?height=64&width=64";
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {component.componentName}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">
                          {component.componentType}
                        </Badge>
                        <span className="text-sm text-gray-600">
                          Qty: {component.quantity}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(component)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete Component
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "
                              {component.componentName}"? This action cannot be
                              undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                handleDelete(component.componentName)
                              }
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div> */}

          <div className="grid gap-4">
            {components.map((component) => (
              <Card key={component._id} className="bg-white">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 mx-auto sm:mx-0">
                      <img
                        src={component.image_url || "/placeholder.svg"}
                        alt={component.componentName}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder.svg?height=64&width=64";
                        }}
                      />
                    </div>

                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="font-semibold text-gray-900 text-base sm:text-lg">
                        {component.componentName}
                      </h3>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 mt-1 justify-center sm:justify-start">
                        <Badge variant="outline">
                          {component.componentType}
                        </Badge>
                        <span className="text-sm text-gray-600 mt-1 sm:mt-0">
                          Qty: {component.quantity}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-center sm:justify-end items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(component)}
                        className="flex items-center justify-center"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 flex items-center justify-center"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete Component
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "
                              {component.componentName}"? This action cannot be
                              undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                handleDelete(component.componentName)
                              }
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {components.length === 0 && (
            <Card className="bg-white">
              <CardContent className="text-center py-12">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No components found
                </h3>
                <p className="text-gray-600">
                  Add your first component to get started.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Edit Dialog */}
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Component</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleEdit} className="space-y-4">
                <div>
                  <Label htmlFor="editComponentType">Component Type</Label>
                  <Select
                    value={formData.componentType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, componentType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {componentTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="editImageUrl">Image URL</Label>
                  <Input
                    id="editImageUrl"
                    type="url"
                    value={formData.image_url}
                    onChange={(e) =>
                      setFormData({ ...formData, image_url: e.target.value })
                    }
                    placeholder="Enter image URL"
                  />
                </div>
                <div>
                  <Label htmlFor="editQuantity">Quantity</Label>
                  <Input
                    id="editQuantity"
                    type="number"
                    min="0"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quantity: Number.parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="Enter quantity"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowEditDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    Update Component
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <Toaster richColors position="bottom-right" />
        {/* // </AdminLayout> */}
      </>
    );
  }
};

export default AdminComponents;
