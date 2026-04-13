# Hoja de Argumentos Extendida del Proyecto 4Fun Store

## 1) Proposito de este documento
Este documento explica, de forma extendida y separada del codigo fuente, que hace cada parte principal del proyecto, en que archivo esta y como se implementa.

Alcance:
- Backend: API REST, seguridad, reglas de negocio y persistencia.
- Frontend: UI, estado global, consumo de API y flujo de usuario.
- Integracion: como se conectan ambas capas.

---

## 2) Mapa general del workspace
Estructura principal:
- Proyecto-Back/: backend Node.js + Express + Prisma + PostgreSQL.
- prueba-front/: frontend Next.js + React + TypeScript + Tailwind.
- docs/: documentacion auxiliar (manuales y anexos).

---

## 3) Arquitectura global (resumen argumental)
Arquitectura aplicada:
- Patron por capas con separacion de responsabilidades.
- Flujo backend: Route -> Middleware -> Controller -> Service -> Prisma -> DB.
- Flujo frontend: App Router -> Componentes -> Hooks/Context -> ApiClient -> Backend.

Argumento tecnico:
- Esta division reduce acoplamiento, facilita pruebas por modulo y permite evolucionar reglas de negocio sin romper la UI.

---

## 4) Backend (Proyecto-Back) - que hace cada parte, donde y como

### 4.1 Arranque del servidor y middleware global
| Parte | Archivo | Que hace | Como se hace |
|---|---|---|---|
| Bootstrap del servidor | Proyecto-Back/server.js | Inicializa Express, seguridad, rutas y conexion DB | Carga variables de entorno, valida configuracion, conecta Prisma y monta middlewares globales |
| Configuracion CORS | Proyecto-Back/config/cors.js | Restringe origenes permitidos | Lista origenes validos y contempla previews de Vercel con regex |
| Conexion Prisma | Proyecto-Back/lib/prisma.js | Crea cliente de base de datos | Centraliza instancia Prisma para evitar multiples conexiones |

Argumento:
- La capa de arranque centraliza politicas transversales (helmet, rate limit, compresion, parseo de cookies), evitando duplicacion en rutas.

### 4.2 Modelo de datos y normalizacion
| Parte | Archivo | Que hace | Como se hace |
|---|---|---|---|
| Esquema relacional | Proyecto-Back/prisma/schema.prisma | Define entidades, relaciones e indices | Modelos en PostgreSQL con relaciones por FK, enums de dominio e indices para consultas frecuentes |
| Migraciones (estado de schema) | Proyecto-Back/prisma/ | Versiona cambios de base | Prisma genera y aplica migraciones sobre el schema |

Puntos clave del schema:
- Product se relaciona con Platform y Genre.
- Order se normaliza con OrderItem, Payment y ShippingAddress.
- Cart y Wishlist usan tablas intermedias para items.
- Hay soft-delete funcional con campos activo/activa en entidades de catalogo.

Argumento:
- La estructura apunta a 3FN operativa: separa datos repetitivos y mantiene integridad referencial.

### 4.3 Seguridad y control de acceso
| Parte | Archivo | Que hace | Como se hace |
|---|---|---|---|
| Autenticacion JWT | Proyecto-Back/middlewares/auth.js | Verifica token y carga usuario en req.user | Lee token de cookie o Bearer, valida JWT y consulta usuario por id |
| Autorizacion por rol | Proyecto-Back/middlewares/auth.js | Restringe endpoints admin | Middleware authorize(...roles) evalua req.user.role |
| Manejo de errores | Proyecto-Back/middlewares/errorHandler.js | Uniforma respuestas de error | Captura excepciones y traduce a respuesta HTTP consistente |
| Validacion de entorno | Proyecto-Back/middlewares/validateEnv.js | Evita iniciar con config incompleta | Verifica variables obligatorias al inicio |

Argumento:
- Se separa autenticar (identidad) de autorizar (permisos), mejorando trazabilidad de seguridad.

### 4.4 Enrutamiento HTTP (API surface)
| Parte | Archivo | Que hace | Como se hace |
|---|---|---|---|
| Registro de rutas | Proyecto-Back/server.js | Conecta prefijos /api/* | app.use para auth, products, cart, orders, users, dashboard, etc. |
| Rutas de productos | Proyecto-Back/routes/productRoutes.js | Endpoints publicos y admin de catalogo | GET publico, GET/POST/PUT/DELETE admin con protect+authorize |
| Rutas de ordenes | Proyecto-Back/routes/orderRoutes.js | Checkout e historial | POST crear orden (user), GET admin total, PATCH estados |

Argumento:
- La capa de rutas solo expresa contratos HTTP y delega la logica real a controllers/services.

### 4.5 Controladores (orquestacion HTTP)
| Parte | Archivo | Que hace | Como se hace |
|---|---|---|---|
| Controller de productos | Proyecto-Back/controllers/productController.js | Traduce query/body a llamadas de servicio | Lee query params, llama ProductService y responde JSON paginado |
| Controller de ordenes | Proyecto-Back/controllers/orderController.js | Expone operaciones de compra | Delega validaciones de negocio a OrderService |
| Otros controllers | Proyecto-Back/controllers/*.js | CRUD y casos de uso por modulo | Patrón uniforme: try/catch + next(error) |

Argumento:
- El controller queda delgado: evita mezclar capa HTTP con reglas de negocio.

### 4.6 Servicios (reglas de negocio)
| Parte | Archivo | Que hace | Como se hace |
|---|---|---|---|
| Servicio de productos | Proyecto-Back/services/productService.js | Filtrado, mapeo DTO, alta/edicion de productos | Construye where de Prisma (search/platform/genre/precio), calcula precio final con descuento y mapea a DTO frontend |
| Servicio de ordenes | Proyecto-Back/services/orderService.js | Checkout seguro y control de stock | Recalcula precios desde DB, valida disponibilidad, descuenta stock y crea orden con items |
| Servicio de auth | Proyecto-Back/services/authService.js | Login/registro/tokens | Encapsula autenticacion y salida de sesion |
| Servicio de email | Proyecto-Back/services/emailService.js | Emails transaccionales | Envia mensajes por SMTP segun eventos |
| Servicios auxiliares | Proyecto-Back/services/*.js | Cart, wishlist, reviews, dashboard, etc. | Cada modulo encapsula su logica de dominio |

Argumento:
- Esta capa concentra la "verdad de negocio" y evita decisiones criticas en frontend.

### 4.7 Utilidades y soporte transversal
| Parte | Archivo | Que hace | Como se hace |
|---|---|---|---|
| Logger | Proyecto-Back/utils/logger.js | Logging estructurado | Winston con niveles y salida controlada |
| ErrorResponse | Proyecto-Back/utils/errorResponse.js | Error de dominio con status code | Clase custom para lanzar errores semanticos |
| Helpers | Proyecto-Back/utils/*.js | Soporte de parseo y constantes | Funciones reutilizables para mantener codigo limpio |

---

## 5) Frontend (prueba-front) - que hace cada parte, donde y como

### 5.1 Shell de aplicacion y layout
| Parte | Archivo | Que hace | Como se hace |
|---|---|---|---|
| Layout raiz | prueba-front/src/app/layout.tsx | Estructura global (Header/Main/Footer) | Envuelve toda la app, aplica fuentes y monta AppProviders |
| Proveedores globales | prueba-front/src/app/providers.tsx | Inyeccion de contextos | Ordena AuthProvider, CartProvider, WishlistProvider y ComparatorProvider |
| Estilos base | prueba-front/src/app/globals.css | Tokens visuales y estilos globales | Define reglas de estilo compartidas |

Argumento:
- El layout central unifica comportamiento visual y estado global de toda la aplicacion.

### 5.2 Capa de consumo API
| Parte | Archivo | Que hace | Como se hace |
|---|---|---|---|
| Cliente HTTP central | prueba-front/src/lib/api.ts | Punto unico de llamadas al backend | request() compone base URL, headers, token y parseo de errores |
| Tipos de contrato | prueba-front/src/lib/types.ts | Define entidades de frontend | Tipado estatico para User, Product, CartItem, Order, etc. |
| Esquemas de validacion | prueba-front/src/lib/schemas.ts | Valida payloads | Zod valida datos de entrada y salida segun contrato |

Argumento:
- Tener un cliente central evita fetch disperso y estandariza errores/sesion.

### 5.3 Estado global y persistencia en cliente
| Parte | Archivo | Que hace | Como se hace |
|---|---|---|---|
| Contexto de carrito | prueba-front/src/context/CartContext.tsx | Maneja carrito local/remoto | Si hay usuario, sincroniza con API; si no, usa localStorage |
| Contexto de wishlist | prueba-front/src/context/WishlistContext.tsx | Gestiona favoritos | Toggle optimista con rollback si falla API |
| Hook de auth | prueba-front/src/hooks/use-auth.tsx | Estado de sesion | Carga perfil, login/logout y persistencia de token |

Argumento:
- Se combinan experiencia fluida (optimistic UI) y consistencia (re-sync con servidor).

### 5.4 Catalogo y filtros
| Parte | Archivo | Que hace | Como se hace |
|---|---|---|---|
| Pagina de productos | prueba-front/src/app/productos/page.tsx | SSR inicial del catalogo | Solicita datos iniciales al backend y delega interaccion al componente cliente |
| Componente de catalogo | prueba-front/src/components/game/game-catalog.tsx | Render grid, paginacion y filtros | Consume useGameCatalog y muestra sidebar + cards |
| Hook del catalogo | prueba-front/src/hooks/use-game-catalog.ts | Orquesta filtros y URL sync | Debounce, fetch filtrado, sincronizacion con query params y maximo de precio dinamico |
| Sidebar de filtros | prueba-front/src/components/game/catalog-sidebar.tsx | UI de plataforma/genero/precio | Usa checkboxes y slider con tope maxPriceCap |

Argumento:
- El catalogo separa vista y logica: UI en componentes, estado y red en hook.

### 5.5 Modulos funcionales por dominio
| Dominio | Archivos principales | Que hace | Como se hace |
|---|---|---|---|
| Autenticacion | prueba-front/src/app/login/, prueba-front/src/app/register/, prueba-front/src/hooks/use-auth.tsx | Alta, login y sesion | Formularios + ApiClient + manejo de token/usuario |
| Carrito y checkout | prueba-front/src/app/cart/page.tsx, prueba-front/src/app/checkout/ | Flujo de compra | Usa CartContext y endpoints /api/cart y /api/orders |
| Admin | prueba-front/src/app/admin/ y subrutas | Gestion de catalogo, usuarios y metadatos | Vistas protegidas con operaciones CRUD sobre API |
| Producto detalle | prueba-front/src/components/game/product-detail-view.tsx | Ficha completa del juego | Muestra precio final, reseñas, acciones de compra y wishlist |
| Busqueda/UX | prueba-front/src/components/search-dialog.tsx | Acceso rapido al catalogo | Consulta y navegacion contextual |

---

## 6) Flujos "como se hace" (end-to-end)

### 6.1 Flujo de consulta de catalogo con filtros
1. El usuario entra a prueba-front/src/app/productos/page.tsx.
2. La pagina hace carga inicial SSR con ApiClient.getProducts(...).
3. El componente prueba-front/src/components/game/game-catalog.tsx renderiza resultados.
4. El hook prueba-front/src/hooks/use-game-catalog.ts escucha cambios de filtros.
5. El hook vuelve a consultar /api/products con query params.
6. En backend, Proyecto-Back/routes/productRoutes.js dirige a productController.
7. Proyecto-Back/controllers/productController.js llama a ProductService.getProducts.
8. Proyecto-Back/services/productService.js traduce filtros a Prisma where y devuelve DTO.

### 6.2 Flujo de checkout (compra)
1. El usuario agrega items desde frontend (CartContext).
2. Si hay sesion, se persiste en backend via /api/cart.
3. Al confirmar compra, frontend envia orderItems y direccion a /api/orders.
4. Proyecto-Back/routes/orderRoutes.js aplica protect y envia a controller.
5. Proyecto-Back/services/orderService.js recalcula precios con DB, valida stock/keys y crea orden.
6. El backend devuelve orderId y data de pago para continuar el flujo.

### 6.3 Flujo de seguridad (ruta admin)
1. Frontend llama endpoint admin (ejemplo: productos admin).
2. Backend pasa por protect en Proyecto-Back/middlewares/auth.js.
3. Si token valido, authorize('admin') verifica rol.
4. Solo con rol admin se ejecuta controller/servicio.

---

## 7) Argumentos de diseno y mantenibilidad
1. Separacion por capas:
- Beneficio: menor acoplamiento y cambios localizados.
- Evidencia: controllers delegan a services.

2. DTO de salida en servicios:
- Beneficio: desacopla nombres internos de DB respecto al frontend.
- Evidencia: ProductService.productToDTO.

3. Persistencia hibrida en carrito:
- Beneficio: permite experiencia para usuario logueado y anonimo.
- Evidencia: CartContext alterna API/localStorage.

4. Seguridad centralizada:
- Beneficio: evita duplicar validaciones por endpoint.
- Evidencia: protect/authorize en rutas sensibles.

5. URL-sync en filtros:
- Beneficio: enlaces compartibles y navegacion retroceder/avanzar consistente.
- Evidencia: useGameCatalog sincroniza query params.

6. Escalabilidad de consultas:
- Beneficio: performance en listados.
- Evidencia: indices en schema.prisma sobre activo, orden y taxonomias.

---

## 8) Guia rapida de lectura del codigo
Orden recomendado para explicar el sistema en una defensa:
1. Backend bootstrap: Proyecto-Back/server.js.
2. Modelo de datos: Proyecto-Back/prisma/schema.prisma.
3. Ejemplo de modulo completo: productRoutes -> productController -> productService.
4. Frontend shell: prueba-front/src/app/layout.tsx + providers.tsx.
5. Catalogo: productos/page.tsx -> game-catalog.tsx -> use-game-catalog.ts.
6. Estado de compra: CartContext.tsx.
7. Flujo transaccional: orderRoutes.js + orderService.js.

---

## 9) Observaciones para presentacion academica
- El README historico puede mencionar stack anterior en algunos bloques; la fuente canonica de la arquitectura actual es schema.prisma + server.js + servicios activos.
- El proyecto implementa reglas de negocio reales: soft-delete, control de stock, RBAC, paginacion y filtros por taxonomias.
- La relacion frontend-backend esta claramente desacoplada por contratos HTTP y DTOs.

---

## 10) Checklist de cobertura (para validar la hoja)
- [x] Explica cada parte principal del proyecto.
- [x] Indica donde esta (archivo/carpeta).
- [x] Describe como se hace (implementacion y flujo).
- [x] Incluye backend, frontend e integracion.
- [x] Puede usarse como anexo separado del codigo fuente.
