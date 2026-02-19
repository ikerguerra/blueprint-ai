# Arquitectura del Sistema: Blueprint AI

Este documento describe la arquitectura técnica de **Blueprint AI**, diseñada para ser una plataforma SaaS multi-tenant escalable y segura.

## Diagrama de Alto Nivel

```mermaid
graph TD
    User[Usuario] -->|HTTPS| CDN[Vercel Edge Network]
    CDN -->|Next.js App| Frontend[Frontend (Next.js)]
    
    subgraph "Capa de Aplicación"
        Frontend -->|API Routes| API[Backend API (Next.js / Node.js)]
        Frontend -->|API Routes| API[Backend API (Next.js / Node.js)]
        API -->|Auth| AuthProvider[Supabase Auth]
        AuthProvider -->|Trigger| UserSync[Sincronización de Usuarios (Public Table)]
    end

    subgraph "Capa de Datos & IA"
        API -->|LangChain| AI_Orchestrator[Orquestador RAG]
        AI_Orchestrator -->|Query| VectorDB[(Supabase pgvector)]
        AI_Orchestrator -->|Context + Prompt| LLM[OpenAI API]
    end

    subgraph "Ingesta de Datos"
        Admin[Admin Tenant] -->|Upload PDF| IngestionService[Servicio de Ingesta]
        IngestionService -->|Chunking| TextSplitter[Fragmentador]
        TextSplitter -->|Embed| EmbeddingModel[OpenAI Embeddings]
        EmbeddingModel -->|Store| VectorDB
    end
```

## Componentes Clave

### 1. Frontend (Cliente)
- **Tecnología:** Next.js (App Router).
- **Estilo:** Tailwind CSS para diseño responsivo y moderno.
- **Interacción:** React Server Components (RSC) para optimización inicial y Client Components para interactividad del chat.
- **Estado:** Gestión de estado global ligera (Zustand o Context API) para la sesión del usuario y chat.

### 2. Backend (API & Lógica)
- **Tecnología:** Next.js API Routes (Serverless Functions) o Node.js Express (si se requiere websocket persistente avanzado, aunque SSE es suficiente).
- **Orquestación IA:** **LangChain.js** o **Vercel AI SDK**. Se encarga de construir los prompts, gestionar la memoria de la conversación y conectar con los modelos.
- **Streaming:** Uso de `AIStream` de Vercel AI SDK para enviar chunks de texto al frontend en tiempo real.

### 3. Capa de Datos (Multi-tenancy)
- **Base de Datos:** **Supabase** (PostgreSQL).
- **Vector Search:** `pgvector` para almacenar y buscar embeddings de documentos.
- **Aislamiento:**
    - Columna `tenant_id` obligatoria en tablas `documents`, `embeddings`, `users`.
    - **Row Level Security (RLS)** activado en PostgreSQL para prevenir fugas de datos a nivel de motor de base de datos.

### 4. Inteligencia Artificial (RAG)
- **Embeddings:** `text-embedding-3-small` (OpenAI) por su balance costo/rendimiento.
- **LLM:** `gpt-4o-mini` (OpenAI) para respuestas rápidas y económicas, o `claude-3-haiku` (Anthropic).
- **Chunking:** Estratégia de fragmentación semántica (preservando cabeceras y contexto) para mejorar la calidad de la recuperación.

## Flujo de Datos (RAG)

1. **Consulta:** El usuario envía una pregunta.
2. **Embedding:** La pregunta se convierte en un vector usando el mismo modelo que los documentos.
3. **Búsqueda Híbrida/Vectorial:** Se buscan los `k` fragmentos más similares en la BD, filtrando estrictamente por `tenant_id`.
4. **Contextualización:** Se construye un prompt: "Usa el siguiente contexto: [Fragmentos] para responder a: [Pregunta]".
5. **Generación:** El LLM genera la respuesta (citado de fuentes planificado para futuro).
