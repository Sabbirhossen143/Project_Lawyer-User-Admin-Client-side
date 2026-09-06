# ⚖️ LegalEase — Online Lawyer Hiring Platform

LegalEase is a full-stack online lawyer hiring platform that connects clients with professional lawyers through a modern, secure, and user-friendly web application.

Users can discover lawyers, view detailed profiles, submit hiring requests, make payments, leave reviews, and track their hiring activities. Lawyers can manage their legal profiles and cases, while administrators can manage users, lawyers, transactions, and the overall platform.

---

## 🌐 Live Demo

🔗 https://project-lawyer-user-admin-client-si-eight.vercel.app/

---

## 📌 Project Overview

Finding the right legal professional can often be difficult through traditional offline methods. LegalEase provides a centralized digital platform where users can easily discover legal professionals based on their specialization and experience.

The platform provides dedicated experiences for three types of users:

- 👤 **User / Client**
- ⚖️ **Lawyer**
- 🛡️ **Admin**

Each role has its own dashboard and permissions.

---

## ✨ Key Features

### 👤 User / Client

- User registration and login
- Email & password authentication
- Google authentication
- Browse available lawyers
- Search lawyers
- Filter lawyers by specialization and other criteria
- View detailed lawyer profiles
- Submit lawyer hiring requests
- Make payments through Stripe
- Track hiring/request history
- Leave reviews and ratings
- Comment on hired lawyers
- View notifications
- Responsive user dashboard

---

### ⚖️ Lawyer

- Lawyer registration
- Lawyer dashboard
- Lawyer profile management
- Add/edit legal specialization
- Update experience and consultation fee
- Add professional biography
- Manage profile information
- Publish/unpublish lawyer profile
- View hiring requests
- Manage cases/hiring history
- Track client requests
- Manage professional presence on the platform

---

### 🛡️ Admin

- Admin dashboard
- Manage registered users
- Change user roles
- Manage lawyer profiles
- Publish/unpublish lawyer listings
- Delete lawyer profiles
- Manage hiring requests
- Monitor transactions
- View platform analytics
- Manage system-level settings
- Centralized platform management

---

## 🔐 Authentication & Authorization

LegalEase implements a secure authentication system using Firebase Authentication and JWT-based authorization.

### Authentication

- Firebase Email/Password Authentication
- Google Authentication
- Secure login and registration flow
- JWT token generation
- Protected API requests

### Role-Based Access Control

The platform supports three roles:

```text
User
 ├── Browse Lawyers
 ├── Hire Lawyers
 ├── Make Payments
 ├── Reviews & Comments
 └── Hiring History

Lawyer
 ├── Manage Profile
 ├── Manage Legal Services
 ├── View Requests
 └── Manage Cases

Admin
 ├── Manage Users
 ├── Manage Lawyers
 ├── Manage Requests
 ├── Manage Transactions
 └── Analytics
