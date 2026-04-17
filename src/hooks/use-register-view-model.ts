import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema, type RegisterValues } from "@/lib/schemas";
import { useToast } from "@/hooks/use-toast";

/**
 * ViewModel del Ecosistema de Registro (Register)
 * --------------------------------------------------------------------------
 * Conecta el Dumb Component con el contexto de auth y la librería
 * de validación (Zod), retornando los props puros.
 */
export function useRegisterViewModel() {
  const router = useRouter();
  const { register, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Zod + React Hook Form Integración
  const form = useForm<RegisterValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (values: RegisterValues) => {
    setIsSubmitting(true);
    try {
      const result = await register(
        values.name,
        values.email,
        values.password
      );

      if (result.success) {
        toast({
          title: "¡Bienvenido a la comunidad!",
          description: "Tu cuenta fue creada con éxito.",
          className: "bg-green-50/10 border-green-500/20 text-green-400"
        });
        router.push("/");
        router.refresh();
      } else {
        toast({
          variant: "destructive",
          title: "Hubo un problema",
          description: result.message || "Ese correo ya podría estar en uso. Intentá con otro.",
        });
      }
    } catch (err: any) {
      console.error("[RegisterViewModel] Error crítico:", err);
      toast({
        variant: "destructive",
        title: "Error de conexión",
        description: err.message || "Tuvimos un problema internamente. Intentá de nuevo en unos minutos.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    authLoading,
    onSubmit: form.handleSubmit(handleSubmit)
  };
}
