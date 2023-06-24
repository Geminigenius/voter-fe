import {
  ELECTION_POSTS_API_TO_SHORT,
  formatNumberWithCommas,
  getUrl,
} from "utils/utils";
import "./election-card.styles.scss";
import { CandidateCard } from "./candidate-card.component";

export const ElectionCard = ({ title, election, updateElection }) => {
  if (!election) return <></>;
  let totalVotes = 0;
  election.candidates.forEach(
    (candidate) => (totalVotes = totalVotes + candidate.votes)
  );

  const updateCandidate = (candidateName, newCandidateObj) => {
    let clone = JSON.parse(JSON.stringify(election));
    clone.candidates = clone.candidates.map((candidate) => {
      if (candidate.name !== candidateName) return candidate;
      return newCandidateObj;
    });
    updateElection(ELECTION_POSTS_API_TO_SHORT[election.post], clone);
  };

  return (
    <div className="election-card">
      <div className="top">
        <div className="election-info">
          <h2>{title}</h2>
        </div>
      </div>
      <div className="bottom">
        <div className="election-info">
          <em>Date: {new Date(election.startDate).toDateString()}</em>
          <em>Total Votes: {formatNumberWithCommas(totalVotes)}</em>
        </div>
      </div>
      <div className="candidates-container">
        <header>
          <h3>Candidates</h3>
        </header>
        <section className="candidates">
          {election.candidates.map((candidate, index) => (
            <CandidateCard
              candidate={candidate}
              electionId={election.id}
              updateCandidate={updateCandidate}
              key={index}
            />
          ))}
        </section>
      </div>
    </div>
  );
};
