"use client";

/**
 * Capa de Interfaz: Recuperación de Contraseña (Forgot Password)
 * --------------------------------------------------------------------------
 * Componente asintomático (Dumb Component). Toda la orquestación y 
 * retención de estados ocurre puramente en el ViewModel.
 */

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
import { Loader2, MailCheck, ArrowLeft, KeyRound } from "lucide-react";

// ✅ INYECCIÓN MVC
import { useForgotPasswordViewModel } from "@/hooks/use-forgot-password-view-model";

export default function ForgotPasswordPage() {
  const { form, isSubmitting, emailSent, onSubmit } = useForgotPasswordViewModel();

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
          <CardTitle className="text-3xl font-headline font-bold text-white tracking-tight">
            ¿Olvidaste tu contraseña?
          </CardTitle>
          <CardDescription className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground opacity-80">
            Restablecé tu acceso
          </CardDescription>
        </CardHeader>

        <CardContent className="px-10 pb-8">
          {emailSent ? (
            <div className="flex flex-col items-center gap-6 py-6 text-center animate-in slide-in-from-bottom-4 duration-500">
              <div className="relative group">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                <div className="rounded-full bg-primary/10 border border-primary/20 p-5 relative z-10 hover:scale-110 transition-transform">
                    <MailCheck className="h-10 w-10 text-primary" />
                </div>
              </div>
              <div className="space-y-3">
                <p className="font-bold text-lg text-white">¡Te enviamos un correo!</p>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-[280px]">
                  Si el correo está registrado en 4Fun, vas a recibir un link seguro para generar una nueva contraseña.
                </p>
                <div className="bg-white/5 p-3 rounded-xl mt-4">
                   <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Revisá también tu carpeta de Spam.</p>
                </div>
              </div>
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={onSubmit}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Correo electrónico</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          disabled={isSubmitting}
                          className="h-12 bg-white/5 border-white/5 rounded-2xl focus:ring-primary/40 text-white placeholder:opacity-20 transition-all hover:bg-white/10"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold text-destructive tracking-wide ml-1" />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full h-14 mt-6 bg-white/5 text-white hover:bg-primary hover:text-black border border-white/10 hover:border-primary font-black uppercase text-xs tracking-[0.15em] rounded-2xl shadow-xl hover:shadow-primary/20 transition-all duration-300 group" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                      Enviando instrucciones...
                    </>
                  ) : (
                    "Recuperar cuenta"
                  )}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>

        <CardFooter className="flex justify-center pb-12 mt-2">
          <Link
            href="/login"
            className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/80 uppercase tracking-widest hover:text-primary transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1.5 transition-transform" />
            Volver a Iniciar Sesión
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
