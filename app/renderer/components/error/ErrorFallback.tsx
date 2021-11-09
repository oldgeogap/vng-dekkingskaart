import React from "react";

export interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: (...args: Array<unknown>) => void;
}

export function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  const style: React.CSSProperties = {
    backgroundColor: "#001421",
    padding: "64px 64px 80px 64px",
    color: "#abe9ff",
    margin: "64px",
    borderRadius: "32px"
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: "#00a1e6",
    color: "#fff",
    borderRadius: "6px",
    border: "0",
    padding: "8px 16px",
    fontSize: "16px"
  };
  return (
    <div role="alert" style={style}>
      <h1 style={{ color: "red" }}>{error.name}</h1>
      <p>Er is iets mis gegaan:</p>
      <div style={{ backgroundColor: "#005982", padding: "32px", borderRadius: "6px" }}>
        <pre style={{ color: "#d8f9ff" }}>{error.message}</pre>
      </div>
      <br />
      <br />
      <button style={buttonStyle} onClick={resetErrorBoundary}>
        Probier opnieuw
      </button>
    </div>
  );
}
