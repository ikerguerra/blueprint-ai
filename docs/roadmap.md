# Hoja de Ruta del Proyecto: Blueprint AI

Este documento detalla el plan de implementación para el desarrollo del MVP de **Blueprint AI**, un SaaS inteligente multi-tenant para la gestión de documentación técnica.

## Visión General
El objetivo es construir un sistema robusto, seguro y escalable que permita a múltiples organizaciones ("tenants") subir, gestionar y consultar sus documentos técnicos mediante una interfaz de chat impulsada por IA (RAG).

---

## Hito 1: Arquitectura y Capa de Datos (Semana 1)
**Objetivo:** Establecer la base del sistema y garantizar el aislamiento de datos entre clientes.

- [x] **Configuración del Proyecto Base**
    - [x] Inicializar repositorio Git y estructura del proyecto (Monorepo o separación Frontend/Backend).
    - [x] Configurar entorno de desarrollo (Linters, Prettier, Husky).

- [x] **Base de Datos y Aislamiento Multi-tenant**
    - [x] Configurar PostgreSQL con la extensión `pgvector` (Supabase o instancia propia).
    - [x] Diseñar esquema de base de datos incluyendo `tenant_id` en todas las tablas relevantes (Documentos, Embeddings, Usuarios).
    - [x] Implementar Row Level Security (RLS) o lógica de aplicación para asegurar el aislamiento estricto de datos.

- [x] **Pipeline de Ingesta de Documentos**
    - [x] Implementar subida de archivos (PDF, Markdown).
    - [x] Desarrollar servicio de "Chunking" (fragmentación de texto) inteligente (respetando parrafos y encabezados).
    - [x] Integrar modelo de Embeddings (OpenAI `text-embedding-3-small` o similar) para generar vectores.
    - [x] Guardar vectores en la base de datos vinculados al `tenant_id`.

- [x] **Validación de Seguridad**
    - [x] Test de penetración básico: Intentar acceder a datos del Tenant A con credenciales del Tenant B.

---

## Hito 2: Motor RAG e Integración (Semana 2)
**Objetivo:** Implementar la lógica de inteligencia artificial y la interacción con el usuario.

- [x] **Lógica RAG (Retrieval-Augmented Generation)**
    - [x] Implementar búsqueda semántica vectorial (recuperar chunks relevantes según query del usuario).
    - [x] Optimizar prompts del sistema para incluir contexto recuperado y directrices de respuesta.

- [x] **Integración con LLM**
    - [x] Conectar con API de LLM (OpenAI GPT-4o-mini o similar).
    - [x] Implementar streaming de respuestas para mejorar la latencia percibida (Server-Sent Events / Vercel AI SDK).

- [x] **API Backend**
    - [x] Crear endpoints para chat (`POST /api/chat`).
    - [x] Crear endpoints para gestión de documentos (`GET /api/documents`, `POST /api/documents`).

---

## Hito 3: UX y Robustez (Semana 3)
**Objetivo:** Crear una interfaz de usuario pulida y profesional.

- [x] **Desarrollo del Frontend (Next.js + Tailwind CSS)**
    - [ ] Implementar sistema de autenticación (Login/Register) con soporte multi-tenant.
    - [x] Crear Dashboard principal (lista de documentos, estado de ingestión).
    - [x] Desarrollar interfaz de Chat interactiva.
        - [x] Visualización de mensajes user/AI.
        - [x] Indicadores de "Escribiendo..." y estado de carga.
        - [x] Renderizado de Markdown en respuestas (código, tablas).
        - [x] Selector de Modelos (Gemini 2.0/1.5/Pro).

- [ ] **Citado de Fuentes**
    - [ ] Modificar respuesta del LLM/RAG para incluir referencias a los documentos fuente.
    - [ ] Implementar UI para mostrar "Fuente: Manual de Usuario v1, pág 42" al pasar el mouse o clicar.

- [x] **Gestión de Errores y Feedback**
    - [x] Manejo elegante de errores (API timeout, documentos no procesables, cuotas).
    - [x] Notificaciones/Banners para errores de cuota API.

---

## Hito 4: Despliegue y Observabilidad (Semana 4)
**Objetivo:** Llevar el proyecto a producción y preparar para escalar.

- [ ] **CI/CD (Integración y Despliegue Continuo)**
    - [ ] Configurar GitHub Actions para tests automáticos (si los hay) y linting.
    - [ ] Configurar despliegue automático en Vercel (Frontend) y servicio de Backend (si es separado, o Serverless Functions).

- [ ] **Observabilidad y Monitorización**
    - [ ] Implementar logging centralizado.
    - [ ] Monitorización de uso de Tokens (Costos por Tenant).
    - [ ] Panel de administración simple para ver estadísticas de uso (opcional pero recomendado).

- [ ] **Documentación Final y Demo**
    - [ ] Crear `README.md` detallado con instrucciones de despliegue local.
    - [ ] Grabar video demo del flujo completo.
