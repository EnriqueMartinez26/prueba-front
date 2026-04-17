import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

/**
 * ViewModel para el Layout de Administración
 * Maneja la seguridad de la ruta y el estado de carga.
 */
export function useAdminLayoutViewModel() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Guardamos a dónde quería ir para devolverlo después
        const currentPath = window.location.pathname;
        router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      } else if (user.role !== "admin") {
        // Si no es admin, lo sacamos de acá
        router.push("/");
      }
    }
  }, [user, loading, router]);

  const isAuthorized = !loading && user && user.role === "admin";

  return {
    loading,
    isAuthorized,
    user,
  };
}
