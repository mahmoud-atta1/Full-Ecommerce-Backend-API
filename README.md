# 🚀 E-Commerce Backend API

A production-ready **Node.js & Express.js E‑Commerce Backend** built with scalable architecture, security best practices, and advanced API features. This project focuses on clean backend structure, performance, and real-world commerce logic such as authentication, orders, payments, and image processing.

---

# 📌 Overview

This project is a fully-featured RESTful API for an E‑Commerce system. It demonstrates advanced backend engineering concepts including:

* Clean Architecture using Service & Factory Patterns
* Secure Authentication with Access & Refresh Tokens
* Stripe Payment Integration with Webhooks
* Advanced API Filtering, Sorting & Pagination
* Image Upload & Processing Pipeline
* Role-Based Authorization System
* Secure Express Middleware Stack

---

# 🧠 Tech Stack

## Backend

* Node.js
* Express.js 5
* MongoDB & Mongoose

## Security

* JWT Authentication (Access + Refresh Tokens)
* Helmet
* HPP
* XSS Clean
* Mongo Sanitize
* Rate Limiting

## Payments & Emails

* Stripe Checkout + Webhook
* Nodemailer (Gmail SMTP)

## File Processing

* Multer (Memory Storage)
* Sharp Image Optimization

---

# ⚙️ Features

## 🔐 Authentication System

* Signup & Login
* Refresh Token Rotation
* Forgot & Reset Password via Email
* Logout & Token Revocation
* Password Hashing using bcrypt

## 👤 User System

* Profile Management
* Change Password
* Soft Delete Account
* Wishlist System
* Address Management

## 🛍️ Product Management

* Categories & Subcategories
* Brands
* Image Upload with Optimization
* Slug Generation
* Search by Keyword

## 🛒 Cart & Coupons

* Add / Remove Products
* Update Quantity
* Apply Discount Coupons

## 💳 Orders & Payments

* Cash Orders
* Stripe Checkout Session
* Webhook Payment Handling
* Auto Product Quantity Updates

## ⭐ Reviews System

* One Review Per User Per Product
* Aggregated Ratings Calculation
* Ownership Validation

## 🧩 Advanced API Features

* Filtering
* Pagination
* Sorting
* Field Limiting
* Search Queries

---

# 🏗️ Project Structure

```
src/
 ├── config/
 ├── middlewares/
 ├── models/
 ├── routes/
 ├── services/
 ├── utils/
 ├── validators/
```

---

# 🔒 Security Highlights

* Rate limiting applied to auth routes
* Input sanitization against NoSQL Injection
* XSS protection
* Secure JWT workflow
* Environment-based error handling

---

# 🧪 API Endpoints

Base URL:

```
/api/v1
```

Main Routes:

* /auth
* /users
* /products
* /categories
* /subcategories
* /brands
* /reviews
* /wishlist
* /cart
* /coupons
* /orders
* /addresses

---

# 🚀 Getting Started

## 1️⃣ Clone the repository

```
git clone <YOUR_REPO_URL>
```

## 2️⃣ Install dependencies

```
npm install
```

## 3️⃣ Create .env file

Add your environment variables:

```
PORT=
DB_URI=
JWT_SECRET=
JWT_REFRESH_SECRET=
STRIPE_SECRET_KEY=
EMAIL_USER=
GOOGLE_APP_PASSWORD=
```

## 4️⃣ Run Development Server

```
npm run start:dev
```

---

# 🖼️ Image Upload Flow

* Images uploaded using Multer Memory Storage
* Processed using Sharp
* Stored locally in uploads directory
* Returned as full URL using BASE_URL middleware logic

---

# 💳 Stripe Integration

* Checkout Session Creation
* Secure Webhook Handling
* Automatic Order Creation after Payment

---

# 📈 Architecture Highlights

* Generic CRUD Factory Pattern
* Service Layer Separation
* Nested Routes Support
* Aggregation Pipelines for Ratings
* Token Rotation Security Model

---

# 👨‍💻 Author

Backend Developer passionate about building scalable, secure APIs and clean architecture.

---

# ⭐ If you like this project

Give it a star on GitHub ⭐ and feel free to contribute!
