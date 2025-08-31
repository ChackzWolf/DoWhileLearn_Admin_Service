# DoWhileLearn - Admin Service

The **Admin Service** is one of the service in the DoWhileLearn e-learning platform.  
It handles **admin-related operations** such as authentication, user-management, monitoring sales and reviews, and event-driven communication via **Kafka** and **gRPC**.

---

## 📌 Features
- Admin Authentication (JWT, sessions)
- CRUD operations for Admin entities
- Kafka consumers & producers
- gRPC server for inter-service communication
- Repository pattern with MongoDB
- Config-driven architecture (ENV, Kafka, DB)

---

## 🏗️ Tech Stack
- **Node.js** + **Express**
- **TypeScript**
- **MongoDB**
- **gRPC**
- **Kafka (kafkajs)**
- Repository pattern + DI

---

## 📂 Project Structure


src/
├── configs/ # App, DB, Kafka, ENV configs
├── controllers/ # Kafka controllers, gRPC handlers
├── repository/ # Data access layer
├── services/ # Business logic
├── utils/ # Helper utilities (mail, OTP, etc.)
├── app.ts # Express app initialization
└── index.ts # Entry point



---

## Installation & Setup

### 1. Clone the repository
```bash
git https://github.com/ChackzWolf/DoWhileLearn_Admin_Service.git
cd DoWhileLearn_Admin_Service


### 2. Install dependencies
npm install

### 3. Setup environment variables
PORT=5001
MONGO_URI=mongodb://localhost:27017/admin-service
DWL_EMAIL=your_email@gmail.com
DWL_PASSWORD=your_app_password
KAFKA_BROKER=localhost:9092

### 4. Run the service
npm run dev

### For production
npm run build
npm run start


### Kafka Topics

admin.update → Handles admin updates after order success

admin-service.rollback → Handles rollback events on transaction failure





### Scripts

npm run dev       # Start in watch mode (ts-node-dev)
npm run build     # Compile TypeScript to dist/
npm run start     # Start production build
npm run lint      # Run ESLint