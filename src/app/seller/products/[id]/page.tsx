"use client";

/**
 * Capa de Vendedor: Edición de Productos Privados
 * --------------------------------------------------------------------------
 * Permite a los comerciantes actualizar sus publicaciones existentes.
 * Actúa como un Dumb Component delegando toda la orquestación de lógica
 * y estados al ViewModel respectivo. (MVVM / View)
 */

import { use } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Save, ArrowLeft, X, Package, ShieldCheck, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { DEVELOPERS } from "@/lib/constants";
import { KeyManager } from "@/components/admin/key-manager";
import { useSellerProductEditViewModel } from "@/hooks/use-seller-product-edit-view-model";

export default function SellerEditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const vm = useSellerProductEditViewModel(id);

  if (vm.isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-10 w-10 text-primary opacity-20" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <Button variant="ghost" asChild className="hover:bg-primary/10 hover:text-primary font-bold text-xs uppercase tracking-widest">
          <Link href="/seller/products"><ArrowLeft className="mr-2 h-4 w-4" /> Cancelar Edición</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none bg-card/40 backdrop-blur-3xl shadow-2xl rounded-[3rem] overflow-hidden">
            <CardHeader className="p-10 border-b border-white/5 bg-primary/5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/20 rounded-2xl"><Package className="h-6 w-6 text-primary" /></div>
                <CardTitle className="text-2xl font-headline font-black italic">Editar Publicación</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-10 space-y-8">
              <Form {...vm.form}>
                <form onSubmit={vm.onSubmit} className="space-y-8">
                  
                  <FormField control={vm.form.control} name="name" render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-xs font-bold uppercase tracking-widest opacity-60">Nombre del Juego</FormLabel>
                      <FormControl><Input className="h-14 bg-white/5 border-white/10 rounded-2xl font-bold" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={vm.form.control} name="description" render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-xs font-bold uppercase tracking-widest opacity-60">Descripción</FormLabel>
                      <FormControl><Textarea className="min-h-[140px] bg-white/5 border-white/10 rounded-2xl" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={vm.form.control} name="price" render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-xs font-bold uppercase tracking-widest opacity-60">Precio (ARS)</FormLabel>
                        <FormControl><Input type="number" step="0.01" className="h-14 bg-white/5 border-white/10 rounded-2xl font-black text-primary" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={vm.form.control} name="stock" render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-xs font-bold uppercase tracking-widest opacity-60">Stock</FormLabel>
                        <FormControl><Input type="number" disabled={vm.form.watch("type" as any) === "Digital"} className="h-14 bg-white/5 border-white/10 rounded-2xl font-black" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={vm.form.control} name="trailerUrl" render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-xs font-bold uppercase tracking-widest opacity-60">URL del Trailer (YouTube)</FormLabel>
                      <FormControl><Input placeholder="https://www.youtube.com/watch?v=..." className="h-14 bg-white/5 border-white/10 rounded-2xl" {...field} value={field.value || ""} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={vm.form.control} name="isDiscounted" render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-4 space-y-0 rounded-[2rem] border border-white/5 p-6 bg-white/5">
                      <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                      <div className="space-y-1">
                        <FormLabel className="text-xs font-black uppercase tracking-widest">Activar Oferta</FormLabel>
                        <FormDescription className="text-[9px] uppercase font-bold tracking-widest opacity-40">Aplica un descuento porcentual inmediato.</FormDescription>
                      </div>
                    </FormItem>
                  )} />

                  {vm.form.watch("isDiscounted" as any) && (
                    <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
                      <FormField control={vm.form.control} name="discountPercentage" render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-xs font-bold uppercase tracking-widest opacity-60">Porcentaje de Descuento (%)</FormLabel>
                          <FormControl><Input type="number" min="0" max="100" className="h-14 bg-white/5 border-white/10 rounded-2xl font-black text-green-400" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />

                      {/* RN - Don Norman (Feedback/Feedforward): Visualización del impacto inmediato del cambio */}
                      <div className="p-6 rounded-[2rem] bg-green-500/10 border border-green-500/20 flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-green-500/60">Precio Resultante</p>
                          <div className="flex items-baseline gap-3">
                            <span className="text-2xl font-black text-green-400">
                              ${(Number(vm.form.watch("price") || 0) * (1 - (Number(vm.form.watch("discountPercentage") || 0) / 100))).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                            </span>
                            <span className="text-sm font-bold line-through opacity-30">
                              ${Number(vm.form.watch("price") || 0).toLocaleString('es-AR')}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black uppercase tracking-widest text-green-500/60">Ahorro</p>
                          <p className="text-sm font-black text-green-400">
                            -${(Number(vm.form.watch("price") || 0) * (Number(vm.form.watch("discountPercentage") || 0) / 100)).toLocaleString('es-AR')}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <FormField control={vm.form.control} name="active" render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-4 space-y-0 rounded-[2rem] border border-primary/20 p-6 bg-primary/5">
                      <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-primary data-[state=checked]:text-black" /></FormControl>
                      <div className="space-y-1">
                        <FormLabel className="text-xs font-bold uppercase tracking-widest text-primary">Producto Público</FormLabel>
                        <FormDescription className="text-[9px] uppercase font-bold tracking-widest opacity-60">Si está marcado, el producto será visible para todos los compradores.</FormDescription>
                      </div>
                    </FormItem>
                  )} />

                  <Button type="submit" className="w-full h-16 bg-primary text-black font-black text-lg tracking-widest rounded-[2rem] shadow-xl hover:-translate-y-1 transition-all" disabled={vm.isSubmitting || vm.isUploading}>
                    {vm.isSubmitting ? <Loader2 className="h-6 w-6 animate-spin" /> : <><Save className="mr-3 h-6 w-6" /> GUARDAR CAMBIOS</>}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {id !== 'new' && vm.form.watch('type' as any) === 'Digital' && (
            <KeyManager
                productId={id}
                productName={vm.form.getValues('name')}
                onStockSync={vm.syncStockFromKeys}
            />
          )}
        </div>

        <div className="space-y-8">
           <Card className="border-none bg-card/40 backdrop-blur-3xl shadow-2xl rounded-[3rem] overflow-hidden">
              <CardHeader className="p-8 pb-4 border-b border-white/5 bg-primary/5">
                 <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-primary" /> Imagen de Portada
                 </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                 <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 bg-black/40 mb-6">
                    {vm.form.watch("imageId") ? (
                      <Image src={vm.form.watch("imageId") || ""} alt="Preview" fill className="object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full opacity-20"><ImageIcon className="h-12 w-12" /></div>
                    )}
                 </div>
                 <Input type="file" onChange={vm.handleImageUpload} disabled={vm.isUploading} className="bg-white/5 border-white/10 rounded-xl" />
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
