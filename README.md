# AnimalX Gym Manager

Esta aplicación es una herramienta de gestión para el gimnasio AnimalX, diseñada para facilitar la administración de miembros, el seguimiento de pagos y el envío de comunicaciones personalizadas. La arquitectura es un sistema cliente-servidor con un frontend en **React** y un backend en **Java 17 con Spring Boot**.

## ✨ Arquitectura y Visión Estratégica

El sistema está diseñado siguiendo los principios de **Clean Architecture** para asegurar un bajo acoplamiento, alta cohesión y máxima testabilidad.

- **Frontend (React)**: Una Single Page Application (SPA) responsable de la interfaz de usuario. Es liviana y se comunica con el backend a través de una API REST.
- **Backend (Java/Spring Boot)**: Proporciona la API REST para la lógica de negocio y la persistencia de datos.
  - **Capas**: Domain, Application, Adapters, Infrastructure.
  - **Persistencia**: Utiliza **SQLite**, una base de datos embebida en un archivo (`animalx-gym.db`), lo que simplifica enormemente la configuración y el despliegue.
  - **Principios**: Se aplican los principios SOLID, patrones de diseño y un enfoque funcional donde es apropiado para un código limpio y mantenible.

## 🚀 Stack Tecnológico

- **Backend**:
  - Java 17
  - Spring Boot 3
  - Spring Data JPA
  - Maven
  - SQLite
- **Frontend**:
  - React 19 (cargado vía CDN)
  - TypeScript
  - Tailwind CSS

---

## 💻 Cómo Ejecutar el Proyecto Completo

Para ejecutar la aplicación, necesitas tener ambos, el backend y el frontend, corriendo simultáneamente.

### 1. Requisitos Previos

- **JDK 17** (o superior) para el backend.
- **Maven** para gestionar las dependencias y construir el backend.
- Un navegador web moderno para el frontend.
- Un editor de código como Visual Studio Code o IntelliJ IDEA.

### 2. Ejecutar el Backend (Java)

1.  Abre una terminal en la raíz del proyecto.
2.  Navega a la carpeta que contiene el archivo `pom.xml`.
3.  Ejecuta el siguiente comando para iniciar el servidor de Spring Boot:
    ```bash
    ./mvnw spring-boot:run
    ```
    (Si estás en Windows, usa `mvnw.cmd spring-boot:run`)

El backend estará corriendo en `http://localhost:8080`. La base de datos `animalx-gym.db` se creará automáticamente.

### 3. Ejecutar el Frontend (React)

1.  No se necesita `npm install` ya que las dependencias se cargan vía CDN.
2.  Abre el archivo `index.html` en tu navegador. Puedes usar una extensión como **Live Server** en VS Code para una mejor experiencia de desarrollo.

¡Listo! La aplicación se conectará automáticamente al backend y podrás empezar a gestionar los miembros del gimnasio.

---

## 📦 API Endpoints

Todos los endpoints están bajo el prefijo `/api/v1`.

- `GET /members`: Retorna una lista de todos los miembros.
- `POST /members/sync`: Sincroniza (crea o actualiza) una lista de miembros enviados en el cuerpo de la solicitud.
