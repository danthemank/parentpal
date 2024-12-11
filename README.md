# ParentPal - Your 24/7 Parenting Companion

ParentPal is a comprehensive mobile application designed to support parents through their parenting journey with features like growth tracking, sleep analysis, developmental milestone tracking, community support, and more.

## Table of Contents
- [System Requirements](#system-requirements)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Environment Setup](#environment-setup)
- [Database Setup](#database-setup)
- [Deployment Instructions](#deployment-instructions)
- [API Documentation](#api-documentation)
- [Security Considerations](#security-considerations)

## System Requirements

- Node.js >= 18.x
- NPM >= 9.x
- Neon PostgreSQL database
- React Native development environment
  - iOS: XCode (Mac only)
  - Android: Android Studio
- Expo CLI

## Tech Stack

### Backend
- Node.js with Express
- SQLite (Development)
- Neon PostgreSQL (Production)
- JWT for authentication
- Zod for validation

### Frontend
- React Native
- Expo
- React Navigation
- Async Storage

## Project Structure

```
parentpal/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── index.js
│   ├── package.json
│   └── .env
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── screens/
    │   ├── navigation/
    │   ├── utils/
    │   └── App.js
    ├── package.json
    └── app.config.js
```

## Environment Setup

### Backend Environment Variables (.env)
```env
# Server Configuration
PORT=3000
NODE_ENV=production

# Database Configuration
DATABASE_URL=your_neon_database_url

# Authentication
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRY=24h

# Media Storage
MEDIA_STORAGE_BUCKET=your_storage_bucket
MEDIA_STORAGE_REGION=your_storage_region
MEDIA_STORAGE_KEY=your_storage_key
MEDIA_STORAGE_SECRET=your_storage_secret

# Push Notifications
EXPO_ACCESS_TOKEN=your_expo_token

# API Keys
BARCODE_API_KEY=your_barcode_api_key
```

### Frontend Environment Variables (.env)
```env
API_URL=your_backend_api_url
MEDIA_STORAGE_URL=your_media_storage_url
```

## Database Setup

### Development
1. SQLite is used for development by default
2. Database schema will be automatically created on first run

### Production (Neon PostgreSQL)
1. Create a Neon account at https://neon.tech
2. Create a new project
3. Get your connection string
4. Set DATABASE_URL in backend .env file
5. Run migrations:
   ```bash
   npm run migrate
   ```

## Deployment Instructions

### Backend Deployment

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/parentpal.git
   cd parentpal/backend
   ```

2. Install dependencies:
   ```bash
   npm install --production
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your production values
   ```

4. Run database migrations:
   ```bash
   npm run migrate
   ```

5. Start the server:
   ```bash
   npm start
   ```

### Frontend Deployment

1. Navigate to frontend directory:
   ```bash
   cd parentpal/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment:
   ```bash
   cp .env.example .env
   # Edit .env with your production values
   ```

4. Build the app:
   ```bash
   # For iOS
   eas build --platform ios
   
   # For Android
   eas build --platform android
   ```

5. Submit to stores:
   ```bash
   # For iOS
   eas submit --platform ios
   
   # For Android
   eas submit --platform android
   ```

## API Documentation

API documentation is available at `/api/docs` when running the server. Key endpoints include:

### Authentication
- POST `/api/auth/register`
- POST `/api/auth/login`

### User Management
- GET `/api/users/profile`
- PUT `/api/users/profile`

### Baby Management
- POST `/api/babies`
- GET `/api/babies/:id`
- PUT `/api/babies/:id`

### Growth Tracking
- POST `/api/growth/:babyId`
- GET `/api/growth/:babyId`

### Sleep Tracking
- POST `/api/sleep/:babyId`
- GET `/api/sleep/:babyId/analysis`

### Milestones
- GET `/api/milestones/list/:ageRange`
- POST `/api/milestones/achievement/:babyId`

### Community
- GET `/api/forum/posts`
- POST `/api/forum/posts`

### Media Management
- POST `/api/media/upload/:albumId`
- GET `/api/media/highlights/:babyId`

### Feedback & Support
- POST `/api/feedback/submit`
- POST `/api/feedback/issues/report`

## Security Considerations

1. Data Protection
   - All sensitive data is encrypted at rest
   - HTTPS required for all API communications
   - JWT tokens expire after 24 hours

2. Media Storage
   - Secure, signed URLs for media access
   - File type validation
   - Size limits enforced

3. User Privacy
   - GDPR compliant data handling
   - Data deletion on account termination
   - Minimal data collection policy

4. API Security
   - Rate limiting implemented
   - Input validation on all endpoints
   - SQL injection protection
   - XSS protection

## Monitoring and Maintenance

1. Set up monitoring:
   ```bash
   # Install monitoring tools
   npm install --save pm2
   
   # Start with PM2
   pm2 start npm --name "parentpal" -- start
   ```

2. Regular maintenance:
   - Database backups daily
   - Log rotation weekly
   - Security updates monthly

## Support

For support inquiries:
- Email: support@parentpal.com
- GitHub Issues: [Create an issue](https://github.com/your-repo/parentpal/issues)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
