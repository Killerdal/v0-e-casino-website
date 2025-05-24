"use client"

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
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import {
  Home,
  Wallet,
  Gamepad2,
  History,
  User,
  Settings,
  CreditCard,
  Trophy,
  Gift,
  Skull,
  Zap,
  Target,
} from "lucide-react"
import { useSidebar } from "@/components/ui/sidebar"

const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    id: "dashboard",
  },
  {
    title: "Web3 Wallet",
    icon: Wallet,
    id: "wallet",
  },
  {
    title: "Crypto Deposit",
    icon: CreditCard,
    id: "deposit",
  },
  {
    title: "Games",
    icon: Gamepad2,
    id: "games",
  },
  {
    title: "Sports Betting",
    icon: Target,
    id: "sports",
  },
  {
    title: "Transactions",
    icon: History,
    id: "transactions",
  },
  {
    title: "Profile",
    icon: User,
    id: "profile",
  },
  {
    title: "Settings",
    icon: Settings,
    id: "settings",
  },
]

const quickActions = [
  {
    title: "Withdraw",
    icon: CreditCard,
    id: "withdraw",
  },
  {
    title: "Rewards",
    icon: Trophy,
    id: "rewards",
  },
  {
    title: "Bonuses",
    icon: Gift,
    id: "bonuses",
  },
]

interface AppSidebarProps {
  activeSection: string
  setActiveSection: (section: string) => void
  connectedWallet: string | null
  userBalance: number
}

export function AppSidebar({ activeSection, setActiveSection, connectedWallet, userBalance }: AppSidebarProps) {
  const { setOpenMobile } = useSidebar()

  const handleMenuClick = (sectionId: string) => {
    console.log("Sidebar menu clicked:", sectionId)
    setActiveSection(sectionId)
    setOpenMobile(false)
  }

  return (
    <Sidebar className="border-r border-red-900/20 bg-black/95 backdrop-blur-sm">
      <SidebarHeader className="border-b border-red-900/20">
        <div className="flex items-center gap-3 px-2 py-4">
          <div className="relative">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center border border-red-500/30">
              <Skull className="h-7 w-7 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          </div>
          <div>
            <h2 className="font-bold text-lg text-red-500 tracking-wider">RED SYNDICATE</h2>
            <p className="text-xs text-red-400/70">REVOLUTION GAMING</p>
          </div>
        </div>

        {/* Balance Display */}
        <div className="px-2 pb-4">
          <div className="bg-gradient-to-r from-red-900/20 to-black/40 rounded-lg p-3 border border-red-600/20">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Balance</span>
              <Zap className="h-4 w-4 text-yellow-500" />
            </div>
            <p className="text-xl font-bold text-green-400">${userBalance.toFixed(2)}</p>
            {connectedWallet && (
              <p className="text-xs text-red-400 font-mono mt-1">
                {connectedWallet.slice(0, 8)}...{connectedWallet.slice(-6)}
              </p>
            )}
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-black/50">
        <SidebarGroup>
          <SidebarGroupLabel className="text-red-400 font-semibold tracking-wider">MAIN MENU</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => handleMenuClick(item.id)}
                    isActive={activeSection === item.id}
                    className="text-gray-300 hover:text-white hover:bg-red-600/20 data-[active=true]:bg-red-600/30 data-[active=true]:text-red-400 border-l-2 border-transparent data-[active=true]:border-red-500"
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.title}</span>
                    {item.id === "wallet" && connectedWallet && (
                      <Badge variant="secondary" className="ml-auto bg-green-600/20 text-green-400 border-green-500/30">
                        Connected
                      </Badge>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-red-400 font-semibold tracking-wider">QUICK ACTIONS</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {quickActions.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => handleMenuClick(item.id)}
                    className="text-gray-300 hover:text-white hover:bg-red-600/20"
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-red-900/20 bg-black/70">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => handleMenuClick("settings")}
              className="text-gray-300 hover:text-white hover:bg-red-600/20"
            >
              <Settings className="h-5 w-5" />
              <span className="font-medium">Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
