# E-Commerce Mobile Store API

A full-featured Node.js / Express backend RESTful API built for an online mobile device marketplace. Features secure user authentication, product management, order processing, email notifications, Cloudinary image uploads, and Chapa payment integration.

---

## Features

- **Authentication & Authorization:** JWT-based user login/registration, cookie handling, password encryption, and role-based access control (Admin vs User).
- **Mobile Product Management:** Complete CRUD operations for mobile phone listings (with image uploads via Cloudinary).
- **Order Management:** Shopping checkout flow, order tracking, and invoice email delivery.
- **Payment Gateway:** Payment processing integration with **Chapa**.
- **Admin Dashboard API:** Analytics, user management, and platform control endpoints.
- **Messaging System:** Messaging service and user contact inquiry handling.
- **Utility Features:** Input validation, custom email templating, and phone number processing.

---

## Tech Stack

- **Runtime Environment:** [Node.js](https://nodejs.org/)
- **Framework:** [Express.js](https://expressjs.com/)
- **Database:** MongoDB (via Mongoose)
- **File Storage:** [Cloudinary](https://cloudinary.com/) (Multer middleware)
- **Payment Processing:** [Chapa API](https://chapa.co/)
- **Authentication:** JSON Web Tokens (`jsonwebtoken`) & HTTP Cookies

---

## Project Structure

```text
├── package.json
├── package-lock.json
├── server.js               # Application entry point
└── src/
    ├── app.js              # Express app setup & middleware configuration
    ├── configs/            # DB, Chapa, Cloudinary & Email configurations
    ├── controllers/        # Request handlers (Admin, Auth, Message, Mobile, Order)
    ├── middlewares/        # Custom middlewares (Auth, Multer upload)
    ├── models/             # Mongoose schemas (User, Mobile, Order, Message)
    ├── routes/             # Express API routes
    ├── services/           # Business logic layer
    └── utils/              # Helper functions (JWT, Cookies, Email templates, Validation)
```

---

## Environment Variables

Create a .env file in the root directory and configure the following environment variables:

```text
# Server Configuration

PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URL=mogodb_url

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Chapa Payment Integration
CHAPA_SECRET_KEY=CHASECK_TEST-your_chapa_secret_key

# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_app_password

# client and server urls
CLIENT_URL=your_client_url,
SERVER_URL=server_url(http://localhost:5000 -> for development),
```

---

## Getting Started

### Prerequisites

- Node.js (v16.x or higher)
- npm or yarn
- MongoDB instance (Local or MongoDB Atlas)

### Installation

1. Clone the repository:

```Bash
git clone https://github.com/abdu-selam/phone-store.git
cd phone-store
```

2. Install dependencies:

```Bash
npm install
```

3. Start the development server:

```Bash
npm run dev
```

The server will be running at http://localhost:5000.

## API Endpoints Overview

| Route Module | Base Route    | Description |
| ------------ | ------------- | ------------|
| Auth         | /api/auth     | Register, login, logout, profile management |
| Admin        | /api/admin    | Administrative actions and analytics |
| Mobiles      | /api/mobiles  | Browse, search, create, update, and delete mobile listings|
| Orders       | /api/orders   | Place orders, initiate payments via Chapa, view history|
| Messages     | /api/messages | User inquiries and messaging functionality|

## License

This project is licensed under the MIT License.
