# Wallywood API 🎬

Welcome to Wallywood! This is the backend API for an online movie poster shop where you can browse, rate, and purchase both new and vintage movie posters.

## What This Project Does

Wallywood API handles everything you need to run an e-commerce platform for movie posters:
- Browse hundreds of movie posters with prices and details
- Search by genre (Action, Drama, Comedy, etc.)
- User registration and authentication
- Shopping cart management
- Rating system (1-5 stars)
- Admin controls for managing inventory

Built with modern tools and following best practices, this API is ready to power a full movie poster marketplace.

## Tech Stack

Here's what makes it tick:
- **Node.js** (v24.11.1) - JavaScript runtime
- **TypeScript** (5.9.3) - For type safety and better developer experience
- **Express** (5.2.1) - Fast, minimalist web framework
- **Prisma** (6.19.0) - Modern ORM that makes database work actually enjoyable
- **MySQL** - Reliable relational database
- **JWT** - Secure token-based authentication
- **bcrypt** - Password hashing for security

## What Can You Do With This API?

### For Everyone (No Login Required)
- Browse all movie posters
- View poster details
- Check out different genres
- See user ratings

### For Registered Users
- Create an account
- Rate your favorite posters
- Add items to your shopping cart
- Manage your cart (update quantities, remove items)

### For Admins
- Full control over posters (create, update, delete)
- Manage genres and categories
- User management
- Organize poster-genre relationships

## Getting Started

### What You'll Need

Before diving in, make sure you have:
- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MySQL** installed locally - I recommend using [Sequel Ace](https://sequel-ace.com/) on Mac for managing your database

### Installation Steps

**1. Clone this repository**
```bash
git clone https://github.com/AlsoSimple/wallywood.git
cd wallywood
```

**2. Install all the dependencies**
```bash
npm install
```

**3. Set up your environment variables**

The `.env` file is already configured for local development:
```env
DATABASE_URL="mysql://root@localhost:3306/wallywood"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=4000
```

**Note:** If your MySQL setup is different (like having a password for root user), update the `DATABASE_URL` accordingly.

**4. Create and seed the database**

This will create all tables and populate them with sample data (669 posters, 22 genres, 2 users):
```bash
npx prisma migrate dev
npm run prisma:seed
```

You'll see confirmation messages showing how many records were created.

**5. Start the server**
```bash
npm run dev
```

You should see:
```
Wallywood API server is running on http://localhost:4000
Health check: http://localhost:4000/api/health
```

Visit http://localhost:4000/api/health to verify everything is working!

### Test Login Credentials

The seed script creates two users you can test with:

**Admin Account:**
- Email: `info@webudvikler.dk`
- Password: `password123`
- Role: ADMIN (full access)

**Regular User:**
- Email: `alm@webudvikler.dk`
- Password: `password123`
- Role: USER (can rate, use cart)

## API Documentation & Testing

### Postman Collection

I've created a complete Postman collection with **32 documented endpoints** organized into 7 categories. Each endpoint includes:
- Detailed descriptions
- Request examples
- Field explanations
- Authorization requirements

**📦 Import the collection:**
1. Open Postman
2. Click Import
3. Select `Wallywood_API.postman_collection.json` from the project root
4. Import the environment: `temp/wallywood.postman_environment.json`
5. Select "Wallywood Local" environment in the top-right dropdown

**🔗 View Online Documentation:**
After importing, Postman automatically generates beautiful documentation you can view by clicking the collection and selecting "View Documentation".

### Quick API Overview

| Endpoint Category | What It Does | Auth Required |
|-------------------|--------------|---------------|
| **Authentication** | Register and login | No |
| **Users** | Manage user accounts | Public GET, ADMIN for modifications |
| **Posters** | Browse and manage movie posters | Public GET, ADMIN for modifications |
| **Genres** | Movie categories | Public GET, ADMIN for modifications |
| **Ratings** | User ratings (1-5 stars) | Any user can rate |
| **Cartlines** | Shopping cart | All cart operations require login |
| **Genre-Poster Relations** | Link posters to genres | ADMIN only |

**Base URL:** `http://localhost:4000`

## Database Overview

The database structure is straightforward and follows these relationships:

- **Users** → Can create ratings and have cart items
- **Posters** → Can belong to multiple genres, have ratings, be in carts
- **Genres** → Can have multiple posters (many-to-many)
- **UserRatings** → Links users and posters (one rating per user per poster)
- **Cartlines** → User's shopping cart items with quantities
- **GenrePosterRel** → Junction table for poster-genre relationships

Check out `prisma/schema.prisma` for the complete database schema, or use Prisma Studio to visualize it:
```bash
npx prisma studio
```

## How Authentication Works

The API uses JWT (JSON Web Tokens) for authentication:

1. **Login** at `/api/auth/login` with email and password
2. Receive a token (valid for 24 hours)
3. Include token in subsequent requests:
   ```
   Authorization: Bearer <your-token>
   ```

**Authorization Levels:**
- 🌍 **Public** - Anyone can access (all GET endpoints)
- 🔐 **Authenticated** - Any logged-in user (ratings, cart)
- 👑 **Admin** - Only admin users (create/update/delete posters, genres, users)

## Project Structure

```
wallywood/
├── src/
│   ├── controllers/     # Business logic for each resource
│   ├── routes/          # API route definitions
│   ├── middleware/      # Auth middleware
│   ├── utils/           # Prisma client and utilities
│   ├── app.ts           # Express app setup
│   └── server.ts        # Server startup
├── prisma/
│   ├── schema.prisma    # Database schema
│   ├── seed.ts          # Database seeding script
│   └── migrations/      # Database migrations
├── _FILES/
│   └── csv/             # Seed data (posters, genres, users, etc.)
├── Wallywood_API.postman_collection.json  # Postman collection
└── README.md            # You are here!
```

## Useful Commands

```bash
# Development
npm run dev              # Start development server with hot reload

# Database
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run database migrations
npm run prisma:seed      # Populate database with sample data
npm run prisma:studio    # Open Prisma Studio (visual database editor)

# Production
npm run build            # Compile TypeScript to JavaScript
npm start                # Run production server
```

## Common Issues & Solutions

**Port 4000 already in use?**
```bash
# Find and kill the process using port 4000
lsof -ti:4000 | xargs kill -9
```

**Database connection issues?**
- Make sure MySQL is running
- Check your DATABASE_URL in `.env`
- Verify database "wallywood" exists

**Seed script failing?**
```bash
# Reset database and try again
npx prisma migrate reset --force
```

## What's Next?

Want to extend this project? Here are some ideas:
- Add image upload for posters
- Implement order/checkout system
- Add search and filtering
- Create refresh token mechanism
- Add email verification
- Implement password reset flow

## Built By

**AlsoSimple** - Exam project for Web Developer education

## License

MIT - Feel free to use this for learning!
