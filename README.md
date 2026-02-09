# Sistema de Mensajería Automatizada ESFOT (Frontend) 

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![n8n](https://img.shields.io/badge/n8n-FF6D5B?style=for-the-badge&logo=n8n&logoColor=white)

Este repositorio contiene el frontend desarrollado para el **Sistema Web de Mensajería Automatizada basada en IA y n8n** para la Escuela de Formación de Tecnólogos (ESFOT) de la Escuela Politécnica Nacional.

El objetivo principal es optimizar la comunicación institucional, permitiendo a los estudiantes acceder a información en tiempo real, resolver dudas mediante un Chatbot con IA y gestionar trámites de prácticas pre-profesionales.

## Características del Sistema

Basado en la estructura de páginas del proyecto, el sistema ofrece:
- **Chatbot con IA:** Interfaz dedicada para consultas académicas y extracurriculares (`IA.jsx`).
- **Dashboard de Mensajería:** Gestión y visualización de flujos de mensajes tipo WhatsApp (`Dashboard_whatsapp.jsx`).
- **Gestión de Formularios:** Seguimiento de procesos de prácticas y servicio comunitario (`FormulariosEstudiante.jsx`).
- **Módulo de Feedback:** Sistema de quejas y sugerencias para la mejora continua (`QuejasSugerenias.jsx`).
- **Administración de Respuestas:** Panel para gestionar las bases de conocimiento del bot (`ManagerResponses.jsx` y `AddSingleQnA.jsx`).
- **Autenticación y Perfiles:** Gestión de usuarios con roles (Administrador, Pasante, Estudiante).

## Tecnologías y Herramientas

- **Framework:** [React.js](https://reactjs.org/) con [Vite](https://vitejs.dev/) para un desarrollo rápido y optimizado.
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/) para un diseño responsivo y moderno.
- **Gestión de Estado:** React Context API (`context/storeAuth.jsx`, `context/storeProfile.jsx`).
- **Enrutamiento:** React Router DOM para la navegación entre páginas y protección de rutas.
- **Iconografía:** Integración de recursos personalizados en formato PNG y SVG.

## Estructura del Proyecto

```text
src/
 ├── assets/             # Recursos visuales (Logos, iconos de redes sociales, etc.)
 ├── components/         # Componentes modulares
 │    ├── Sidebar/       # Navegación lateral
 │    ├── list/          # Componentes de listado
 │    ├── principal/     # Secciones de la página de inicio
 │    └── profile/       # Componentes del perfil de usuario
 ├── context/            # Manejo de estados globales (Auth y Perfil)
 ├── hooks/              # Lógica de React personalizada
 ├── layout/             # Plantillas de diseño de página
 ├── pages/              # Vistas principales del sistema
 ├── routes/             # Configuración y protección de rutas
 ├── App.jsx             # Punto de entrada de la aplicación
 └── main.jsx            # Renderizado inicial
