import { useCallback, useEffect, useState } from "react";
import { getRides } from "../services/rideService";

export default function useRides(filters) {
  const [rides, setRides] = useState([]);
  const [status, setStatus] = useState("loading"); // "loading" | "success" | "error"

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const data = await getRides(filters);
      setRides(data);
      setStatus("success");
    } catch (err) {
      setStatus("error");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    load();
  }, [load]);

  return { rides, status, reload: load };
}
