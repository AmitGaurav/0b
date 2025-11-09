# Serenity - Modular React Application

A scalable and modular React application built with TypeScript, featuring authentication, user management, and a modern UI design system.

## 🚀 Features

### Core Features
- **Modern React Stack**: Built with React 18, TypeScript, and React Router v6
- **Authentication System**: Complete login/register flow with JWT token management
- **User Management**: User CRUD operations and role-based access
- **Responsive Design**: Mobile-first approach with styled-components
- **State Management**: Context API with useReducer for predictable state updates
- **Form Handling**: React Hook Form with Yup validation
- **API Integration**: Axios-based HTTP client with interceptors
- **UI Components**: Modular component library with consistent theming

### Architecture Highlights
- **Modular Structure**: Well-organized folder structure for scalability
- **Type Safety**: Full TypeScript implementation
- **Error Handling**: Comprehensive error boundaries and API error handling
- **Loading States**: Loading spinners and skeleton screens
- **Toast Notifications**: User feedback system
- **Theme System**: Consistent design tokens and theming

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Common components (LoadingSpinner, etc.)
│   ├── layout/         # Layout components (Header, Sidebar)
│   └── routing/        # Route protection components
├── contexts/           # React contexts
├── hooks/              # Custom hooks
├── layouts/            # Page layouts
├── pages/              # Page components
│   ├── auth/          # Authentication pages
│   ├── dashboard/     # Dashboard page
│   ├── profile/       # Profile page
│   └── users/         # User management pages
├── services/           # API services
│   └── api/           # API endpoints and client
├── styles/             # Global styles and theme
└── types/              # TypeScript type definitions
```

## 🛠️ Tech Stack

### Core Dependencies
- **React** - UI library
- **TypeScript** - Type safety
- **React Router DOM** - Routing
- **Styled Components** - CSS-in-JS styling
- **Axios** - HTTP client
- **React Query** - Server state management
- **React Hook Form** - Form handling
- **Yup** - Schema validation
- **React Toastify** - Notifications
- **React Icons** - Icon library
- **js-cookie** - Cookie management

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_API_BASE_URL=http://localhost:3001/api
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production
```bash
npm run build
```

## 📱 Pages & Features

### Authentication
- **Login Page** (`/auth/login`)
  - Email/password authentication
  - Form validation
  - Remember me functionality
  - Password visibility toggle

- **Register Page** (`/auth/register`)
  - User registration form
  - Strong password validation
  - Confirm password matching
  - Auto-login after registration

### Dashboard
- **Dashboard** (`/dashboard`)
  - Welcome message with user's name
  - Statistics cards (Users, Sessions, Growth, Revenue)
  - Analytics chart placeholder
  - Recent activity feed
  - Responsive grid layout

### User Management
- **Users Page** (`/users`)
  - User listing (placeholder)
  - Search and filtering capabilities
  - CRUD operations
  - Role management
  - Bulk operations
  - Import/export functionality

### Profile
- **Profile Page** (`/profile`)
  - User profile display
  - Personal information section
  - Account information section
  - Edit profile functionality
  - Avatar display with initials

## 🔐 Authentication System

### Features
- JWT token-based authentication
- Automatic token refresh
- Secure cookie storage
- Protected routes
- Auth context for global state management

### API Integration
The application is designed to work with a REST API backend with the following endpoints:

```
POST /api/auth/login          - User login
POST /api/auth/register       - User registration
GET  /api/auth/profile        - Get current user
POST /api/auth/logout         - User logout
POST /api/auth/refresh        - Refresh token
PUT  /api/auth/profile        - Update profile
PUT  /api/auth/change-password - Change password
POST /api/auth/forgot-password - Forgot password
POST /api/auth/reset-password  - Reset password

GET  /api/users              - Get all users
GET  /api/users/:id          - Get user by ID
POST /api/users              - Create user
PUT  /api/users/:id          - Update user
DELETE /api/users/:id        - Delete user
```

## 🎨 Design System

### Theme
- **Colors**: Primary, secondary, semantic colors (success, warning, error, info)
- **Typography**: Font families, sizes, weights, line heights
- **Spacing**: Consistent spacing scale
- **Border Radius**: Consistent border radius scale
- **Shadows**: Box shadow scale
- **Breakpoints**: Responsive breakpoints

### Components
All components follow consistent design patterns:
- Proper TypeScript interfaces
- Styled-components for styling
- Theme integration
- Responsive design
- Accessibility considerations

## 🔧 Development

### Scripts
- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

### Code Structure Guidelines
- Use TypeScript for all components
- Follow consistent naming conventions
- Implement proper error handling
- Add loading states for async operations
- Use the theme system for consistent styling
- Write reusable components
- Implement proper form validation

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Styled Components for the styling solution
- React Hook Form for form handling
- All other open source contributors

---

Built with ❤️ for scalable React applications.
# serenity-ui
