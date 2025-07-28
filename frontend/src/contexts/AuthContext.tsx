import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  medicalHistory?: string;
  emergencyContact?: string;
  bloodType?: string;
  allergies?: string;
  currentMedications?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: SignupData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
  isAuthenticated: boolean;
  loading: boolean;
}

interface SignupData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const userData = localStorage.getItem("bloodai_user");
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        localStorage.removeItem("bloodai_user");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Save user to localStorage whenever user state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("bloodai_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("bloodai_user");
    }
  }, [user]);

  const generateUserId = () => {
    return (
      "user_" +
      Math.random().toString(36).substr(2, 9) +
      Date.now().toString(36)
    );
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);

      // Get all users from localStorage
      const usersData = localStorage.getItem("bloodai_users");
      const users: User[] = usersData ? JSON.parse(usersData) : [];

      // Find user by email
      const existingUser = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase(),
      );

      if (!existingUser) {
        return false; // User not found
      }

      // Get stored password
      const passwordsData = localStorage.getItem("bloodai_passwords");
      const passwords: Record<string, string> = passwordsData
        ? JSON.parse(passwordsData)
        : {};

      if (passwords[existingUser.id] !== password) {
        return false; // Invalid password
      }

      setUser(existingUser);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData: SignupData): Promise<boolean> => {
    try {
      setLoading(true);

      // Get existing users
      const usersData = localStorage.getItem("bloodai_users");
      const users: User[] = usersData ? JSON.parse(usersData) : [];

      // Check if user already exists
      const existingUser = users.find(
        (u) => u.email.toLowerCase() === userData.email.toLowerCase(),
      );
      if (existingUser) {
        return false; // User already exists
      }

      // Create new user
      const newUser: User = {
        id: generateUserId(),
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        dateOfBirth: userData.dateOfBirth,
        gender: userData.gender,
        createdAt: new Date().toISOString(),
      };

      // Save user
      users.push(newUser);
      localStorage.setItem("bloodai_users", JSON.stringify(users));

      // Save password separately for security
      const passwordsData = localStorage.getItem("bloodai_passwords");
      const passwords: Record<string, string> = passwordsData
        ? JSON.parse(passwordsData)
        : {};
      passwords[newUser.id] = userData.password;
      localStorage.setItem("bloodai_passwords", JSON.stringify(passwords));

      setUser(newUser);
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    try {
      if (!user) return false;

      const updatedUser = { ...user, ...userData };

      // Update in users array
      const usersData = localStorage.getItem("bloodai_users");
      const users: User[] = usersData ? JSON.parse(usersData) : [];

      const userIndex = users.findIndex((u) => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        localStorage.setItem("bloodai_users", JSON.stringify(users));
      }

      setUser(updatedUser);
      return true;
    } catch (error) {
      console.error("Update profile error:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
