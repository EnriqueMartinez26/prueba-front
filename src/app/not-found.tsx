import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Ghost, ArrowRight, Home } from 'lucide-react';

/**
 * Capa de Interfaz: Manejador de Excepciones de Enrutamiento (Not Found)
 * --------------------------------------------------------------------------
 * Resuelve las colisiones de navegación cuando el segmento de la URI no 
 * coincide con ninguna ruta física o dinámica del sistema. 
 * Implementa una experiencia de recuperación (Fallback UX) para evitar la
 * deserción del usuario en el flujo de consulta. (UI / View)
 */

export default function NotFound() {
    return (
        <div className="flex min-h-[85vh] flex-col items-center justify-center gap-6 text-center animate-in fade-in zoom-in-95 duration-700 px-4">
            
            {/* Componente Visual de Excepción */}
            <div className="relative group">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full opacity-50 group-hover:opacity-80 transition-opacity animate-pulse" />
                <div className="relative bg-card/40 backdrop-blur-2xl border border-white/10 p-12 rounded-[3rem] shadow-3xl overflow-hidden">
                    {/* El 404 ahora está ADENTRO y como marca de agua */}
                    <h1 className="text-[12rem] font-bold leading-none text-white/5 font-headline tracking-tighter absolute top-4 left-1/2 -translate-x-1/2 select-none">404</h1>
                    
                    <Ghost className="h-24 w-24 text-primary relative z-10 mx-auto animate-bounce duration-[3000ms]" />
                    <div className="mt-14 relative z-10">
                        <h2 className="text-4xl font-bold text-white/70 tracking-tighter italic">Pagina no encontrada</h2>
                    </div>
                </div>
            </div>

            <div className="max-w-md space-y-8">
                <p className="text-muted-foreground text-sm leading-relaxed opacity-80">
                    La página que buscabas no está disponible. Podés volver al inicio o seguir explorando juegos en nuestro catálogo.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg" className="h-14 px-8 rounded-xl font-bold uppercase tracking-widest text-[10px] bg-primary text-white hover:bg-primary/90 shadow-xl transition-all shadow-primary/20">
                        <Link href="/">
                            <Home className="mr-2 h-4 w-4" /> Regresar al Inicio
                        </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="h-14 px-8 rounded-xl border-white/10 text-white/60 font-bold uppercase tracking-widest text-[10px] hover:bg-white/5 transition-all">
                        <Link href="/productos">
                            Explorar Catálogo <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Footer de Capa de Error */}
            <div className="fixed bottom-10 opacity-20 select-none">
                <span className="text-[9px] font-bold uppercase tracking-[0.6em] text-white/40">Error 404 Protocol</span>
            </div>
        </div>
    );
}
