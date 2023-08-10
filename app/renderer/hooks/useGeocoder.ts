import * as React from "react";
import { parsePointString } from "renderer/util";

function _getSuggestRequest(q: string) {
  return `https://api.pdok.nl/bzk/locatieserver/search/v3_1/suggest?wt=json&q=${encodeURIComponent(q)}`;
}

function _getLookupRequest(id: string) {
  return `https://api.pdok.nl/bzk/locatieserver/search/v3_1/lookup?wt=json&id=${id}`;
}

export type SuggestItem = {
  type: string;
  name: string;
  id: string;
  score: number;
};

export type SuggestItemAlternative = {
  name: string;
  suggestions: string[];
};

export type SuggestResult = {
  items: SuggestItem[];
  alternatives: SuggestItemAlternative[];
};

export type LookupResult = {
  coordinates: [number, number] | null;
  municipalityCode: string;
  municipalityName: string;
  streetName: string;
  streetNumber: string;
};

export type UseGeocoderParams = {};
export type UseGeocoderReturn = {
  loading: boolean;
  doQuery: (q: string) => void;
  doLookup: (id: string) => void;
  clear: () => void;
  suggestResult: SuggestResult | null;
  lookupResult: LookupResult | null;
};

export function useGeocoder({}: UseGeocoderParams): UseGeocoderReturn {
  const [query, setQuery] = React.useState<string | null>(null);
  const [lookup, setLookup] = React.useState<string | null>(null);
  const [suggestResult, setSuggestResult] = React.useState<SuggestResult | null>(null);
  const [lookupResult, setLookupResult] = React.useState<LookupResult | null>(null);
  React.useEffect(() => {
    const action = async (q: string) => {
      try {
        const response = await fetch(_getSuggestRequest(q));
        const json = await response.json();
        let items: SuggestItem[] = [];
        let alternatives: SuggestItemAlternative[] = [];
        if (json.response) {
          items = json.response.docs.map((doc) => ({
            type: doc.type,
            name: doc.weergavenaam,
            id: doc.id,
            score: doc.score
          }));
        }
        if (json.spellcheck && json.spellcheck.suggestions) {
          for (let i = 0, n = json.spellcheck.suggestions.length; i < n; i += 2) {
            alternatives.push({
              name: json.spellcheck.suggestions[i],
              suggestions: json.spellcheck.suggestions[i + 1].suggestion
            });
          }
        }

        setSuggestResult({
          items,
          alternatives
        });
        setQuery(null);
      } catch (err) {
        console.error("Geocode request error:", err);
      }
    };
    if (query) {
      action(query);
    }
  }, [query]);

  React.useEffect(() => {
    const action = async (id: string) => {
      try {
        const response = await fetch(_getLookupRequest(id));
        const json = await response.json();
        console.log(json);
        if (json && json.response && json.response.docs && json.response.docs.length > 0) {
          let doc = json.response.docs[0];
          setLookupResult({
            coordinates: parsePointString(doc.centroide_ll),
            municipalityCode: doc.gemeentecode,
            municipalityName: doc.gemeentenaam,
            streetName: doc.weergavenaam,
            streetNumber: doc.huisnummer
          });
        }
        setLookup(null);
      } catch (err) {
        console.error("Geocode request error:", err);
      }
    };
    if (lookup) {
      action(lookup);
    }
  }, [lookup]);

  const doQuery = (q: string) => {
    setQuery(q);
  };

  const doLookup = (id: string) => {
    setLookup(id);
  };

  const clear = () => {
    setQuery(null);
    setSuggestResult(null);
  };

  return {
    loading: query !== null || lookup !== null,
    doQuery,
    clear,
    suggestResult,
    doLookup,
    lookupResult
  };
}
