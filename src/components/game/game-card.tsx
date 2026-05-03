"use client";

/**
 * Capa de Interfaz: Componente Atómico de Visualización (Game Card)
 * --------------------------------------------------------------------------
 * Renderiza la ficha técnica reducida de un producto para listados masivos.
 * Implementa el patrón MVVM al delegar íntegramente la lógica de presentación
 * (formateo monetario, visualización de stock, cálculos promocionales) a la
 * clase especializada `ProductViewModel`. Garantiza la independencia entre el
 * modelo de datos y la vista. (MVC / Component)
 */

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useWishlist } from "@/context/WishlistContext";
import { Heart, ShoppingCart, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { ProductEntity } from "@/domain/entities/ProductEntity";
import type { Game } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  /**
   * POO - Encapsulamiento: La lógica de negocio visual reside en la Entidad de Dominio.
   * Esto asegura que el componente sea puramente declarativo y altamente mantenible.
   * Refactor: ViewModel eliminado para reducir entropía.
   */
  const vm = new ProductEntity(game as any);
  
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart, cart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const isFavorite = isInWishlist(vm.getDisplayId());

  // RN - Prevención de Errores: Detectar si el producto ya está en el carrito y alcanzó el stock máximo.
  const cartItem = cart.find(item => item.productId === vm.getDisplayId());
  const hasReachedStockLimit = cartItem ? cartItem.quantity >= vm.stock : false;
  const isAlreadyInCart = !!cartItem;

  const handleAddToCart = async () => {
    setIsAdding(true);
    await addToCart(game);
    setTimeout(() => setIsAdding(false), 2000);
  };

  return (
    <Card className="group relative overflow-hidden bg-card/40 backdrop-blur-md transition-all duration-300 hover:bg-card/60 hover:shadow-xl hover:-translate-y-1 rounded-2xl border border-white/5 hover:border-primary/30 shadow-md flex flex-col h-full">
      
      {/* RN - Gestión Promocional: Badge dinámico de bonificación. */}
      {vm.isOnSale() && (
        <div className="absolute left-4 top-4 z-20">
          <Badge className="bg-green-500/10 hover:bg-green-500/20 text-white/70 font-black text-xs px-4 py-1.5 shadow-[0_0_20px_-5px_rgba(34,197,94,0.3)] border-green-500/20 backdrop-blur-md uppercase tracking-wider rounded-md">
            {vm.getDiscountBadge()} OFF
          </Badge>
        </div>
      )}

      {/* RN - Persistencia de Intenciones: Gestión de Lista de Deseos. */}
      <button
        onClick={() => toggleWishlist(game)}
        className={cn(
          "absolute right-4 top-4 z-20 h-10 w-10 rounded-full transition-all duration-300 flex items-center justify-center hover:scale-110 hover:shadow-lg border backdrop-blur-md",
          isFavorite 
            ? "bg-red-500 border-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)]" 
            : "bg-white/10 border-white/20 text-white/70 hover:bg-white/20 hover:border-white/40"
        )}
        aria-label="Alternar Favorito"
      >
        <motion.div
          animate={isFavorite ? {
            scale: [1, 1.2, 1],
            transition: { duration: 0.4, ease: "easeInOut" }
          } : {}}
        >
          <Heart className={cn("h-5 w-5 transition-all", isFavorite ? "fill-current scale-110" : "group-hover:scale-125")} />
        </motion.div>
      </button>

      <Link href={`/productos/${vm.getDisplayId()}`}>
        <CardHeader className="p-0 overflow-hidden">
          <div className="relative aspect-[3/4] overflow-hidden">
            <Image
              src={vm.getImageUrl()}
              alt={`Portada de ${game.name}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-1"
              priority={false}
            />
            {/* Capa de Transición de Brillo */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 transition-opacity duration-700 group-hover:opacity-40" />
          </div>
        </CardHeader>

        <CardContent className="p-5 relative flex-1 flex flex-col">
          <div className="mb-3 flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-[8px] font-bold uppercase tracking-widest border-primary/30 text-primary bg-primary/5 px-2.5 py-1">
              {vm.getPlatformName()}
            </Badge>
            {!vm.hasStock() && <Badge variant="secondary" className="text-[8px] font-bold uppercase tracking-widest bg-destructive/10 text-destructive border-destructive/20">Agotado</Badge>}
          </div>

          <h3 className="line-clamp-2 font-headline text-lg font-semibold text-white group-hover:text-primary transition-colors mb-2 tracking-tight leading-tight">
            {game.name}
          </h3>
          
          <div className="border-t border-white/5 pt-4 mb-4" />
          
          <div className="flex items-baseline gap-2 mb-4">
            {/**
              * RN - Localización Monetaria: El ViewModel garantiza el formato ARS (Pesos Argentinos)
              * operando bajo los estándares transaccionales del TFI.
              */}
            <span className="text-2xl font-bold text-white/60 tracking-tighter">{vm.toDisplayPrice()}</span>
            
            {vm.isOnSale() && (
              <span className="text-xs text-muted-foreground line-through decoration-red-500 opacity-50 font-medium">
                {vm.getOriginalPrice()}
              </span>
            )}
          </div>
        </CardContent>
      </Link>

      <CardFooter className="p-5 pt-0">
        <Button
          onClick={handleAddToCart}
          className={cn(
            "w-full h-11 rounded-lg transition-all duration-300 font-bold uppercase text-[9px] tracking-widest shadow-sm hover:shadow-md group/btn disabled:opacity-50 disabled:cursor-not-allowed",
            isAdding 
              ? "bg-green-500 text-white border-green-500 hover:bg-green-600" 
              : hasReachedStockLimit
                ? "bg-white/5 text-white/40 border-white/5 cursor-not-allowed"
                : "bg-white/5 text-white hover:bg-primary hover:text-black border border-white/10 hover:border-primary"
          )}
          disabled={!vm.hasStock() || isAdding || hasReachedStockLimit}
        >
          <AnimatePresence mode="wait">
            {isAdding ? (
              <motion.div
                key="added"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="flex items-center gap-2"
              >
                <Check className="h-5 w-5" />
                <span className="text-xs font-bold">¡Añadido!</span>
              </motion.div>
            ) : (
              <motion.div
                key="add"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                {!vm.hasStock() ? (
                  "Agotado"
                ) : hasReachedStockLimit ? (
                  <>
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="text-xs font-bold">En el Carrito</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5 group-hover/btn:scale-110 group-hover/btn:rotate-6 transition-transform" />
                    <span className="text-xs font-bold">Añadir</span>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </CardFooter>
    </Card>
  );
}
