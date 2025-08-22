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

      const response = await fetch('http://localhost:5001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setUser({
          id: data.user.id.toString(),
          email: data.user.email,
          name: data.user.name,
          phone: data.user.phone,
          dateOfBirth: data.user.date_of_birth,
          gender: data.user.gender,
          createdAt: data.user.created_at
        });
        return true;
      } else {
        console.error('Login failed:', data.error);
        return false;
      }
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

      const response = await fetch('http://localhost:5001/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.success) {
        setUser({
          id: data.user.id.toString(),
          email: data.user.email,
          name: data.user.name,
          phone: data.user.phone,
          dateOfBirth: data.user.date_of_birth,
          gender: data.user.gender,
          createdAt: data.user.created_at
        });
        return true;
      } else {
        console.error('Signup failed:', data.error);
        return false;
      }
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
