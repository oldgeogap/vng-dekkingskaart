import * as React from "react";
import { LocationPoint } from "renderer/types";
import { parsePointString } from "renderer/util";

function _getLookupRequest(p: LocationPoint) {
  return `https://api.pdok.nl/bzk/locatieserver/search/v3_1/reverse?lon=${p.x}&lat=${p.y}`;
}

export type ReverseGeocoderResult = {
  type: string;
  weergavenaam: string;
  id: string;
  score: number;
  afstand: number;
};

export type UseReverseGeocoderParams = {
  points: LocationPoint[];
};
export type UseReverseGeocoderReturn = {
  loading: boolean;
  result: any;
  error?: string;
};

export function useReverseGeocoder({ points }: UseReverseGeocoderParams): UseReverseGeocoderReturn {
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<(ReverseGeocoderResult | null)[] | null>(null);
  const [error, setError] = React.useState(null);
  React.useEffect(() => {
    const action = async (p: LocationPoint[]) => {
      try {
        let result = [];
        for (let i = 0; i < p.length; i++) {
          const response = await fetch(_getLookupRequest(p[i]));
          const json = await response.json();
          if (json.response && json.response.docs && json.response.docs.length > 0) {
            result.push(json.response.docs[0]);
          } else {
            result.push(null);
          }
        }
        setResult(result);
        setLoading(false);
      } catch (err) {
        console.error("Geocode request error:", err);
        setLoading(false);
        setError(err.message);
      }
    };
    if (points) {
      setLoading(true);
      action(points);
    }
  }, [points]);

  return {
    loading,
    result,
    error
  };
}
