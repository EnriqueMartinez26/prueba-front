"use client";

/**
 * Capa de Administración: Navegación Estructural (App Sidebar)
 * --------------------------------------------------------------------------
 * Orquesta el acceso a los módulos críticos del panel administrativo.
 * Implementa una arquitectura colapsable (Sidebar Rail) para optimizar el 
 * espacio de trabajo y proporciona trazabilidad visual del estado de 
 * sesión del operador. (MVC / View-Admin)
 */

import {
    LayoutDashboard,
    Package,
    Image as ImageIcon,
    ShoppingCart,
    LogOut,
    User
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { usePathname } from "next/navigation";
import Link from "next/link";

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
    SidebarRail,
    SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

/**
 * RN - Estructura de Navegación: Mapeo de módulos de gestión.
 */
const items = [
    {
        title: "Dashboard",
        url: "/admin",
        icon: LayoutDashboard,
    },
    {
        title: "Productos",
        url: "/admin/products",
        icon: Package,
    },
    {
        title: "Visuales",
        url: "/admin/visuals",
        icon: ImageIcon,
    },
    {
        title: "Ordenes",
        url: "/admin/orders",
        icon: ShoppingCart,
    },
    {
        title: "Usuarios",
        url: "/admin/users",
        icon: User,
    },
];

export function AppSidebar() {
    const { user, logout } = useAuth();
    const pathname = usePathname();

    const isItemActive = (url: string) => {
        if (url === "/admin") return pathname === "/admin";
        return pathname === url || pathname.startsWith(`${url}/`);
    };

    return (
        <Sidebar collapsible="icon" className="!top-16 md:!top-20 !h-[calc(100svh-4rem)] md:!h-[calc(100svh-5rem)] z-40 border-r border-white/5 bg-card/95 backdrop-blur-xl">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-white/5 hover:text-white transition-colors cursor-pointer">
                            <Link href="/admin">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-black font-black shadow-lg shadow-primary/20">
                                    <Package className="size-5" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                                    <span className="truncate font-headline font-bold text-white uppercase tracking-tight">4Fun Dashboard</span>
                                    <span className="truncate text-[10px] lg:text-xs text-muted-foreground uppercase font-bold tracking-widest">Panel de Dashboard</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarSeparator className="bg-white/5" />
            
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-[10px] lg:text-xs uppercase font-bold tracking-[0.2em] text-muted-foreground mb-2">Gestión Operativa</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton 
                                        asChild 
                                        isActive={isItemActive(item.url)} 
                                        className="h-11 lg:h-12 transition-all duration-200 hover:bg-primary/10 data-[active=true]:bg-primary/20 data-[active=true]:text-primary"
                                    >
                                        <Link href={item.url} className="flex items-center gap-3">
                                            <item.icon className="!h-5 !w-5" />
                                            <span className="text-sm font-bold uppercase tracking-wide group-data-[collapsible=icon]:hidden">{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarRail className="bg-white/5" />
            
            <SidebarFooter className="border-t border-white/5 mt-auto">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton 
                            size="lg" 
                            onClick={() => logout()} 
                            title="Finalizar Sesión Operativa"
                            className="hover:bg-destructive/10 hover:text-destructive group/logout transition-colors cursor-pointer justify-between"
                        >
                            <Avatar className="h-8 w-8 rounded-lg ring-1 ring-white/10 group-hover/logout:ring-destructive/30 transition-colors">
                                {user?.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
                                <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-bold text-xs lg:text-sm group-hover/logout:bg-destructive/10 group-hover/logout:text-destructive transition-colors">{user?.name?.[0] || "A"}</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-xs leading-tight min-w-0 group-data-[collapsible=icon]:hidden">
                                <span className="truncate font-bold text-white group-hover/logout:text-destructive transition-colors">{user?.name}</span>
                                <span className="truncate text-[9px] lg:text-[10px] text-muted-foreground uppercase opacity-70 italic">{user?.role}</span>
                            </div>
                            <LogOut className="h-4 w-4 ml-auto text-muted-foreground group-hover/logout:text-destructive transition-colors group-data-[collapsible=icon]:hidden" />
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
