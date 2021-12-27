import { FunctionalComponent, h } from "preact";
import style from "./style.css";

interface Props {
  filterType: string;
  filterValue: string;
  remove: h.JSX.MouseEventHandler<HTMLButtonElement>;
}

const Filter: FunctionalComponent<Props> = (props: Props) => {
  return (
    <div class={style.filter}>
      <span>{props.filterType + ": " + props.filterValue}</span>
      <button
        onClick={props.remove}
        class={`${style.btn} fa fa-trash`}></button>
    </div>
  );
};

export default Filter;
