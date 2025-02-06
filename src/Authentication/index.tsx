/**
 * Authentication Module Exports
 * This file serves as the main entry point for the authentication module,
 * exporting all necessary components, hooks, services, and types.
 */

// Core Authentication Context & Hook
// Provides global authentication state and methods
export { AuthProvider, useAuth } from './context/AuthContext';

// UI Components
// Modal component for user profile and authentication actions
export { UserModal } from './UserModal';

// Database Service
// Supabase client instance for database operations
export { supabase } from '../Database/services/supabase';

// Type Definitions
// Types for authentication state and actions
export type { AuthState, AuthActions } from './types/auth';