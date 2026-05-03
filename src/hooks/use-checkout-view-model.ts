import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/hooks/use-auth";
import { OrderApiService } from "@/lib/services/OrderApiService";
import { useToast } from "@/hooks/use-toast";

export function useCheckoutViewModel() {
  const { cart, cartTotal } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Argentina",
    paymentMethod: "mercadopago"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const nextStep = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (currentStep === 1) {
      if (!isFormValid) {
        toast({ 
          variant: "destructive", 
          title: "¿A dónde enviamos tu pedido?", 
          description: "Por favor, completa todos los campos de dirección para que podamos entregarte tus juegos." 
        });
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({ 
        variant: "destructive", 
        title: "Necesitamos saber quién eres", 
        description: "Por favor, inicia sesión para que podamos vincular esta compra a tu cuenta." 
      });
      router.push("/login");
      return;
    }

    if (cart.length === 0) {
      toast({ 
        variant: "destructive", 
        title: "Tu carrito está vacío", 
        description: "Agrega algunos juegos antes de intentar finalizar la compra." 
      });
      router.push("/productos");
      return;
    }

    setIsSubmitting(true);

    // ✅ REGLA QA E-COMMERCE #004: CARGA ÚTIL ESTERILIZADA (Payload Seguro)
    // El frontend JAMÁS remite precios. Solo el inventario base y parámetros logísticos.
    // El backend recaba precios de DB e incauta la orden.
    const secureOrderData = {
      userId: user.id,
      paymentMethod: formData.paymentMethod,
      shippingAddress: {
        fullName: user.name, // O recolectar de un input en el form
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zip: formData.zipCode,
        country: formData.country
      },
      orderItems: cart.map(item => ({
        product: item.productId,
        quantity: item.quantity
      }))
      // INCISUM DE SEGURIDAD ELIMINADO: itemsPrice, shippingPrice, totalPrice, image, name.
    };

    try {
      const response = await OrderApiService.create(secureOrderData as any);

      if (response.paymentLink) {
        // Soporte robusto por si ObjectId llega anidado en distintas formas según Backend Node
        const resolvedOrderId = response.orderId || (response.order && (response.order.id || response.order._id));
        const query = new URLSearchParams({
          payment_link: String(response.paymentLink),
        });
        if (resolvedOrderId) query.set("order_id", String(resolvedOrderId));

        toast({ title: "¡Orden Creada!", description: "Estamos conectando con Mercado Pago para procesar tu pago de forma segura..." });
        router.push(`/checkout/success?${query.toString()}`);
      } else {
        throw new Error("El motor no consolidó la liquidación externa.");
      }
    } catch (error: any) {
      console.error("[useCheckoutViewModel] Excepción de Liquidación:", error);
      toast({
        variant: "destructive",
        title: "No pudimos procesar el pago",
        description: error.response?.data?.message || error.message || "Hubo un problema al conectar con la pasarela de pagos. Por favor, verifica tu conexión o el stock de los productos."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = Boolean(
    formData.street && 
    formData.city && 
    formData.state && 
    formData.zipCode && 
    formData.country
  );

  return {
    cart,
    cartTotal,
    user,
    isSubmitting,
    currentStep,
    formData,
    isFormValid,
    setFormData,
    handleChange,
    nextStep,
    prevStep,
    handleSubmit
  };
}
