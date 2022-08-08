/* style */
import style from "./style.css";

/* preact types */
import { FunctionalComponent, h } from "preact";

/* custom types */
import { Set } from "../../helpers/types";
import { StateUpdater, useEffect, useState } from "preact/hooks";
import { Popup } from "../popup";
import { Result } from "../result";
import InfiniteScroll from "react-infinite-scroll-component";

interface ResultProps {
  results: any;
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

  useEffect(() => {
    const root = document.getElementById("results_scrollable");
    if (props.results.next && root.scrollHeight <= root.clientHeight) {
      fetchMore(props.results.next);
    }
  }, [props.results]);

  const getSet = (id: string) => sets.find((set) => set.id === parseInt(id));
  return (
    <div
      class={style.results}
      id="results_scrollable"
      // onScroll={(e) => {
      //   e.preventDefault();
      // }}
    >
      {chosen && !editable && (
        <Popup set={getSet(chosen)!} setChosen={setChosen} />
      )}
      <ul class={style.scrollable}>
        {sets.length ? (
          <InfiniteScroll
            dataLength={sets.length}
            next={() => fetchMore(props.results.next)}
            hasMore={props.results.next}
            loader={<h4>Loading...</h4>}
            endMessage={
              <p style={{ textAlign: "center" }}>
                <b>[no more results]</b>
              </p>
            }
            scrollableTarget="results_scrollable">
            {sets.map((set) => (
              <Result
                key={set.id.toString()}
                set={set}
                onClick={(e) => {
                  e.preventDefault();
                  const key = set.id.toString();
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
          </InfiniteScroll>
        ) : (
          <div></div>
        )}
      </ul>
    </div>
  );
};

export { Results };
