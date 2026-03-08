# 🍔 FoodDash — Full Stack Food Delivery App

A full-featured food delivery web application built with the MERN stack, featuring real-time order tracking, AI-powered food recommendations, and seamless payment integration.

![FoodDash Banner](./frontend/src/assets/logo.png)

---

## 🌐 Languages Used

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

---

## 🛠️ Tech Stack

### Frontend
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Passport](https://img.shields.io/badge/Passport.js-34E27A?style=for-the-badge&logo=passport&logoColor=white)

### Services & Tools
![Stripe](https://img.shields.io/badge/Stripe-008CDD?style=for-the-badge&logo=stripe&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Google OAuth](https://img.shields.io/badge/Google_OAuth-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)

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
- ➕ Add / remove food items with prep time
- 🔄 Auto order status progression
- 🗑️ Order deletion with revenue snapshotting

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

## 🧪 Testing

All backend API endpoints were tested using **Postman** including:

| Endpoint | Method | Description |
|---|---|---|
| `/api/user/register` | POST | Register new user |
| `/api/user/login` | POST | Login user |
| `/api/food/list` | GET | Get all food items |
| `/api/food/add` | POST | Add food item |
| `/api/food/remove` | POST | Remove food item |
| `/api/cart/add` | POST | Add item to cart |
| `/api/cart/items` | GET | Get cart items |
| `/api/order/add` | POST | Place order |
| `/api/order/verify` | POST | Verify Stripe payment |
| `/api/order/userorders` | GET | Get user orders |
| `/api/order/list` | GET | Get all orders (admin) |
| `/api/order/status` | POST | Update order status |
| `/api/bot/chat` | POST | AI chatbot message |

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

---

## 📝 License

MIT License — feel free to use this project for learning or portfolio purposes.

---

## 🙋‍♂️ Author

**Amal V**
- GitHub: [@amalv35](https://github.com/amalv35)

---

⭐ If you found this project helpful, please give it a star!
