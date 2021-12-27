/* style */
import style from "./style.css";

/* preact types */
import { FunctionalComponent, h } from "preact";

/* custom types */
import { Set } from "../../helpers/types";
import { StateUpdater, useState } from "preact/hooks";
import { Popup } from "../popup";
import { Result } from "../result";

interface ResultProps {
  results: { next_cursor: number | null; sets: Set[] };
  fetchMore: any; // too lazy to write out the type
  editable?: boolean;
  selected?: string[];
  setSelected?: StateUpdater<string[]>;
}

const Results: FunctionalComponent<ResultProps> = (props: ResultProps) => {
  const [chosen, setChosen] = useState(""); // use set ID since it is unique
  const selected = props.selected;
  const setSelected = props.setSelected;
  const fetchMore = props.fetchMore;
  const sets = props.results.sets;
  const next_cursor = props.results.next_cursor;
  const editable = props.editable;

  const getSet = (id: string) =>
    sets.find((set) => set.set_id === parseInt(id));
  return (
    <div
      class={style.results}
      onScroll={(e) => {
        e.preventDefault();
      }}>
      {chosen && !editable && (
        <Popup set={getSet(chosen)!} setChosen={setChosen} />
      )}
      <ul class={style.scrollable}>
        {sets.map((set) => (
          <Result
            key={set.set_id.toString()}
            set={set}
            onClick={(e) => {
              e.preventDefault();
              const key = set.set_id.toString();
              if (!editable) setChosen(key);
              if (editable) {
                if (selected!.includes(key)) {
                  e.currentTarget.classList.remove(style.highlighted);
                  setSelected!(selected!.filter((el) => el !== key));
                } else {
                  e.currentTarget.classList.add(style.highlighted);
                  setSelected!([...selected!, key]);
                }
                console.log(e.currentTarget.classList);
              }
            }}
          />
        ))}
      </ul>
      {next_cursor && (
        <button
          class={style.more}
          onClick={(e) => {
            e.preventDefault();
            console.log(next_cursor);
            if (next_cursor && fetchMore)
              fetchMore({ variables: { cursor: next_cursor } });
          }}>
          <i class="fa fa-chevron-down" />
        </button>
      )}
    </div>
  );
};

export { Results };
