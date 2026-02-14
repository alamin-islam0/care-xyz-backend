# Care.xyz Backend

Backend API for Care.xyz - A service booking platform built with Node.js, Express, and MongoDB.

## Features

- **User Authentication**: JWT-based authentication with Google OAuth support
- **Service Management**: CRUD operations for services
- **Booking System**: Complete booking workflow with status management
- **Admin Dashboard**: Role-based access control for administrators
- **Email Notifications**: Automated booking confirmation emails (optional SMTP)
- **RESTful API**: Clean and well-structured API endpoints

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + Google OAuth 2.0
- **Email**: Nodemailer
- **Deployment**: Vercel Serverless Functions

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB database (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/alamin-islam0/care-xyz-backend.git
cd care-xyz-backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory (see `.env.example` for reference):

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_app_password
SMTP_FROM=no-reply@carexyz.com

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
```

4. Start the development server:

```bash
npm run dev
```

The server will run on `http://localhost:5001`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/google` - Login with Google OAuth
- `GET /api/auth/me` - Get current user (requires auth)

### Services

- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get service by ID

### Bookings

- `POST /api/bookings` - Create a new booking (requires auth)
- `GET /api/bookings/my` - Get user's bookings (requires auth)
- `GET /api/bookings/:id` - Get booking by ID (requires auth)
- `PATCH /api/bookings/:id/cancel` - Cancel a booking (requires auth)
- `GET /api/bookings/all` - Get all bookings (admin only)
- `PATCH /api/bookings/:id/status` - Update booking status (admin only)

## Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run seed` - Seed database with initial services

## Project Structure

```
backend/
├── api/
│   └── index.js          # Vercel serverless handler
├── src/
│   ├── config/
│   │   ├── db.js         # Database connection
│   │   └── env.js        # Environment variables
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bookingController.js
│   │   └── serviceController.js
│   ├── middleware/
│   │   ├── auth.js       # JWT authentication
│   │   └── adminAuth.js  # Admin authorization
│   ├── models/
│   │   ├── User.js
│   │   ├── Service.js
│   │   └── Booking.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bookingRoutes.js
│   │   └── serviceRoutes.js
│   ├── utils/
│   │   └── email.js      # Email utilities
│   ├── app.js            # Express app configuration
│   ├── server.js         # Server entry point
│   └── seed.js           # Database seeder
├── .env.example          # Environment variables template
├── .gitignore
├── package.json
├── vercel.json           # Vercel deployment config
└── README.md
```

## Deployment

This backend is configured for deployment on Vercel:

1. Install Vercel CLI:

```bash
npm i -g vercel
```

2. Deploy:

```bash
vercel --prod
```

3. Set environment variables on Vercel dashboard or via CLI

## Environment Variables

See `.env.example` for all required environment variables. Make sure to set these in your deployment platform.

## License

MIT

## Author

Alamin Islam

- GitHub: [@alamin-islam0](https://github.com/alamin-islam0)

## Related Projects

- [Frontend Repository](https://github.com/alamin-islam0/care-xyz-frontend)
# care-xyz-backend
