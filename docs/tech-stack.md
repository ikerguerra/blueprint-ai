# Stack Tecnológico: Blueprint AI

Tecnologías seleccionadas para el desarrollo del MVP y su futura escalabilidad.

## Core Stack

| Componente | Tecnología | Razón de Elección |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 14+ (App Router)** | Estándar de la industria, optimización SEO, integración backend/frontend fluida. |
| **Lenguaje** | **TypeScript** | Tipado estático para reducir errores y mejorar mantenibilidad en proyectos complejos. |
| **Estilos** | **Tailwind CSS** | Desarrollo rápido de UI, consistente y altamente personalizable. |
| **Componentes UI** | **shadcn/ui** | Componentes accesibles y personalizables basados en Radix UI. |

## Backend & Datos

| Componente | Tecnología | Razón de Elección |
| :--- | :--- | :--- |
| **Runtime** | **Node.js** | Amplio ecosistema, ideal para I/O intensivo y manejo de JSON. |
| **Base de Datos** | **Supabase (PostgreSQL)** | Racional + Vectorial en uno. Gestión de Auth y Realtime incluida. |
| **Vector Extension** | **pgvector** | Integración nativa de búsqueda vectorial en Postgres (sin ETL complejo a otra DB). |
| **ORM** | **Prisma** o **Drizzle ORM** | Type-safety para consultas a base de datos. |

## Inteligencia Artificial

| Componente | Tecnología | Razón de Elección |
| :--- | :--- | :--- |
| **SDK IA** | **Vercel AI SDK** / **LangChain.js** | Abstracción para conectar LLMs y gestionar flujos de chat/streaming fácilmente. |
| **Modelo LLM** | **OpenAI GPT-4o-mini** | Mejor relación calidad/precio/latencia actual. |
| **Embeddings** | **OpenAI text-embedding-3-small** | Eficiente y con buena dimensionalidad para búsqueda semántica. |

## Infraestructura & Herramientas

| Componente | Tecnología | Razón de Elección |
| :--- | :--- | :--- |
| **Hosting** | **Vercel** | Despliegue optimizado para Next.js, Edge Functions. |
| **Auth** | **Supabase Auth** / **Clerk** | Manejo seguro de sesiones, usuarios y soporte multi-tenant. |
| **Control de Versiones** | **Git / GitHub** | Estándar para colaboración y CI/CD. |
| **CI/CD** | **GitHub Actions** | Automatización de tests y despliegues. |
