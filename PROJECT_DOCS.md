# Mzumbe Academic Portal - Project Documentation

## 1. Project Overview
The **Mzumbe Academic Portal** is a comprehensive web application designed to manage academic tasks and information for students, staff, and administrators. It facilitates various academic processes including Project Supervision, MOU (Memorandum of Understanding) management, User management, and Departmental organization.

The application is built using **React** with **Vite**, styled with **Tailwind CSS**, and powered by **Firebase** for backend services (Authentication, Firestore Database, Storage, and Cloud Messaging).

---

## 2. Technology Stack

### Frontend Core
- **React 19**: UI Library.
- **Vite**: Build tool and development server.
- **Redux Toolkit**: State management (User session, UI state).
- **React Router DOM**: Client-side routing.

### Styling & UI
- **Tailwind CSS 4**: Utility-first CSS framework.
- **Headless UI / Radix UI**: Accessible UI primitives (Dialogs, Checkboxes, Slots).
- **Framer Motion**: Animations and transitions.
- **Recharts / ApexCharts**: Data visualization.
- **React Icons / Lucide React / Bootstrap Icons**: Icon sets.
- **React Toastify**: Notifications.

### Backend & Services (Firebase)
- **Firebase Authentication**: User identity and session management.
- **Cloud Firestore**: NoSQL realtime database.
- **Firebase Storage**: File storage for profile pictures and documents.
- **Firebase Cloud Messaging (FCM)**: Push notifications.

### Other Utilities
- **Tiptap**: Rich text editor.
- **Flatpickr**: Date picker.
- **Redux Persist**: Persists Redux state across reloads.

---

## 3. Installation and Setup

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Steps
1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd blandy_project
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Ensure you have the Firebase configuration set up in `src/configs/firebase.js`. You may need to create a `.env` file if the project uses environment variables for Firebase keys.

4. **Run the Development Server:**
   ```bash
   npm run start
   ```
   The app usually runs at `http://localhost:5173`.

5. **Build for Production:**
   ```bash
   npm run build
   ```

---

## 4. Architecture & Project Structure

The project follows a standard React folder structure inside `src/`:

```
src/
├── assets/          # Static assets (images, global styles)
├── components/      # Reusable UI components
├── configs/         # Configuration files (Firebase, customized tools)
├── contexts/        # React Contexts (AuthContext, DataContext)
├── hooks/           # Custom React hooks (useTitle, etc.)
├── layout/          # Layout components (Sidenav, Header - inferred)
├── lib/             # Utility libraries and helper functions
├── pages/           # Application pages organized by module
│   ├── admin/       # Admin-specific pages (Dashboard, Users, Depts)
│   ├── student/     # Student pages (Dashboard, Projects)
│   ├── supervisor/  # Staff/Supervisor pages (Supervision, Assigned Students)
│   ├── mou/         # MOU Management pages
│   ├── coordinator/ # Panel management pages
│   └── ...          # Shared pages (Login, Profile, Invoice)
├── routes/          # Routing configuration
│   ├── AllRoutes.jsx      # Main route definitions
│   └── ProtectedRoutes.jsx # Route guard component
├── services/        # API service functions
├── store/           # Redux store setup
│   ├── userSlice.js    # User authentication state
│   ├── sidenavSlice.js # Sidenav toggle state
│   └── store.js        # Store configuration
├── App.jsx          # Main application component
└── main.jsx         # Entry point
```

---

## 5. Key Features & Modules

### Authentication & Authorization
- **Login/Register:** Users can sign up and log in using Email/Password or Google Sign-In.
- **Protected Routes:** `ProtectedRoutes.jsx` ensures that only authorized roles (Admin, Staff, Student) can access specific pages.
- **Access Control:** User roles determine access:
    - `admin`: Full system access, user management, department management.
    - `staff`: Supervision, assigned students, panel management.
    - `student`: Project submission, dashboard, MOU view.

### Dashboard Modules
- **Admin Dashboard:** Overview of system stats, user management links.
- **Staff Dashboard:** Metrics on supervised students, pending reviews.
- **Student Dashboard:** Project status, quick links.

### MOU Management (`/mou`)
- Complete workflow for creating, editing, signing, and reviewing Memorandums of Understanding.
- Roles can manage reviewers and track MOU status.

### Project & Supervision
- **Students** can submit and track projects.
- **Staff** can view assigned students and manage supervision progress.
- **Coordinators** leverage Panel Management to organize defenses/reviews.

### User Management
- Admins can register new Administrators.
- Profile management allows users to update personal details.
- Invoice generation capability.

---

## 6. Data Layer (DataContext)

The application uses a central **DataContext** (`src/contexts/DataContext.jsx`) to handle interactions with Firebase Firestore.

**Key Methods:**
- `fetchData({ path, filters, sort, ... })`: Fetches a list of documents with optional filtering and sorting.
- `fetchSingleDoc(path, id)`: Fetches a single document by ID.
- `fetchSnapshotData(...)`: Sets up a real-time listener for a collection.
- `addData(path, data, id?)`: Adds or overwrites a document.
- `updateData(path, id, updates)`: Updates specific fields of a document.
- `deleteData(path, id)`: Removes a document.
- `uploadFile(file, path)`: Uploads a file to Firebase Storage and returns the URL.

---

## 7. State Management (Redux)

The app uses **Redux Toolkit** for managing global client state, configured in `src/store/store.js`.

- **User Slice (`userSlice.js`):** Stores the current user's UID, email, display name, and authentication token.
- **Sidenav Slice (`sidenavSlice.js`):** Manages the open/close state of the sidebar navigation.

State is persisted using `redux-persist` to survive page reloads.

---

## 8. Development Guidelines

- **Adding a New Page:**
    1. Create the component in `src/pages/`.
    2. Import it in `src/pages/index.js` (or respective module index).
    3. Add a Route in `src/routes/AllRoutes.jsx`.
    4. Wrap with `ProtectedRoutes` if authentication/role check is needed.

- **Adding a New Feature:**
    - Use `DataContext` for database operations.
    - Use `useAuth` or Redux selector to get current user info.
    - Ensure styling follows the Tailwind CSS config.

---

## 9. Contacts
- **Maintainer:** [Normankita]
- **Repository:** Normankita/blandyProject 
