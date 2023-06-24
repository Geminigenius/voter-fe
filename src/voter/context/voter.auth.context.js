import { createContext, useState } from "react";
import jwtDecode from "jwt-decode";

export const VoterAuthContext = createContext({
  authToken: "",
  setAuthToken: () => null,
  setRefreshToken: () => null,
  signOut: () => null,
  isSignedIn: false,
});

export const VoterAuthContextProvider = ({ children }) => {
  const [authToken, setAuthTokenValue] = useState(
    localStorage.getItem("authToken")
  );
  const [refreshToken, setRefreshTokenValue] = useState(
    localStorage.getItem("refreshToken")
  );

  const setAuthToken = (newAuthToken) => {
    localStorage.setItem("authToken", newAuthToken);
    setAuthTokenValue(newAuthToken);
  };

  const getAuthToken = () => {
    let localAuthToken = localStorage.getItem("authToken");
    if (localAuthToken !== authToken) setAuthToken(localAuthToken);

    return localAuthToken;
  };

  const signOut = () => {
    setAuthToken("");
    setRefreshToken("");
  };

  const setRefreshToken = (newRefreshToken) => {
    localStorage.setItem("refreshToken", newRefreshToken);
    setRefreshTokenValue(newRefreshToken);
  };

  return (
    <VoterAuthContext.Provider
      value={{
        authToken: getAuthToken(),
        setAuthToken,
        setRefreshToken,
        isSignedIn: !!getAuthToken(),
        signOut,
      }}
    >
      {children}
    </VoterAuthContext.Provider>
  );
};
