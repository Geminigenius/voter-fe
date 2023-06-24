import { Link, Navigate, redirect } from "react-router-dom";
import "./login.styles.scss";
import { useContext, useState } from "react";
import { Loader } from "utils/components/loader/loader.component";
import { GENERIC_ERROR_MESSAGE, getBaseUrl, getUrl } from "utils/utils";
import { voterAxios } from "services/voterAxios";
import { AdminAuthContext } from "admin/context/admin.auth.context";
import { adminAxios } from "services/adminAxios";

export const AdminLoginPage = () => {
  const [email, setEmail] = useState(
    process.env.NODE_ENV !== "production" ? "victor@gmail.com" : ""
  );
  const [password, setPassword] = useState(
    process.env.NODE_ENV !== "production" ? "password" : ""
  );
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { isSignedIn, setAuthToken, setRefreshToken } =
    useContext(AdminAuthContext);
  if (isSignedIn) return <Navigate to="/admin/" />;

  const login = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("All fields must be filled");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      let resp = await adminAxios.post(getUrl("admin/login"), {
        email,
        password,
      });

      console.log(resp);
      setAuthToken(resp.data.authToken);
      setRefreshToken(resp.data.refreshToken);
      setEmail("");
      setPassword("");
    } catch (e) {
      let message = e?.response?.data?.message || GENERIC_ERROR_MESSAGE;
      console.log(e.response);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="login-container">
      <form>
        <h1>Admin Login</h1>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <input
          type="password"
          placeholder="Admin Password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        {error ? <em className="error">*{error}</em> : <></>}
        <button onClick={isLoading ? () => {} : login}>
          {isLoading ? <Loader /> : "Login"}
        </button>
      </form>
    </div>
  );
};
