import { motion } from "framer-motion";
import * as React from "react";
import { styled } from "renderer/ui/theme";
import { VscCheck } from "react-icons/vsc";
import { Heading, Icon, Spinner } from "@chakra-ui/react";

export type FeedbackEntry = {
  label: string;
  subLabel?: string;
  done: boolean;
};

export interface FeedbackPanelProps {
  title: string;
  entries: FeedbackEntry[];
}

export function FeedbackPanel({ title, entries }: FeedbackPanelProps) {
  return (
    <FeedbackContainer>
      <Feedback>
        <Heading mb="16px">{title}</Heading>
        <Entries>
          {entries.map((entry, index) => (
            <Entry key={index}>
              <section>
                <label>{entry.label}</label>
                {entry.subLabel && <p>{entry.subLabel}</p>}
              </section>
              {entry.done ? <Icon color="green.400" as={VscCheck} /> : <Spinner size="xs" />}
            </Entry>
          ))}
        </Entries>
      </Feedback>
    </FeedbackContainer>
  );
}

const FeedbackContainer = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;

  display: flex;
  align-items: center;
  justify-content: space-around;
`;

const _Feedback = styled.div``;
const Feedback = motion(_Feedback);
const Entries = styled.ul`
  list-style: none;
`;

const Entry = styled.li`
  display: flex;
  align-items: center;

  padding: 8px 0;
  border-bottom: 1px solid ${(props) => props.theme.colors.bg[50]};

  section {
    flex: 1 1 auto;
    margin-right: 16px;
  }
  label {
    font-weight: bold;
  }
  p {
  }
  &:last-of-type {
    border-bottom: none;
  }

  svg {
    margin-left: auto;
  }
`;
