# Planificación SCRUM: Blueprint AI

Este documento traduce la hoja de ruta del proyecto en artefactos SCRUM (Epics e Historias de Usuario) listos para ser importados o creados manualmente en JIRA (o herramientas similares como Linear/Trello).

## Estructura del Backlog

El backlog se divide en 4 grandes **Epics** que corresponden a los hitos del proyecto.

---

## Epic 1: Core Architecture & Data Isolation (Arquitectura y Datos)
**Descripción:** Establecer la infraestructura base, la base de datos y garantizar el aislamiento multi-tenant.

| ID | Tipo | Título | Historia de Usuario / Descripción | Criterios de Aceptación | Puntos (Est.) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **BR-1** | Story | Configuración Inicial del Repositorio | Como desarrollador, quiero tener el entorno configurado con linters y estructura de carpetas para empezar a codificar con buenas prácticas. | - Repo creado en GitHub.<br>- ESLint, Prettier y Husky configurados.<br>- Estructura de carpetas Next.js definida. | 1 |
| **BR-2** | Story | Configuración de BD y Soporte Vectorial | Como arquitecto, quiero tener una instancia de PostgreSQL con `pgvector` lista para almacenar datos vectorial. | - Instancia Supabase activa.<br>- Extensión `pgvector` habilitada.<br>- Conexión exitosa desde el proyecto local. | 2 |
| **BR-3** | Story | Esquema de Base de Datos Multi-tenant | Como administrador, quiero un esquema de base de datos que obligue a tener un `tenant_id` para aislar los datos. | - Tablas `users`, `documents`, `embeddings` creadas.<br>- Columna `tenant_id` presente y Not Null.<br>- Claves foráneas configuradas correctamente. | 3 |
| **BR-4** | Story | Implementación de RLS (Row Level Security) | Como responsable de seguridad, quiero que la base de datos impida consultas cruzadas entre tenants a nivel de motor. | - Políticas RLS activadas en todas las tablas sensibles.<br>- Pruebas SQL demuestran que Tenant A no ve datos de Tenant B. | 5 |
| **BR-5** | Story | Pipeline de Ingesta y Chunking | Como usuario, quiero subir un PDF y que el sistema lo divida en fragmentos lógicos para su procesamiento. | - API endpoint para upload.<br>- Función de particionado (chunking) preservando contexto.<br>- Texto extraído correctamente de PDF de prueba. | 8 |
| **BR-6** | Story | Generación y Almacenado de Embeddings | Como sistema, quiero convertir texto a vectores y guardarlos vinculados al tenant. | - Integración con OpenAI Embeddings API.<br>- Vectores guardados en columna `vector` de Postgres.<br>- `tenant_id` asociado correctamente al vector. | 5 |

---

## Epic 2: RAG Engine & AI Integration (Motor IA)
**Descripción:** Desarrollo de la lógica de recuperación de información y generación de respuestas.

| ID | Tipo | Título | Historia de Usuario / Descripción | Criterios de Aceptación | Puntos (Est.) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **BR-7** | Story | Búsqueda Semántica Vectorial | Como sistema, quiero encontrar los documentos más relevantes para una pregunta dada. | - Función de búsqueda por similaridad (coseno).<br>- Filtro estricto `where tenant_id = X`.<br>- Retorna los top-k chunks más relevantes. | 5 |
| **BR-8** | Story | Orquestación de Prompts (Prompt Engineering) | Como sistema, quiero construir un prompt que incluya el contexto recuperado para evitar alucinaciones. | - Template de prompt definido.<br>- Inyección dinámica de contexto recuperado.<br>- Instrucciones de sistema para limitar respuestas al contexto. | 3 |
| **BR-9** | Story | Integración LLM y Streaming | Como usuario, quiero ver la respuesta generándose en tiempo real para percibir rapidez. | - Conexión con OpenAI GPT-4o.<br>- Implementación de `Vercel AI SDK` o Streams manuales.<br>- El texto aparece carácter a carácter en el frontend. | 5 |
| **BR-10** | Story | API de Chat Backend | Como frontend, quiero un endpoint unificado para enviar mensajes y recibir streams. | - Endpoint `POST /api/chat` funcional.<br>- Valida autenticación y tenant antes de procesar.<br>- Maneja errores de API externa. | 3 |

---

## Epic 3: UX & Interface (Interfaz de Usuario)
**Descripción:** Construcción de la aplicación web visible para el usuario final.

| ID | Tipo | Título | Historia de Usuario / Descripción | Criterios de Aceptación | Puntos (Est.) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **BR-11** | Story | Sistema de Autenticación (Done ✅) | Como usuario, quiero registrarme e iniciar sesión para acceder a mis documentos privados. | - Login/Register con Supabase Auth.<br>- Asignación de usuario a un Tenant al registrarse.<br>- Protección de rutas privadas. | 5 |
| **BR-12** | Story | Dashboard de Documentos (Done ✅) | Como usuario, quiero ver una lista de mis documentos y su estado de procesamiento. | - Tabla de documentos subidos.<br>- Indicadores de estado (Procesando, Listo, Error).<br>- Botón para subir nuevos documentos. | 3 |
| **BR-13** | Story | Interfaz de Chat (Done ✅) | Como usuario, quiero una interfaz tipo chat para interactuar con mis documentos. | - Input de texto y lista de mensajes.<br>- Diferenciación visual Usuario vs IA.<br>- Scroll automático al nuevo mensaje. | 5 |
| **BR-15** | Story | Renderizado de Markdown y Modelos (Done ✅) | Como usuario técnico, quiero ver el código formateado y poder cambiar de modelo si hay errores. | - Soporte blocks de código.<br>- Renderizado Markdown.<br>- Selector de modelos y manejo de errores 429. | 3 |
| **BR-18** | Story | Gestión de Documentos (Listar/Eliminar) (Done ✅) | Como usuario, quiero poder borrar documentos antiguos para limpiar mi base de conocimiento. | - Lista paginada de documentos.<br>- Acción de eliminación que borra archivo y vectores.<br>- Confirmación antes de borrar. | 3 |

---

## Epic 4: DevOps & Scalability (Despliegue)
**Descripción:** Preparación para producción y operaciones.

| ID | Tipo | Título | Historia de Usuario / Descripción | Criterios de Aceptación | Puntos (Est.) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **BR-16** | Story | Pipeline CI/CD | Como equipo, quiero que el código se despliegue automáticamente al hacer push a main. | - GitHub Actions configurado para lint/build.<br>- Despliegue automático a Vercel (Preview y Prod). | 3 |
| **BR-17** | Story | Monitorización de Tokens | Como administrador del SaaS, quiero saber o limitar cuántos tokens consume cada tenant. | - Registro de uso de tokens por request.<br>- Dashboard básico o log estructurado con costes. | 5 |
| **BR-19** | Story | Tests End-to-End Críticos | Como desarrollador, quiero asegurar que el flujo principal (Login -> Chat) no se rompa. | - Test E2E (Playwright/Cypress) para flujo de crítica.<br>- Se ejecuta en CI. | 5 |

---

## Instrucciones para JIRA

1. **Crear Proyecto:** Tipo "Scrum" o "Kanban".
2. **Crear Epics:** Copiar los 4 títulos de Epics.
3. **Importar Stories:**
    - Puedes importar este contenido vía CSV si tu JIRA lo permite.
    - O crear manualmente asegurando vincular cada Story a su Epic correspondiente.
4. **Sprints Sugeridos:**
    - **Sprint 1:** Epic 1 (BR-1 a BR-6)
    - **Sprint 2:** Epic 2 (BR-7 a BR-10)
    - **Sprint 3:** Epic 3 (BR-11 a BR-15)
    - **Sprint 4:** Epic 4 (BR-16 a BR-18)

---

## Backlog / Futuras Mejoras
**Descripción:** Historias de usuario pospuestas para versiones futuras.

| ID | Tipo | Título | Historia de Usuario / Descripción | Criterios de Aceptación | Puntos (Est.) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **BR-14** | Story | Citado de Fuentes en UI | Como usuario, quiero saber qué documento se usó para generar la respuesta. | - La respuesta de la IA incluye metadatos de fuente.<br>- UI muestra "Fuente: [Nombre Doc]" al final o en tooltip. | 5 |
