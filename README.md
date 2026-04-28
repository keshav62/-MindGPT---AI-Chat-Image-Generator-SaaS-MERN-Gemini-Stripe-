#🧠 MindGPT — Full-Stack AI SaaS built with MERN Stack. Features AI chat (Gemini), text-to-image generation (ImageKit), voice-to-text input, Stripe credit system, JWT auth & dark mode.



**MindGPT** is a full-stack AI-powered chat application that supports **text generation** and **AI image generation**. It features a credit-based system powered by **Stripe**, AI text responses via **Google Gemini**, and AI image generation via **ImageKit**. Users can publish generated images to a shared community gallery.

---

## 📸 Preview

> **Dark Mode Chat Interface** — Multi-chat sidebar, Markdown rendering, typing animations, copy-to-clipboard, and prompt suggestions.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Authentication** | JWT-based register & login with bcrypt password hashing |
| 💬 **AI Text Chat** | Send prompts and receive AI responses powered by Google Gemini |
| 🖼️ **AI Image Generation** | Generate images from text prompts using ImageKit's AI endpoint |
| 📋 **Copy to Clipboard** | One-click copy for any AI response message |
| ⌨️ **Typing Animation** | Smooth character-by-character streaming effect for AI replies |
| 💡 **Prompt Suggestions** | Clickable suggestion cards to jumpstart conversations |
| 🌐 **Community Gallery** | Browse and share AI-generated images published by the community |
| 💳 **Credit System** | Purchase credit packs (Basic / Pro / Premium) via Stripe Checkout |
| 🌙 **Dark / Light Mode** | Theme toggle with localStorage persistence |
| 🗂️ **Multi-Chat Management** | Create, browse, and delete multiple chat sessions |
| 📱 **Responsive Design** | Mobile-friendly with collapsible sidebar |
| ✅ **Stripe Webhooks** | Automatic credit fulfillment on successful payment |

---

## 🏗️ Project Structure

```
MindGPT/
├── client/                        # React + Vite Frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/                # Static assets & dummy data
│   │   ├── components/
│   │   │   ├── ChatBox.jsx        # Main chat interface
│   │   │   ├── Message.jsx        # Individual message renderer
│   │   │   └── Sidebar.jsx        # Navigation sidebar
│   │   ├── context/
│   │   │   └── AppContext.jsx     # Global state management
│   │   ├── pages/
│   │   │   ├── Community.jsx      # Community image gallery
│   │   │   ├── Credits.jsx        # Credit plans & purchase
│   │   │   ├── Loading.jsx        # Loading screen
│   │   │   └── Login.jsx          # Auth page (login/register)
│   │   ├── App.jsx                # Root component & routing
│   │   ├── main.jsx               # React entry point
│   │   └── index.css              # Global styles
│   ├── package.json
│   └── vite.config.js
│
└── server/                        # Node.js + Express Backend
    ├── configs/
    │   ├── db.js                  # MongoDB connection
    │   ├── imageKit.js            # ImageKit SDK setup
    │   └── openai.js              # (OpenAI config - reserved)
    ├── controllers/
    │   ├── chatController.js      # Chat CRUD logic
    │   ├── creditController.js    # Plans & Stripe Checkout
    │   ├── messageController.js   # Text & image AI response
    │   ├── userController.js      # Auth logic (register/login)
    │   └── webhooks.js            # Stripe webhook handler
    ├── middlewares/
    │   └── auth.js                # JWT protect middleware
    ├── models/
    │   ├── Chat.js                # Chat & embedded messages schema
    │   ├── Transaction.js         # Payment transaction schema
    │   └── User.js                # User schema with bcrypt hook
    ├── routes/
    │   ├── chatRoutes.js          # /api/chat/*
    │   ├── creditRoutes.js        # /api/credit/*
    │   ├── messageRoutes.js       # /api/message/*
    │   └── userRouters.js         # /api/user/*
    ├── server.js                  # Express app entry point
    ├── package.json
    └── vercel.json                # Vercel deployment config
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Vite 7 | Build tool & dev server |
| React Router DOM v7 | Client-side routing |
| TailwindCSS 4 | Utility-first styling |
| Axios | HTTP client |
| React Hot Toast | Notification toasts |
| React Markdown | Markdown rendering for AI replies |
| PrismJS | Syntax highlighting in code blocks |
| Moment.js | Timestamp formatting |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express 5 | REST API server |
| MongoDB + Mongoose | Database & ODM |
| JWT (jsonwebtoken) | Stateless authentication |
| bcryptjs | Password hashing |
| Google Gemini (`@google/genai`) | AI text generation |
| ImageKit | AI image generation & CDN storage |
| Stripe | Payment processing & webhooks |
| dotenv | Environment variable management |
| CORS | Cross-origin resource sharing |
| Nodemon | Development auto-restart |

---

## 🗄️ Database Models

### `User`
```js
{
  name:     String   // required
  email:    String   // required, unique
  password: String   // required, bcrypt-hashed (pre-save hook)
  credits:  Number   // default: 20
}
```

### `Chat`
```js
{
  userId:   String   // ref: User
  userName: String
  name:     String   // default: "New Chat"
  messages: [
    {
      role:        String   // "user" | "assistant"
      content:     String   // text or image URL
      timestamp:   Number
      isImage:     Boolean
      isPublished: Boolean  // default: false
    }
  ]
  // Mongoose timestamps: createdAt, updatedAt
}
```

### `Transaction`
```js
{
  userId:  ObjectId  // ref: User
  planId:  String    // "basic" | "pro" | "premium"
  amount:  Number    // in USD
  credits: Number
  isPaid:  Boolean   // default: false
  // Mongoose timestamps: createdAt, updatedAt
}
```

---

## 🌐 API Reference

### Auth: `/api/user`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/user/register` | ✅ | Register a new user |
| `POST` | `/api/user/login` | ✅ | Login and get JWT token |
| `GET` | `/api/user/data` | ✅ | Get authenticated user's data |
| `GET` | `/api/user/published-images` | ✅ | Fetch all published community images |

---

### Chats: `/api/chat`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/chat/create` | ✅ | Create a new chat session |
| `GET` | `/api/chat/get` | ✅ | Get all chats for the logged-in user |
| `GET` | `/api/chat/delete?chatId=` | ✅ | Delete a chat by its ID (via query param) |

---

### Messages: `/api/message`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/message/text` | ✅ | Send a text prompt and get AI reply (costs 1 credit) |
| `POST` | `/api/message/image` | ✅ | Send an image prompt and get AI image (costs 2 credits) |

**Request body for `/api/message/text`:**
```json
{
  "chatId": "<mongoId>",
  "prompt": "Explain quantum computing"
}
```

**Request body for `/api/message/image`:**
```json
{
  "chatId": "<mongoId>",
  "prompt": "A futuristic city at sunset",
  "isPublished": true
}
```

---

### Credits: `/api/credit`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/credit/plan` | ✅ | Get all available credit plans |
| `POST` | `/api/credit/purchase` | ✅ | Create Stripe Checkout session for a plan |

**Request body for `/api/credit/purchase`:**
```json
{
  "planId": "pro"
}
```

---

### Stripe Webhook: `/api/stripe`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/stripe` | Stripe Sig | Handles `payment_intent.succeeded` to fulfill credits |



---

## 🎛️ Controllers

### `userController.js`
| Function | Description |
|---|---|
| `registerUser` | Validates uniqueness, creates user, returns JWT |
| `loginUser` | Verifies password with bcrypt, returns JWT |
| `getUser` | Returns `req.user` populated by auth middleware |

### `chatController.js`
| Function | Description |
|---|---|
| `createChat` | Creates a new empty chat for the user |
| `getChats` | Fetches all chats sorted by `updatedAt` descending |
| `deleteChat` | Deletes a chat by `chatId` query param (ownership verified) |

### `messageController.js`
| Function | Description |
|---|---|
| `textMessageController` | Requires ≥1 credit. Calls Gemini API, appends user + AI messages, deducts 1 credit |
| `imageMessageController` | Requires ≥2 credits. Uses ImageKit AI URL, uploads to CDN, saves image URL as message, deducts 2 credits |
| `getPublishedImages` | MongoDB aggregation to extract all published image messages across all chats |

### `creditController.js`
| Function | Description |
|---|---|
| `getPlans` | Returns the hard-coded array of 3 credit plans |
| `purchasePlan` | Creates a `Transaction` (isPaid: false), opens a Stripe Checkout session with metadata |

### `webhooks.js`
| Function | Description |
|---|---|
| `stripeWebhooks` | Verifies Stripe signature. On `payment_intent.succeeded`, updates user credits and marks transaction as paid |

---

## 🛡️ Middleware

### `auth.js` — `protect`
Reads `Authorization` header (plain JWT — no `Bearer` prefix), verifies with `JWT_SECRET`, attaches `req.user` (full Mongoose user document), calls `next()` or returns `401`.

---

## ⚙️ Credit Plans

| Plan | Price | Credits | Text Generations | Image Generations |
|---|---|---|---|---|
| Basic | $10 | 100 | 100 | 50 |
| Pro | $20 | 500 | 500 | 200 |
| Premium | $30 | 1000 | 1000 | 500 |

> New users start with **20 free credits**.

---

## 🖥️ Frontend Pages & Components

### Pages
| Page | Route | Description |
|---|---|---|
| `Login.jsx` | `/` (unauthenticated) | Register / Login form with tab switching |
| `ChatBox.jsx` | `/` | Main AI chat interface |
| `Credits.jsx` | `/credits` | View and purchase credit plans |
| `Community.jsx` | `/community` | Browse published AI-generated images |
| `Loading.jsx` | `/loading` | Shown after Stripe redirect or while fetching user |

### Components
| Component | Description |
|---|---|
| `Sidebar.jsx` | Navigation with chat list, new chat button, credit display, dark mode toggle, logout |
| `ChatBox.jsx` | Text/image mode toggle, message history, typing animation, prompt suggestions, send form |
| `Message.jsx` | Renders a single message — Markdown + syntax highlighting for AI replies, image display, copy button, timestamp |

### Global State — `AppContext.jsx`
| Value | Type | Description |
|---|---|---|
| `user` | Object | Authenticated user data |
| `token` | String | JWT stored in `localStorage` |
| `chats` | Array | All user chat sessions |
| `selectedChat` | Object | Currently active chat |
| `theme` | String | `"dark"` or `"light"` |
| `loadingUser` | Boolean | True while fetching initial user |
| `createNewChat()` | Function | Creates a new chat and refreshes list |
| `fetchUsersChats()` | Function | Fetches and syncs all chats |
| `navigate` | Function | React Router programmatic navigation |
| `axios` | Instance | Configured with `baseURL` from `VITE_SERVER_URL` |

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- MongoDB Atlas or local MongoDB instance
- Stripe account (for payments)
- Google Gemini API key
- ImageKit account

---

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/MindGPT.git
cd MindGPT
```

---

### 2. Configure the Server

```bash
cd server
npm install
```

Create a `.env` file inside `server/`:
```env
PORT=3000
MONGODB_URL=mongodb+srv://<user>:<password>@cluster.mongodb.net
JWT_SECRET=your_jwt_secret_key

GEMINI_API_KEY=your_google_gemini_api_key

IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id

STRIP_SECRET_KEY=sk_test_...
STRIP_WEBHOOK_SECRET=whsec_...
```

Start the server:
```bash
npm run server     # development (nodemon)
npm start          # production
```

---

### 3. Configure the Client

```bash
cd ../client
npm install
```

Create a `.env` file inside `client/`:
```env
VITE_SERVER_URL=http://localhost:3000
```

Start the dev server:
```bash
npm run dev
```

App runs at **http://localhost:5173**

---

## 🚢 Deployment

### Backend → Vercel
The `server/vercel.json` configures all routes to be handled by `server.js`:

```json
{
  "version": 2,
  "builds": [{ "src": "server.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "server.js" }]
}
```

> Set all environment variables in your Vercel project dashboard.

### Frontend → Vercel / Netlify
```bash
cd client
npm run build
```
Deploy the `dist/` folder. Set `VITE_SERVER_URL` to your deployed backend URL.

### Stripe Webhook Setup
After deploying, register your webhook endpoint in the [Stripe Dashboard](https://dashboard.stripe.com/webhooks):
- **Endpoint URL:** `https://your-server.vercel.app/api/stripe`
- **Event:** `payment_intent.succeeded`

---

## 🔐 Environment Variables Summary

### Server (`server/.env`)
| Variable | Description |
|---|---|
| `PORT` | Server port (default: 3000) |
| `MONGODB_URL` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing JWT tokens |
| `GEMINI_API_KEY` | Google Gemini API key |
| `IMAGEKIT_PUBLIC_KEY` | ImageKit public key |
| `IMAGEKIT_PRIVATE_KEY` | ImageKit private key |
| `IMAGEKIT_URL_ENDPOINT` | ImageKit URL endpoint |
| `STRIP_SECRET_KEY` | Stripe secret key |
| `STRIP_WEBHOOK_SECRET` | Stripe webhook signing secret |

### Client (`client/.env`)
| Variable | Description |
|---|---|
| `VITE_SERVER_URL` | Base URL of the backend server |

---

## 📄 License

This project is licensed under the **ISC License**.

---

## 👨‍💻 Author

Built with ❤️ by **Keshav** — [GitHub](https://github.com/keshav62)
