# TechnoBorrow

TechnoBorrow is a peer-to-peer equipment borrowing platform that allows students to request, lend, and manage borrowing transactions within a campus environment.

---

## 📌 Project Overview

This project follows a **monorepo structure** containing:

* 🌐 Frontend (React)
* ⚙️ Backend (Spring Boot)
* 📱 Mobile (Android App)

---

## 🚀 Tech Stack

### Frontend

* React
* TypeScript
* Tailwind CSS

### Backend

* Java 17
* Spring Boot
* Spring Security

### Android App

* Kotlin
* XML Layouts & Material Components
* MVP Architecture
* Gradle (Kotlin DSL)

### Database

* Supabase / PostgreSQL

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/sorasai/TechnoBorrow-frontend.git
cd TechnoBorrow-frontend
```

---

## ▶️ Run Frontend

```bash
cd frontend
npm install
npm start
```

---

## ▶️ Run Backend

```bash
cd backend/testapi
./mvnw spring-boot:run
```

Backend runs on:

```
http://localhost:8080
```

---

## ▶️ Run Android App

1. Open the `AndroidApp` directory in **Android Studio**.
2. Wait for the Gradle sync to complete.
3. Run the application on an **Emulator** or a **Physical Device**.

Alternatively, you can build the APK using Gradle:

```bash
cd AndroidApp
./gradlew assembleDebug
```

---

## 🔗 API Integration

The frontend communicates with the backend via REST APIs.

Example endpoints:

* POST /auth/login
* POST /requests
* GET /requests

---

## 🎯 Features

* User authentication
* Borrowing request posting
* Dashboard with request feed
* Peer-to-peer lending system
* Transaction tracking

---

## 🧠 Architecture

This project follows a multi-platform architecture consisting of:

* **Presentation Layer**: 
  * 🌐 Web Frontend (React & Tailwind CSS)
  * 📱 Mobile App (Native Android in Kotlin using MVP)
* **Application Layer**: ⚙️ Spring Boot REST APIs
* **Data Layer**: 💾 PostgreSQL / Supabase

---

## 👨‍💻 Author

**Zyrrah Kaye Lacida**

---

## 📄 License

This project is for academic purposes.
