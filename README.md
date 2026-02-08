# Kab Creative Lab

A full-stack web application for managing creative portfolios, projects, and client communications.

## Features

### Frontend
- **Landing Page**: Dynamic hero section with portfolio showcase
- **Portfolio Management**: Display creative works (images, videos, YouTube)
- **User Dashboard**: Personalized content delivery
- **Admin Panel**: Complete management system
- **Dark Mode**: Full dark/light theme support
- **Responsive Design**: Mobile-first approach

### Backend
- **RESTful API**: Built with Express.js and TypeScript
- **Authentication**: JWT-based secure authentication
- **File Upload**: Cloudinary integration for media storage
- **Database**: MongoDB with Mongoose ODM
- **Email Service**: Nodemailer for notifications

## Tech Stack

### Frontend
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- React Icons

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB
- Cloudinary
- JWT
- Bcrypt

## Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB
- Cloudinary account

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

Run backend:
```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Run frontend:
```bash
npm run dev
```

## Project Structure

```
Kab/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.ts
│   └── package.json
├── frontend/
│   ├── app/
│   │   ├── admin/
│   │   ├── user/
│   │   └── portfolio/
│   ├── components/
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/verify` - Verify JWT token

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `DELETE /api/users/:id` - Delete user

### Portfolio
- `GET /api/portfolio` - Get portfolio data
- `POST /api/portfolio/hero` - Add hero image
- `PUT /api/portfolio/about` - Update about section
- `POST /api/portfolio/works` - Add sample work

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all messages
- `PUT /api/contact/:id/read` - Mark as read

## Features in Detail

### Admin Panel
- User management with role-based access
- Portfolio content management
- Project showcase management
- Contact form submissions
- Send media to users (videos/photos)
- FAQ management
- Service management

### User Dashboard
- View assigned media content
- Access personalized projects
- Profile management

### Portfolio Page
- Dynamic hero section with animated characters
- About section with experience showcase
- Skills display with animations
- Work experience timeline
- Sample works gallery (images, videos, YouTube)
- Responsive modal viewer

## Deployment

### Backend (Render)
1. Push code to GitHub
2. Connect Render to repository
3. Add environment variables
4. Deploy

### Frontend (Vercel)
1. Push code to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy

## License

MIT

## Author

Kab Creative Lab
