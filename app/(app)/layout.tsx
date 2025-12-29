import SideBar from "@/components/sidebar/SideBar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <SideBar />
      <div className="flex-1 flex flex-col w-full">
        <header className="md:hidden sticky top-0 z-10 flex items-center gap-3 border-b bg-white px-4 py-3">
          <SidebarTrigger />
          <h1 className="text-lg font-semibold">Flup</h1>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </SidebarProvider>
  );
}
