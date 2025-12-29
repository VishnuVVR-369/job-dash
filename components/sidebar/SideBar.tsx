"use client";

import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DashboardUserButton } from "@/components/sidebar/UserButton";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const navSections = [
  {
    label: "Dashboard",
    items: [
      { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
      { href: "/tracker", icon: ShoppingCart, label: "Tracker" },
      { href: "/analytics", icon: Package, label: "Analytics" },
    ],
  },
  {
    label: "Settings",
    items: [{ href: "/settings", icon: Settings, label: "Settings" }],
  },
];

export const SideBar = () => {
  const pathname = usePathname();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-gray-200">
      <SidebarHeader className="p-4 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:pb-2 border-b border-gray-200">
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:h-8">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-500 text-white shrink-0 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8">
            <span className="text-lg font-bold group-data-[collapsible=icon]:text-base">
              J
            </span>
          </div>
          <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <div className="flex items-center justify-between">
              <h1 className="text-base font-semibold text-gray-900 truncate">
                Job Dash
              </h1>
              <button
                type="button"
                onClick={toggleSidebar}
                className="p-1 hover:bg-gray-100 rounded-md transition-colors"
              >
                <ChevronLeft className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>
          {isCollapsed && (
            <button
              type="button"
              onClick={toggleSidebar}
              className="absolute -right-3 top-3 p-1 bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 transition-colors z-20"
            >
              <ChevronRight className="h-3 w-3 text-gray-600" />
            </button>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-2 group-data-[collapsible=icon]:pt-6">
        {navSections.map((section, idx) => (
          <SidebarGroup
            key={section.label}
            className={cn(
              "mb-6 group-data-[collapsible=icon]:mb-3 group-data-[collapsible=icon]:p-0",
              idx === 0 && "group-data-[collapsible=icon]:mt-0",
            )}
          >
            <SidebarGroupLabel className="px-3 mb-2 text-xs font-medium text-gray-400 uppercase tracking-wide group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:h-0 group-data-[collapsible=icon]:mb-0">
              {section.label}
            </SidebarGroupLabel>
            <SidebarGroupContent className="group-data-[collapsible=icon]:p-0">
              <SidebarMenu className="space-y-1 group-data-[collapsible=icon]:space-y-1">
                {section.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/dashboard" &&
                      pathname.startsWith(item.href));

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.label}
                        className={cn(
                          "relative px-3 py-2 rounded-lg transition-all duration-200",
                          "hover:bg-gray-100",
                          "group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-2 group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:rounded-lg group-data-[collapsible=icon]:hover:bg-emerald-50 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:justify-center",
                          isActive
                            ? "bg-emerald-50 text-emerald-600 font-medium hover:bg-emerald-50"
                            : "text-gray-700 hover:text-gray-900",
                        )}
                      >
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 w-full",
                            "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0",
                          )}
                        >
                          <item.icon
                            className={cn(
                              "h-5 w-5 shrink-0 transition-all duration-200",
                              "group-data-[collapsible=icon]:h-5 group-data-[collapsible=icon]:w-5",
                              isActive ? "text-emerald-600" : "text-gray-500",
                            )}
                          />
                          <span className="group-data-[collapsible=icon]:hidden">
                            {item.label}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
            {idx < navSections.length - 1 && (
              <div className="mt-4 group-data-[collapsible=icon]:mt-2" />
            )}
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-3 group-data-[collapsible=icon]:p-2 border-t border-gray-200">
        <DashboardUserButton />
      </SidebarFooter>
    </Sidebar>
  );
};

export default SideBar;
