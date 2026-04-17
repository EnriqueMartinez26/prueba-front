import { useCart } from "@/context/CartContext";
import { useAuth } from "@/hooks/use-auth";

/**
 * ViewModel: Orquestador de Cabecera Global
 * --------------------------------------------------------------------------
 * Centraliza TODA la lógica de estado, contexto y acciones.
 * Retorna props limpias y estructuradas para componentes presentacionales.
 * (MVC - Model/ViewModel)
 */
export function useHeaderViewModel() {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();

  // ═══════════════════════════════════════════════════════════════════════════
  // DERIVACIONES - Computadas a partir del estado global
  // ═══════════════════════════════════════════════════════════════════════════

  const isLoggedIn = !!user;
  const isAdmin = user?.role === 'admin';
  const isSeller = user?.role === 'seller';
  const userName = user?.name || user?.email || "";
  const userInitials = (userName || 'U')[0].toUpperCase();
  const userAvatar = user?.avatar;
  const userRoleDisplay = user?.role ? `Cuenta ${user.role}` : "";
  const hasItemsInCart = cartCount > 0;

  // ═══════════════════════════════════════════════════════════════════════════
  // ACCIONES - Encapsuladas y composables
  // ═══════════════════════════════════════════════════════════════════════════

  const handleLogout = () => {
    logout();
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RETORNO ESTRUCTURADO - Props organizadas por sección
  // ═══════════════════════════════════════════════════════════════════════════

  return {
    // LOGO
    logo: {
      href: "/",
    },

    // NAVEGACIÓN
    navigation: {
      showAdmin: isAdmin,
      adminHref: "/admin",
      showSeller: isSeller,
      sellerHref: "/seller/products",
    },

    // BÚSQUEDA (mantenida igual)
    search: {
      placeholder: "Buscar...",
      shortcut: "⌘ K",
    },

    // CARRITO
    cart: {
      href: "/cart",
      count: cartCount,
      showBadge: hasItemsInCart,
    },

    // FAVORITOS
    wishlist: {
      href: "/wishlist",
      show: isLoggedIn,
    },

    // PERFIL / DROPDOWN
    profile: {
      isLoggedIn,
      userName,
      userInitials,
      userAvatar,
      userRoleDisplay,
      profileHref: "/account",
      adminLink: "/admin/products",
      show: isLoggedIn,
    },

    // AUTENTICACIÓN (Login/Logout)
    auth: {
      isLoggedIn,
      loginHref: "/login",
      onLogout: handleLogout,
    },
  };
}
