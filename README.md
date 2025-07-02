# 📘 Inventory Management System (IMS) – Angular Frontend

This is the **Angular Frontend** of the Inventory Management System (IMS), a multi-tenant inventory platform that integrates seamlessly with the backend built in Django. The UI is designed for scalability, dynamic tenant support, and enterprise-grade user experience.

---

## ⚙️ Tech Stack

- **Angular** 17+
- **RxJS** for reactive programming
- **NgRx** for state management
- **Angular Material** for UI components
- **ngx-toastr** for user notifications
- **JWT Auth** integration
- **Multi-Tenant Routing** based on subdomain or tenant context
- **SCSS** for theming and styling

---

## 🚀 Features

### 🌐 Multi-Tenant Ready
- Dynamically adapts UI based on authenticated tenant
- Subdomain-based tenant routing or tenant code handling
- Supports **tenant-aware access control**

### 🔐 Authentication & Authorization
- JWT-based auth integrated with backend
- Role-based access control for dynamic UI visibility
- Guards and interceptors implemented for route protection and secure API communication

### 🧾 Core Modules

| Module           | Description                                         |
|------------------|-----------------------------------------------------|
| 👤 User Mgmt     | List, create, and manage users within a tenant      |
| 🔐 Auth          | Login, logout, and session management               |
| 🧩 Roles & Permissions | Control access at role and permission level      |
| 🏷 Categories     | Manage product categories                           |
| 📦 Products       | CRUD operations on tenant-specific products         |
| 📥 Stock          | Handle stock IN/OUT flows with validations          |
| 📊 Reports        | Visualize and download stock and usage reports      |
| 🧾 Audit Logs     | View all user actions with timestamp                |
| 📬 Notifications  | Show alerts and messages across the app             |
| 🧪 Health Check   | Display system and API status                       |

---

## 🧰 Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Angular CLI](https://angular.io/cli) 17+
- [Git](https://git-scm.com/) 2.25+
- Access to running IMS backend via `localhost` or domain

---

## ⚙️ Setup Instructions

```bash
# 1️⃣ Clone the repository
git clone https://github.com/<your-org>/ims-angular-frontend.git
cd ims-angular-frontend

# 2️⃣ Install dependencies
npm install

# 3️⃣ Set environment variables
cp src/environments/environment.example.ts src/environments/environment.ts
# Edit environment.ts to match your backend URL and tenant handling

# 4️⃣ Run the development server
ng serve --open
