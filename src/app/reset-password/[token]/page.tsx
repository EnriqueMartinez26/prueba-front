"use client";

/**
 * Capa de Interfaz: Mutación de Credenciales de Acceso (Reset Password)
 * --------------------------------------------------------------------------
 * Componente asintomático (Dumb Component). Toda la orquestación y 
 * retención de estados ocurre puramente en el ViewModel.
 * (MVC / View)
 */

import { use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, KeyRound, ArrowLeft, Eye, EyeOff, ShieldCheck } from "lucide-react";

// ✅ INYECCIÓN MVC
import { useResetPasswordViewModel } from "@/hooks/use-reset-password-view-model";

export default function ResetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const { 
    form, 
    isSubmitting, 
    showPassword, 
    showConfirm, 
    togglePasswordVisibility, 
    toggleConfirmVisibility, 
    onSubmit 
  } = useResetPasswordViewModel(token);

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[90vh] py-8 px-4 animate-in fade-in zoom-in-95 duration-700">
      <Card className="w-full max-w-md border-none bg-card/40 backdrop-blur-3xl shadow-3xl rounded-[2.5rem] overflow-hidden ring-1 ring-white/10 relative">
        
        {/* Adorno Top gradient */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-80" />

        <CardHeader className="pt-12 pb-6 text-center space-y-4">
          <div className="flex justify-center mb-2">
            <div className="relative group">
                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-50 transition-opacity duration-1000 group-hover:opacity-100" />
                <div className="h-20 w-20 flex items-center justify-center bg-black/40 rounded-2xl border border-white/5 relative z-10 hover:scale-110 transition-transform shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                    <KeyRound className="h-10 w-10 text-primary" />
                </div>
            </div>
          </div>
          <CardTitle className="text-3xl font-headline font-bold text-white tracking-tighter">
            Actualizar Credencial
          </CardTitle>
          <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-70">
            Protocolo de Actualización Registral de Password
          </CardDescription>
        </CardHeader>

        <CardContent className="px-10 pb-8">
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Nueva Contraseña</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Input
                          type={showPassword ? "text" : "password"}
                          disabled={isSubmitting}
                          className="h-12 bg-white/5 border-white/10 rounded-xl focus:ring-primary/40 text-white placeholder:opacity-20 pr-12"
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                          onClick={togglePasswordVisibility}
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-[10px] font-bold text-destructive uppercase tracking-tighter" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Confirmar Credencial</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Input
                          type={showConfirm ? "text" : "password"}
                          disabled={isSubmitting}
                          className="h-12 bg-white/5 border-white/10 rounded-xl focus:ring-primary/40 text-white placeholder:opacity-20 pr-12"
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                          onClick={toggleConfirmVisibility}
                          tabIndex={-1}
                        >
                          {showConfirm ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-[10px] font-bold text-destructive uppercase tracking-tighter" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-14 bg-primary text-black hover:bg-primary/90 font-black uppercase text-[10px] tracking-widest transition-all rounded-xl shadow-xl shadow-primary/20"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                    Ejecutando Restauración...
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4" />
                      Normalizar Acceso
                  </div>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex justify-center pb-12">
          <Link
            href="/forgot-password"
            className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Solicitar Identificador Alternativo
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
