import "./dashboard.styles.scss";
import { useContext } from "react";
import { AdminAuthContext } from "admin/context/admin.auth.context";
import { Navigate } from "react-router-dom";
import { CreatePoliticalParty } from "admin/components/create-political-party/create-political-party.component";
import { CreateElection } from "admin/components/create-election/create-election.component";

export const AdminDashboard = () => {
  const { isSignedIn, signOut } = useContext(AdminAuthContext);

  if (!isSignedIn) return <Navigate to="/admin/login" />;

  return (
    <div className="admin-dashboard-container">
      <header>
        <h1>Admin Dashboard</h1>
      </header>
      <CreatePoliticalParty />
      <CreateElection />
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
};
