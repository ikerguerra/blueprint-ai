# Blueprint AI 🚀

**Blueprint AI** es una plataforma SaaS moderna de gestión documental inteligente que permite a los usuarios "chatear" con sus documentos. Utiliza Inteligencia Artificial Generativa (RAG) para proporcionar respuestas precisas basadas en el contenido de archivos PDF y TXT subidos por el usuario.

## ✨ Características Principales

*   **💬 Chat con tus Documentos (RAG):** Sube archivos PDF o TXT y obtén respuestas instantáneas basadas en su contenido.
*   **🧠 IA Avanzada (Gemini 2.5):** Impulsado por los modelos más recientes de Google (Gemini 2.5 Flash Lite) para una comprensión profunda y respuestas rápidas.
*   **🔒 Autenticación Segura:** Sistema de login y registro gestionado por Supabase Auth.
*   **📂 Gestión de Archivos:** Subida, indexación y almacenamiento seguro de documentos.
*   **⚡ Rendimiento y Escalabilidad:** Construido sobre Next.js 15 y desplegado en Vercel.

## 🛠️ Stack Tecnológico

Este proyecto utiliza las tecnologías más modernas del ecosistema React/Next.js:

*   **Frontend & Framework:** [Next.js 15](https://nextjs.org/) (App Router, Server Actions)
*   **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
*   **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/)
*   **Base de Datos:** [Supabase](https://supabase.com/) (PostgreSQL + pgvector)
*   **ORM:** [Prisma](https://www.prisma.io/)
*   **IA & Embeddings:**
    *   [Google Gemini API](https://ai.google.dev/) (Generación de texto y embeddings)
    *   [LangChain](https://js.langchain.com/) (Procesamiento de texto y RAG)
    *   [AI SDK](https://sdk.vercel.ai/docs) (Integración de chat en React)

## 🚀 Instalación y Configuración Local

Sigue estos pasos para ejecutar el proyecto en tu máquina local:

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/tu-usuario/blueprint-ai.git
    cd blueprint-ai
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar Variables de Entorno:**
    Crea un archivo `.env` en la raíz del proyecto y añade las siguientes claves (necesitarás cuentas en Supabase y Google AI Studio):

    ```env
    # Base de Datos (Supabase)
    DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
    DIRECT_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].supabase.co:5432/postgres"

    # Autenticación (Supabase)
    NEXT_PUBLIC_SUPABASE_URL="https://[ref].supabase.co"
    NEXT_PUBLIC_SUPABASE_ANON_KEY="[tu-anon-key]"
    SUPABASE_SERVICE_ROLE_KEY="[tu-service-role-key]"

    # Inteligencia Artificial (Google)
    GOOGLE_GENERATIVE_AI_API_KEY="[tu-api-key]"
    ```

4.  **Inicializar la Base de Datos:**
    ```bash
    npx prisma generate
    npx prisma db push
    ```

5.  **Ejecutar el servidor de desarrollo:**
    ```bash
    npm run dev
    ```
    Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📦 Despliegue

El proyecto está optimizado para desplegarse en **Vercel**:

1.  Sube tu código a GitHub.
2.  Importa el proyecto en Vercel.
3.  Configura las variables de entorno en el panel de Vercel.
4.  ¡Despliega!

## 🧪 Tests

El proyecto incluye tests End-to-End (E2E) con **Playwright**:

```bash
npm run test
```

---
Diseñado y desarrollado con ❤️ por Iker Guerra.
