# Authentication System

A clean, maintainable authentication system with role-based access control.

## Directory Structure

```
lib/auth/
├── types.ts          # TypeScript interfaces and types
├── permissions.ts    # Role-based permission logic
├── api.ts           # Authentication API functions
├── index.ts         # Re-exports for clean imports
└── README.md        # This file

components/auth/
├── AuthGuard.tsx    # Generic authentication guard component
├── UserProfile.tsx  # User profile display component
├── LoadingSpinner.tsx # Reusable loading spinner
└── index.ts         # Component re-exports

hooks/
├── useAuth.ts       # Main authentication hook
└── usePermissions.ts # Permission checking hook
```

## User Roles

- **user**: Basic user with no admin access
- **editor**: Can access admin panel and manage exercises
- **admin**: Full access including user management

## Usage Examples

### Basic Authentication

```tsx
import { useUser } from "@/app/(payload)/_providers/UserProvider";

function MyComponent() {
  const { user, isLoading, logout } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>Please login</div>;

  return <div>Welcome, {user.email}!</div>;
}
```

### Permission Checking

```tsx
import { usePermissions } from "@/hooks/usePermissions";
import { useUser } from "@/app/(payload)/_providers/UserProvider";

function AdminFeature() {
  const { user } = useUser();
  const permissions = usePermissions(user);

  if (!permissions.canAccessAdmin) {
    return <div>Access denied</div>;
  }

  return <div>Admin content</div>;
}
```

### Route Protection

```tsx
import { AuthGuard } from "@/lib/auth";
import { useUser } from "@/app/(payload)/_providers/UserProvider";

function ProtectedPage() {
  const { user, isLoading, hasAdminAccess } = useUser();

  return (
    <AuthGuard
      user={user}
      isLoading={isLoading}
      hasAccess={hasAdminAccess()}
      accessDeniedMessage="Admin access required"
    >
      <div>Protected content</div>
    </AuthGuard>
  );
}
```

### User Profile Display

```tsx
import { UserProfile } from "@/components/auth";
import { useUser } from "@/app/(payload)/_providers/UserProvider";

function Sidebar() {
  const { user, logout } = useUser();

  return (
    <div>
      {/* Other sidebar content */}
      {user && <UserProfile user={user} onLogout={logout} compact={true} />}
    </div>
  );
}
```

## API Functions

- `fetchCurrentUser()`: Get current logged-in user
- `loginUser(email, password)`: Login with credentials
- `signupUser(email, password)`: Create new account
- `logoutUser()`: Logout current user

## Permission Functions

- `canAccessAdmin(user)`: Check admin panel access
- `canEditExercises(user)`: Check exercise editing permission
- `canDeleteExercises(user)`: Check exercise deletion permission
- `canManageUsers(user)`: Check user management permission
- `canViewAnalytics(user)`: Check analytics viewing permission

## Components

### AuthGuard

Generic authentication and authorization guard that handles:

- Loading states
- Unauthenticated users (redirect to login)
- Unauthorized users (access denied message)
- Successful authentication (render children)

### UserProfile

Displays user information with logout functionality. Supports:

- Compact mode for sidebars
- Full mode for detailed profiles
- Role and status display

### LoadingSpinner

Reusable loading spinner with size variants (sm, md, lg).

## Hooks

### useAuth

Main authentication hook providing:

- Current user state
- Loading states
- Auth state management
- Login/logout functions
- User refetching

### usePermissions

Permission checking hook that returns:

- Boolean flags for each permission
- Generic permission checker function
- Memoized results for performance

## Best Practices

1. **Use the hooks**: Always use `useUser()` and `usePermissions()` instead of direct API calls
2. **Guard routes**: Wrap protected components with `AuthGuard`
3. **Check permissions**: Use permission functions before rendering sensitive UI
4. **Handle loading**: Always handle loading states in your components
5. **Clean imports**: Use the index files for cleaner import statements

## Extending the System

To add new roles or permissions:

1. Update the `UserRole` type in `types.ts`
2. Add the new role to `PERMISSIONS` in `permissions.ts`
3. Create helper functions for the new permissions
4. Update the server-side Users collection to match
