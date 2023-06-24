import { useState } from "react";
import { voterAxios } from "services/voterAxios";
import { Loader } from "utils/components/loader/loader.component";
import { GENERIC_ERROR_MESSAGE, getUrl } from "utils/utils";

export const ResultCandidateCard = ({ candidate, electionId }) => {
  return (
    <>
      <div className="candidate">
        <img src={candidate.party.logo} />
        <div className="info">
          <h2>{candidate.name}</h2>
          <em>
            {candidate.party.name} ({candidate.party.acronym})
          </em>
        </div>
        <em>{candidate.votes}</em>
      </div>
    </>
  );
};
