import { Link } from "react-router-dom";
import "./registration.styles.scss";
import { useState } from "react";
import { Loader } from "utils/components/loader/loader.component";
import { GENERIC_ERROR_MESSAGE, getBaseUrl } from "utils/utils";
import { voterAxios } from "services/voterAxios";

export const RegisterPage = () => {
  const [nin, setNin] = useState("");
  const [password, setPassword] = useState("");
  const [votingPassword, setVotingPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const registerUser = async (e) => {
    e.preventDefault();
    if (!nin || !password || !votingPassword) {
      setError("All fields must be filled");
      return;
    }
    setSuccess("");
    setError("");
    setIsLoading(true);

    try {
      let baseUrl = getBaseUrl();

      const resp = await voterAxios.post(`${baseUrl}/voter/register`, {
        nin,
        password,
        votingPassword,
      });
      if (resp.status === 201) {
        setSuccess("Voter registered successfully");
        setNin("");
        setPassword("");
        setVotingPassword("");
      }
    } catch (e) {
      let message = e?.response?.data?.message || GENERIC_ERROR_MESSAGE;
      console.log(e.response);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <form>
        <h1>Voter Registration</h1>

        <input
          type="number"
          placeholder="NIN"
          onChange={(e) => setNin(e.target.value)}
          value={nin}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <input
          type="password"
          placeholder="Voting Password"
          onChange={(e) => setVotingPassword(e.target.value)}
          value={votingPassword}
        />
        {error ? <em className="error">*{error}</em> : <></>}
        {success ? <em className="success">*{success}</em> : <></>}

        <button onClick={registerUser}>
          {isLoading ? <Loader /> : "Register"}
        </button>
        <p>
          Already registered? <Link to="/">Sign in here</Link>
        </p>
      </form>
    </div>
  );
};
