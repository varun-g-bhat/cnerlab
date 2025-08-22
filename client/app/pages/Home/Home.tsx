import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  FileText,
  Users,
  ArrowRight,
  Zap,
  Target,
  Eye,
  Heart,
  ShoppingCart,
  Settings,
  TrendingUp,
} from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";

interface Stats {
  totalComponents: number;
  totalRequests: number;
  totalVisitors: number;
}

const Home: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    totalComponents: 0,
    totalRequests: 0,
    totalVisitors: 0,
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    // Simulate fetching stats with animated counting
    const fetchStats = async () => {
      try {
        const [componentsResponse, requestsResponse, visitorsResponse] =
          await Promise.all([
            axios.get(
              "https://cnerlab-kf0v.onrender.com/api/v1/components/all/count"
            ),
            axios.get(
              "https://cnerlab-kf0v.onrender.com/api/v1/statistics/requestcount"
            ),
            axios.get(
              "https://cnerlab-kf0v.onrender.com/api/v1/statistics/visitorcount"
            ),
          ]);

        // Accessing data from responses

        console.log(
          "Components Response:",
          componentsResponse.data.totalComponents
        );
        console.log("Requests Response:", requestsResponse.data.count);
        console.log("Visitors Response:", visitorsResponse.data.count);
        const totalComponents = componentsResponse.data?.totalComponents || 0;
        const totalRequests = requestsResponse.data?.count || 0;
        const totalVisitors = visitorsResponse.data?.count || 0;

        const finalStats = {
          totalComponents,
          totalRequests,
          totalVisitors,
        };

        const duration = 2000;
        const steps = 60;
        const interval = duration / steps;

        let step = 0;

        timer = setInterval(() => {
          step++;
          const progress = step / steps;

          setStats({
            totalComponents: Math.floor(finalStats.totalComponents * progress),
            totalRequests: Math.floor(finalStats.totalRequests * progress),
            totalVisitors: Math.floor(finalStats.totalVisitors * progress),
          });

          if (step >= steps) {
            clearInterval(timer);
            setStats(finalStats);
          }
        }, interval);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      }
    };

    setMounted(true);
    fetchStats();

    return () => clearInterval(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const statsVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const isActive = (path: string) => location.pathname === path;

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      {/* <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-10 h-10 bg-gray-900 rounded-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                ComponentLab
              </span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a
                href="/components"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Browse Components
              </a>
              <a
                href="/cart"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Cart
              </a>
              <a
                href="/admin"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Admin
              </a>
            </nav>
            <Button onClick={() => (window.location.href = "/components")}>
              Get Started
            </Button>
          </div>
        </div>
      </header> */}

      {/* Hero Section */}
      <motion.section
        className="py-20 px-4"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="container mx-auto text-center">
          <motion.div variants={itemVariants}>
            <Badge
              variant="outline"
              className="mb-6 bg-blue-50 text-blue-700 border-blue-200"
            >
              <TrendingUp className="h-3 w-3 mr-1" />
              Live Component Management System
            </Badge>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
            variants={itemVariants}
          >
            Access Electronic Components
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Seamlessly
            </span>
          </motion.h1>

          <motion.p
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            Streamline your project workflow with our intelligent component
            management system. Browse, request, and manage electronic components
            with ease.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={itemVariants}
          >
            <Link
              to="/components"
              className={`flex items-center justify-center gap-2 px-4 py-2 border rounded-lg transition-colors bg-black text-white ${
                isActive("/components")
                  ? "text-blue-600 font-bold border-blue-600"
                  : "text-muted-foreground border-muted"
              }`}
            >
              Browse Components
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* <Button
              variant="outline"
              size="lg"
              onClick={() => (window.location.href = "/admin")}
            >
              <Settings className="mr-2 h-4 w-4" />
              Admin Panel
            </Button> */}
          </motion.div>
        </div>
      </motion.section>

      {/* Statistics Section */}
      <motion.section
        className="py-16 px-4 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <div className="container mx-auto">
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Live Dashboard
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Real-time statistics showing the current state of our component
              management system
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div variants={statsVariants}>
              <Card className="text-center border-2 hover:border-blue-200 transition-colors group">
                <CardHeader className="pb-3">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                    <Package className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-gray-600 text-sm font-medium uppercase tracking-wide">
                    Total Components
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {stats.totalComponents.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-500">
                    Available in inventory
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={statsVariants}>
              <Card className="text-center border-2 hover:border-green-200 transition-colors group">
                <CardHeader className="pb-3">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                    <FileText className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-gray-600 text-sm font-medium uppercase tracking-wide">
                    Total Requests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {stats.totalRequests.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-500">
                    Permission requests made
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={statsVariants}>
              <Card className="text-center border-2 hover:border-purple-200 transition-colors group">
                <CardHeader className="pb-3">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-gray-600 text-sm font-medium uppercase tracking-wide">
                    Total Visitors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {stats.totalVisitors.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-500">Platform visitors</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Vision & Mission Section */}
      <motion.section
        className="py-20 px-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <div className="container mx-auto">
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our Vision & Mission
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Driving innovation through accessible technology and seamless
              component management
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div variants={itemVariants}>
              <Card className="h-full bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <Eye className="h-6 w-6 text-blue-400" />
                    </div>
                    <CardTitle className="text-2xl text-white">
                      Our Vision
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    "To empower students and innovators by providing seamless
                    access to electronic components for academic and personal
                    projects."
                  </p>
                  <Separator className="my-6 bg-white/10" />
                  <div className="flex items-center gap-2 text-blue-400">
                    <Target className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Empowering Innovation
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="h-full bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <Heart className="h-6 w-6 text-purple-400" />
                    </div>
                    <CardTitle className="text-2xl text-white">
                      Our Mission
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    "Our mission is to simplify the borrowing process for
                    components, ensure availability, and build a tech-enabled
                    lab ecosystem."
                  </p>
                  <Separator className="my-6 bg-white/10" />
                  <div className="flex items-center gap-2 text-purple-400">
                    <Zap className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Tech-Enabled Ecosystem
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="py-20 px-4 bg-gray-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <div className="container mx-auto">
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose <span className="text-blue-400">CNERlab</span>?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience the future of component management with our
              comprehensive platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div variants={itemVariants}>
              <Card className="text-center h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle>Smart Inventory</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Real-time tracking of component availability with
                    intelligent categorization and search capabilities.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="text-center h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingCart className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle>Easy Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Streamlined permission system with instant notifications and
                    approval workflows for quick access.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="text-center h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Settings className="h-8 w-8 text-purple-600" />
                  </div>
                  <CardTitle>Admin Control</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Comprehensive admin panel for managing components, users,
                    and permissions with detailed analytics.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-20 px-4 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <div className="container mx-auto text-center">
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of students and innovators who are already using
              ComponentLab to bring their projects to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/components"
                className={`flex items-center justify-center gap-2 px-4 py-2 border rounded-lg transition-colors bg-black text-white ${
                  isActive("/components")
                    ? "text-blue-600 font-bold border-blue-600"
                    : "text-muted-foreground border-muted"
                }`}
              >
                Browse Components
              </Link>
              {/* <Button
                variant="outline"
                size="lg"
                onClick={() => (window.location.href = `/cnerlabs/cart`)}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                View Cart
              </Button> */}

              <Link
                to="/cart"
                className={`flex items-center justify-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                  isActive("/cart")
                    ? "text-blue-600 font-bold border-blue-600"
                    : "text-muted-foreground border-muted"
                }`}
              >
                <ShoppingCart className="h-4 w-4" />
                View Cart
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      {/* <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="flex items-center justify-center w-8 h-8 bg-white rounded-lg">
                <Zap className="h-5 w-5 text-gray-900" />
              </div>
              <span className="text-lg font-bold">ComponentLab</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-400">
              <a
                href="/components"
                className="hover:text-white transition-colors"
              >
                Components
              </a>
              <a href="/cart" className="hover:text-white transition-colors">
                Cart
              </a>
              <a href="/admin" className="hover:text-white transition-colors">
                Admin
              </a>
            </div>
          </div>
          <Separator className="my-8 bg-gray-700" />
          <div className="text-center text-gray-400 text-sm">
            <p>
              &copy; 2024 ComponentLab. All rights reserved. Built with React,
              TypeScript, and TailwindCSS.
            </p>
          </div>
        </div>
      </footer> */}
    </div>
  );
};

export default Home;
