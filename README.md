# 🏋️ Combat Fitness — Gym Management & E-Commerce Web System

A full-stack web application built for a gym, featuring an e-commerce store, membership management, real-time gym occupancy tracking, and a complete admin panel.

---

## 📖 Description

Combat Fitness is a web-based gym management system that allows members to purchase products, track orders, manage their membership, and communicate with the admin. The admin side provides full control over products, orders, users, FAQs, and live gym occupancy via a barcode scanner system.

---

## 🚀 Features

### 👤 User Side

* **User Registration & Login** — All users register as normal users by default. Additional profile information can be completed later through the user dashboard.
* **Membership Management** — Users can view and activate gym memberships.
* **Store & Shopping Cart** — Browse products, add to cart, and proceed to checkout.
* **Checkout with Member Lookup** — Enter a member ID at checkout to auto-fill member details.
* **Order Tracking** — Live order status visible from the user dashboard.
* **Order History** — Full history of past orders.
* **Message Admin** — Users can submit questions or issues which are saved to the database.
* **FAQ Page** — Admin-answered questions are displayed here for all users to see.

### 🔐 Admin Panel

> Access is role-based. Users must first register normally, then have their `role` field manually changed to `admin` in the database before they can access the admin panel through the main login page.

* **Admin Dashboard** — Summary view showing:

  * Total products, orders, members, and FAQs
  * Top 5 selling products
  * Recent orders
  * Live gym occupancy count
* **Product Management** — Add, view, and delete products.
* **Order Management** — Edit and delete orders.
* **FAQ Management** — View all user-submitted questions and choose which ones to answer; answered FAQs are published to the user-facing FAQ page.
* **User Management** — Add, edit, and delete user accounts.

### 📡 Live Gym Occupancy Tracker

* Barcode scanner integrated into the admin dashboard.
* Scanning a barcode increments the live people count.
* Count automatically decrements after **2 hours**.
* Real-time occupancy visible to admin.

---

## 🧰 Technologies Used

| Layer        | Technology                    |
| ------------ | ----------------------------- |
| Frontend     | HTML5, CSS3, JavaScript, AJAX |
| Backend      | PHP                           |
| Database     | MySQL                         |
| Local Server | WAMP Server                   |

---

## 🗂️ Project Structure

```
Combat-Fitness/
├── Admin Panel/        # Admin dashboard, product, order, user & FAQ management
├── CSS/                # Stylesheets for all pages
├── HTML/               # Frontend pages (store, login, dashboard, checkout, etc.)
├── Javascript/         # Client-side scripts and AJAX calls
├── PHP/                # Backend logic (auth, session, profile, membership)
├── api/                # API endpoints for data fetching
├── Images/             # Product and UI images
└── Files.txt           # Project file reference
```

---

## ⚙️ How to Run Locally

1. Install WAMP Server.
2. Clone this repository into your `www` folder:

   ```
   C:/wamp64/www/Combat Fitness/
   ```
3. Import the database:

   * Open phpMyAdmin via WAMP.
   * Create a new database (e.g. `combat_fitness`).
   * Import the provided `.sql` file.
4. Configure database connection in `PHP/database.php`.
5. Start WAMP and visit:

   ```
   http://localhost/Combat Fitness/HTML/Homepage.html
   ```

---

## 🔑 Admin Access

1. Register an account through the normal user registration page.
2. In the database, change the user's `role` column from `user` to `admin`.
3. Log in using the main login page.
4. The system will automatically detect the user's role and redirect admin users to the admin panel.

Only accounts with `role = admin` can access admin features.

---

## 👨‍💻 Built By

**Ashan Shamika Rajapaksha**
Cybersecurity Student @ SLIIT | University of Bedfordshire
🔗 GitHub: https://github.com/ashanrajapaksha72-hub

---

> *First year university project — built with HTML, CSS, JavaScript, PHP & MySQL*
