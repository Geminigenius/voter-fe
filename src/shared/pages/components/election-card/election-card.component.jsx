import {
  ELECTION_POSTS,
  formatNumberWithCommas,
  toSentenceCase,
} from "utils/utils";
import "./election-card.styles.scss";
import { ResultCandidateCard } from "./candidate-card.component";

export const ResultElectionCard = ({ election }) => {
  const getTitle = () => {
    if (election.post === ELECTION_POSTS.PRESIDENTIAL)
      return "Presidential Election";
    if (election.post === ELECTION_POSTS.GUBERNATORIAL)
      return `${toSentenceCase(election.state.name)} State Election`;
    if (election.post === ELECTION_POSTS.LGA)
      return `toSentenceCase(election.lga.name) Local Government Election`;
  };

  if (!election) return <></>;
  let totalVotes = 0;
  election.candidates.forEach(
    (candidate) => (totalVotes = totalVotes + candidate.votes)
  );

  return (
    <div className="election-card">
      <div className="top">
        <div className="election-info">
          <h2>{getTitle()}</h2>
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
            <ResultCandidateCard
              candidate={candidate}
              electionId={election.id}
              key={index}
            />
          ))}
        </section>
      </div>
    </div>
  );
};
