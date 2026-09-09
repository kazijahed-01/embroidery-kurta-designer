# Thread & Bloom 🧵🌸

**Custom Embroidery Kurta Designer for Women**

A beautiful, full-stack embroidery kurta customization platform built with React, Node.js, and Supabase. Features a stunning pink/white theme with Indian traditional aesthetics.

## ✨ Features

### User Features
- 🎨 **Design Studio** - Step-by-step kurta customization (7 steps)
- 👁️ **360° Preview** - Interactive 3D view with rotation
- ❤️ **My Collection** - Save, edit, duplicate designs
- 🛍️ **Shop** - Browse ready-made designs with filters
- 🛒 **Cart** - With promo codes and checkout
- 📦 **Orders** - Track order status with timeline
- 👤 **Profile** - Manage account, addresses, payments
- ⚙️ **Settings** - Dark mode, notifications, privacy

### Admin Features
- 📊 **Dashboard** - Revenue, orders, users analytics
- 👗 **Products** - Manage kurta catalog
- 🧵 **Embroidery** - Manage embroidery designs
- 📦 **Orders** - Process and track orders
- 👥 **Users** - Manage customer accounts
- 📈 **Analytics** - Detailed business insights

### Technical Highlights
- 🎭 **Creative Animations** - Framer Motion throughout
- 🌸 **Pink/White Theme** - Indian traditional aesthetics
- 📱 **Responsive Design** - Mobile-first approach
- 🔐 **Authentication** - Supabase Auth with JWT
- 🗄️ **Database** - PostgreSQL with RLS policies
- 🎨 **Tailwind CSS** - Custom design system

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account
- npm or yarn

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Add your Supabase credentials
npm run dev
```

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Add your Supabase credentials and JWT secret
npm run dev
```

### Database Setup
1. Create a new Supabase project
2. Run the SQL schema in `backend/database/schema.sql` in Supabase SQL Editor
3. Enable Row Level Security
4. Configure authentication providers

## 📁 Project Structure

```
embroidery-kurta-designer/
├── frontend/                 # React + Vite + Tailwind
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── context/          # React Context providers
│   │   ├── pages/            # User pages
│   │   ├── admin/            # Admin pages
│   │   ├── lib/              # Utilities & Supabase client
│   │   └── hooks/            # Custom React hooks
│   └── public/
└── backend/                  # Node.js + Express
    ├── routes/               # API routes
    ├── middleware/           # Auth & error handling
    ├── lib/                  # Supabase client
    └── database/             # SQL schema
```

## 🛠️ Tech Stack

### Frontend
- React 18 + Vite
- Tailwind CSS
- Framer Motion
- React Router v6
- Supabase JS Client
- Lucide React Icons
- React Hot Toast
- Zustand (state management)

### Backend
- Node.js + Express
- Supabase (PostgreSQL + Auth)
- JWT Authentication
- Helmet + CORS + Morgan
- Express Validator

## 🎨 Design System

### Colors
- **Primary**: Pink gradient (#ec4899 → #be185d)
- **Secondary**: Rose (#f43f5e)
- **Background**: Pink 50-100 gradients
- **Text**: Pink 700-800, Gray 600-800

### Typography
- **Headings**: Playfair Display (serif)
- **Body**: Poppins (sans-serif)
- **Accents**: Dancing Script (cursive)

### Components
- Buttons: Primary, Secondary, Ghost
- Cards: Elevated, Glass morphism
- Forms: Consistent input fields
- Animations: Slide, Scale, Fade, Rotate

## 📱 Pages Overview

### User Pages
| Page | Route | Description |
|------|-------|-------------|
| Login/Signup | `/login`, `/signup` | Auth with role selection |
| Dashboard | `/dashboard` | Welcome, stats, quick actions |
| Design Studio | `/design-studio` | 7-step customization |
| 360° Preview | `/preview-3d` | Interactive 3D view |
| My Collection | `/my-collection` | Saved designs management |
| Shop | `/shop` | Catalog with filters |
| Cart | `/cart` | Checkout with promo codes |
| Orders | `/orders` | Order tracking |
| Profile | `/profile` | Account management |
| Settings | `/settings` | Preferences |

### Admin Pages
| Page | Route | Description |
|------|-------|-------------|
| Dashboard | `/admin` | Business overview |
| Products | `/admin/products` | Kurta catalog CRUD |
| Embroidery | `/admin/embroidery` | Design patterns CRUD |
| Orders | `/admin/orders` | Order processing |
| Users | `/admin/users` | Customer management |
| Analytics | `/admin/analytics` | Business insights |

## 🔧 Development

### Environment Variables

#### Frontend (.env)
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_URL=http://localhost:5000/api
```

#### Backend (.env)
```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_key
JWT_SECRET=your_secret_key
```

### Available Scripts

#### Frontend
```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

#### Backend
```bash
npm run dev      # Start with nodemon
npm run start    # Production start
```

## 🌐 Deployment

### Frontend (Vercel/Netlify)
1. Connect repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variables

### Backend (Railway/Render)
1. Connect repository
2. Set start command: `npm start`
3. Add environment variables
4. Configure database connection

### Database (Supabase)
- Use Supabase managed PostgreSQL
- Enable required extensions
- Configure RLS policies
- Set up authentication providers

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Supabase** for backend infrastructure
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Lucide** for beautiful icons
- **Google Fonts** for typography

## 💖 Made with Love

Built for every woman who loves embroidery and wants to design her own perfect kurta.

---

**Thread & Bloom** - Where threads meet dreams 🧵✨