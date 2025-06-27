# VideoSaaS - Automated Video Creation & YouTube Publishing Platform

A production-ready SaaS platform that allows users to auto-generate and upload videos to YouTube using AI-powered tools. Built with Next.js, Node.js, Prisma, Redis, and Stripe.

## 🚀 Features

### Core Functionality
- **AI Script Generation**: GPT-4 powered script creation for any niche
- **Text-to-Speech**: High-quality voiceovers using ElevenLabs API
- **Video Rendering**: FFmpeg-based video assembly with AI-generated visuals
- **YouTube Integration**: Direct publishing with OAuth2 authentication
- **Thumbnail Generation**: AI-generated thumbnails using DALL-E

### Business Features
- **Credit System**: Flexible credit-based pricing model
- **Stripe Integration**: Subscription management and billing
- **User Management**: Authentication, profiles, and team collaboration
- **Analytics**: Video performance tracking and insights
- **Queue System**: Robust job processing with BullMQ and Redis

### Technical Features
- **Monorepo Architecture**: Clean separation of frontend and backend
- **TypeScript**: Full type safety across the stack
- **Modern UI**: Beautiful interface with TailwindCSS and shadcn/ui
- **Real-time Updates**: WebSocket integration for live status updates
- **Scalable**: Docker-ready with cloud deployment support

## 🏗️ Architecture

```
video-saas-platform/
├── apps/
│   ├── api/                 # Backend API (Node.js + Express)
│   │   ├── src/
│   │   │   ├── services/    # Business logic services
│   │   │   ├── routes/      # API endpoints
│   │   │   ├── middleware/  # Auth & validation
│   │   │   └── lib/         # Database & queue setup
│   │   └── prisma/          # Database schema
│   └── web/                 # Frontend (Next.js 14)
│       ├── app/             # App router pages
│       ├── components/      # Reusable UI components
│       └── lib/             # Utilities & API clients
└── packages/                # Shared packages (future)
```

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express** - API framework
- **Prisma** - Database ORM
- **PostgreSQL** - Primary database
- **Redis** + **BullMQ** - Job queues
- **JWT** - Authentication
- **Stripe** - Payment processing
- **AWS S3** - File storage
- **FFmpeg** - Video processing

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **shadcn/ui** - Component library
- **React Query** - Data fetching
- **Zustand** - State management
- **Framer Motion** - Animations

### AI & External APIs
- **OpenAI GPT-4** - Script generation
- **DALL-E** - Image generation
- **ElevenLabs** - Text-to-speech
- **YouTube Data API** - Video publishing

## 📦 Installation

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- FFmpeg
- Docker (optional)

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/video-saas-platform.git
cd video-saas-platform
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Backend
cp apps/api/env.example apps/api/.env
# Frontend
cp apps/web/env.example apps/web/.env
```

4. **Configure your environment variables**
Edit the `.env` files with your API keys and configuration.

5. **Set up the database**
```bash
npm run db:generate
npm run db:push
```

6. **Start the development servers**
```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run dev --workspace=apps/api
npm run dev --workspace=apps/web
```

## 🔧 Configuration

### Required Environment Variables

#### Backend (`apps/api/.env`)
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/videosaas"

# JWT
JWT_SECRET="your-super-secret-jwt-key"

# Redis
REDIS_HOST="localhost"
REDIS_PORT="6379"

# AWS S3
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="your-s3-bucket"

# OpenAI
OPENAI_API_KEY="your-openai-api-key"

# ElevenLabs
ELEVENLABS_API_KEY="your-elevenlabs-api-key"

# Stripe
STRIPE_SECRET_KEY="sk_test_your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="whsec_your-webhook-secret"

# Google/YouTube
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_REDIRECT_URI="http://localhost:3001/api/youtube/callback"
```

#### Frontend (`apps/web/.env`)
```env
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your-stripe-publishable-key"
```

## 🚀 Deployment

### Docker Deployment

1. **Build the images**
```bash
docker-compose build
```

2. **Start the services**
```bash
docker-compose up -d
```

### Cloud Deployment

#### Vercel (Frontend)
```bash
cd apps/web
vercel --prod
```

#### Railway (Backend)
```bash
cd apps/api
railway up
```

#### Database
- **Neon** (PostgreSQL)
- **Upstash** (Redis)

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Scripts
- `POST /api/scripts/generate` - Generate AI script
- `GET /api/scripts` - List user scripts
- `GET /api/scripts/:id` - Get script details
- `PUT /api/scripts/:id` - Update script
- `DELETE /api/scripts/:id` - Delete script

### Videos
- `POST /api/videos/generate` - Generate video from script
- `GET /api/videos` - List user videos
- `GET /api/videos/:id` - Get video details
- `DELETE /api/videos/:id` - Delete video

### YouTube
- `GET /api/youtube/auth-url` - Get OAuth URL
- `POST /api/youtube/connect` - Connect YouTube account
- `GET /api/youtube/accounts` - List connected accounts
- `POST /api/youtube/upload` - Upload video to YouTube

### Billing
- `POST /api/stripe/create-checkout-session` - Create payment session
- `POST /api/stripe/create-subscription` - Create subscription
- `POST /api/stripe/webhook` - Stripe webhook handler

## 💳 Pricing Tiers

| Plan | Price | Credits | Features |
|------|-------|---------|----------|
| Starter | $29/mo | 30 | Basic video generation |
| Pro | $79/mo | 100 | Advanced analytics, priority support |
| Agency | $199/mo | 300 | Team collaboration, white-label |

## 🔒 Security

- JWT-based authentication
- Rate limiting on all endpoints
- Input validation with Zod
- CORS protection
- Helmet.js security headers
- SQL injection protection with Prisma
- XSS protection

## 📈 Monitoring

- Request logging with Winston
- Error tracking and reporting
- Performance monitoring
- Queue monitoring with BullMQ
- Database query optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- Documentation: [docs.videosaas.com](https://docs.videosaas.com)
- Issues: [GitHub Issues](https://github.com/yourusername/video-saas-platform/issues)
- Email: support@videosaas.com

## 🗺️ Roadmap

- [ ] Multi-language support
- [ ] Advanced video templates
- [ ] Social media integration
- [ ] Advanced analytics dashboard
- [ ] Mobile app
- [ ] API for third-party integrations
- [ ] White-label solution
- [ ] Advanced team features

---

Built with ❤️ by the VideoSaaS Team 