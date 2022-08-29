import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "preact/hooks";

const useSetsQuery = () => {
  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [data, setData] = useState({
    sets: [],
    next: null,
    previous: null,
    count: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fetchData = async (url: string, more: boolean = true) => {
    setLoading(true);
    const token =
      !isLoading &&
      isAuthenticated &&
      (await getAccessTokenSilently({
        audience: "https://api.pokebrow.se",
        scope: "profile",
      }));
    fetch(url, {
      method: "GET",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
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
