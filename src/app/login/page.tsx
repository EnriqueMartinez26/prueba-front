"use client";

/**
 * Capa de Interfaz: Ingreso de Usuario (Login Page)
 * --------------------------------------------------------------------------
 * Componente asintomático (Dumb Component). Toda la lógica de conexión,
 * Zod validations y ruteo es delegada al ViewModel.
 */

import { Suspense } from "react";
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
import Image from "next/image";
import { Loader2, LogIn, ArrowRight } from "lucide-react";

// ✅ INYECCIÓN MVC
import { useLoginViewModel } from "@/hooks/use-login-view-model";

function LoginForm() {
  const { form, isSubmitting, authLoading, onSubmit } = useLoginViewModel();

  if (authLoading) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
      </div>
    );
  }

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[85vh] py-8 px-4 animate-in fade-in zoom-in-95 duration-700">
      <Card className="w-full max-w-md border-none bg-card/40 backdrop-blur-3xl shadow-3xl rounded-[2.5rem] overflow-hidden ring-1 ring-white/10">
        <CardHeader className="pt-12 pb-6 text-center space-y-4">
          <div className="flex justify-center mb-2">
            <div className="relative group">
                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
                <Image src="/logo.png" alt="4Fun Logo" width={100} height={100} className="h-20 w-20 object-contain relative z-10 hover:scale-110 transition-transform duration-500" />
            </div>
          </div>
          <div className="space-y-1">
            <CardTitle className="text-3xl font-headline font-bold text-white tracking-tight">
              Iniciar sesión
            </CardTitle>
            <CardDescription className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground opacity-80">
              Entrá a tu cuenta
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="px-10 pb-8">
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Tu email</FormLabel>
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
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Contraseña</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        disabled={isSubmitting}
                        className="h-12 bg-white/5 border-white/5 rounded-2xl focus:ring-primary/40 text-white placeholder:opacity-20 transition-all hover:bg-white/10"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[10px] font-bold text-destructive tracking-wide ml-1" />
                  </FormItem>
                )}
              />
              <div className="flex justify-end pt-2">
                <Link
                  href="/forgot-password"
                  className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary/70 hover:text-primary transition-colors underline-offset-4 hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <Button type="submit" className="w-full h-14 mt-6 bg-white/5 text-white hover:bg-primary hover:text-black border border-white/10 hover:border-primary font-black uppercase text-xs tracking-[0.15em] rounded-2xl shadow-xl hover:shadow-primary/20 transition-all duration-300 group" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
                    Entrar
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-6 text-center px-10 pb-12 mt-2">
          <div className="text-sm text-muted-foreground/80 font-medium tracking-tight">
            ¿No tenés una cuenta?{" "}
            <Link href="/register" className="text-white hover:text-primary transition-colors font-bold flex items-center justify-center mt-3 gap-2 group">
              ¡Registrate ahora! <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform text-primary" />
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
        <div className="min-h-[85vh] flex items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
        </div>
    }>
      <LoginForm />
    </Suspense>
  );
}