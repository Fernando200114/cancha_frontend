// import React, { useState } from "react";
// import { Eye, EyeOff } from "lucide-react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";

// export default function AuthForm() {
//   const [isLogin, setIsLogin] = useState(true);
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));
//   const { login, logout } = useAuth();
//   const navigate = useNavigate();

//   // Errores
//   const [nameError, setNameError] = useState<string | null>(null);
//   const [emailError, setEmailError] = useState<string | null>(null);
//   const [passwordError, setPasswordError] = useState<string | null>(null);

//   // Validaciones
//   const validateName = (value: string) => {
//     if (!isLogin && value.trim().length < 3) {
//       setNameError("El nombre debe tener al menos 3 caracteres.");
//       return false;
//     }
//     setNameError(null);
//     return true;
//   };

//   const validateEmail = (value: string) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(value)) {
//       setEmailError("Por favor, introduce un correo electrónico válido.");
//       return false;
//     }
//     setEmailError(null);
//     return true;
//   };

//   const validatePassword = (value: string) => {
//     if (value.length < 6) {
//       setPasswordError("La contraseña debe tener al menos 6 caracteres.");
//       return false;
//     }
//     setPasswordError(null);
//     return true;
//   };

//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();

//     const isNameValid = isLogin || validateName(name);
//     const isEmailValid = validateEmail(email);
//     const isPasswordValid = validatePassword(password);

//     if (!isNameValid || !isEmailValid || !isPasswordValid) return;
//     setLoading(true);

//     try {
//       const baseURL = "https://nestjs-cancha-backend-api.desarrollo-software.xyz";
//       const endpoint = isLogin ? "/auth/login" : "/auth/register";
//       const payload = isLogin
//         ? { correo: email, password }
//         : { nombre: name, correo: email, password };

//       const response = await axios.post(baseURL + endpoint, payload);

//       if (isLogin) {
//         const token = response.data.token;
//         const decoded = JSON.parse(atob(token.split(".")[1]));
//         const { nombre, correo, rol } = decoded;

//         login({ nombre, correo, rol, token });
//         setLoggedIn(true);
//         alert("¡Inicio de sesión exitoso!");
//         navigate("/");
//       } else {
//         alert("¡Registro exitoso! Ahora inicia sesión.");
//         setIsLogin(true);
//         setName("");
//         setEmail("");
//         setPassword("");
//       }
//     } catch (error: any) {
//       console.error(error);
//       alert(error.response?.data?.message || "Error en la operación");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = () => {
//     logout();
//     setLoggedIn(false);
//     setEmail("");
//     setPassword("");
//     setName("");
//   };

//   return (
//     <div className="container d-flex vh-100 align-items-center justify-content-center bg-light">
//       <div className="card shadow p-4" style={{ maxWidth: 420, width: "100%" }}>
//         <div className="text-center mb-4">
//           <h2 className="fw-bold">{isLogin ? "Bienvenido de Nuevo" : "Crea tu Cuenta"}</h2>
//           <p className="text-muted">
//             {isLogin ? "Ingresa tus datos para continuar." : "Únete a nuestra comunidad en pocos pasos."}
//           </p>
//         </div>
//         <form onSubmit={handleSubmit} noValidate>
//           {!isLogin && (
//             <div className="mb-3">
//               <label htmlFor="name" className="form-label fw-semibold">Nombre Completo</label>
//               <input
//                 type="text"
//                 id="name"
//                 className={`form-control ${nameError ? "is-invalid" : ""}`}
//                 placeholder="Fernando"
//                 value={name}
//                 onChange={(e) => {
//                   setName(e.target.value);
//                   validateName(e.target.value);
//                 }}
//                 onBlur={(e) => validateName(e.target.value)}
//                 required={!isLogin}
//               />
//               {nameError && <div className="invalid-feedback">{nameError}</div>}
//             </div>
//           )}

//           <div className="mb-3">
//             <label htmlFor="email" className="form-label fw-semibold">Correo Electrónico</label>
//             <input
//               type="email"
//               id="email"
//               className={`form-control ${emailError ? "is-invalid" : ""}`}
//               placeholder="tu.correo@ejemplo.com"
//               value={email}
//               onChange={(e) => {
//                 setEmail(e.target.value);
//                 validateEmail(e.target.value);
//               }}
//               onBlur={(e) => validateEmail(e.target.value)}
//               required
//             />
//             {emailError && <div className="invalid-feedback">{emailError}</div>}
//           </div>

//           <div className="mb-4 position-relative">
//             <label htmlFor="password" className="form-label fw-semibold">Contraseña</label>
//             <input
//               type={showPassword ? "text" : "password"}
//               id="password"
//               className={`form-control ${passwordError ? "is-invalid" : ""}`}
//               placeholder="••••••••"
//               value={password}
//               onChange={(e) => {
//                 setPassword(e.target.value);
//                 validatePassword(e.target.value);
//               }}
//               onBlur={(e) => validatePassword(e.target.value)}
//               required
//             />
//             <button
//               type="button"
//               className="btn btn-outline-secondary position-absolute top-50 end-0 translate-middle-y me-2"
//               onClick={() => setShowPassword(!showPassword)}
//               tabIndex={-1}
//               aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
//               style={{ zIndex: 10 }}
//             >
//               {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//             </button>
//             {passwordError && <div className="invalid-feedback d-block">{passwordError}</div>}
//           </div>

//           <button
//             type="submit"
//             className="btn btn-primary w-100 py-2 fw-semibold"
//             disabled={loading}
//           >
//             {loading && <span className="spinner-border spinner-border-sm me-2" rol="status" aria-hidden="true"></span>}
//             {isLogin ? "Iniciar Sesión" : "Registrarse"}
//           </button>
//         </form>

//         <div className="mt-3 text-center text-muted">
//           {isLogin ? "¿No tienes una cuenta?" : "¿Ya eres miembro?"}{" "}
//           <button
//             type="button"
//             className="btn btn-link p-0 fw-semibold"
//             onClick={() => {
//               setIsLogin(!isLogin);
//               setName("");
//               setEmail("");
//               setPassword("");
//               setNameError(null);
//               setEmailError(null);
//               setPasswordError(null);
//             }}
//           >
//             {isLogin ? "Regístrate aquí" : "Inicia sesión"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));
  const { login, logout } = useAuth();
  const navigate = useNavigate();

  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const validateName = (value: string) => {
    if (!isLogin && value.trim().length < 3) {
      setNameError("El nombre debe tener al menos 3 caracteres.");
      return false;
    }
    setNameError(null);
    return true;
  };

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError("Por favor, introduce un correo electrónico válido.");
      return false;
    }
    setEmailError(null);
    return true;
  };

  const validatePassword = (value: string) => {
    if (value.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres.");
      return false;
    }
    setPasswordError(null);
    return true;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isNameValid = isLogin || validateName(name);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    if (!isNameValid || !isEmailValid || !isPasswordValid) return;

    setLoading(true);
    try {
      const baseURL = "https://nestjs-cancha-backend-api.desarrollo-software.xyz";
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const payload = isLogin
        ? { correo: email, password }
        : { nombre: name, correo: email, password };

      const response = await axios.post(baseURL + endpoint, payload);

      if (isLogin) {
        const token = response.data.token;

        // 🟢 Guardar token para que funcione el acceso privado
        localStorage.setItem("token", token);

        const decoded = JSON.parse(atob(token.split(".")[1]));
        const { nombre, correo, rol } = decoded;

        login({ nombre, correo, rol, token });
        setLoggedIn(true);
        alert("¡Inicio de sesión exitoso!");
        navigate("/");
      } else {
        alert("¡Registro exitoso! Ahora inicia sesión.");
        setIsLogin(true);
        setName("");
        setEmail("");
        setPassword("");
      }
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Error en la operación");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token"); // 🧹 Limpieza del token
    setLoggedIn(false);
    setEmail("");
    setPassword("");
    setName("");
  };

  return (
    <div className="container d-flex vh-100 align-items-center justify-content-center bg-light">
      <div className="card shadow p-4" style={{ maxWidth: 420, width: "100%" }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold">{isLogin ? "Bienvenido de Nuevo" : "Crea tu Cuenta"}</h2>
          <p className="text-muted">
            {isLogin ? "Ingresa tus datos para continuar." : "Únete a nuestra comunidad en pocos pasos."}
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {!isLogin && (
            <div className="mb-3">
              <label htmlFor="name" className="form-label fw-semibold">Nombre Completo</label>
              <input
                type="text"
                id="name"
                className={`form-control ${nameError ? "is-invalid" : ""}`}
                placeholder="Fernando"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  validateName(e.target.value);
                }}
                onBlur={(e) => validateName(e.target.value)}
                required={!isLogin}
              />
              {nameError && <div className="invalid-feedback">{nameError}</div>}
            </div>
          )}

          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-semibold">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              className={`form-control ${emailError ? "is-invalid" : ""}`}
              placeholder="tu.correo@ejemplo.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                validateEmail(e.target.value);
              }}
              onBlur={(e) => validateEmail(e.target.value)}
              required
            />
            {emailError && <div className="invalid-feedback">{emailError}</div>}
          </div>

          <div className="mb-4 position-relative">
            <label htmlFor="password" className="form-label fw-semibold">Contraseña</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className={`form-control ${passwordError ? "is-invalid" : ""}`}
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                validatePassword(e.target.value);
              }}
              onBlur={(e) => validatePassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="btn btn-outline-secondary position-absolute top-50 end-0 translate-middle-y me-2"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              style={{ zIndex: 10 }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {passwordError && <div className="invalid-feedback d-block">{passwordError}</div>}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 py-2 fw-semibold"
            disabled={loading}
          >
            {loading && <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>}
            {isLogin ? "Iniciar Sesión" : "Registrarse"}
          </button>
        </form>

        <div className="mt-3 text-center text-muted">
          {isLogin ? "¿No tienes una cuenta?" : "¿Ya eres miembro?"}{" "}
          <button
            type="button"
            className="btn btn-link p-0 fw-semibold"
            onClick={() => {
              setIsLogin(!isLogin);
              setName("");
              setEmail("");
              setPassword("");
              setNameError(null);
              setEmailError(null);
              setPasswordError(null);
            }}
          >
            {isLogin ? "Regístrate aquí" : "Inicia sesión"}
          </button>
        </div>
      </div>
    </div>
  );
}
