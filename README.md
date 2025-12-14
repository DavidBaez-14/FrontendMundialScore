# 🎮 MUNDIAL SCORE

Sistema de apuestas de marcadores para el Mundial 2026

## 🚀 Inicio Rápido

### Backend (Spring Boot)
```bash
cd MundialScore
./mvnw spring-boot:run
```
El backend estará corriendo en `http://localhost:8080`

### Frontend (React + Vite)
```bash
cd MundialFrontend
npm install
npm run dev
```
El frontend estará corriendo en `http://localhost:5173`

## 👥 Usuarios Precargados

### Administradores (ROLE_ADMIN)
- **Email:** carlos.angarita@mundial.com  
  **Contraseña:** admin123

- **Email:** admin@mundial.com  
  **Contraseña:** admin123

### Usuarios de Prueba (ROLE_USER)
- **Email:** juan.perez@mundial.com  
  **Contraseña:** user123

- **Email:** maria.garcia@mundial.com  
  **Contraseña:** user123

## 🔐 Funcionalidades de Autenticación

### Login
- Autenticación con email y contraseña
- Validación de credenciales
- Redirección según rol de usuario
- Manejo de errores visualizado

### Registro
- Solo para usuarios apostadores (ROLE_USER)
- Validación de contraseñas
- Verificación de email único
- Login automático después del registro

### Protección de Rutas
- Rutas públicas: `/login`, `/register`
- Rutas protegidas: `/dashboard`
- Redirección automática según autenticación
- Dashboard diferenciado por rol

## 📊 Dashboards

### Admin Dashboard
Funcionalidades para administradores:
- ⚽ Gestionar partidos
- 👥 Ver usuarios registrados
- 🎯 Ver todos los pronósticos
- 🏆 Ver ranking general


### User Dashboard
Funcionalidades para apostadores:
- ⚽ Ver partidos disponibles
- 🎯 Hacer pronósticos
- 📈 Ver mis pronósticos
- 🏆 Ver ranking
- 📋 Reglas de puntuación

## 🎯 Sistema de Puntuación

- **5 puntos:** Resultado exacto (ejemplo: 2-1)
- **3 puntos:** Aciertas ganador o empate
- **1 punto:** Aciertas goles de algún equipo
- **0 puntos:** Cualquier otro caso

## 🛠️ Tecnologías Utilizadas

### Backend
- Java 17+
- Spring Boot 3
- Spring Security (Basic Auth)
- JPA/Hibernate
- Postgresql Database
- Maven

### Frontend
- React 19
- Vite
- React Router DOM
- Axios
- CSS3

## 📁 Estructura del Proyecto

```
MundialWeb/
├── MundialScore/          # Backend Spring Boot
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/example/mundialscore/
│   │   │   │       ├── config/
│   │   │   │       ├── controller/
│   │   │   │       ├── dto/
│   │   │   │       ├── entity/
│   │   │   │       ├── repository/
│   │   │   │       ├── security/
│   │   │   │       └── service/
│   │   │   └── resources/
│   │   └── test/
│   └── pom.xml
│
└── MundialFrontend/       # Frontend React
    ├── src/
    │   ├── components/
    │   │   └── auth/
    │   │       └── ProtectedRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── auth/
    │   │   │   ├── Login.jsx
    │   │   │   ├── Register.jsx
    │   │   │   └── Auth.css
    │   │   └── dashboard/
    │   │       ├── AdminDashboard.jsx
    │   │       ├── UserDashboard.jsx
    │   │       └── Dashboard.css
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── App.css
    │   ├── index.css
    │   └── main.jsx
    └── package.json
```

## 🔧 Configuración de CORS

El backend ya está configurado para aceptar peticiones del frontend en desarrollo.


## 🎮 ¡Comienza a Apostar!

1. Inicia el backend
2. Inicia el frontend
3. Accede a `http://localhost:5173`
4. Inicia sesión o regístrate

---

### Desarrollado Por:
- Valerie De los Ángeles Sierra Pabón
- Raúl David Báez Suárez

