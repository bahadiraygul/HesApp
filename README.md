# ExpenseSplitter - HesApp

ExpenseSplitter (HesApp) is a full-stack web application that helps you manage and split shared expenses with friends, roommates, or teams — easily and fairly. Track group expenses, manage members, and calculate balances with automatic debt settlement recommendations.

## Features

### Core Functionality
- **User Authentication**: Secure JWT-based authentication with user registration and login
- **Group Management**: Create and manage expense groups with multiple members
- **Expense Tracking**: Add, edit, and delete expenses with flexible splitting options
- **Smart Balance Calculation**: Automatic balance tracking and simplified debt settlement
- **Member Roles**: Admin and member roles with appropriate permissions
- **Profile Management**: View and update user profile information

### Expense Splitting Modes
- **Equal Split**: Divide expenses equally among selected members
- **Custom Amount**: Specify exact amounts for each person
- **Percentage Split**: Distribute expenses by percentage

### Dashboard Features
- Overview statistics (groups, monthly expenses, net balance)
- Recent expenses feed
- Group-wise expense filtering
- Search and filter capabilities

## Tech Stack

### Backend
- **Framework**: NestJS (TypeScript)
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT with Passport
- **Validation**: class-validator
- **Documentation**: Swagger/OpenAPI
- **Password Hashing**: bcrypt

### Frontend
- **Framework**: Next.js 15 (React, TypeScript)
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui (Radix UI primitives)
- **State Management**: React Query (@tanstack/react-query)
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Notifications**: Sonner (toast notifications)
- **Date Handling**: date-fns with Turkish locale

## Project Structure

```
HesApp-1/
├── expense-splitter-backend/     # NestJS backend
│   ├── src/
│   │   ├── auth/                 # Authentication module
│   │   ├── users/                # User management
│   │   ├── groups/               # Group management
│   │   ├── expenses/             # Expense tracking
│   │   └── main.ts              # Application entry point
│   ├── .env                      # Environment variables (not tracked)
│   └── package.json
│
└── expense-splitter-frontend/    # Next.js frontend
    ├── src/
    │   ├── app/                  # Next.js app directory
    │   │   ├── (auth)/          # Authentication pages
    │   │   └── (dashboard)/     # Protected dashboard pages
    │   ├── components/           # React components
    │   │   ├── layout/          # Layout components
    │   │   ├── groups/          # Group-related components
    │   │   ├── expenses/        # Expense components
    │   │   └── ui/              # UI primitives
    │   ├── contexts/            # React contexts
    │   ├── lib/                 # Utilities and helpers
    │   ├── services/            # API services
    │   └── types/               # TypeScript type definitions
    ├── .env.local               # Environment variables (not tracked)
    └── package.json
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL (v14 or higher)

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd expense-splitter-backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create PostgreSQL database**:
   ```sql
   CREATE DATABASE expense_splitter;
   ```

4. **Configure environment variables**:
   Create a `.env` file in the backend directory:
   ```env
   # Database Configuration
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USERNAME=postgres
   DATABASE_PASSWORD=your_password
   DATABASE_NAME=expense_splitter

   # JWT Authentication
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d

   # Application
   PORT=3001
   NODE_ENV=development

   # CORS (Frontend URL)
   FRONTEND_URL=http://localhost:3000
   ```

5. **Run database migrations** (TypeORM will auto-sync in development):
   ```bash
   npm run start:dev
   ```

6. **Start the development server**:
   ```bash
   npm run start:dev
   ```

   The backend will be available at `http://localhost:3001`
   Swagger API documentation: `http://localhost:3001/api`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd expense-splitter-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env.local` file in the frontend directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:3000`

5. **Build for production**:
   ```bash
   npm run build
   npm start
   ```

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login with email/username and password
- `GET /auth/profile` - Get current user profile (protected)

### Users
- `GET /users/me` - Get current user profile
- `PATCH /users/me` - Update current user profile
- `GET /users/search?email={email}` - Search user by email
- `GET /users/:id` - Get user by ID

### Groups
- `GET /groups` - Get all user's groups
- `POST /groups` - Create a new group
- `GET /groups/:id` - Get group details
- `PATCH /groups/:id` - Update group (admin only)
- `DELETE /groups/:id` - Delete group (creator only)
- `POST /groups/:id/members` - Add member to group (admin only)
- `DELETE /groups/:groupId/members/:userId` - Remove member (admin or self)
- `PATCH /groups/:groupId/members/:userId/role` - Update member role (admin only)

### Expenses
- `GET /expenses` - Get all user's expenses (optional `groupId` query param)
- `POST /expenses` - Create a new expense
- `GET /expenses/:id` - Get expense details
- `PATCH /expenses/:id` - Update expense (payer only)
- `DELETE /expenses/:id` - Delete expense (payer only)
- `GET /expenses/groups/:groupId/balance` - Get group balance and settlements

## User Guide

### Creating an Account
1. Navigate to the registration page
2. Enter your email, username, password, first name, and last name
3. Click "Kayıt Ol" to create your account
4. You'll be automatically logged in

### Creating a Group
1. Go to the "Gruplar" (Groups) page
2. Click "Yeni Grup" (New Group)
3. Enter group name, description (optional), and select currency
4. Click "Grup Oluştur"

### Adding Members to a Group
1. Open the group detail page
2. Go to the "Üyeler" (Members) tab
3. Click "Üye Ekle" (Add Member)
4. Search for users by email
5. Select the user and assign a role (Admin or Member)

### Adding an Expense
1. Open the group or go to group's "Masraflar" (Expenses) tab
2. Click "Masraf Ekle" (Add Expense)
3. Fill in expense details:
   - Description
   - Amount
   - Category (optional)
   - Date
   - Who paid
4. Select splitting mode (Equal, Custom, or Percentage)
5. Choose which members to split with
6. Click "Masraf Ekle"

### Editing/Deleting an Expense
- Only the person who paid can edit or delete an expense
- Click the edit (pencil) or delete (trash) icon on an expense
- Confirm the action

### Viewing Balance
1. Go to the "Bakiye" (Balance) page
2. See your overall balance across all groups
3. Click on a group tab to see detailed balance and settlement recommendations

### Deleting a Group
- Only the group creator can delete a group
- Go to group detail page
- Click the "Sil" (Delete) button in the header
- Confirm deletion (this will also delete all expenses)

## Development

### Backend Commands
```bash
# Development
npm run start:dev

# Production build
npm run build
npm run start:prod

# Run tests
npm run test

# Lint
npm run lint
```

### Frontend Commands
```bash
# Development
npm run dev

# Production build
npm run build
npm start

# Lint
npm run lint

# Type check
npm run type-check
```

## Features Overview

### Completed Features
- ✅ User authentication and authorization
- ✅ Group creation and management
- ✅ Member management with roles
- ✅ Expense creation with flexible splitting
- ✅ Edit and delete expenses
- ✅ Balance calculation and debt settlement
- ✅ Dashboard with statistics
- ✅ Profile management
- ✅ Search and filter functionality
- ✅ Responsive design
- ✅ Toast notifications
- ✅ Form validation
- ✅ Turkish localization

### Potential Future Enhancements
- [ ] Email notifications
- [ ] Expense categories management
- [ ] Export data to CSV/PDF
- [ ] Multiple currency support with conversion
- [ ] Recurring expenses
- [ ] Expense attachments/receipts
- [ ] Payment tracking and reminders
- [ ] Activity feed/history
- [ ] Dark mode
- [ ] Mobile app (React Native)

## Security Considerations

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Protected routes with guards
- Input validation on both frontend and backend
- CORS configuration
- Environment variables for sensitive data
- SQL injection prevention through TypeORM

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Support

For issues and questions, please create an issue in the GitHub repository.

---

**Built with ❤️ using NestJS, Next.js, and TypeScript**
