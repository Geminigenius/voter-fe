import { useEffect, useRef, useState } from "react";
import "./create-election.styles.scss";
import { adminAxios } from "services/adminAxios";
import {
  ELECTION_POSTS,
  GENERIC_ERROR_MESSAGE,
  convertInputDateToDate,
  getBaseUrl,
  getUrl,
  toSentenceCase,
} from "utils/utils";
import { CandidateSelector } from "./candidate-selector.component";
import { Loader } from "utils/components/loader/loader.component";

const emptyCandidate = (time = Date.now()) => ({
  name: "",
  party: "",
  id: time,
});

export const CreateElection = () => {
  const [states, setStates] = useState([]);
  const [electionType, setElectionType] = useState("");
  const [state, setState] = useState("");
  const [lga, setLGA] = useState("");
  const [lgas, setLGAs] = useState([]);
  const [parties, setParties] = useState([]);
  const [startDate, setStartDate] = useState(
    new Date().toLocaleDateString("en-CA")
  );
  const [endDate, setEndDate] = useState(
    new Date().toLocaleDateString("en-CA")
  );
  const [candidates, setCandidates] = useState([emptyCandidate()]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const stateMap = useRef({});
  const lgaMap = useRef({});

  const submitElection = async (e) => {
    e.preventDefault();

    if (!electionType) return setError("Election Type must be selected");

    if (endDate <= startDate)
      return setError("End Date must be greater than Start Date");

    if (electionType === ELECTION_POSTS.GUBERNATORIAL && !state)
      return setError("Gubernatorial elections must have a state");

    if (electionType === ELECTION_POSTS.LGA && (!state || !lga))
      return setError("LGA elections must have a state and LGA");

    setIsLoading(true);
    setError("");
    setSuccess("");

    const body = {
      post: electionType,
      startDate: convertInputDateToDate(startDate),
      endDate: convertInputDateToDate(endDate),
      candidates,
    };

    if (
      electionType === ELECTION_POSTS.GUBERNATORIAL ||
      electionType === ELECTION_POSTS.LGA
    )
      body["state"] = stateMap.current[state];

    if (electionType === ELECTION_POSTS.LGA) body["lga"] = lgaMap.current[lga];

    try {
      let resp = await adminAxios.post(getUrl("election"), body);
      console.log(resp);
      setSuccess(resp.data.message);
    } catch (e) {
      console.log(e);
      console.log(e?.response);
      let message = e?.response?.data?.message || GENERIC_ERROR_MESSAGE;
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const addNewCandidate = (e) => {
    e.preventDefault();
    setCandidates([...candidates, emptyCandidate()]);
  };

  const deleteCandidate = (e, id) => {
    e.preventDefault();
    let filteredCandidates = candidates.filter(
      (candidate) => candidate.id !== id
    );
    setCandidates(filteredCandidates);
  };

  const editCandidate = (e, id, fieldToEdit, newValue) => {
    e.preventDefault();
    let editedCandidates = candidates.map((candidate) => {
      if (candidate.id !== id) return candidate;
      candidate[fieldToEdit] = newValue;
      return candidate;
    });
    setCandidates(editedCandidates);
  };

  const fetchStates = async () => {
    try {
      let resp = await adminAxios.get(`${getBaseUrl()}/state/`);
      let sortedStates = resp.data.states.sort((state1, state2) =>
        state1.name < state2.name ? -1 : 1
      );
      sortedStates.forEach(
        (state) => (stateMap.current[state.name] = state.id)
      );
      setStates(sortedStates);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchParties = async () => {
    try {
      let resp = await adminAxios.get(`${getBaseUrl()}/party/`);
      let sortedParties = resp.data.parties.sort((party1, party2) =>
        party1.acronym < party2.acronym ? -1 : 1
      );
      sortedParties.forEach(
        (state) => (stateMap.current[state.name] = state.id)
      );
      setParties(sortedParties);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchLGAs = async (stateId) => {
    console.log(stateId);
    if (!stateId) return;

    try {
      let resp = await adminAxios.get(`${getBaseUrl()}/state/${stateId}/lga`);
      console.log(resp);
      let sortedLGAs = resp.data.lgas.sort((lga1, lga2) =>
        lga1.name < lga2.name ? -1 : 1
      );
      sortedLGAs.forEach((lga) => (lgaMap.current[lga.name] = lga.id));
      setLGAs(sortedLGAs);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchStates();
    fetchParties();
  }, []);

  useEffect(() => {
    if (!state) return;
    console.log(state);
    fetchLGAs(stateMap.current[state]);
  }, [state]);

  return (
    <form className="createElection">
      <h3>Create Election</h3>
      <label htmlFor="electionType">
        Election Type
        <select
          value={electionType}
          name="electionType"
          id="electionType"
          onChange={(e) => setElectionType(e.target.value)}
        >
          <option disabled hidden value="">
            Select an election type
          </option>
          {Object.values(ELECTION_POSTS).map((electionPost, idx) => (
            <option key={idx} value={electionPost}>
              {electionPost}
            </option>
          ))}
        </select>
      </label>
      <label htmlFor="startDate">
        Start Date
        <input
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          min={new Date().toLocaleDateString("en-CA")}
          type="date"
          id="startDate"
        />
      </label>
      <label htmlFor="endDate">
        End Date
        <input
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          min={new Date().toLocaleDateString("en-CA")}
          type="date"
          id="endDate"
        />
      </label>
      {electionType === ELECTION_POSTS.GUBERNATORIAL ||
      electionType === ELECTION_POSTS.LGA ? (
        <label htmlFor="state">
          State
          <select
            value={state}
            name="state"
            id="state"
            onChange={(e) => setState(e.target.value)}
          >
            <option disabled hidden value="">
              Select a state
            </option>
            {states.map((state) => (
              <option key={state.id} value={state.name}>
                {toSentenceCase(state.name)}
              </option>
            ))}
          </select>
        </label>
      ) : (
        <></>
      )}

      {electionType === ELECTION_POSTS.LGA && state ? (
        <label htmlFor="lga">
          LGA
          <select
            value={lga}
            name="lga"
            id="lga"
            onChange={(e) => setLGA(e.target.value)}
          >
            <option disabled hidden value="">
              Select an LGA
            </option>
            {lgas.map((lga) => (
              <option key={lga.id} value={lga.name}>
                {toSentenceCase(lga.name)}
              </option>
            ))}
          </select>
        </label>
      ) : (
        <> </>
      )}
      <h4>Candidates</h4>
      {candidates.map((candidate, idx) => (
        <CandidateSelector
          candidate={candidate}
          parties={parties}
          number={idx + 1}
          deleteCandidate={deleteCandidate}
          editCandidate={editCandidate}
          key={candidate.id}
        />
      ))}

      <button onClick={addNewCandidate}>Add Candidate</button>
      {error ? <em className="info">*{error}</em> : <></>}
      {success ? <em className="info">*{success}</em> : <></>}
      <button className="submit" onClick={submitElection}>
        {isLoading ? <Loader /> : "Submit Election"}
      </button>
    </form>
  );
};
