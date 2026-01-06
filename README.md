# AnimalX Gym Manager – Backend

## 🏗️ Arquitectura y Diseño

- **Backend:** Java 17, Spring Boot 3
    - Sólido enfoque en principios SOLID, Clean Architecture (Robert C. Martin), patrones de diseño (inyección dependencias, DTOs, adaptadores), y uso funcional donde es apropiado.
    - Capas claras: **Domain**, **Application**, **Adapters** (Web), **Infrastructure** (JPA/SQLite).
    - Persistencia con **SQLite** usando JPA/Hibernate (archivo `animalxgym.db`).
    - Gestión de dependencias vía Maven (`pom.xml`).
    - Pruebas unitarias: JUnit 5, MockMvc, Mockito.
    - Documentación de endpoints y estructura en este archivo.
    
## 🖥️ Cómo ejecutar el backend

1. Requisitos: Java 17+, Maven instalado.
2. En terminal, desde la raíz del repo:
   ```bash
   mvn spring-boot:run
   ```
   El backend estará disponible en: [http://localhost:8080](http://localhost:8080)
   
3. El archivo de configuración principal está en `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:sqlite:animalxgym.db
   spring.datasource.driver-class-name=org.sqlite.JDBC
   spring.jpa.database-platform=org.hibernate.community.dialect.SQLiteDialect
   spring.jpa.show-sql=true
   spring.jpa.hibernate.ddl-auto=update
   ```


## 📦 API Endpoints principales

- **GET /members**
    - Retorna todos los usuarios registrados en la base de datos (JSON).

- **POST /members/upload**
    - Permite la carga masiva de usuarios desde un archivo Excel (`.xlsx`), con formato:
      | Id | Nombre | Correo | Teléfono | Género | Edad | Fecha de nacimiento | DNI | Estado de cuota | Dia a pagar la cuota | Tipo de pago | Cuota |
      |----|--------|--------|----------|--------|------|---------------------|-----|-----------------|---------------------|--------------|-------|
    - El campo `file` debe ser del tipo form-data (archivo) al enviar desde Postman o el frontend.
    - El backend actualizará usuarios existentes por Id o creará nuevos según corresponda. El resultado indica filas creadas, actualizadas y errores.

- **DELETE /members/clear** (**ENDPOINT TEMPORAL**)
    - Elimina todos los usuarios de la base de datos. Útil para pruebas y recargas de Excel. Usar solo en desarrollo/test.
    - No recibe parámetros ni body. Responde con HTTP 204.


## 🗃️ Dependencias destacadas del backend (pom.xml)
- Spring Boot Starter Web, Data JPA
- SQLite JDBC
- Hibernate Community Dialects (dialecto SQLite)
- Apache POI (procesamiento de Excel)
- Spring Boot Starter Test, JUnit, Mockito

## 💾 Modelo de datos principal (`GymMember`)
```java
class GymMember {
    private Long id;
    private String nombre;
    private String correo;
    private Long telefono;
    private String genero;
    private Integer edad;
    private String fechaNacimiento;
    private Long dni;
    private String estadoCuota;
    private String diaPagarCuota;
    private String tipoPago;
    private String cuota;
    // getters/setters
}
```

## 📝 Flujo de Carga de Usuarios

1. El usuario accede al frontend o usa Postman para cargar el Excel.
2. El backend procesa cada fila:
    - Si existe un Id, actualiza el usuario (toda la info); si no, lo crea.
    - Responde con resultado y errores encontrados.
3. Consulta de usuarios con GET.

## ☑️ Pruebas automatizadas
- Unitarias para los servicios core y controladores (ver `/src/test/java/...`).

## 🧩 Notas de arquitectura
- Clean Architecture: separación clara de dominio, servicio de aplicación, acceso a BBDD y adaptadores (controllers REST).
- Código idiomático y comentado para fácil extensión.
- Preparado para despliegue cloud o embebido.

## 🚀 Despliegue
Puede ser desplegado en cualquier hosting que soporte Java/Spring Boot. Para bases de datos persistentes, puedes migrar fácilmente de SQLite a PostgreSQL solo cambiando el driver y la URL en el properties.

## 🗂️ Información adicional/importante
- La base de datos (`animalxgym.db`) está persistida en disco local.
- El mismo endpoint de carga puede usarse varias veces: actualiza por Id o inserta nuevos automáticamente.
- El endpoint temporal `/members/clear` te ayuda a dejar la BD limpia para nuevas importaciones en pruebas.

¡Para cualquier duda de integración, consulta o extensión, revisa los tests o contacta al desarrollador! 
