# Bugfix Requirements Document

## Introduction

Los datos de la base de datos (Productos, Marca, Categoría) nunca se muestran en la interfaz. TanStack Query no reporta ningún error, y la consola tampoco muestra nada visible. Existen tres defectos encadenados que se silencian mutuamente: un TypeError en `EmpresaStore` al acceder a `response.empresa` cuando `response` es `null`, una race condition en `routes.jsx` que impide que la query de empresa se dispare si la sesión de Supabase aún no está lista, y funciones Supabase que retornan `[]` o `null` en lugar de lanzar una excepción cuando ocurre un error, impidiendo que TanStack Query entre en estado `error`.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN `MostrarEmpresa` retorna `null` (usuario sin empresa asignada o sesión aún no lista) THEN `EmpresaStore.mostrarEmpresa` lanza un TypeError silencioso al intentar acceder a `null.empresa`, dejando `dataempresa` como `null` sin ningún mensaje de error visible en la UI

1.2 WHEN `MostrarUsuarios` retorna `null` porque la sesión de Supabase aún no se ha establecido al momento del montaje de `MyRoutes` THEN la query de empresa tiene `enabled: false` (porque `data?.id` es `undefined`), `dataempresa` permanece `null`, y todas las queries hijas (Productos, Marca, Categoría) quedan bloqueadas con `enabled: false` sin que ningún error sea visible

1.3 WHEN ocurre un error de red, autenticación o RLS en `MostrarProductos`, `MostrarMarca`, o `MostrarCategoria` THEN la función captura el error implícitamente al no desestructurar `error` de la respuesta de Supabase y retorna `[]`, evitando que TanStack Query entre en estado `error` y ocultando el problema completamente

1.4 WHEN `ObtenerIdAuthSupabase` es llamada antes de que la sesión de Supabase esté disponible THEN retorna `undefined` en lugar de `null` o de lanzar, causando que `MostrarUsuarios` consulte la tabla `usuarios` con `eq("idauth", undefined)` y retorne `null`

### Expected Behavior (Correct)

#### Requirement 2.1: Manejo seguro de null en EmpresaStore

**User Story:** As a developer, I want EmpresaStore.mostrarEmpresa to handle null responses safely, so that the app does not crash silently when a user has no company assigned.

**Acceptance Criteria:**

1. IF `MostrarEmpresa` retorna `null`, THEN `EmpresaStore.mostrarEmpresa` SHALL ejecutar `set({ dataempresa: null })` sin acceder a ninguna propiedad del valor retornado, de modo que `dataempresa` quede como `null` y no se lance ningún TypeError.

2. IF `MostrarEmpresa` retorna `null` y la función `mostrarEmpresa` del store completa su ejecución, THEN el valor de `dataempresa` en el store SHALL ser `null` (no `undefined`, no el valor previo).

3. IF `MostrarEmpresa` lanza una excepción (error de red o de Supabase), THEN `EmpresaStore.mostrarEmpresa` SHALL re-lanzar esa excepción para que TanStack Query la capture y ponga la query en estado `error`.

---

#### Requirement 2.2: Resolución de race condition entre sesión de Supabase y queries dependientes

**User Story:** As a user, I want the app to wait until my session is ready before loading company data, so that the data chain initializes correctly without silently blocking.

**Acceptance Criteria:**

1. IF `user` obtenido del `AuthContext` es `null` o `undefined` al momento del montaje de `MyRoutes`, THEN el sistema SHALL mantener la query `mostrarUsuarios` en estado `disabled` (sin ejecutarse) hasta que `user` sea un objeto no nulo, de modo que `MostrarUsuarios` nunca sea invocada con una sesión de Supabase aún no establecida.

2. WHEN `user` del `AuthContext` pasa de `null` a un objeto no nulo, THEN el sistema SHALL habilitar y ejecutar la query `mostrarUsuarios` con el `user.id` disponible, de modo que `data?.id` sea un valor válido y la query de empresa tenga `enabled: true` y se ejecute automáticamente.

3. IF `MostrarUsuarios` retorna `null` después de que `user` es no nulo (usuario autenticado sin registro en la tabla `usuarios`), THEN el sistema SHALL mantener `enabled: false` en la query de empresa y mostrar al usuario un mensaje de error indicando que no se encontró un registro de usuario asociado a la sesión activa.

---

#### Requirement 2.3: Funciones CRUD de Supabase deben propagar errores

**User Story:** As a developer, I want Supabase CRUD read functions to throw errors instead of returning empty arrays silently, so that TanStack Query can enter error state and the UI can show meaningful feedback.

**Acceptance Criteria:**

1. IF la respuesta de Supabase en `MostrarProductos`, `MostrarMarca`, o `MostrarCategoria` contiene un objeto `error` distinto de `null`, THEN la función SHALL ejecutar `throw error` de modo que la `queryFn` de TanStack Query rechace la promesa y la query quede en estado `isError: true` con la propiedad `error` disponible.

2. IF la respuesta de Supabase retorna `data: null` con `error: null` (caso de política RLS que bloquea sin error explícito), THEN la función SHALL retornar un array vacío `[]` sin lanzar, de modo que la UI muestre una lista vacía en lugar de un error.

3. WHEN una query de lectura entra en estado `isError: true`, THEN la UI SHALL mostrar el componente de error (o el texto `"Error"` según la página) con el mensaje del error capturado, en lugar de mostrar una lista vacía silenciosa.

---

#### Requirement 2.4: ObtenerIdAuthSupabase debe retornar null explícito cuando no hay sesión

**User Story:** As a developer, I want ObtenerIdAuthSupabase to return null explicitly when there is no active session, so that callers can detect the no-session state and avoid querying the database with undefined values.

**Acceptance Criteria:**

1. IF `supabase.auth.getSession()` retorna `session: null`, THEN `ObtenerIdAuthSupabase` SHALL retornar `null` explícitamente (no `undefined`), de modo que `MostrarUsuarios` pueda detectar la ausencia de sesión antes de ejecutar la query.

2. IF `ObtenerIdAuthSupabase` retorna `null`, THEN `MostrarUsuarios` SHALL retornar `null` inmediatamente sin ejecutar ninguna query contra la tabla `usuarios`, de modo que no se realice ninguna llamada a Supabase con `eq("idauth", null)`.

3. WHEN `ObtenerIdAuthSupabase` retorna un UUID válido (sesión activa), THEN `MostrarUsuarios` SHALL ejecutar la query con ese UUID y retornar el registro encontrado o `null` si no existe, sin cambios respecto al comportamiento actual.

### Unchanged Behavior (Regression Prevention)

3.1 WHEN el usuario tiene una sesión de Supabase válida y tiene empresa asignada THEN el sistema SHALL CONTINUE TO cargar correctamente la cadena `usuario → empresa → productos/marca/categoría` y mostrar los datos en la UI

3.2 WHEN se producen operaciones de escritura (insertar, editar, eliminar) en Productos, Marca o Categoría THEN el sistema SHALL CONTINUE TO mostrar alertas de error de SweetAlert2 para los errores de esas mutaciones y refrescar los datos correctamente tras el éxito

3.3 WHEN el usuario no está autenticado THEN el sistema SHALL CONTINUE TO redirigir a `/login` sin cargar datos de empresa ni de inventario

3.4 WHEN `MostrarEmpresa` retorna un objeto válido con la propiedad `empresa` THEN `EmpresaStore` SHALL CONTINUE TO asignar correctamente `response.empresa` a `dataempresa`

3.5 WHEN `empresaId` es un valor válido (distinto de `undefined` y `null`) THEN todas las queries hijas (Productos, Marca, Categoría) SHALL CONTINUE TO ejecutarse con `enabled: !!empresaId` como condición de activación

---

## Bug Condition Derivation

### Bug Condition Functions

```pascal
// Bug 1 — TypeError en EmpresaStore
FUNCTION isBugCondition_1(response)
  INPUT: response retornado por MostrarEmpresa
  OUTPUT: boolean
  RETURN response = null
END FUNCTION

// Bug 2 — Race condition: sesión no lista al montar routes
FUNCTION isBugCondition_2(session)
  INPUT: session del contexto de Supabase Auth al momento del montaje
  OUTPUT: boolean
  RETURN session = null OR session.user = null
END FUNCTION

// Bug 3 — Funciones Supabase silencian errores
FUNCTION isBugCondition_3(supabaseResult)
  INPUT: resultado de una query Supabase { data, error }
  OUTPUT: boolean
  RETURN supabaseResult.error ≠ null AND supabaseResult.data = null
END FUNCTION
```

### Property Specifications (Fix Checking)

```pascal
// Property: Fix Checking — Bug 1
FOR ALL response WHERE isBugCondition_1(response) DO
  result ← mostrarEmpresa'(response)
  ASSERT dataempresa = null AND no_crash(result)
END FOR

// Property: Fix Checking — Bug 2
FOR ALL session WHERE isBugCondition_2(session) DO
  result ← queryUsuarios'(session)
  ASSERT query_empresa_se_dispara_cuando_session_esta_lista(result)
END FOR

// Property: Fix Checking — Bug 3
FOR ALL supabaseResult WHERE isBugCondition_3(supabaseResult) DO
  result ← MostrarProductos'(supabaseResult)
  ASSERT throws_error(result)
END FOR
```

### Preservation Goal

```pascal
// Property: Preservation Checking — Para los tres bugs
FOR ALL X WHERE NOT isBugCondition_1(X) AND NOT isBugCondition_2(X) AND NOT isBugCondition_3(X) DO
  ASSERT F(X) = F'(X)  // El comportamiento existente no cambia para entradas no defectuosas
END FOR
```
