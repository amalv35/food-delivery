# 🍔 FoodDash — Full Stack Food Delivery App

A full-featured food delivery web application built with the MERN stack, featuring real-time order tracking, AI-powered food recommendations, and seamless payment integration.

![FoodDash Banner](./frontend/src/assets/logo.png)

---

## ✨ Features

### Customer
- 🔐 Email/Password & Google OAuth authentication
- 🍽️ Browse food menu by category
- 🛒 Add to cart with live item count
- 💳 Secure checkout via Stripe
- 📦 Real-time order tracking (Socket.io)
- 🤖 AI food recommendation chatbot (Gemini)
- 📋 Order history page

### Admin Panel
- 📊 Revenue & statistics dashboard
- 🧾 Manage all orders with live updates
- ➕ Add / remove food items
- 🔄 Auto order status progression
- 🗑️ Order deletion with revenue snapshotting

---

## 🛠️ Tech Stack

### Frontend
| Tech | Usage |
|---|---|
| React + Vite | UI framework |
| React Router | Navigation |
| Context API | State management |
| Socket.io Client | Real-time updates |
| Axios | API calls |
| React Icons | Icons |
| React Toastify | Notifications |

### Backend
| Tech | Usage |
|---|---|
| Node.js + Express | Server |
| MongoDB + Mongoose | Database |
| JWT | Authentication |
| Passport.js | Google OAuth |
| Stripe | Payments |
| Socket.io | Real-time |
| Gemini API | AI chatbot |
| Multer | File uploads |
| Helmet | Security headers |
| express-rate-limit | Rate limiting |

---

## 📁 Project Structure
```
food-delivery/
├── frontend/          # React + Vite customer app
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── assets/
├── admin/             # React + Vite admin panel
│   ├── src/
│   │   ├── components/
│   │   └── pages/
└── backend/           # Node.js + Express API
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    └── utils/
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Stripe account
- Google Cloud Console project
- Google Gemini API key

### 1. Clone the repo
```bash
git clone https://github.com/amalv35/food-delivery
cd food-delivery
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Create `.env` in `/backend`:
```env
PORT=8000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GEMINI_API_KEY=your_gemini_key
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```
```bash
npm run server
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Setup Admin Panel
```bash
cd admin
npm install
npm run dev
```

---

## 🔐 Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Backend port (default 8000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `GEMINI_API_KEY` | Google Gemini API key |
| `FRONTEND_URL` | Frontend URL for CORS + redirects |
| `NODE_ENV` | `development` or `production` |

---

## 🔄 Order Flow
```
User places order
      ↓
Stripe payment
      ↓
Payment verified → Food Processing (auto, 1 sec)
      ↓
Prep time countdown → Out for Delivery (auto)
      ↓
30 mins → Delivered (auto)
      ↓
Revenue snapshotted
      ↓
5 years → Order auto-deleted
```

---

## 🤖 AI Chatbot

The chatbot uses Google Gemini to provide personalised food recommendations based on:
- User's order history
- Favourite food categories
- Menu item descriptions
- Natural language input ("something spicy", "surprise me")

---

## 🔒 Security

- JWT authentication with 7 day expiry
- Google OAuth 2.0
- Helmet HTTP security headers
- Rate limiting (100 req/15min general, 10 req/15min auth)
- MongoDB injection prevention
- CORS locked to frontend origin
- Input validation and sanitization
- Password hashing with bcrypt (12 rounds)
- File upload validation (images only, 5MB max)



## 📝 License

MIT License — feel free to use this project for learning or portfolio purposes.

---

## 🙋‍♂️ Author

**Amal**
- GitHub: [@amalv35](https://github.com/amalv35)

---

⭐ If you found this project helpful, please give it a star!
