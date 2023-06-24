export const CandidateSelector = ({
  parties,
  candidate,
  number,
  deleteCandidate,
  editCandidate,
}) => {
  return (
    <div className="candidateSelector">
      <div className="top">
        <h5>Candidate {number}</h5>
        <button
          className="cancel"
          onClick={(e) => deleteCandidate(e, candidate.id)}
        >
          x
        </button>
      </div>

      <label htmlFor="name">
        Name
        <input
          value={candidate.name}
          type="text"
          placeholder="Candidate Name"
          id="name"
          onChange={(e) =>
            editCandidate(e, candidate.id, "name", e.target.value)
          }
        />
      </label>
      <label htmlFor="party">
        Party
        <select
          value={candidate.party}
          name="party"
          id="party"
          onChange={(e) =>
            editCandidate(e, candidate.id, "party", e.target.value)
          }
        >
          <option disabled hidden value="">
            Select a Party
          </option>
          {parties.map((party) => (
            <option key={party.id} value={party.acronym}>
              {party.name} ({party.acronym})
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};
