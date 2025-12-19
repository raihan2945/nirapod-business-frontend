"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, Info, Search, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Button as AntButton } from "antd";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { AppDispatch } from "@/state/store";
import { useGetUserByIdQuery } from "@/state/features/user/userApi";
import { useRouter } from "next/navigation";
import { userLoggedOut } from "@/state/features/auth/authSlice";
import { Popconfirm } from "antd";

interface NavbarProps {
  variant?: "transparent" | "fixed";
}

export default function Navbar({ variant = "transparent" }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();

  const userId = useSelector((state: RootState) => state.auth?.id);
  const { data: userData, isLoading, isError } = useGetUserByIdQuery(userId);
  const userProfile = useSelector((state: RootState) => state?.user?.data);

  // console.log("User Profile:", userProfile);

  const logout = () => {
    console.log("logged Out!!!");
    dispatch(userLoggedOut());
    window.location.reload();
    router.push("/");
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navBackground =
    variant === "fixed"
      ? "bg-[#31ad5c] shadow-lg"
      : isScrolled
      ? "bg-[#31ad5c] shadow-lg"
      : "bg-transparent";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBackground}`}
    >
      <div className="py-2 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href={"/"}>
              <img
                src={
                  variant === "fixed" || isScrolled
                    ? "/images/logoDark.png"
                    : "/images/logoLight.png"
                }
                alt="Team holding frames"
                className="w-36 h-full object-cover"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link
              href="/projects"
              className="text-white hover:text-cyan-400 px-3 py-2 text-md font-medium"
            >
              Projects
            </Link>
            <Link
              href="/blogs"
              className="text-white hover:text-cyan-400 px-3 py-2 text-md font-medium"
            >
              Blog
            </Link>
            <Link
              href="/investment"
              className="text-white hover:text-cyan-400 px-3 py-2 text-md font-medium"
            >
              Apply for Investments
            </Link>
            {/* <Link
              href="/faq"
              className="text-white hover:text-cyan-400 px-3 py-2 text-md font-medium"
            >
              FAQ's
            </Link> */}
            <Link
              href="/about"
              className="text-white hover:text-cyan-400 px-3 py-2 text-md font-medium"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-white hover:text-cyan-400 px-3 py-2 text-md font-medium"
            >
              Contact
            </Link>

            {/* Demos Dropdown */}

            {userProfile && userProfile.role == "admin" ? (
              <Link href="/admin/projects">
                <Button style={{ cursor: "pointer" }}>Dashboard</Button>
              </Link>
            ) : userProfile?.role == "user" ? (
              <Link href="/user/profile">
                <Button style={{ cursor: "pointer" }}>Profile</Button>
              </Link>
            ) : (
              <Link href="/login/login-user">
                <Button style={{ cursor: "pointer" }}>Login</Button>
              </Link>
             
              // <DropdownMenu>
              //   <DropdownMenuTrigger asChild>
              //     <Button
              //       // variant="ghost"
              //       className="pointer flex items-center space-x-1 text-white bg-gray-800"
              //     >
              //       <span>Login</span>
              //       <ChevronDown className="h-4 w-4" />
              //     </Button>
              //   </DropdownMenuTrigger>
              //   <DropdownMenuContent>
              //     <DropdownMenuItem>
              //       <Link href="/login/investor-login" className="text-md">
              //         As Investor
              //       </Link>
              //     </DropdownMenuItem>
              //     <DropdownMenuItem>
              //       <Link href="/login/finance-login" className="text-md">
              //         As Finance
              //       </Link>
              //     </DropdownMenuItem>
              //   </DropdownMenuContent>
              // </DropdownMenu>
            )}
            {userProfile && (
              <Popconfirm
                title="Logout"
                description="Are you sure to logout?"
                onConfirm={() => logout()}
                okText="Yes"
                cancelText="No"
                style={{ cursor: "pointer" }}
              >
                <AntButton style={{ margin: 0 }}>
                  <LogOut className="h-4 w-4 mr-2" />
                </AntButton>
              </Popconfirm>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="text-white hover:text-cyan-400 hover:bg-transparent"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-900/95 backdrop-blur-sm rounded-lg mt-2">
              {/* Demos Dropdown for Mobile */}
              {/* <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-white hover:text-cyan-400 hover:bg-transparent"
                  >
                    <span>Demos</span>
                    <ChevronDown className="h-4 w-4 ml-auto" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuItem>
                    <Link href="/demos/demo1" onClick={() => setIsOpen(false)}>
                      Demo 1
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/demos/demo2" onClick={() => setIsOpen(false)}>
                      Demo 2
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/demos/demo3" onClick={() => setIsOpen(false)}>
                      Demo 3
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu> */}

              <Link
                onClick={toggleMenu}
                href="/projects"
                className="block w-full text-white hover:text-cyan-400 px-3 py-2 text-md font-medium"
              >
                Projects
              </Link>

              <Link
                onClick={toggleMenu}
                href="/blogs"
                className="block w-full text-white hover:text-cyan-400 px-3 py-2 text-md font-medium"
              >
                Blog
              </Link>
              <Link
                onClick={toggleMenu}
                href="/investment"
                className="block w-full text-white hover:text-cyan-400 px-3 py-2 text-md font-medium"
              >
                Apply for Investments
              </Link>

              <Link
                onClick={toggleMenu}
                href="/about"
                className="block w-full text-white hover:text-cyan-400 px-3 py-2 text-md font-medium"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="block w-full text-white hover:text-cyan-400 px-3 py-2 text-md font-medium"
              >
                Contact
              </Link>

              {/* Demos Dropdown */}
              {userProfile && userProfile.role == "admin" ? (
                <Button>Dashboard</Button>
              ) : userProfile?.role == "user" ? (
                <Button>Profile</Button>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      onClick={toggleMenu}
                      className="block w-full pointer flex items-center space-x-1 text-white bg-gray-800"
                    >
                      <span>Login</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Link
                        onClick={toggleMenu}
                        href="/login/investor-login"
                        className="text-md"
                      >
                        As Investor
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link
                        onClick={toggleMenu}
                        href="/login/finance-login"
                        className="text-md"
                      >
                        As Finance
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Mobile Icons */}
              {/* <div className="flex items-center space-x-4 px-3 pt-4 border-t border-gray-700">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-cyan-400 hover:bg-transparent"
                >
                  <Info className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-cyan-400 hover:bg-transparent"
                >
                  <Search className="h-5 w-5" />
                </Button>
              </div> */}
              <div style={{ padding: "1rem 1rem" }}>
                {userProfile && (
                  <Popconfirm
                    title="Logout"
                    description="Are you sure to logout?"
                    onConfirm={() => {
                      logout(), toggleMenu();
                    }}
                    okText="Yes"
                    cancelText="No"
                    style={{ cursor: "pointer" }}
                  >
                    <AntButton style={{ margin: 0 }}>
                      <LogOut className="h-4 w-4 mr-2" />
                    </AntButton>
                  </Popconfirm>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
