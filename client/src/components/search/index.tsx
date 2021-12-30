import style from "./style.css";

import { QueryLazyOptions, OperationVariables } from "@apollo/client";
import { FunctionalComponent, h } from "preact";
import { useState } from "preact/hooks";

import Filter from "./../../components/filter";
import parseInput from "../../routes/browser/tokenizer";

interface SearchProps {
  fetchResults(
    options?: QueryLazyOptions<OperationVariables> | undefined
  ): void;
}

const SearchComponent: FunctionalComponent<SearchProps> = (
  props: SearchProps
) => {
  const [currentInput, setCurrentInput] = useState("");
  const [species, setSpecies] = useState(["Excadrill"] as string[]);
  const [date, setDate] = useState("");
  const [speed, setSpeed] = useState(0);
  const [author, setAuthor] = useState("");
  const fetchResults = props.fetchResults;

  function handleUserInput(
    event: h.JSX.TargetedKeyboardEvent<HTMLInputElement>
  ) {
    event.preventDefault();
    if (event.code === "Enter") {
      setUserInput(event.currentTarget.value);
    }
  }

  function setUserInput(value: string) {
    setCurrentInput("");
    const res = parseInput(value);
    if (res) {
      switch (res.key) {
        case "date":
          if (!res.val) break; // e.g empty string
          if (species.includes(res.val)) break;
          setDate(res.val);
          break;
        case "species":
          if (!res.val) break; // e.g empty string
          if (species.includes(res.val)) break;
          setSpecies([...species, res.val]);
          break;
        case "speed":
          setSpeed(parseInt(res.val));
          break;
        case "author":
          if (!res.val) break; // e.g empty string
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
          placeholder="/species <pokemon>, /speed <speedtier>, /author <name> or /date <yyyy-mm-dd>, then press Enter"
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
            setUserInput(document.getElementById("cli").getAttribute("value"));
          }}>
          <i class="fa fa-plus" /> Add{" "}
        </button>
      </div>
      <div class={style.query}>
        {
          <div class={style.chosen}>
            <h5>Filters: </h5>
            {species.map((val) => (
              <Filter
                filterType={"species"}
                filterValue={val}
                remove={(event) => {
                  event.preventDefault();
                  setSpecies([...species].filter((el) => el !== val));
                }}></Filter>
            ))}
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
          </div>
        }
        <button
          class={`${style.btn}`}
          onClick={(e) => {
            e.preventDefault();
            fetchResults({
              variables: {
                species: species,
                author: author,
                speed: speed,
                date: date,
                cursor: 0,
              },
            });
          }}>
          <i class="fa fa-search" /> Search
        </button>
      </div>
    </form>
  );
};

export { SearchComponent };
