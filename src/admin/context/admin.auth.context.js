import { createContext, useState } from "react";

export const AdminAuthContext = createContext({
  authToken: "",
  setAuthToken: () => null,
  setRefreshToken: () => null,
  signOut: () => null,
  isSignedIn: false,
});

export const AdminAuthContextProvider = ({ children }) => {
  const [authToken, setAuthTokenValue] = useState(
    localStorage.getItem("adminAuthToken")
  );
  const [refreshToken, setRefreshTokenValue] = useState(
    localStorage.getItem("adminRefreshToken")
  );

  const setAuthToken = (newAuthToken) => {
    localStorage.setItem("adminAuthToken", newAuthToken);
    setAuthTokenValue(newAuthToken);
  };

  const setRefreshToken = (newRefreshToken) => {
    localStorage.setItem("adminRefreshToken", newRefreshToken);
    setRefreshTokenValue(newRefreshToken);
  };

  const getAuthToken = () => {
    let localAuthToken = localStorage.getItem("adminAuthToken");
    if (localAuthToken !== authToken) setAuthTokenValue(localAuthToken);
    return localAuthToken;
  };

  const signOut = () => {
    setAuthToken("");
    setRefreshToken("");
  };

  return (
    <AdminAuthContext.Provider
      value={{
        authToken: getAuthToken(),
        setAuthToken,
        setRefreshToken,
        isSignedIn: !!getAuthToken(),
        signOut,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};
