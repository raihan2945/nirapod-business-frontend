"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, Info, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-black shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="py-2 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img
              src="/images/logoLight.png"
              alt="Team holding frames"
              className="w-45 h-full object-cover"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {/* Demos Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-1 text-white hover:text-cyan-400 hover:bg-transparent"
                >
                  <span>Demos</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link href="/demos/demo1">Demo 1</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/demos/demo2">Demo 2</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/demos/demo3">Demo 3</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Pages Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-1 text-white hover:text-cyan-400 hover:bg-transparent"
                >
                  <span>Pages</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link href="/pages/about">About</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/pages/services">Services</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/pages/contact">Contact</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Projects Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-1 text-white hover:text-cyan-400 hover:bg-transparent"
                >
                  <span>Projects</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link href="/projects/project1">Project 1</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/projects/project2">Project 2</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Blog Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-1 text-white hover:text-cyan-400 hover:bg-transparent"
                >
                  <span>Blog</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link href="/blog/latest">Latest Posts</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/blog/categories">Categories</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Blocks Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-1 text-white hover:text-cyan-400 hover:bg-transparent"
                >
                  <span>Blocks</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link href="/blocks/headers">Headers</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/blocks/footers">Footers</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href="/documentation"
              className="text-white hover:text-cyan-400 px-3 py-2 text-sm font-medium"
            >
              Documentation
            </Link>
          </div>

          {/* Right Icons */}
          {/* <div className="hidden lg:flex items-center space-x-4">
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
              <DropdownMenu>
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
              </DropdownMenu>

              {/* Pages Dropdown for Mobile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-white hover:text-cyan-400 hover:bg-transparent"
                  >
                    <span>Pages</span>
                    <ChevronDown className="h-4 w-4 ml-auto" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuItem>
                    <Link href="/pages/about" onClick={() => setIsOpen(false)}>
                      About
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      href="/pages/services"
                      onClick={() => setIsOpen(false)}
                    >
                      Services
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      href="/pages/contact"
                      onClick={() => setIsOpen(false)}
                    >
                      Contact
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Projects Dropdown for Mobile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-white hover:text-cyan-400 hover:bg-transparent"
                  >
                    <span>Projects</span>
                    <ChevronDown className="h-4 w-4 ml-auto" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuItem>
                    <Link
                      href="/projects/project1"
                      onClick={() => setIsOpen(false)}
                    >
                      Project 1
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      href="/projects/project2"
                      onClick={() => setIsOpen(false)}
                    >
                      Project 2
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Blog Dropdown for Mobile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-white hover:text-cyan-400 hover:bg-transparent"
                  >
                    <span>Blog</span>
                    <ChevronDown className="h-4 w-4 ml-auto" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuItem>
                    <Link href="/blog/latest" onClick={() => setIsOpen(false)}>
                      Latest Posts
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      href="/blog/categories"
                      onClick={() => setIsOpen(false)}
                    >
                      Categories
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Blocks Dropdown for Mobile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-white hover:text-cyan-400 hover:bg-transparent"
                  >
                    <span>Blocks</span>
                    <ChevronDown className="h-4 w-4 ml-auto" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuItem>
                    <Link
                      href="/blocks/headers"
                      onClick={() => setIsOpen(false)}
                    >
                      Headers
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      href="/blocks/footers"
                      onClick={() => setIsOpen(false)}
                    >
                      Footers
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link
                href="/documentation"
                className="text-white hover:text-cyan-400 block px-3 py-2 text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                Documentation
              </Link>

              {/* Mobile Icons */}
              <div className="flex items-center space-x-4 px-3 pt-4 border-t border-gray-700">
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
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
