# DoWhileLearn - Admin Service

The **Admin Service** is one of the microservice in the DoWhileLearn e-learning platform.  
It handles **admin-related operations** such as authentication, user management, monitoring sales and reviews, and event-driven communication via **Kafka** and **gRPC**.

---

## Features
- Admin authentication (JWT, sessions)
- CRUD operations for Admin entities
- Kafka consumers & producers
- gRPC server for inter-service communication
- Repository pattern with MongoDB
- Config-driven architecture (ENV, Kafka, DB)

---

## Tech Stack
- **Node.js** + **Express**
- **TypeScript**
- **MongoDB**
- **gRPC**
- **Kafka (kafkajs)**
- Repository pattern + Dependency Injection

---

## Project Structure
```
src/
├── app.ts # Express app initialization
├── server.ts # HTTP server entry (Express)
│
├── common/ # Shared enums, constants
│ └── enums/
│ └── enums.ts
│
├── configs/ # App, DB, Kafka, ENV configs
│ ├── DB.configs/
│ │ └── MongoDB.ts
│ ├── ENV_configs/
│ │ └── ENV.configs.ts
│ ├── Kafka.configs/
│ │ ├── Kafka.config.ts
│ │ └── kafka-topics.ts
│ └── logger.config.ts
│
├── contracts/ # Shared types & event contracts
│ ├── admin.types.ts
│ └── events.ts
│
├── controllers/ # Kafka consumers & gRPC handlers
│ ├── grpc-controller/
│ │ ├── admin-grpc.controller.ts
│ │ └── interfaces/
│ │ └── IAdmin-grpc.controller.ts
│ └── kafka-controller/
│ ├── admin-kafka.controller.ts
│ └── interfaces/
│ └── IAdmin-kafka.controller.ts
│
├── entities/ # Domain entities
│ └── admin.entity.ts
│
├── grpc/ # gRPC entrypoint
│ └── grpc-server.ts
│
├── kafka/ # Kafka entrypoint
│ └── kafka-server.ts
│
├── interfaces/ # Shared model interfaces
│ └── Models/
│
├── protos/ # gRPC proto files
│ └── admin.proto
│
├── repository/ # Data access layer
│ ├── AdminRepository/
│ │ └── Admin.repository.ts
│ ├── BaseRepository/
│ │ └── Base.repository.ts
│ └── interfaces/
│ └── IRepositroy.interfaces.ts
│
├── schemas/ # Database schemas
│ └── Admin.schema.ts
│
├── services/ # Business logic layer
│ ├── admin-auth.service.ts
│ ├── admin.service.ts
│ ├── Interfaces/
│ │ └── IService.interfaces.ts
│ └── types/
│ ├── admin-auth.service.types.ts
│ └── admin-service.types.ts
│
└── utils/ # Helper utilities (mail, OTP, etc.)
├── generateOTP.ts
└── sendEmail.ts

```
---

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/ChackzWolf/DoWhileLearn_Admin_Service.git
cd DoWhileLearn_Admin_Service
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
Create a **`.env`** file in the root directory:

```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/admin-service
DWL_EMAIL=your_email@gmail.com
DWL_PASSWORD=your_app_password
KAFKA_BROKER=localhost:9092
```

⚠️ Do not commit your `.env` file.

### 4. Run the service
```bash
npm run dev
```

For production:
```bash
npm run build
npm run start
```

---

## 📨 Kafka Topics
- **admin.update** → Handles admin updates after order success
- **admin-service.rollback** → Handles rollback events on transaction failure

---

## 🛠 Scripts
```bash
npm run dev       # Start in watch mode (ts-node-dev)
npm run build     # Compile TypeScript to dist/
npm run start     # Start production build
npm run lint      # Run ESLint
```

---

