"use client";

import { ChevronDownIcon, CreditCardIcon, LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { GeneratedAvatar } from "@/components/sidebar/GeneratedAvatar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export const DashboardUserButton = () => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const { data, isPending } = authClient.useSession();

  if (isPending || !data?.user) {
    return null;
  }

  const onLogout = () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => router.push("/sign-in"),
      },
    });
  };

  const userAvatar = data.user.image ? (
    <Avatar
      className={cn(
        "size-9 transition-transform duration-200",
        isCollapsed && "size-8 hover:scale-110",
      )}
    >
      <AvatarImage
        src={data.user.image}
        alt={data.user.name || "User Avatar"}
        className="object-cover"
      />
      <AvatarFallback className="bg-linear-to-br from-blue-500 to-purple-600 text-white font-medium">
        {data.user.name?.charAt(0)?.toUpperCase() || "U"}
      </AvatarFallback>
    </Avatar>
  ) : (
    <GeneratedAvatar
      seed={data.user.name}
      variant={"initials"}
      className={cn(
        "size-9 transition-transform duration-200",
        isCollapsed && "size-8 hover:scale-110",
      )}
    />
  );

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger
          className={cn(
            "rounded-xl border border-border/20 p-3 w-full flex items-center bg-white/5 hover:bg-white/10 transition-all duration-200 hover:border-border/30 overflow-hidden",
            isCollapsed && "justify-center p-2",
          )}
        >
          {userAvatar}
          {!isCollapsed && (
            <>
              <div className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0">
                <p className="text-sm font-medium truncate w-full text-black">
                  {data.user.name || "Unknown User"}
                </p>
                <p className="text-xs truncate w-full text-muted-foreground">
                  {data.user.email}
                </p>
              </div>
              <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground" />
            </>
          )}
        </DrawerTrigger>
        <DrawerContent className="max-w-sm mx-auto">
          <DrawerHeader className="text-center pb-4">
            <div className="flex justify-center mb-3">{userAvatar}</div>
            <DrawerTitle className="text-lg font-semibold">
              {data.user.name || "Unknown User"}
            </DrawerTitle>
            <DrawerDescription className="text-sm text-muted-foreground">
              {data.user.email}
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 space-y-2">
            <button
              className="w-full cursor-pointer flex items-center justify-between px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-left border border-transparent hover:border-border/20"
              type="button"
              onClick={() => router.push("/upgrade")}
              disabled={true}
            >
              <span className="font-medium">Billing</span>
              <CreditCardIcon className="size-4" />
            </button>
            <button
              className="w-full cursor-pointer flex items-center justify-between px-4 py-3 rounded-lg hover:bg-red-500/10 transition-colors text-left border border-transparent hover:border-red-500/20 text-red-400 hover:text-red-300"
              type="button"
              onClick={onLogout}
            >
              <span className="font-medium">Logout</span>
              <LogOutIcon className="size-4" />
            </button>
          </div>
          <DrawerFooter>
            <p className="text-xs text-muted-foreground text-center">
              Powered by Meet AI
            </p>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "rounded-xl border border-border/20 p-3 w-full flex items-center bg-white/5 hover:bg-white/10 transition-all duration-200 hover:border-border/30 overflow-hidden",
          isCollapsed && "justify-center p-2",
        )}
      >
        {userAvatar}
        {!isCollapsed && (
          <>
            <div className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0">
              <p className="text-sm font-medium truncate w-full text-black">
                {data.user.name || "Unknown User"}
              </p>
              <p className="text-xs truncate w-full text-muted-foreground">
                {data.user.email}
              </p>
            </div>
            <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground" />
          </>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72" side="right">
        <DropdownMenuLabel>
          <div className="flex items-center gap-3 py-2">
            {userAvatar}
            <div className="flex flex-col gap-1 overflow-hidden flex-1">
              <span className="font-medium truncate">{data.user.name}</span>
              <span className="text-sm truncate font-normal text-muted-foreground">
                {data.user.email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer flex items-center justify-between py-3"
          onClick={() => router.push("/upgrade")}
          disabled={true}
        >
          <span className="font-medium">Billing</span>
          <CreditCardIcon className="size-4" />
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer flex items-center justify-between py-3 text-red-400 focus:text-red-300 focus:bg-red-500/10"
          onClick={onLogout}
        >
          <span className="font-medium">Logout</span>
          <LogOutIcon className="size-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
