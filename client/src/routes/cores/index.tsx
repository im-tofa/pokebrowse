import style from "./style.css";
import { FunctionalComponent, h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { SearchComponent } from "../../components/search";
import { Results } from "../../components/results";
import { useSetsQuery } from "../../components/query";

interface Props {}

const CoreRequester: FunctionalComponent<Props> = (props: Props) => {
  const [results, setResults] = useState([]);
  const [params, setParams] = useState("");

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
        })
    );

    try {
      if (response.status !== 200) {
        setResults(undefined);
        return;
      }
      const json = await response.json();
      console.log(json);
      setResults(json);
    } catch (err) {
      console.log(err);
      setResults(undefined);
      return;
    }
  };

  return (
    <main class={style.main}>
      <div class={style.cores}>
        <form
          class={style.form}
          onSubmit={async (e) => {
            e.preventDefault();
            await request();
          }}>
          <label class={style.text}>Constraints:</label>
          <input
            type="text"
            class={style.text}
            value={params}
            placeholder="type ground, resists fire fighting dark, immuneTo ground, neutralTo ice electric"
            onChange={(e) => {
              setParams(e.currentTarget.value);
            }}
          />
          <input type="submit" value="Submit" />
        </form>
        {results && results.length != 0 && (
          <div>
            <div>
              <b>Pairings that satisfy criteria:</b>
            </div>
            {results.map((val) => (
              <div>{val.map((v) => v.name).join(", ")}</div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default CoreRequester;
