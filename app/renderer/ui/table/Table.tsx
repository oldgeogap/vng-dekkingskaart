import * as React from "react";
import { styled } from "../theme";

export const Table = styled.table`
  th {
    text-align: left;
    text-transform: uppercase;
    font-weight: normal;
    font-size: 12px;
    position: sticky;
    top: 0;
  }
  tr {
    td {
      &:first-of-type {
        padding-left: 16px;
      }

      &:last-of-type {
        padding-right: 16px;
      }

      padding: 8px 0;
      border-bottom: 1px solid ${(props) => props.theme.colors.bg[100]};

      &.title {
        font-weight: bold;
      }

      &.created {
        label {
          padding: 0;
          margin: 0;
        }

        p {
          font-size: 10px;
          padding: 0;
          margin: 0;
        }
      }
      &.actions {
        width: 90px;
        button {
          margin-left: 4px;
        }
      }
    }
  }
`;
