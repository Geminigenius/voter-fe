import { useState } from "react";
import { voterAxios } from "services/voterAxios";
import { Loader } from "utils/components/loader/loader.component";
import { GENERIC_ERROR_MESSAGE, getUrl } from "utils/utils";

export const CandidateCard = ({ candidate, electionId, updateCandidate }) => {
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState("");

  const incrementVote = () => {
    let clone = JSON.parse(JSON.stringify(candidate));
    clone.votes += 1;
    updateCandidate(candidate.name, clone);
  };

  const vote = async (partyAcronym) => {
    setLoading(true);
    setInfo("");
    try {
      let resp = await voterAxios.post(getUrl("election/vote"), {
        electionId: electionId,
        partyAcronym,
      });

      console.log(resp);
      setInfo(resp.data.message);
      incrementVote();
    } catch (e) {
      console.log(e);
      console.log(e?.response);
      let message = e?.response?.data?.message || GENERIC_ERROR_MESSAGE;
      setInfo(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="candidate">
        <img src={candidate.party.logo} />
        <div className="info">
          <h2>{candidate.name}</h2>
          <em>
            {candidate.party.name} ({candidate.party.acronym})
          </em>
          <em>Current Votes: {candidate.votes}</em>
        </div>
        <button className="vote" onClick={(e) => vote(candidate.party.acronym)}>
          {loading ? <Loader /> : "Vote"}
        </button>
      </div>
      {info ? <em className="info">*{info}</em> : <></>}
    </>
  );
};
