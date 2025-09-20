# AI-Powered Sports Talent Ecosystem Backend

This repository contains the backend code for the AI-Powered Sports Talent Ecosystem web application. It provides RESTful APIs and real-time capabilities for user authentication, athlete profile management, video upload and processing, AI job queuing, analytics, gamification, and admin controls.

## Technology Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- AWS S3 for video storage
- RabbitMQ for AI job queuing
- Socket.io for real-time updates
- JWT-based authentication
- Security middlewares (rate limiting, sanitization)
- Modular architecture

## Prerequisites

- Node.js (v14+ recommended)
- MongoDB instance (local or cloud)
- RabbitMQ instance (local or cloud)
- AWS account with S3 bucket and credentials
- Optional: Postman or similar tool for API testing

## Environment Variables

Create a `.env` file in the root directory with the following variables:

