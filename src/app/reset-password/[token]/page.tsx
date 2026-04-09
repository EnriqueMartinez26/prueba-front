"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Loader2, KeyRound, ArrowLeft, Eye, EyeOff } from "lucide-react";

const ResetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });
type ResetPasswordValues = z.infer<typeof ResetPasswordSchema>;

export default function ResetPasswordPage({
  params,
}: {
  params: { token: string };
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (values: ResetPasswordValues) => {
    setIsSubmitting(true);
    try {
      await ApiClient.resetPassword(params.token, values.password);
      toast({
        title: "¡Contraseña restablecida!",
        description: "Podés iniciar sesión con tu nueva contraseña.",
      });
      router.push("/login");
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Enlace inválido o expirado",
        description:
          err.message ||
          "El enlace de recuperación ya no es válido. Solicitá uno nuevo.",
      });
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
          <div className="flex justify-center mb-2">
            <div className="rounded-full bg-primary/10 p-3">
              <KeyRound className="h-7 w-7 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold font-headline text-center">
            Nueva contraseña
          </CardTitle>
          <CardDescription className="text-center">
            Elegí una contraseña segura de al menos 6 caracteres.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nueva contraseña</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••"
                          disabled={isSubmitting}
                          className="pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() => setShowPassword((v) => !v)}
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar contraseña</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirm ? "text" : "password"}
                          placeholder="••••••"
                          disabled={isSubmitting}
                          className="pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() => setShowConfirm((v) => !v)}
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Restablecer contraseña"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <Link
            href="/forgot-password"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Solicitar un nuevo enlace
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
