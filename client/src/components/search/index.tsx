import style from "./style.css";

import { FunctionalComponent, h } from "preact";
import { useState } from "preact/hooks";

import Filter from "./../../components/filter";
import parseInput from "../../helpers/tokenizer";

interface SearchProps {
  fetchResults(url: string, more: boolean): void;
}

const SearchComponent: FunctionalComponent<SearchProps> = (
  props: SearchProps
) => {
  const [currentInput, setCurrentInput] = useState("");
  const [species, setSpecies] = useState("Excadrill");
  const [date, setDate] = useState("");
  const [type, setType] = useState("");
  const [speed, setSpeed] = useState(0);
  const [author, setAuthor] = useState("");
  const fetchResults = props.fetchResults;

  function handleUserInput(
    event: h.JSX.TargetedKeyboardEvent<HTMLInputElement>
  ) {
    event.preventDefault();
    if (event.code === "Enter") {
      setUserInput(currentInput);
    }
  }

  function setUserInput(value: string) {
    setCurrentInput("");
    const res = parseInput(value);
    if (!res.val) return; // e.g empty string
    if (res) {
      switch (res.key) {
        case "date":
          setDate(res.val);
          break;
        case "species":
          setSpecies(res.val);
          break;
        case "speed":
          setSpeed(parseInt(res.val));
          break;
        case "type":
          setType(res.val);
          break;
        case "author":
          setAuthor(res.val);
          break;
        default:
          break;
      }
    }
  }

  return (
    <form class={style.filters}>
      <div class={style.cli}>
        <input
          type="text"
          id="cli"
          class={style.cmd}
          value={currentInput}
          placeholder="/species <pokemon>, /speed <speedtier>, /author <name>, /type <type> or /date <yyyy-mm-dd>, then press Enter"
          onChange={(event) => setCurrentInput(event.currentTarget.value)}
          onKeyUp={(event) => handleUserInput(event)}
          onKeyDown={(event) => {
            if (event.code === "Enter") event.preventDefault();
          }}
        />
        <button
          class={`${style.btn}`}
          onClick={(event) => {
            event.preventDefault();
            setUserInput(currentInput);
          }}>
          <i class="fa fa-plus" /> <span class={style.hidden}>Add</span>
        </button>
      </div>
      <div class={style.query}>
        {
          <div class={style.chosen}>
            <h5>Filters: </h5>
            {species && (
              <Filter
                filterType={"species"}
                filterValue={species}
                remove={(event) => {
                  event.preventDefault();
                  setSpecies("");
                }}></Filter>
            )}
            {speed !== 0 && (
              <Filter
                filterType={"speed"}
                filterValue={speed.toString()}
                remove={(event) => {
                  event.preventDefault();
                  setSpeed(0);
                }}></Filter>
            )}
            {author && (
              <Filter
                filterType={"author"}
                filterValue={author}
                remove={(event) => {
                  event.preventDefault();
                  setAuthor("");
                }}></Filter>
            )}
            {date && (
              <Filter
                filterType={"date"}
                filterValue={date}
                remove={(event) => {
                  event.preventDefault();
                  setDate("");
                }}></Filter>
            )}
            {type && (
              <Filter
                filterType={"type"}
                filterValue={type}
                remove={(event) => {
                  event.preventDefault();
                  setType("");
                }}></Filter>
            )}
          </div>
        }
        <button
          class={`${style.btn}`}
          onClick={(e) => {
            e.preventDefault();
            const queryString = new URLSearchParams({
              ...(species && { species: species }), // TODO should not be able to add multiple species at all
              ...(author && { author: author }),
              ...(speed && { speed: speed.toString() }),
              ...(date && { createdAfter: date }),
              ...(type && { type: type }),
              limit: "5",
            });
            fetchResults(
              process.env.URL + "/sets?" + queryString.toString(),
              false
            );
          }}>
          <i class="fa fa-search" /> Search
        </button>
      </div>
    </form>
  );
};

export { SearchComponent };
