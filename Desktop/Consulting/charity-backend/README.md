# Charity Donation Backend

Secure backend for a charity donation website.

## Features
- User registration and login
- Password hashing (bcrypt)
- JWT authentication
- Login attempt logging
- Account lock protection

## Setup
1. Install Node.js
2. Create PostgreSQL database
3. Run database.sql
4. Install dependencies:
   npm install
5. Start server:
   npm run dev

## API
POST /api/auth/register  
POST /api/auth/login  

## Security
- Encrypted passwords
- Token-based auth
- Login tracking