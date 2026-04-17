import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, type LoginValues } from "@/lib/schemas";
import { useToast } from "@/hooks/use-toast";

/**
 * ViewModel del Módulo de Acceso (Login)
 * --------------------------------------------------------------------------
 * Encapsula la persistencia del contexto global (Auth), la orquestación 
 * de red (API/Login) y la seguridad de entrada local (Zod/Form).
 */
export function useLoginViewModel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams?.get('redirect') || '/';
  
  const { login, loading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Integridad de Formularios (Contrato Estricto Zod)
  const form = useForm<LoginValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Operación: Validar y Procesar Credenciales
  const handleSubmit = async (values: LoginValues) => {
    setIsSubmitting(true);
    try {
      const result = await login(values.email, values.password);

      if (result.success) {
        toast({
          title: "¡Qué bueno verte de nuevo!",
          description: "Ingresaste con éxito a tu cuenta.",
          className: "bg-green-50/10 border-green-500/20 text-green-400"
        });
        router.push(redirectPath);
        router.refresh();
      } else {
        toast({
          variant: "destructive",
          title: "Algo salió mal",
          description: result.message || "Tu correo o contraseña no coinciden con nuestros datos.",
        });
      }
    } catch (err: any) {
      console.error("[LoginViewModel] Error de red:", err);
      toast({
        variant: "destructive",
        title: "Problema de conexión",
        description: err.message || "Tuvimos un problema internamente. Intentá de nuevo en unos minutos.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    // Modelos / Estados
    form,
    isSubmitting,
    authLoading,
    
    // Comandos / Actions
    onSubmit: form.handleSubmit(handleSubmit)
  };
}
