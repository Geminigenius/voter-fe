import { Link, Navigate } from "react-router-dom";
import "./login.styles.scss";
import { useContext, useState } from "react";
import { VoterAuthContext } from "voter/context/voter.auth.context";
import { Loader } from "utils/components/loader/loader.component";
import { GENERIC_ERROR_MESSAGE, getBaseUrl, getUrl } from "utils/utils";
import { voterAxios } from "services/voterAxios";

export const LoginPage = () => {
  const [nin, setNin] = useState(
    process.env.NODE_ENV !== "production" ? "492007016" : ""
  );
  const [password, setPassword] = useState(
    process.env.NODE_ENV !== "production" ? "aimakuvote" : ""
  );
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { isSignedIn, setAuthToken, setRefreshToken } =
    useContext(VoterAuthContext);
  if (isSignedIn) return <Navigate to="/" />;

  const login = async (e) => {
    e.preventDefault();

    if (!nin || !password) {
      setError("All fields must be filled");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      let resp = await voterAxios.post(getUrl("voter/login"), {
        nin,
        password,
      });

      console.log(resp);
      setAuthToken(resp.data.authToken);
      setRefreshToken(resp.data.refreshToken);
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
        <h1>Voter Login</h1>
        <input
          type="number"
          placeholder="NIN"
          onChange={(e) => setNin(e.target.value)}
          value={nin}
        />
        <input
          type="password"
          placeholder="Voting Password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        {error ? <em className="error">*{error}</em> : <></>}
        <button onClick={isLoading ? () => {} : login}>
          {isLoading ? <Loader /> : "Login"}
        </button>
        <p>
          Haven't registered yet? <Link to="/register">Register Here</Link>
        </p>
      </form>
    </div>
  );
};
