"use client";

/**
 * Capa de Interfaz: Panel de Filtrado Multidimensional (Catalog Sidebar)
 * --------------------------------------------------------------------------
 * Provee los controles técnicos para segmentar el catálogo de activos.
 * Implementa la gestión de taxonomías (Plataformas, Géneros) y rangos de 
 * valorización financiera mediante un sistema de acordeones optimizado. 
 * Garantiza una navegación eficiente en grandes volúmenes de datos. (UI / View)
 */

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { X, Filter, BarChart, HardDrive, Gamepad2 } from "lucide-react";

interface FilterOption {
    id: string;
    name: string;
}

interface CatalogSidebarProps {
    platforms: FilterOption[];
    genres: FilterOption[];
    selectedPlatforms: string[];
    setSelectedPlatforms: (ids: string[]) => void;
    selectedGenres: string[];
    setSelectedGenres: (ids: string[]) => void;
    priceRange: [number, number];
    maxPriceCap: number;
    setPriceRange: (range: [number, number]) => void;
    onClear: () => void;
    className?: string;
}

export function CatalogSidebar({
    platforms,
    genres,
    selectedPlatforms,
    setSelectedPlatforms,
    selectedGenres,
    setSelectedGenres,
    priceRange,
    maxPriceCap,
    setPriceRange,
    onClear,
    className,
}: CatalogSidebarProps) {

    /**
     * RN - Gestión de Taxonomías: Orquestación de selección múltiple para Plataformas.
     */
    const handlePlatformChange = (id: string, checked: boolean) => {
        if (checked) {
            setSelectedPlatforms([...selectedPlatforms, id]);
        } else {
            setSelectedPlatforms(selectedPlatforms.filter((p) => p !== id));
        }
    };

    /**
     * RN - Gestión de Taxonomías: Orquestación de selección múltiple para Categorías/Géneros.
     */
    const handleGenreChange = (id: string, checked: boolean) => {
        if (checked) {
            setSelectedGenres([...selectedGenres, id]);
        } else {
            setSelectedGenres(selectedGenres.filter((g) => g !== id));
        }
    };

    return (
        <div className={className}>
            {/* Cabecera Técnica de Filtrado */}
            <div className="flex items-center justify-between pb-4 mb-4">
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-primary" />
                    <h3 className="font-headline text-xs font-bold text-white uppercase tracking-widest">Filtros</h3>
                </div>
                {(selectedPlatforms.length > 0 || selectedGenres.length > 0 || priceRange[0] !== 0 || priceRange[1] !== maxPriceCap) && (
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={onClear} 
                        className="h-8 px-2 text-[9px] font-bold uppercase tracking-widest text-muted-foreground hover:bg-destructive/15 hover:text-destructive transition-all duration-300 rounded-md"
                    >
                        <X className="mr-1 h-3 w-3" />
                        Limpiar
                    </Button>
                )}
            </div>
            <Separator className="bg-white/5 mb-4" />

            {/* Matriz de Parámetros (Acordeones Expandibles) */}
            <Accordion type="multiple" defaultValue={["price"]} className="w-full space-y-2">
                
                {/* RN - Segmentación Financiera: Control de Rango de Inversión */}
                <AccordionItem value="price" className="border-white/5 rounded-lg bg-white/5 px-4 data-[state=open]:bg-white/8 transition-colors">
                    <AccordionTrigger className="font-bold text-xs uppercase tracking-widest hover:text-primary transition-colors py-4">
                        <div className="flex items-center gap-3">
                            <BarChart className="h-4 w-4 text-primary/70" />
                            Precio
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="px-2 pb-4 pt-2 space-y-6 border-t border-white/5">
                            <Slider
                                defaultValue={[0, maxPriceCap]}
                                value={priceRange}
                                min={0}
                                max={maxPriceCap}
                                step={1} 
                                onValueChange={(val) => setPriceRange(val as [number, number])}
                                className="py-4"
                            />
                            <div className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[8px] text-muted-foreground uppercase font-bold block leading-none">Mínimo</span>
                                    <span className="text-sm font-bold text-white">$ {priceRange[0].toLocaleString()}</span>
                                </div>
                                <div className="w-px h-8 bg-white/10" />
                                <div className="flex flex-col gap-1 text-right">
                                    <span className="text-[8px] text-muted-foreground uppercase font-bold block leading-none">Máximo</span>
                                    <span className="text-sm font-bold text-white">$ {priceRange[1].toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* RN - Selección de Plataformas */}
                <AccordionItem value="platform" className="border-white/5 rounded-lg bg-white/5 px-4 data-[state=open]:bg-white/8 transition-colors">
                    <AccordionTrigger className="font-bold text-xs uppercase tracking-widest hover:text-primary transition-colors py-4">
                        <div className="flex items-center gap-3">
                            <HardDrive className="h-4 w-4 text-primary/70" />
                            Plataformas
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-3 pt-3 pb-2 border-t border-white/5">
                            {platforms.map((platform) => (
                                <div key={platform.id} className="flex items-center space-x-3 group rounded-md p-2 hover:bg-white/5 transition-colors">
                                    <Checkbox
                                        id={`p-${platform.id}`}
                                        checked={selectedPlatforms.includes(platform.id)}
                                        onCheckedChange={(checked) => handlePlatformChange(platform.id, checked as boolean)}
                                        className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary rounded transition-all"
                                    />
                                    <Label htmlFor={`p-${platform.id}`} className="text-xs font-medium uppercase tracking-tight cursor-pointer text-muted-foreground group-hover:text-white transition-colors flex-1">
                                        {platform.name}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* RN - Categorización Lúdica: Selección por Propuesta de Valor (Géneros) */}
                <AccordionItem value="genre" className="border-white/5 rounded-lg bg-white/5 px-4 data-[state=open]:bg-white/8 transition-colors">
                    <AccordionTrigger className="font-bold text-xs uppercase tracking-widest hover:text-primary transition-colors py-4">
                        <div className="flex items-center gap-3">
                            <Gamepad2 className="h-4 w-4 text-primary/70" />
                            Género
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-3 pt-3 pb-2 border-t border-white/5">
                            {genres.map((genre) => (
                                <div key={genre.id} className="flex items-center space-x-3 group rounded-md p-2 hover:bg-white/5 transition-colors">
                                    <Checkbox
                                        id={`g-${genre.id}`}
                                        checked={selectedGenres.includes(genre.id)}
                                        onCheckedChange={(checked) => handleGenreChange(genre.id, checked as boolean)}
                                        className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary rounded transition-all"
                                    />
                                    <Label htmlFor={`g-${genre.id}`} className="text-xs font-medium uppercase tracking-tight cursor-pointer text-muted-foreground group-hover:text-white transition-colors flex-1">
                                        {genre.name}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}
