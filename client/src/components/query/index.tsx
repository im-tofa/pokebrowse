import { useState } from "preact/hooks";

const useSetsQuery = () => {
  const [data, setData] = useState({
    sets: [],
    next: null,
    previous: null,
    count: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fetchData = (url: string, more: boolean = true) => {
    setLoading(true);
    fetch(url, {
      method: "GET",
    })
      .then(async (res) => {
        if (res.status !== 200) throw Error();
        const json = await res.json();
        setData({
          count: json?.count,
          sets: more
            ? json?.results
              ? [...data.sets, ...json.results]
              : data.sets
            : json?.results
            ? [...json.results]
            : [],
          next: json?.next,
          previous: json?.previous,
        });
        setError("");
      })
      .catch((err) => {
        console.log("useSetsQuery()");
        console.error(err);
        setData(undefined);
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return { fetchData, results: { loading: loading, error: error, data: data } };
};

export { useSetsQuery };
