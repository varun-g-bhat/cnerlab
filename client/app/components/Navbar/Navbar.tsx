// import React from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { LogOut, Menu } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
// import { useDispatch, useSelector } from "react-redux";
// import type { RootState } from "@/store/store";
// import { logoutUser } from "@/api/authService";
// import { logout } from "@/store/auth/authSlice";

// const Navbar: React.FC = () => {
//   const dispatch = useDispatch();
//   const { user, isLoggedIn, userProfile } = useSelector(
//     (state: RootState) => state.auth
//   );

//   const navigate = useNavigate();
//   const location = useLocation();

//   const handleLogout = async () => {
//     await logoutUser();
//     dispatch(logout());
//   };

//   const isActive = (path: string) => {
//     return location.pathname === path;
//   };

//   const isAdmin = useSelector((state: RootState) => state.auth.role);

//   return (
//     <>
//       {/* <div className="flex w-full flex-col ">
//         <header className="sticky z-[1] top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-900">
//           <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
//             <Link
//               to="/"
//               className="flex items-center gap-2 text-lg font-semibold md:text-base"
//             >
//               <img
//                 src="https://i.ibb.co/ymr4kp0f/CNER-LAB-LOGO.jpg"
//                 className="h-10 me-3"
//                 alt="FlowBite Logo"
//               />
//               <span>CNER - LAB</span>
//             </Link>
//             <Link
//               to="/"
//               className="text-foreground transition-colors hover:text-foreground"
//             >
//               Home
//             </Link>
//             <Link
//               to="/components"
//               className="text-muted-foreground transition-colors hover:text-foreground"
//             >
//               Components
//             </Link>

//             <Link
//               to="/cart"
//               className="text-muted-foreground transition-colors hover:text-foreground"
//             >
//               Cart
//             </Link>

//             <Link
//               to="/contact"
//               className="text-muted-foreground transition-colors hover:text-foreground"
//             >
//               Contact us
//             </Link>
//           </nav>
//           <Sheet>
//             <SheetTrigger asChild>
//               <Button
//                 variant="outline"
//                 size="icon"
//                 className="shrink-0 md:hidden"
//               >
//                 <Menu className="h-5 w-5" />
//                 <span className="sr-only">Toggle navigation menu</span>
//               </Button>
//             </SheetTrigger>
//             <SheetContent side="left">
//               <nav className="grid gap-6 text-lg font-medium">
//                 <Link
//                   to="/"
//                   className="flex items-center gap-2 text-lg font-semibold"
//                 >
//                   <img src="" alt="WN" className="h-6 w-6" />
//                   <span>CNER - LAB</span>
//                 </Link>
//                 <Link to="/" className="hover:text-foreground">
//                   Home
//                 </Link>
//                 <Link
//                   to="/components"
//                   className="text-muted-foreground hover:text-foreground"
//                 >
//                   Components
//                 </Link>

//                 <Link
//                   to="/cart"
//                   className="text-muted-foreground hover:text-foreground"
//                 >
//                   Cart
//                 </Link>

//                 <Link
//                   to="/contact"
//                   className="text-muted-foreground hover:text-foreground"
//                 >
//                   Contact us
//                 </Link>
//               </nav>
//             </SheetContent>
//           </Sheet>
//           <div className="flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
//             {!isLoggedIn ? (
//               <div className="ml-auto flex-1 sm:flex-initial">
//                 <div className="flex gap-3 relative">
//                   <Link to="/auth/signup">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="ml-auto gap-1.5 text-sm"
//                     >
//                       Sign Up
//                     </Button>
//                   </Link>
//                   <Link to="/auth/login">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="ml-auto gap-1.5 text-sm"
//                     >
//                       Sign In
//                     </Button>
//                   </Link>
//                 </div>
//               </div>
//             ) : (
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <div className="flex gap-1">
//                     <Avatar className="rounded-none">
//                       <AvatarImage
//                         className="rounded-full"
//                         src={`data:image/svg+xml;base64,${btoa(userProfile!)}`}
//                       />
//                       <AvatarFallback>CN</AvatarFallback>
//                       <span className="top-0 left-7 absolute  w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></span>
//                     </Avatar>

//                     <Button variant="secondary">{user}</Button>
//                   </div>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end" className="w-56">
//                   <DropdownMenuLabel>My Account</DropdownMenuLabel>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuItem onClick={() => navigate("/purchases")}>
//                     My Purchases
//                   </DropdownMenuItem>
//                   <DropdownMenuItem onClick={() => navigate("")}>
//                     Edit Profile
//                   </DropdownMenuItem>

//                   <DropdownMenuSeparator />
//                   <DropdownMenuItem onClick={handleLogout}>
//                     <LogOut className="mr-2 h-4 w-4" />
//                     <span>Log out</span>
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             )}
//           </div>
//         </header>
//       </div> */}
//       <div className="flex w-full flex-col ">
//         <header className="sticky z-[1] top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-900">
//           <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
//             <Link
//               to="/"
//               className={`flex items-center gap-2 text-lg font-semibold md:text-base ${
//                 isActive("/") ? "text-blue-600 font-bold" : ""
//               }`}
//             >
//               <img
//                 src="https://i.ibb.co/ymr4kp0f/CNER-LAB-LOGO.jpg"
//                 className="h-10 me-3"
//                 alt="FlowBite Logo"
//               />
//               <span>CNER - LAB</span>
//             </Link>
//             <Link
//               to="/"
//               className={`transition-colors hover:text-foreground ${
//                 isActive("/") ? "text-blue-600 font-bold" : "text-foreground"
//               }`}
//             >
//               Home
//             </Link>
//             <Link
//               to="/components"
//               className={`transition-colors hover:text-foreground ${
//                 isActive("/components")
//                   ? "text-blue-600 font-bold"
//                   : "text-muted-foreground"
//               }`}
//             >
//               Components
//             </Link>

//             <Link
//               to="/cart"
//               className={`transition-colors hover:text-foreground ${
//                 isActive("/cart")
//                   ? "text-blue-600 font-bold"
//                   : "text-muted-foreground"
//               }`}
//             >
//               Cart
//             </Link>

//             <Link
//               to="/contact"
//               className={`transition-colors hover:text-foreground ${
//                 isActive("/contact")
//                   ? "text-blue-600 font-bold"
//                   : "text-muted-foreground"
//               }`}
//             >
//               Contact us
//             </Link>
//           </nav>
//           {/* Sheet menu for small screens */}

//           {/* <Sheet>
//             <SheetTrigger asChild>
//               <Button
//                 variant="outline"
//                 size="icon"
//                 className="shrink-0 md:hidden"
//               >
//                 <Menu className="h-5 w-5" />
//                 <span className="sr-only">Toggle navigation menu</span>
//               </Button>
//             </SheetTrigger>
//             <SheetContent side="left">
//               <nav className="grid gap-6 text-lg font-medium">
//                 <Link
//                   to="/"
//                   className={`flex items-center gap-2 text-lg font-semibold ${
//                     isActive("/") ? "text-blue-600 font-bold" : ""
//                   }`}
//                 >
//                   <img src="" alt="WN" className="h-6 w-6" />
//                   <span>CNER - LAB</span>
//                 </Link>
//                 <Link
//                   to="/"
//                   className={`hover:text-foreground ${
//                     isActive("/") ? "text-blue-600 font-bold" : ""
//                   }`}
//                 >
//                   Home
//                 </Link>
//                 <Link
//                   to="/components"
//                   className={`hover:text-foreground ${
//                     isActive("/components") ? "text-blue-600 font-bold" : ""
//                   }`}
//                 >
//                   Components
//                 </Link>

//                 <Link
//                   to="/cart"
//                   className={`hover:text-foreground ${
//                     isActive("/cart") ? "text-blue-600 font-bold" : ""
//                   }`}
//                 >
//                   Cart
//                 </Link>

//                 <Link
//                   to="/contact"
//                   className={`hover:text-foreground ${
//                     isActive("/contact") ? "text-blue-600 font-bold" : ""
//                   }`}
//                 >
//                   Contact us
//                 </Link>
//               </nav>
//             </SheetContent>
//           </Sheet> */}
//           {isAdmin === "admin" ? (
//             <Sheet>
//               <SheetTrigger asChild>
//                 <Button
//                   variant="outline"
//                   size="icon"
//                   className="shrink-0 md:hidden"
//                 >
//                   <Menu className="h-5 w-5" />
//                   <span className="sr-only">Toggle navigation menu</span>
//                 </Button>
//               </SheetTrigger>
//               <SheetContent side="left">
//                 <nav className="grid gap-6 text-lg font-medium">
//                   <Link
//                     to="/admin"
//                     className={`flex items-center gap-2 text-lg font-semibold ${
//                       isActive("/") ? "text-blue-600 font-bold" : ""
//                     }`}
//                   >
//                     <img src="" alt="WN" className="h-6 w-6" />
//                     <span>CNER - LAB</span>
//                   </Link>
//                   <Link
//                     to="/admin"
//                     className={`hover:text-foreground ${
//                       isActive("/") ? "text-blue-600 font-bold" : ""
//                     }`}
//                   >
//                     Home
//                   </Link>
//                   <Link
//                     to="/admin/components"
//                     className={`hover:text-foreground ${
//                       isActive("/components") ? "text-blue-600 font-bold" : ""
//                     }`}
//                   >
//                     Components
//                   </Link>

//                   <Link
//                     to="/admin/permissions"
//                     className={`hover:text-foreground ${
//                       isActive("/cart") ? "text-blue-600 font-bold" : ""
//                     }`}
//                   >
//                     Permission
//                   </Link>

//                   <Link
//                     to="/admin/purchases"
//                     className={`hover:text-foreground ${
//                       isActive("/contact") ? "text-blue-600 font-bold" : ""
//                     }`}
//                   >
//                     Purchases
//                   </Link>
//                 </nav>
//               </SheetContent>
//             </Sheet>
//           ) : (
//             <Sheet>
//               <SheetTrigger asChild>
//                 <Button
//                   variant="outline"
//                   size="icon"
//                   className="shrink-0 md:hidden"
//                 >
//                   <Menu className="h-5 w-5" />
//                   <span className="sr-only">Toggle navigation menu</span>
//                 </Button>
//               </SheetTrigger>
//               <SheetContent side="left">
//                 <nav className="grid gap-6 text-lg font-medium">
//                   <Link
//                     to="/"
//                     className={`flex items-center gap-2 text-lg font-semibold ${
//                       isActive("/") ? "text-blue-600 font-bold" : ""
//                     }`}
//                   >
//                     <img src="" alt="WN" className="h-6 w-6" />
//                     <span>CNER - LAB</span>
//                   </Link>
//                   <Link
//                     to="/"
//                     className={`hover:text-foreground ${
//                       isActive("/") ? "text-blue-600 font-bold" : ""
//                     }`}
//                   >
//                     Home
//                   </Link>
//                   <Link
//                     to="/components"
//                     className={`hover:text-foreground ${
//                       isActive("/components") ? "text-blue-600 font-bold" : ""
//                     }`}
//                   >
//                     Components
//                   </Link>

//                   <Link
//                     to="/cart"
//                     className={`hover:text-foreground ${
//                       isActive("/cart") ? "text-blue-600 font-bold" : ""
//                     }`}
//                   >
//                     Cart
//                   </Link>

//                   <Link
//                     to="/contact"
//                     className={`hover:text-foreground ${
//                       isActive("/contact") ? "text-blue-600 font-bold" : ""
//                     }`}
//                   >
//                     Contact us
//                   </Link>
//                 </nav>
//               </SheetContent>
//             </Sheet>
//           )}
//           {/* User menu */}
//           <div className="flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
//             {!isLoggedIn ? (
//               <div className="ml-auto flex-1 sm:flex-initial">
//                 <div className="flex gap-3 relative">
//                   <Link to="/auth/signup">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="ml-auto gap-1.5 text-sm"
//                     >
//                       Sign Up
//                     </Button>
//                   </Link>
//                   <Link to="/auth/login">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="ml-auto gap-1.5 text-sm"
//                     >
//                       Sign In
//                     </Button>
//                   </Link>
//                 </div>
//               </div>
//             ) : (
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <div className="flex gap-1">
//                     <Avatar className="rounded-none">
//                       <AvatarImage
//                         className="rounded-full"
//                         src={`data:image/svg+xml;base64,${btoa(userProfile!)}`}
//                       />
//                       <AvatarFallback>CN</AvatarFallback>
//                       <span className="top-0 left-7 absolute  w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></span>
//                     </Avatar>

//                     <Button variant="secondary">{user}</Button>
//                   </div>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end" className="w-56">
//                   <DropdownMenuLabel>My Account</DropdownMenuLabel>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuItem onClick={() => navigate("/purchases")}>
//                     My Purchases
//                   </DropdownMenuItem>
//                   <DropdownMenuItem onClick={() => navigate("")}>
//                     Edit Profile
//                   </DropdownMenuItem>

//                   <DropdownMenuSeparator />
//                   <DropdownMenuItem onClick={handleLogout}>
//                     <LogOut className="mr-2 h-4 w-4" />
//                     <span>Log out</span>
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             )}
//           </div>
//         </header>
//       </div>
//     </>
//   );
// };

// export default Navbar;

import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { logoutUser } from "@/api/authService";
import { logout } from "@/store/auth/authSlice";

const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const { user, isLoggedIn, userProfile } = useSelector(
    (state: RootState) => state.auth
  );

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logoutUser();
    dispatch(logout());
  };

  const isActive = (path: string) => location.pathname === path;

  const isAdmin = useSelector((state: RootState) => state.auth.role);

  const avatarSrc = userProfile
    ? `data:image/svg+xml;base64,${btoa(userProfile)}`
    : "";

  const renderUserLinks = () => (
    <>
      <Link
        to="/"
        className={`transition-colors ${
          isActive("/") ? "text-blue-600 font-bold" : "text-foreground"
        }`}
      >
        Home
      </Link>
      <Link
        to="/components"
        className={`transition-colors ${
          isActive("/components")
            ? "text-blue-600 font-bold"
            : "text-muted-foreground"
        }`}
      >
        Components
      </Link>
      <Link
        to="/cart"
        className={`transition-colors ${
          isActive("/cart")
            ? "text-blue-600 font-bold"
            : "text-muted-foreground"
        }`}
      >
        Cart
      </Link>
      <Link
        to="/contact"
        className={`transition-colors ${
          isActive("/contact")
            ? "text-blue-600 font-bold"
            : "text-muted-foreground"
        }`}
      >
        Contact us
      </Link>
    </>
  );

  const renderAdminLinks = () => (
    <>
      <Link
        to="/admin-dashboard"
        className={`transition-colors ${
          isActive("/admin")
            ? "text-blue-600 font-bold"
            : "text-muted-foreground"
        }`}
      >
        Admin Home
      </Link>
      <Link
        to="/admin-components"
        className={`transition-colors ${
          isActive("/admin/components")
            ? "text-blue-600 font-bold"
            : "text-muted-foreground"
        }`}
      >
        Admin Components
      </Link>
      <Link
        to="/admin-permissions"
        className={`transition-colors ${
          isActive("/admin/permissions")
            ? "text-blue-600 font-bold"
            : "text-muted-foreground"
        }`}
      >
        Admin Permissions
      </Link>
      <Link
        to="/admin-purchases"
        className={`transition-colors ${
          isActive("/admin/purchases")
            ? "text-blue-600 font-bold"
            : "text-muted-foreground"
        }`}
      >
        Admin Purchases
      </Link>
    </>
  );

  return (
    <>
      <div className="flex w-full flex-col">
        <header className="sticky z-[1] top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-900">
          <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
            {/* https://bmsit.ac.in/public/assets/images/logo/logo.png */}

            <img
              src="https://bmsit.ac.in/public/assets/images/logo/logo.png"
              className="h-10 me-3"
              alt="FlowBite Logo"
            />
            <Link
              to="/"
              className={`flex items-center gap-2 text-lg font-semibold md:text-base ${
                isActive("/") ? "text-blue-600 font-bold" : ""
              }`}
            >
              <img
                src="https://i.ibb.co/ymr4kp0f/CNER-LAB-LOGO.jpg"
                className="h-10 me-3"
                alt="FlowBite Logo"
              />
              <span>CNER - LAB</span>
            </Link>
            {isAdmin === "admin" ? renderAdminLinks() : renderUserLinks()}
          </nav>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-4">
              <nav className="grid gap-6 text-lg font-medium">
                {isAdmin === "admin" ? renderAdminLinks() : renderUserLinks()}
              </nav>
            </SheetContent>
          </Sheet>

          {/* User menu */}
          <div className="flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
            {!isLoggedIn ? (
              <div className="ml-auto flex-1 sm:flex-initial">
                <div className="flex gap-3 relative">
                  <Link to="/auth/signup">
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-auto gap-1.5 text-sm"
                    >
                      Sign Up
                    </Button>
                  </Link>
                  <Link to="/auth/login">
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-auto gap-1.5 text-sm"
                    >
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex gap-1">
                    <Avatar className="rounded-none">
                      <AvatarImage className="rounded-full" src={avatarSrc} />
                      <AvatarFallback>CN</AvatarFallback>
                      <span className="top-0 left-7 absolute w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></span>
                    </Avatar>
                    <Button variant="secondary">{user}</Button>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/purchases")}>
                    My Purchases
                  </DropdownMenuItem>
{/*                   <DropdownMenuItem onClick={() => navigate("/edit-profile")}>
                    Edit Profile
                  </DropdownMenuItem> */}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </header>
      </div>
    </>
  );
};

export default Navbar;
