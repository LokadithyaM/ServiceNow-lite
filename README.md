
# This project is currently under development

# Now Lite
**A lightweight, high-performance ticketing and communication system for teams.**

## About Awake

Awake is a minimalistic goal-tracking platform designed to enhance productivity with AI-driven insights and seamless communication. It features real-time goal tracking, personalized analytics, and a WhatsApp-like messaging system for mentorship and collaboration.

for guide through please go through the below link
[Product Demo](https://www.youtube.com/watch?v=pqpSk4MElFo)

- use gmail: alexander.m@example.com
- passkey : humble
- [Live Application](https://servicenowlite-git-main-lokadithyams-projects.vercel.app/home)


## Overview
Now Lite is a scalable and production-ready ticketing system designed to enhance team collaboration and incident management. It seamlessly integrates in-app documentation, personalized mailing, and real-time updates, ensuring a smooth and efficient user experience. Built with cutting-edge web technologies, Now Lite aims to deliver a powerful yet lightweight solution for modern teams.

## Features
- **Incident Management**: Effortlessly create, update, and track incidents.
- **Real-time Messaging**: Communicate with team members instantly using WebSockets and Redis Pub/Sub.
- **Personalized Mailing Space**: Filter, prioritize, and manage team emails efficiently.
- **Team Updates & Documentation**: Maintain a centralized record of team activities and internal updates.
- **Optimized Performance**: Uses Redis caching and SWR for background data fetching to ensure fast operations.
- **Scalability**: Developed with Next.js and deployed on Vercel for seamless scaling and reliability.

## Tech Stack
- **Framework**: Next.js (TypeScript)
- **Session Management**: Redis
- **Dynamic Data Fetching**: SWR (15-second polling)
- **Database**: MongoDB
- **Authentication**: Custom-built authentication system
- **Deployment**: Vercel

## Installation
### Prerequisites
Ensure you have the following installed:
- Node.js (Latest LTS version)
- MongoDB
- Redis

### Setup Instructions
1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-repo/now-lite.git
   cd now-lite
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Configure environment variables:**
   Create a `.env.local` file and add the following:
   ```env
   MONGODB_URI=your_mongo_connection_string
   REDIS_URL=your_redis_connection_string
   NEXTAUTH_SECRET=your_secret_key
   ```
4. **Start the development server:**
   ```sh
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

## Usage
- **Admin Signup**: Register an admin account to manage incidents and users.
- **User Signup**: Join an organization to participate in ticketing and team communication.
- **Incident Management**: Create, track, and manage support tickets in real-time.
- **Messaging & Collaboration**: Communicate efficiently with team members via the in-app chat system.

## Roadmap
- [ ] Integrate realtime updates (notifcation system)
- [ ] Implement advanced user roles and permissions
- [ ] Enhance UI for a mobile-friendly experience

## Contribution Guidelines
Contributions are welcome! To get started:
1. **Fork the repository.**
2. **Create a new branch:**
   ```sh
   git checkout -b feature-name
   ```
3. **Make your changes and commit:**
   ```sh
   git commit -m 'Add feature XYZ'
   ```
4. **Push your branch:**
   ```sh
   git push origin feature-name
   ```
5. **Open a Pull Request for review.**

---
Now Lite is designed to simplify team workflows with a lightweight yet powerful ticketing and communication system. Join us in making incident management smarter and more efficient!


