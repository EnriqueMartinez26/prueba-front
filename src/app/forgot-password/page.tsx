"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ApiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
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
import { Loader2, MailCheck, ArrowLeft } from "lucide-react";

const ForgotPasswordSchema = z.object({
  email: z.string().email("Ingresá un correo electrónico válido"),
});
type ForgotPasswordValues = z.infer<typeof ForgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: ForgotPasswordValues) => {
    setIsSubmitting(true);
    try {
      await ApiClient.forgotPassword(values.email);
      setEmailSent(true);
    } catch (err: any) {
      // Mostramos el mismo mensaje de éxito aunque falle para no revelar
      // si el email existe o no (seguridad — enumeración de usuarios).
      setEmailSent(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-4rem)] py-8 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-3">
            <Image
              src="/logo.png"
              alt="4Fun Logo"
              width={160}
              height={160}
              className="h-20 w-20 md:h-28 md:w-28 object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-bold font-headline text-center">
            ¿Olvidaste tu contraseña?
          </CardTitle>
          <CardDescription className="text-center">
            Ingresá tu correo y te enviaremos un enlace para restablecerla.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {emailSent ? (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <div className="rounded-full bg-primary/10 p-4">
                <MailCheck className="h-10 w-10 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-lg">¡Revisá tu correo!</p>
                <p className="text-muted-foreground text-sm mt-1">
                  Si tu email está registrado, recibirás un enlace para
                  restablecer tu contraseña en los próximos minutos.
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                ¿No lo ves? Revisá tu carpeta de spam.
              </p>
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo electrónico</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="tu@email.com"
                          type="email"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar enlace de recuperación"
                  )}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>

        <CardFooter className="flex justify-center">
          <Link
            href="/login"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio de sesión
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
