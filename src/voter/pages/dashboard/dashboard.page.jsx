import { ElectionCard } from "voter/components/election-card/election-card.component";
import "./dashboard.styles.scss";
import { useContext, useEffect, useState } from "react";
import { VoterAuthContext } from "voter/context/voter.auth.context";
import { Navigate } from "react-router-dom";
import { Loader } from "utils/components/loader/loader.component";
import { voterAxios } from "services/voterAxios";
import {
  ELECTION_POSTS,
  ELECTION_POSTS_API,
  getUrl,
  toSentenceCase,
} from "utils/utils";

export const DashboardPage = () => {
  const { isSignedIn, signOut } = useContext(VoterAuthContext);
  const [loading, setLoading] = useState(false);
  const [elections, setElections] = useState(null);

  const fetchElections = async () => {
    setLoading(true);
    try {
      let resp = await voterAxios.get(getUrl("election"));
      console.log(resp);
      setElections(resp.data.elections);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const areElectionsEmpty = () => {
    if (!elections) return true;
    let found = false;
    for (let vals of Object.values(elections)) {
      if (vals) found = true;
    }
    return !found;
  };

  const updateElection = (electionPost, newElection) => {
    let clone = JSON.parse(JSON.stringify(elections));
    clone[electionPost] = newElection;
    setElections(clone);
  };

  useEffect(() => {
    fetchElections();
  }, []);

  if (!isSignedIn) return <Navigate to="/login" />;

  return (
    <div className="dashboard-container">
      <header>
        <h1>Elections</h1>
        <button>Live Results</button>
      </header>
      <section className="election-cards">
        {loading ? (
          <Loader />
        ) : !areElectionsEmpty() ? (
          <>
            <ElectionCard
              title="Presidential Election"
              election={elections[ELECTION_POSTS_API.PRESIDENTIAL]}
              key={elections[ELECTION_POSTS_API.PRESIDENTIAL].id}
              updateElection={updateElection}
            />

            <ElectionCard
              title={`${
                elections[ELECTION_POSTS_API.STATE]
                  ? toSentenceCase(
                      elections[ELECTION_POSTS_API.STATE].stateName
                    )
                  : ""
              } State Election`}
              election={elections[ELECTION_POSTS_API.STATE]}
              key={elections[ELECTION_POSTS_API.STATE].id}
              updateElection={updateElection}
            />
            <ElectionCard
              title={`${
                elections[ELECTION_POSTS_API.LGA]
                  ? toSentenceCase(elections[ELECTION_POSTS_API.LGA].lgaName)
                  : ""
              } Local Government Election`}
              election={elections[ELECTION_POSTS_API.LGA]}
              updateElection={updateElection}
              key={
                elections[ELECTION_POSTS_API.LGA]
                  ? elections[ELECTION_POSTS_API.LGA].id
                  : Date.now()
              }
            />
          </>
        ) : (
          <h1 className="info">No Elections</h1>
        )}
      </section>
      <button onClick={signOut}> Sign Out</button>
    </div>
  );
};
