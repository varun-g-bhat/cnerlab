// "use client";

// import type React from "react";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   Settings,
//   Package,
//   FileText,
//   Menu,
//   X,
//   History,
//   Link,
//   LogOut,
// } from "lucide-react";
// import { useDispatch, useSelector } from "react-redux";
// import type { RootState } from "@/store/store";
// import { useNavigate } from "react-router-dom";
// import { logoutUser } from "@/api/authService";
// import { logout } from "@/store/auth/authSlice";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// interface AdminLayoutProps {
//   children: React.ReactNode;
// }

// export default function AdminLayout({ children }: AdminLayoutProps) {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   // const navigation = [
//   //   {
//   //     name: "Components",
//   //     href: "/admin/components",
//   //     icon: Package,
//   //     current: false,
//   //   },
//   //   {
//   //     name: "Permissions",
//   //     href: "/admin/permissions",
//   //     icon: FileText,
//   //     current: false,
//   //   },
//   //   {
//   //     name: "Purchase History",
//   //     href: "/admin/purchases",
//   //     icon: History,
//   //     current: false,
//   //   },
//   // ];

//   const navigation = [
//     {
//       name: "Components",
//       href: "/cnerlabs/admin-components",
//       icon: Package,
//       current: false,
//     },
//     {
//       name: "Permissions",
//       href: "/cnerlabs/admin-permissions",
//       icon: FileText,
//       current: false,
//     },
//     {
//       name: "Purchase History",
//       href: "/cnerlabs/admin-purchases",
//       icon: History,
//       current: false,
//     },
//   ];

//   const dispatch = useDispatch();
//   const { user, isLoggedIn, userProfile } = useSelector(
//     (state: RootState) => state.auth
//   );

//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     await logoutUser();
//     dispatch(logout());
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Mobile sidebar */}
//       <div
//         className={`fixed inset-0 z-50 lg:hidden ${
//           sidebarOpen ? "block" : "hidden"
//         }`}
//       >
//         <div
//           className="fixed inset-0 bg-gray-600 bg-opacity-75"
//           onClick={() => setSidebarOpen(false)}
//         />
//         <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
//           <div className="flex h-16 items-center justify-between px-4">
//             <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => setSidebarOpen(false)}
//             >
//               <X className="h-5 w-5" />
//             </Button>
//           </div>
//           <nav className="flex-1 space-y-1 px-2 py-4">
//             {navigation.map((item) => (
//               <a
//                 key={item.name}
//                 href={item.href}
//                 className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
//               >
//                 <item.icon className="mr-3 h-5 w-5" />
//                 {item.name}
//               </a>
//             ))}
//           </nav>
//         </div>
//       </div>

//       {/* Desktop sidebar */}
//       <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
//         <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
//           <div className="flex h-16 items-center px-4">
//             <Settings className="h-8 w-8 text-gray-900 mr-3" />
//             <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
//           </div>
//           <nav className="flex-1 space-y-1 px-2 py-4">
//             {navigation.map((item) => (
//               <a
//                 key={item.name}
//                 href={item.href}
//                 className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
//               >
//                 <item.icon className="mr-3 h-5 w-5" />
//                 {item.name}
//               </a>
//             ))}
//           </nav>
//         </div>
//       </div>

//       {/* Main content */}
//       <div className="lg:pl-64">
//         <div className="flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm lg:gap-x-6">
//           <Button
//             variant="ghost"
//             size="sm"
//             className="lg:hidden"
//             onClick={() => setSidebarOpen(true)}
//           >
//             <Menu className="h-5 w-5" />
//           </Button>
//           <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
//             <div className="flex items-center gap-x-4 lg:gap-x-6 ">
//               <Badge
//                 variant="secondary"
//                 className="bg-blue-100 text-blue-800 hidden xl:block lg:block md:block"
//               >
//                 Admin Dashboard
//               </Badge>
//               {!isLoggedIn ? (
//                 <div className="ml-auto flex-1 sm:flex-initial">
//                   <div className="flex gap-3 relative">
//                     <Link to="/auth/signup">
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         className="ml-auto gap-1.5 text-sm"
//                       >
//                         Sign Up
//                       </Button>
//                     </Link>
//                     <Link to="/auth/login">
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         className="ml-auto gap-1.5 text-sm"
//                       >
//                         Sign In
//                       </Button>
//                     </Link>
//                   </div>
//                 </div>
//               ) : (
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <div className="flex gap-1">
//                       <Avatar className="rounded-none">
//                         <AvatarImage
//                           className="rounded-full"
//                           src={`data:image/svg+xml;base64,${btoa(
//                             userProfile!
//                           )}`}
//                         />
//                         <AvatarFallback>CN</AvatarFallback>
//                         <span className="top-0 left-7 absolute  w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></span>
//                       </Avatar>

//                       <Button variant="secondary">{user}</Button>
//                     </div>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent align="end" className="w-56">
//                     <DropdownMenuLabel>My Account</DropdownMenuLabel>
//                     <DropdownMenuSeparator />
//                     <DropdownMenuItem onClick={() => navigate("/purchases")}>
//                       My Purchases
//                     </DropdownMenuItem>
//                     <DropdownMenuItem onClick={() => navigate("")}>
//                       Edit Profile
//                     </DropdownMenuItem>

//                     <DropdownMenuSeparator />
//                     <DropdownMenuItem onClick={handleLogout}>
//                       <LogOut className="mr-2 h-4 w-4" />
//                       <span>Log out</span>
//                     </DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               )}
//             </div>
//           </div>
//         </div>

//         <main className="py-8">
//           <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//             {children}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }
