import style from "./style.css";
import { FunctionalComponent, h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { SearchComponent } from "../../components/search";
import { Results } from "../../components/results";
import { useSetsQuery } from "../../components/query";

interface Props {}

const CoreRequester: FunctionalComponent<Props> = (props: Props) => {
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [params, setParams] = useState("");
  const [ignoreTeammateViability, setIgnoreTeammateViability] = useState(false);
  const [format, setFormat] = useState("gen9ou");

  // set title after first render
  useEffect(() => {
    document.title = "Cores | Pokebrowse";
  }, []);

  const request = async () => {
    const response = await fetch(
      process.env.URL +
        "/cores?" +
        new URLSearchParams({
          constraintsString: params,
          allowAnyTeammate: ignoreTeammateViability.toString(),
          format: format,
        })
    );

    try {
      if (response.status !== 200) {
        setResults(undefined);
        const json = await response.json();
        setError(json.error);
        return;
      }
      const json = await response.json();
      console.log(json);
      setResults(json);
      setError("");
    } catch (err) {
      console.log(err);
      setResults(undefined);
      setError("Something went wrong");
      return;
    }
  };

  return (
    <main class={style.main}>
      <div class={style.cores}>
        <h2>Core Generator</h2>
        <div>
          Generate cores based on your own preferences! Type in a
          comma-separated list of criteria and click submit. Possible types of
          criteria are noted below, where "..." means more values can be
          provided:
          <ul>
            <li>
              <pre>type {"<typing>"}</pre> - The core should include a Pokémon
              with this type.
            </li>
            <li>
              <pre>species {"<species>"}</pre> - The core should include this
              species.
            </li>
            <li>
              <pre>
                immuneTo {"<typing>"} {"<typing>"} ...
              </pre>{" "}
              - The core should include a Pokémon that is immune to all of the
              space-separated types.
            </li>
            <li>
              <pre>
                resists {"<typing>"} {"<typing>"} ...
              </pre>{" "}
              - The core should include a Pokémon that takes resisted or no
              damage from all of the space-separated types.
            </li>
            <li>
              <pre>
                neutralTo {"<typing>"} {"<typing>"} ...
              </pre>{" "}
              - The core should include a Pokémon that takes neutral, resisted
              or no damage from all of the space-separated types.
            </li>
          </ul>
        </div>
        <div class={style.line}></div>
        <form
          class={style.form}
          onSubmit={async (e) => {
            e.preventDefault();
            await request();
          }}>
          <fieldset>
            <legend>Configuration</legend>
            <label class={style.text}>
              <span>Format:</span>
              <select
                value={format}
                onChange={(e) => {
                  setFormat(e.currentTarget.value);
                }}>
                <option value="gen9ou">Gen 9 OU</option>
                <option value="gen8ou">Gen 8 OU</option>
              </select>
            </label>
            <label class={style.text}>
              <span>Allow rare pairings:</span>

              <input
                name="ignoreTeammateViability"
                type="checkbox"
                checked={ignoreTeammateViability}
                onChange={(e) => {
                  setIgnoreTeammateViability(e.currentTarget.checked);
                }}
              />
            </label>
          </fieldset>
          <fieldset>
            <legend>Constraints</legend>
            <input
              type="text"
              class={style.text}
              value={params}
              placeholder="type ground, resists fire fighting dark, immuneTo ground, neutralTo ice electric"
              onChange={(e) => {
                setParams(e.currentTarget.value);
              }}
            />
          </fieldset>
          <input class={style.submit} type="submit" value="Submit" />
        </form>
        {results && results.length != 0 && (
          <div class={style.results}>
            <div>
              <b>Pairings that satisfy criteria:</b>
            </div>
            {results.map((val) => (
              <div>{val.map((v) => v.name).join(", ")}</div>
            ))}
          </div>
        )}
        {error && (
          <div>
            <b style="color: red">{error}</b>
          </div>
        )}
      </div>
    </main>
  );
};

export default CoreRequester;
