import { useState } from "react";
import "./create-political-party.styles.scss";
import { adminAxios } from "services/adminAxios";
import { GENERIC_ERROR_MESSAGE, getUrl } from "utils/utils";
import { Loader } from "utils/components/loader/loader.component";

export const CreatePoliticalParty = () => {
  const [name, setName] = useState("");
  const [acronym, setAcronym] = useState("");
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const submitParty = async (e) => {
    e.preventDefault();

    if (!name || !acronym || !url) {
      return setError("All fields must be filled");
    }

    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      let resp = await adminAxios.post(getUrl("party"), {
        name,
        logo: url,
        acronym,
      });

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

  return (
    <form className="createParty">
      <header>
        <h3>Create Political Party</h3>
      </header>
      <label htmlFor="partyName">
        Name
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Party Name"
          id="partyName"
        />
      </label>
      <label htmlFor="partyAcronym">
        Acronym
        <input
          value={acronym}
          onChange={(e) => setAcronym(e.target.value)}
          type="text"
          placeholder="Party Acronym"
          id="partyAcronym"
        />
      </label>
      <label htmlFor="partyLogo">
        Logo URL
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          type="text"
          placeholder="Party Logo URL"
          id="partyLogo"
        />
      </label>
      {error ? <em className="info">*{error}</em> : <></>}
      {success ? <em className="info">*{success}</em> : <></>}
      <button onClick={submitParty}>{isLoading ? <Loader /> : "Submit"}</button>
    </form>
  );
};
