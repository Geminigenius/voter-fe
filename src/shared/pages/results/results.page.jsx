import { getUrl } from "utils/utils";
import "./results.styles.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import { ResultElectionCard } from "../components/election-card/election-card.component";

export const ResultsPage = () => {
  const [elections, setElections] = useState([]);

  const fetchResults = async () => {
    try {
      let resp = await axios.get(getUrl("election/results"));
      console.log(resp);
      let elections = resp.data.elections.map((election) => {
        election.candidates.sort(
          (candidate1, candidate2) => candidate2.votes - candidate1.votes
        );
        return election;
      });
      setElections(elections);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  return (
    <div className="results-container">
      <h1>Results</h1>
      {elections && elections.length ? (
        elections.map((election) => (
          <ResultElectionCard election={election} key={election.id} />
        ))
      ) : (
        <> </>
      )}
    </div>
  );
};
