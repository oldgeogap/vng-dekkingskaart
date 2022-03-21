import * as React from "react";
import { styled } from "renderer/ui/theme";

export interface ErrorMessageProps {
  label: string;
  message: string;
}

function _location() {
  if (typeof window !== "undefined") {
    return window.location.href;
  }
  return "server";
}

export function ErrorMessage({ label, message }: ErrorMessageProps) {
  return (
    <ErrorMessageContainer>
      <h2>{label}</h2>
      <h3>{_location()}</h3>
      <article>{message}</article>
    </ErrorMessageContainer>
  );
}

const ErrorMessageContainer = styled.div`
  padding: 32px;

  h2 {
    font-weight: bold;
  }

  article {
    margin-top: 16px;
    border-radius: 4px;
    padding: 8px;
    background-color: #eee;
  }
`;
