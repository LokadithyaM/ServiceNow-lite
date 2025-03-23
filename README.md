# Now Lite
**This project is currently under development**
**A lightweight, high-performance alternative to ServiceNow for teams.**

## Overview
Now Lite is a scalable and production-ready ticketing system designed to optimize team collaboration and incident management. It integrates in-app documentation, personalized mailing, and real-time updates to offer a seamless user experience. Built with modern web technologies, it aims to outperform existing solutions like ServiceNow in speed and usability.

## Features
- **Incident Management**: Create, update, and track incidents effortlessly.
- **Real-time Messaging**: Chat with team members using WebSockets and Redis Pub/Sub.
- **Personalized Mailing Space**: Filter and prioritize team emails efficiently.
- **Team Updates & Documentation**: Keep track of internal updates within the app.
- **High Performance**: Optimized for speed using Redis caching and SWR for background data fetching.
- **Scalability**: Built with Next.js and deployed on Vercel for seamless scaling.

## Tech Stack
- **Frontend**: Next.js (TypeScript), SWR
- **Backend**: Node.js, Redis, WebSockets
- **Database**: MongoDB
- **Authentication**: Custom cryptographic hashing, Iron Session, Redis for session management
- **Deployment**: Vercel

## Installation
### Prerequisites
Ensure you have the following installed:
- Node.js (latest LTS)
- MongoDB
- Redis

### Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/now-lite.git
   cd now-lite
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables:
   Create a `.env.local` file and configure the following:
   ```env
   MONGODB_URI=your_mongo_connection_string
   REDIS_URL=your_redis_connection_string
   NEXTAUTH_SECRET=your_secret_key
   ```
4. Start the development server:
   ```sh
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

## Usage
- **Admin Signup**: Create an admin account to manage incidents and users.
- **User Signup**: Sign up and join an organization for ticketing and team communication.
- **Create Incidents**: Raise tickets and track their status in real-time.
- **Messaging & Collaboration**: Communicate with team members via the in-app chat system.

## Roadmap
- [ ] Incident Deletion & Updating
- [ ] Complete Messaging System Functionality
- [ ] Advanced User Roles & Permissions
- [ ] Mobile-friendly UI Enhancements

## Contribution
Contributions are welcome! Follow these steps:
1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature XYZ'`
4. Push the branch: `git push origin feature-name`
5. Open a Pull Request.

## License
This project is licensed under the MIT License.

---
_Developed with Next.js, Redis, and a vision for a better ticketing experience._

