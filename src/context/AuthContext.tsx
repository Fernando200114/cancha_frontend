import axios from "axios";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface User {
  username?: string;
  nombre: string;
  correo: string;
  rol?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (data: User & { token: string }) => void;
  logout: () => void;
  fetchUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      const savedToken = localStorage.getItem("token");
      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      }
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, []);

  const login = (data: User & { token: string }): void => {
    localStorage.setItem("user", JSON.stringify(data));
    localStorage.setItem("token", data.token);
    setUser({ nombre: data.nombre, correo: data.correo, rol: data.rol });
    setToken(data.token);
  };

  const logout = (): void => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  const fetchUser = async (): Promise<void> => {
    try {
      const response = await axios.get(
        "https://nestjs-cancha-backend-api.desarrollo-software.xyz/user/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const { nombre, correo, rol } = response.data;
      const data = { nombre, correo, rol };
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
    } catch (error) {
      console.error("Failed to fetch user", error);
      logout();
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};
