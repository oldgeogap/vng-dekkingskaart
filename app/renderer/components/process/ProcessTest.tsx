import * as React from "react";
import { db } from "../../db";
import { useLiveQuery } from "../../hooks/useLiveQuery";

export interface ProcessTestProps {}

export function ProcessTest({}: ProcessTestProps) {
  const providers = useLiveQuery(() => db.provider.toCollection().sortBy("name"), []);

  if (!providers) return <p>Loading?</p>;
  return (
    <div>
      <h1>DB Test</h1>
      {providers.map((p) => (
        <div key={p.id}>{p.name}</div>
      ))}
    </div>
  );
}
