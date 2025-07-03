import { DashboardSidebar } from "@/modules/dashboard/ui/dashboard-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"


type Props = {
  children: React.ReactNode
}

const Layout = ({ children }: Props) => {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main className="flex flex-col h-screen w-screen bg-muted">
        {children}
      </main>
    </SidebarProvider>
  )
}

export default Layout