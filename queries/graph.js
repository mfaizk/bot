import { api, graphEndPoint } from "@/service/api-service";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchBars = async ({ symbol, resolution, from, to }) => {
  const { data } = await api.get(graphEndPoint, {
    params: { symbol, resolution, from, to },
  });

  if (data.s !== "ok") throw new Error("No data");

  return data.t.map((t, i) => ({
    time: t,
    open: data.o[i],
    high: data.h[i],
    low: data.l[i],
    close: data.c[i],
    volume: data.v[i],
  }));
};
export const useBars = ({ symbol, resolution, from, to }) => {
  return useQuery({
    queryKey: ["bars", symbol, resolution],
    queryFn: () => fetchBars({ symbol, resolution, from, to }),
  });
};
