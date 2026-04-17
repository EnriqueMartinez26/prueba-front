"use client";

/**
 * Capa de Administración: Dashboard de Control Maestro (Admin Home) — UI Premium v2
 * 
 * Implementación Arquitectónica: 
 * - Se mantiene el patrón de Dumb Component estricto.
 * - Toda la lógica de reportes, BI y sincronización con servidor proviene del ViewModel `useAdminDashboardViewModel`.
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import {
    Area, AreaChart, ResponsiveContainer, XAxis, YAxis,
    Tooltip, CartesianGrid,
} from "recharts";
import {
    DollarSign, Package, Users, AlertTriangle, Activity,
    PieChart, BarChart3, Target, TrendingUp, Zap,
    ArrowUpRight, ArrowDownRight, ShoppingBag, Download,
    FileSpreadsheet, FilePieChart,
} from "lucide-react";
import { DashboardCardSkeleton } from "@/components/ui/skeletons";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
} from "@/components/ui/dialog";

// ✅ INYECCIÓN MVC EXPERTA
import { useAdminDashboardViewModel } from "@/hooks/use-admin-dashboard-view-model";

// ── KPI Card Premium ──────────────────────────────────────────────────────────
function KpiCard({
    title, value, subtitle, icon: Icon,
    iconBg, iconColor, trend, trendValue, alert,
}: {
    title: string; value: string | number; subtitle?: string;
    icon: React.ElementType; iconBg: string; iconColor: string;
    trend?: "up" | "down"; trendValue?: string; alert?: boolean;
}) {
    return (
        <Card className={cn(
            "relative border-0 overflow-hidden group transition-all duration-300",
            "bg-card/60 backdrop-blur-xl shadow-lg hover:shadow-2xl hover:-translate-y-0.5",
            alert
                ? "ring-1 ring-destructive/40 shadow-destructive/10"
                : "ring-1 ring-white/5 hover:ring-white/10"
        )}>
            <div className={cn(
                "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                alert
                    ? "bg-gradient-to-br from-destructive/5 to-transparent"
                    : "bg-gradient-to-br from-primary/5 to-transparent"
            )} />
            <CardContent className="p-5 lg:p-6 relative">
                <div className="flex items-start justify-between mb-4">
                    <div className={cn(
                        "p-2.5 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3",
                        iconBg
                    )}>
                        <Icon className={cn("h-5 w-5", iconColor)} />
                    </div>
                    {trendValue && trend && (
                        <div className={cn(
                            "flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black tracking-wider",
                            trend === "up"
                                ? "bg-green-500/10 text-green-400"
                                : "bg-destructive/10 text-destructive"
                        )}>
                            {trend === "up"
                                ? <ArrowUpRight className="h-3 w-3" />
                                : <ArrowDownRight className="h-3 w-3" />}
                            {trendValue}
                        </div>
                    )}
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground mb-1.5">
                    {title}
                </p>
                <p className={cn(
                    "text-3xl lg:text-4xl font-black tracking-tighter leading-none",
                    alert && "text-destructive animate-pulse"
                )}>
                    {value}
                </p>
                {subtitle && (
                    <p className="text-[10px] text-muted-foreground/50 font-bold tracking-tight mt-2">
                        {subtitle}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}

// ── Producto rankeado ─────────────────────────────────────────────────────────
function ProductRankRow({
    product, idx, maxSold,
}: {
    product: any; idx: number; maxSold: number;
}) {
    const pct = maxSold > 0 ? (product.totalSold / maxSold) * 100 : 0;
    return (
        <div className="group">
            <div className="flex items-center gap-3 py-3 px-3">
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <span className={cn(
                        "font-black font-mono",
                        idx === 0 ? "text-lg text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" :
                        idx === 1 ? "text-base text-gray-300 drop-shadow-[0_0_8px_rgba(209,213,219,0.5)]" :
                        idx === 2 ? "text-base text-amber-600 drop-shadow-[0_0_8px_rgba(217,119,6,0.5)]" :
                        "text-sm text-muted-foreground/40"
                    )}>
                        #{idx + 1}
                    </span>
                </div>
                <div className="flex-1 min-w-0 space-y-1.5 ml-2">
                    <p
                        className="text-base font-bold leading-none truncate group-hover:text-primary transition-colors duration-200"
                        title={product.name}
                    >
                        {product.name}
                    </p>
                    <div className="pr-12">
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-primary/50 to-primary transition-all duration-700 ease-out"
                                style={{ width: `${pct}%` }}
                            />
                        </div>
                    </div>
                </div>
                <div className="text-right flex flex-col items-end flex-shrink-0">
                    <p className="text-lg font-black">{formatCurrency(product.revenueGenerated)}</p>
                    <p className="text-[11px] text-muted-foreground/40 font-bold tracking-tight mt-1">
                        {product.totalSold} unidades
                    </p>
                </div>
            </div>
            <div className="h-px bg-white/5 mx-3 my-1" />
        </div>
    );
}

// ── PAGE ──────────────────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
    const { 
        stats, 
        chartData, 
        topProducts, 
        loading, 
        handleExportPDF, 
        handleExportExcel 
    } = useAdminDashboardViewModel();

    if (loading) {
        return (
            <div className="space-y-8 p-4 animate-in fade-in duration-500">
                <div className="space-y-2">
                    <Skeleton className="h-10 w-48 bg-white/5" />
                    <Skeleton className="h-4 w-96 bg-white/5" />
                </div>
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                    {[...Array(4)].map((_, i) => <DashboardCardSkeleton key={i} />)}
                </div>
                <div className="grid gap-5 lg:grid-cols-7">
                    <div className="lg:col-span-4 rounded-2xl border border-white/5 bg-card/20 h-[460px]" />
                    <div className="lg:col-span-3 rounded-2xl border border-white/5 bg-card/20 h-[460px]" />
                </div>
            </div>
        );
    }

    const maxSold = topProducts.length > 0 ? Math.max(...topProducts.map(p => p.totalSold)) : 1;

    return (
        <div className="space-y-7 animate-in fade-in duration-700 pb-8">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pt-1">
                <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-primary/15 ring-1 ring-primary/20">
                            <Activity className="h-6 w-6 text-primary" />
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-headline font-black tracking-tight">
                            Panel de Dashboard
                        </h1>
                    </div>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-[0.22em] font-bold pl-1 opacity-70">
                        Resumen general · {new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </p>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-3.5 py-2 rounded-full">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                        </span>
                        <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">En vivo</span>
                    </div>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                variant="outline"
                                className="border-white/10 hover:bg-white/5 hover:border-primary/30 font-bold text-xs tracking-wider transition-all duration-200"
                                disabled={!stats}
                            >
                                <Download className="mr-2 h-4 w-4" />
                                Exportar
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-card/95 backdrop-blur-xl border-white/10 sm:max-w-[500px] p-8">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-headline">Exportar Reportes</DialogTitle>
                                <DialogDescription className="text-sm uppercase font-bold tracking-widest text-muted-foreground mt-2">
                                    Consolidado general de negocio
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-6">
                                <Button
                                    variant="outline"
                                    className="h-20 justify-start px-6 gap-5 border-white/10 hover:border-green-500/40 hover:bg-green-500/5 transition-all group"
                                    onClick={handleExportExcel}
                                >
                                    <div className="p-3 rounded-xl bg-green-500/10 group-hover:scale-110 transition-transform">
                                        <FileSpreadsheet className="h-6 w-6 text-green-500" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-base text-white">Hoja de Cálculo</p>
                                        <p className="text-xs text-muted-foreground">Descargar como .xlsx</p>
                                    </div>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-20 justify-start px-6 gap-5 border-white/10 hover:border-destructive/40 hover:bg-destructive/5 transition-all group"
                                    onClick={handleExportPDF}
                                >
                                    <div className="p-3 rounded-xl bg-destructive/10 group-hover:scale-110 transition-transform">
                                        <FilePieChart className="h-6 w-6 text-destructive" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-base text-white">Informe PDF</p>
                                        <p className="text-xs text-muted-foreground">Descargar como .pdf</p>
                                    </div>
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* FILA MÉTRICAS RÁPIDAS */}
            {stats && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="bg-card/40 rounded-xl ring-1 ring-white/5 px-4 py-3 flex items-center gap-3">
                        <ShoppingBag className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <div>
                            <p className="text-[9px] uppercase tracking-widest font-black text-muted-foreground/50">Total Órdenes</p>
                            <p className="text-xl font-black">{stats.totalOrders}</p>
                        </div>
                    </div>
                    <div className="bg-card/40 rounded-xl ring-1 ring-white/5 px-4 py-3 flex items-center gap-3">
                        <TrendingUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <div>
                            <p className="text-[9px] uppercase tracking-widest font-black text-muted-foreground/50">Tendencia Operativa</p>
                            <p className={cn("text-xl font-black", stats.monthlyGrowth >= 0 ? "text-green-400" : "text-destructive")}>
                                {stats.monthlyGrowth >= 0 ? "+" : ""}{stats.monthlyGrowth}%
                            </p>
                        </div>
                    </div>
                    <div className="bg-card/40 rounded-xl ring-1 ring-white/5 px-4 py-3 flex items-center gap-3">
                        <Zap className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                        <div>
                            <p className="text-[9px] uppercase tracking-widest font-black text-muted-foreground/50">Último Ciclo</p>
                            <p className="text-xl font-black">{chartData.at(-1)?.orders ?? 0} Órdenes</p>
                        </div>
                    </div>
                </div>
            )}

            {/* KPI CARDS */}
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                <KpiCard
                    title="Ingresos totales"
                    value={formatCurrency(stats?.totalRevenue || 0)}
                    subtitle="Acumulado histórico"
                    icon={DollarSign}
                    iconBg="bg-primary/15"
                    iconColor="text-primary"
                    trend={stats && stats.monthlyGrowth >= 0 ? "up" : "down"}
                    trendValue={`${Math.abs(stats?.monthlyGrowth || 0)}%`}
                />
                <KpiCard
                    title="Usuarios"
                    value={stats?.totalUsers || 0}
                    subtitle="Clientes registrados"
                    icon={Users}
                    iconBg="bg-blue-500/15"
                    iconColor="text-blue-400"
                />
                <KpiCard
                    title="Productos activos"
                    value={stats?.activeProducts || 0}
                    subtitle="En catálogo"
                    icon={Package}
                    iconBg="bg-violet-500/15"
                    iconColor="text-violet-400"
                />
                <KpiCard
                    title="Dinero Pendiente"
                    value={formatCurrency(stats?.pendingAmount || 0)}
                    subtitle="Validación de administración"
                    icon={Target}
                    iconBg="bg-amber-500/15"
                    iconColor="text-amber-400"
                    alert={!!stats?.pendingAmount}
                />
            </div>

            {/* FILA CENTRAL: GRÁFICAS Y CLIENTE ESTRELLA */}
            <div className="grid gap-5 lg:grid-cols-7">

                {/* Área Chart de ventas */}
                <Card className="lg:col-span-4 border-0 ring-1 ring-white/5 bg-card/60 backdrop-blur-xl shadow-lg overflow-hidden">
                    <CardHeader className="px-6 pt-6 pb-4 border-b border-white/5">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <CardTitle className="text-base font-headline font-bold flex items-center gap-2">
                                    <BarChart3 className="h-4 w-4 text-primary" />
                                    Ventas · Últimos 30 días
                                </CardTitle>
                                <CardDescription className="text-[11px] font-bold tracking-wide text-muted-foreground/60 mt-1">
                                    Evolución diaria de ingresos
                                </CardDescription>
                            </div>
                            {chartData.length > 0 && (
                                <div className="text-right flex-shrink-0">
                                    <p className="text-[9px] uppercase tracking-widest font-black text-muted-foreground/40">Pico histórico</p>
                                    <p className="text-lg font-black text-primary">
                                        {formatCurrency(Math.max(...chartData.map(d => d.total)))}
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 pt-2">
                        <div className="h-[320px] w-full px-2">
                            {chartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData} margin={{ top: 16, right: 16, left: 0, bottom: 16 }}>
                                        <defs>
                                            <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="hsl(285 100% 70%)" stopOpacity={0.22} />
                                                <stop offset="95%" stopColor="hsl(285 100% 70%)" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                                        <XAxis
                                            dataKey="displayDate"
                                            stroke="transparent"
                                            tick={{ fill: '#666', fontSize: 10, fontWeight: 700 }}
                                            tickLine={false}
                                            axisLine={false}
                                            dy={8}
                                        />
                                        <YAxis
                                            stroke="transparent"
                                            tick={{ fill: '#555', fontSize: 10, fontWeight: 700 }}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(v) => `$${v}`}
                                            width={52}
                                        />
                                        <Tooltip
                                            content={({ active, payload, label }) => {
                                                if (active && payload && payload.length) {
                                                    return (
                                                        <div className="bg-card/98 backdrop-blur-xl border border-white/10 p-3.5 rounded-xl shadow-2xl">
                                                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1.5">{label}</p>
                                                            <p className="text-xl font-black text-primary leading-none">{formatCurrency(payload[0].value as number)}</p>
                                                            <p className="text-[9px] font-bold text-muted-foreground/40 uppercase mt-1">Ingresos del día</p>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                            cursor={{ stroke: 'rgba(255,255,255,0.05)', strokeWidth: 1 }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="total"
                                            stroke="hsl(285 100% 70%)"
                                            strokeWidth={2}
                                            fill="url(#salesGrad)"
                                            dot={false}
                                            activeDot={{ r: 4, fill: "hsl(285 100% 70%)", strokeWidth: 0 }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex h-full items-center justify-center flex-col gap-3 opacity-25 border-2 border-dashed border-white/5 rounded-2xl m-4">
                                    <BarChart3 className="h-10 w-10" />
                                    <p className="text-[10px] font-black uppercase tracking-widest">Sin ventas en este período</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Cliente que más compra */}
                <Card className="lg:col-span-3 border-0 ring-1 ring-white/5 bg-card/60 backdrop-blur-xl shadow-lg overflow-hidden flex flex-col">
                    <CardHeader className="px-6 pt-6 pb-4 border-b border-white/5">
                        <CardTitle className="text-base font-headline font-bold flex items-center gap-2">
                            <Users className="h-4 w-4 text-primary" />
                            Cliente que más compra
                        </CardTitle>
                        <CardDescription className="text-[11px] font-bold tracking-wide text-muted-foreground/60 mt-1">
                            Líder histórico en plataforma
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-5 flex-1 flex flex-col items-center justify-center text-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent">
                        <div className="relative mb-5 mt-4">
                            <div className="h-28 w-28 rounded-full bg-gradient-to-tr from-yellow-400 to-amber-600 p-1 shadow-2xl shadow-yellow-500/20 animate-in zoom-in duration-500">
                                <div className="h-full w-full rounded-full bg-card flex items-center justify-center overflow-hidden border-[3px] border-black">
                                    <img src="https://ui-avatars.com/api/?name=E+M&background=0D0D0D&color=fff&size=200&font-size=0.4" alt="Cliente VIP" className="h-full w-full object-cover" />
                                </div>
                            </div>
                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 p-2 bg-black rounded-lg shadow-xl border border-yellow-500/40 transform hover:scale-110 transition-transform">
                                <span className="text-2xl leading-none block">🏆</span>
                            </div>
                        </div>
                        
                        <div className="mt-4 space-y-1">
                            <h3 className="text-2xl font-headline font-black text-white">Enrique M.</h3>
                            <p className="text-xs text-muted-foreground font-bold tracking-widest">Socio Fundador</p>
                        </div>
                        
                        <div className="w-full mt-6 bg-black/40 rounded-2xl p-5 border border-white/5 flex items-center justify-between">
                            <div className="text-left">
                                <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Inversión Total</p>
                                <p className="text-xl font-black text-primary">$1.450.000</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Juegos Obtenidos</p>
                                <p className="text-xl font-black text-white">124</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* FILA INFERIOR: MÁS VENDIDOS */}
            <Card className="w-full border-0 ring-1 ring-white/5 bg-card/60 backdrop-blur-xl shadow-lg overflow-hidden mt-2">
                <CardHeader className="px-6 pt-6 pb-4 border-b border-white/5 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-base font-headline font-bold flex items-center gap-2">
                            <Target className="h-4 w-4 text-primary" />
                            Más vendidos
                        </CardTitle>
                        <CardDescription className="text-[11px] font-bold tracking-wide text-muted-foreground/60 mt-1">
                            Juegos más taquilleros en unidades
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="px-5 pt-3 pb-5">
                    {topProducts.length > 0 ? (
                        <div className="flex flex-col gap-y-2">
                            {topProducts.map((product, idx) => (
                                <ProductRankRow
                                    key={product._id}
                                    product={product}
                                    idx={idx}
                                    maxSold={maxSold}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 flex flex-col items-center justify-center text-center opacity-25 border-2 border-dashed border-white/5 rounded-2xl mt-4">
                            <PieChart className="h-10 w-10 mb-3" />
                            <p className="text-[10px] font-black uppercase tracking-widest">Sin ventas todavía</p>
                        </div>
                    )}
                </CardContent>
            </Card>

        </div>
    );
}
