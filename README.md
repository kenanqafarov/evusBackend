# 🍽️ Loyalty API

A RESTful loyalty program backend built with **Express.js**, **Mongoose**, and **JWT authentication**. Users can join restaurant-specific loyalty programs by scanning a QR code or entering a unique register link.

---

## 📁 Project Structure

```
loyalty-api/
├── src/
│   ├── app.js                  # Entry point
│   ├── config/
│   │   └── database.js         # MongoDB connection
│   ├── models/
│   │   ├── User.js             # User schema
│   │   ├── Restaurant.js       # Restaurant schema
│   │   └── Loyalty.js          # Junction schema
│   ├── services/
│   │   ├── authService.js      # Auth business logic
│   │   ├── restaurantService.js
│   │   └── loyaltyService.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── restaurantController.js
│   │   └── loyaltyController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── restaurantRoutes.js
│   │   ├── loyaltyRoutes.js
│   │   └── userRoutes.js
│   └── middleware/
│       ├── auth.js             # JWT protect + adminOnly
│       └── errorHandler.js     # Global error handler
└── scripts/
    └── seed.js                 # Database seeder
```

---

## ⚙️ Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/loyalty_db
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d
ADMIN_SECRET=your_admin_registration_secret
```

> **`ADMIN_SECRET`** — pass this in the register body to create an admin account.

### 3. Seed the database

```bash
npm run seed
```

This will:
- Insert 8 sample restaurants
- Create a default `admin` user (nickname: `admin`, password: `Admin@1234`)

### 4. Start the server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

---

## 🔐 Authentication

All protected endpoints require a **Bearer token** in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

Tokens are returned from `/auth/register` and `/auth/login`.

### Roles

| Role    | Capabilities                                              |
|---------|-----------------------------------------------------------|
| `user`  | View own cards, join restaurant programs                  |
| `admin` | Full CRUD on restaurants, issue points, view all cards    |

---

## 📡 API Endpoints

### Auth

| Method | Endpoint          | Access | Description              |
|--------|-------------------|--------|--------------------------|
| POST   | `/auth/register`  | Public | Register a new user      |
| POST   | `/auth/login`     | Public | Login and receive a JWT  |

#### POST `/auth/register`
```json
{
  "nickname": "johndoe",
  "password": "secret123",
  "adminSecret": "optional_admin_key"
}
```

#### POST `/auth/login`
```json
{
  "nickname": "johndoe",
  "password": "secret123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGci...",
    "user": { "id": "...", "nickname": "johndoe", "role": "user" }
  }
}
```

---

### Restaurants

| Method | Endpoint                    | Access    | Description               |
|--------|-----------------------------|-----------|---------------------------|
| GET    | `/restaurants`              | Public    | List all restaurants      |
| GET    | `/restaurants/:id`          | Public    | Get a single restaurant   |
| POST   | `/admin/restaurants`        | Admin     | Create a restaurant       |
| PUT    | `/admin/restaurants/:id`    | Admin     | Update a restaurant       |
| DELETE | `/admin/restaurants/:id`    | Admin     | Delete a restaurant       |

#### POST `/admin/restaurants`
```json
{
  "name": "My New Restaurant",
  "icon": "🌮",
  "registerLink": "my-restaurant-vip"
}
```
> `registerLink` is optional — auto-generated if omitted.

---

### Loyalty

| Method | Endpoint                              | Access | Description                         |
|--------|---------------------------------------|--------|-------------------------------------|
| POST   | `/loyalty/join`                       | User   | Join a restaurant's loyalty program |
| GET    | `/user/cards`                         | User   | Get all your loyalty cards          |
| GET    | `/admin/loyalty`                      | Admin  | List all loyalty cards              |
| PATCH  | `/admin/loyalty/:loyaltyId/points`    | Admin  | Issue points/visits to a card       |

#### POST `/loyalty/join`

Join by **restaurant ID**:
```json
{ "restaurantId": "664abc123def456789012345" }
```

Join by **register link** (e.g., from a QR code):
```json
{ "registerLink": "sakura-sushi-join" }
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "userId": "...",
    "restaurantId": {
      "name": "Sakura Sushi House",
      "icon": "🍣",
      "registerLink": "sakura-sushi-join"
    },
    "pointsBalance": 0,
    "visitCount": 0,
    "joinDate": "2024-06-01T10:00:00.000Z"
  }
}
```

#### GET `/user/cards`
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "...",
      "restaurantId": { "name": "Sakura Sushi House", "icon": "🍣" },
      "pointsBalance": 150,
      "visitCount": 5,
      "joinDate": "2024-06-01T10:00:00.000Z"
    }
  ]
}
```

#### PATCH `/admin/loyalty/:loyaltyId/points`
```json
{
  "points": 50,
  "visits": 1
}
```

---

### User

| Method | Endpoint    | Access | Description              |
|--------|-------------|--------|--------------------------|
| GET    | `/user/me`  | User   | Get current user profile |
| GET    | `/user/cards` | User | Get all loyalty cards    |

---

## 🌱 Sample Restaurants (from seed)

| Name                  | Icon | Register Link           |
|-----------------------|------|-------------------------|
| The Golden Fork       | 🍴   | `golden-fork-2024`      |
| Sakura Sushi House    | 🍣   | `sakura-sushi-join`     |
| Bella Napoli Pizzeria | 🍕   | `bella-napoli-vip`      |
| Smoky Joe's BBQ       | 🍖   | `smoky-joes-bbq`        |
| The Green Bowl        | 🥗   | `green-bowl-loyalty`    |
| Dragon Palace         | 🥟   | `dragon-palace-rewards` |
| Café Lumière          | ☕   | `cafe-lumiere-club`     |
| The Burger Lab        | 🍔   | `burger-lab-member`     |

---

## 🛡️ Error Responses

All errors follow a consistent shape:

```json
{
  "success": false,
  "message": "Human-readable error description"
}
```

| Status | Meaning                              |
|--------|--------------------------------------|
| 400    | Bad request / validation error       |
| 401    | Unauthorized (missing/invalid token) |
| 403    | Forbidden (insufficient role)        |
| 404    | Resource not found                   |
| 409    | Conflict (duplicate entry)           |
| 500    | Internal server error                |

---

## 🔧 Tech Stack

| Library       | Purpose                        |
|---------------|--------------------------------|
| `express`     | HTTP framework                 |
| `mongoose`    | MongoDB ODM                    |
| `bcryptjs`    | Password hashing               |
| `jsonwebtoken`| JWT auth                       |
| `cors`        | Cross-origin support           |
| `dotenv`      | Environment variable loading   |
| `nodemon`     | Dev auto-reload                |
