"use client";

/**
 * Capa de Vendedor: Publicación de Productos
 * --------------------------------------------------------------------------
 * Permite a los comerciantes integrar nuevos juegos al catálogo.
 * Actúa como un Dumb Component delegando toda la orquestación de lógica
 * y estados al ViewModel respectivo. (MVVM / View)
 */

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, X, PlusCircle, ArrowLeft, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DEVELOPERS } from "@/lib/constants";
import { useSellerProductCreationViewModel } from "@/hooks/use-seller-product-creation-view-model";

export default function SellerNewProductPage() {
  const vm = useSellerProductCreationViewModel();

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <Button variant="ghost" asChild className="hover:bg-primary/10 hover:text-primary font-bold text-xs uppercase tracking-widest">
          <Link href="/seller/products"><ArrowLeft className="mr-2 h-4 w-4" /> Volver al Listado</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="border-none bg-card/40 backdrop-blur-3xl shadow-2xl rounded-[3rem] overflow-hidden">
            <CardHeader className="p-10 border-b border-white/5 bg-primary/5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/20 rounded-2xl"><PlusCircle className="h-6 w-6 text-primary" /></div>
                <div>
                  <CardTitle className="text-2xl font-headline font-black italic">Crear Publicación</CardTitle>
                  <CardDescription className="text-[10px] font-black uppercase tracking-widest opacity-60">Completá los datos de tu nueva oferta</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-10 space-y-8">
              <Form {...vm.form}>
                <form onSubmit={vm.onSubmit} className="space-y-8">
                  
                  <FormField control={vm.form.control} name="name" render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-xs font-bold uppercase tracking-widest opacity-60">Nombre del Juego</FormLabel>
                      <FormControl><Input placeholder="Elden Ring" className="h-14 bg-white/5 border-white/10 rounded-2xl font-bold" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={vm.form.control} name="description" render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-xs font-bold uppercase tracking-widest opacity-60">Descripción</FormLabel>
                      <FormControl><Textarea placeholder="Contale a los compradores de qué trata el juego..." className="min-h-[140px] bg-white/5 border-white/10 rounded-2xl" {...field} /></FormControl>
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
                        <FormLabel className="text-xs font-bold uppercase tracking-widest opacity-60">Stock Calculado</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type="number" 
                              readOnly 
                              className="h-14 bg-white/[0.02] border-white/5 rounded-2xl font-black text-primary/60 cursor-not-allowed" 
                              {...field} 
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black uppercase tracking-tighter opacity-30">
                              Auto-Sincronizado
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  {/* NUEVA SECCIÓN: KEY MANAGER INTEGRATION */}
                  <div className="space-y-3">
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                       <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                       Claves Digitales (Keys)
                    </FormLabel>
                    <Textarea 
                      placeholder="Pega aquí tus claves (una por cada línea)..." 
                      className="min-h-[180px] bg-white/[0.05] border-primary/20 rounded-2xl font-mono text-sm focus:border-primary transition-all p-6"
                      value={vm.keysText}
                      onChange={(e) => vm.setKeysText(e.target.value)}
                    />
                    <div className="flex justify-between items-center px-2">
                      <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                        El stock se calculará automáticamente en base a las líneas ingresadas.
                      </p>
                      <Badge variant="outline" className="text-[9px] font-black tracking-widest bg-primary/5 border-primary/20">
                         {vm.form.watch("stock")} LICENCIAS
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={vm.form.control} name="platformId" render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-xs font-bold uppercase tracking-widest opacity-60">Plataforma</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger className="h-14 bg-white/5 border-white/10 rounded-2xl">
                            <SelectValue placeholder={vm.isLoadingTaxonomies ? "Cargando..." : "Seleccionar"} />
                          </SelectTrigger></FormControl>
                          <SelectContent className="bg-card/95 backdrop-blur-xl">
                            {vm.platforms.map((p) => (<SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={vm.form.control} name="genreId" render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-xs font-bold uppercase tracking-widest opacity-60">Género</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger className="h-14 bg-white/5 border-white/10 rounded-2xl">
                            <SelectValue placeholder={vm.isLoadingTaxonomies ? "Cargando..." : "Seleccionar"} />
                          </SelectTrigger></FormControl>
                          <SelectContent className="bg-card/95 backdrop-blur-xl">
                            {vm.genres.map((g) => (<SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>))}
                          </SelectContent>
                        </Select>
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
                        <FormLabel className="text-xs font-bold uppercase tracking-widest">Activar Oferta Inicial</FormLabel>
                        <FormDescription className="text-[9px] uppercase font-bold tracking-widest opacity-40">Lanzá el producto con un precio promocional.</FormDescription>
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

                  <FormField control={vm.form.control} name="developer" render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-xs font-bold uppercase tracking-widest opacity-60">Desarrollador</FormLabel>
                      {vm.isCustomDev ? (
                        <div className="flex gap-2">
                          <FormControl><Input className="h-14 bg-white/5 border-white/10 rounded-2xl" placeholder="Nombre de la empresa" {...field} autoFocus /></FormControl>
                          <Button type="button" variant="outline" className="h-14 rounded-2xl" onClick={vm.cancelCustomDeveloper}>CANCELAR</Button>
                        </div>
                      ) : (
                        <Select onValueChange={vm.toggleCustomDeveloper} defaultValue={field.value}>
                          <FormControl><SelectTrigger className="h-14 bg-white/5 border-white/10 rounded-2xl"><SelectValue placeholder="Seleccionar" /></SelectTrigger></FormControl>
                          <SelectContent className="bg-card/95 backdrop-blur-xl">
                            {DEVELOPERS.map((dev) => (<SelectItem key={dev} value={dev}>{dev}</SelectItem>))}
                            <SelectItem value="__custom__" className="text-primary font-bold">+ REGISTRAR OTRO</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={vm.form.control} name="active" render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-4 space-y-0 rounded-[2rem] border border-primary/20 p-6 bg-primary/5">
                      <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-primary data-[state=checked]:text-black" /></FormControl>
                      <div className="space-y-1">
                        <FormLabel className="text-xs font-bold uppercase tracking-widest text-primary">Producto Público</FormLabel>
                        <FormDescription className="text-[9px] uppercase font-bold tracking-widest opacity-60">Si se marca, el producto estará disponible en el catálogo inmediatamente.</FormDescription>
                      </div>
                    </FormItem>
                  )} />

                  <Button type="submit" className="w-full h-16 bg-primary text-white font-bold text-lg tracking-widest rounded-[2rem] shadow-xl hover:shadow-[0_15px_40px_rgba(214,88,250,0.4)] hover:-translate-y-1 transition-all" disabled={vm.isSubmitting || vm.isUploading}>
                    {vm.isSubmitting ? <Loader2 className="h-6 w-6 animate-spin" /> : <><PlusCircle className="mr-3 h-6 w-6" /> CREAR PUBLICACIÓN</>}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="border-none bg-card/40 backdrop-blur-3xl shadow-2xl rounded-[3rem] overflow-hidden">
             <CardHeader className="p-8 pb-4 border-b border-white/5 bg-primary/5">
                <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                   <ImageIcon className="h-4 w-4 text-primary" /> Portada del Juego
                </CardTitle>
             </CardHeader>
             <CardContent className="p-8 space-y-6">
               <div className="relative group">
                 <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 bg-black/40 shadow-inner">
                   {vm.form.watch("imageId") ? (
                      <Image src={vm.form.watch("imageId") || ""} alt="Preview" fill className="object-cover animate-in zoom-in-95 duration-500" />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4 opacity-20">
                         <ImageIcon className="h-12 w-12" />
                         <p className="text-[10px] font-black uppercase tracking-widest">Sin Portada</p>
                      </div>
                    )}
                    {vm.form.watch("imageId") && (
                      <Button type="button" variant="destructive" size="icon" className="absolute top-4 right-4 h-10 w-10 rounded-full shadow-lg" onClick={() => vm.form.setValue("imageId", "")}><X className="h-5 w-5" /></Button>
                    )}
                 </div>
                 <div className="mt-6">
                    <Input type="file" accept="image/*" onChange={vm.handleImageUpload} disabled={vm.isUploading} className="bg-white/5 border-white/10 rounded-xl" />
                    <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mt-3 text-center">Formato Vertical Recomendado (3:4)</p>
                 </div>
               </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
