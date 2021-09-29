import { styled } from "../theme";

export const FilterSelection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #fff;

  h2 {
    font-weight: bold;
    padding: 4px 16px;
    color: ${(props) => props.theme.colors.brand[800]};
  }
  section {
    h3 {
      text-transform: uppercase;
      font-size: 11px;
      padding: 4px 16px;
      font-weight: bold;
    }
  }
`;

export const Filters = styled.section`
  flex: 0 1 auto;
`;

export const Selection = styled.section`
  flex: 0 1 auto;
`;

export const Options = styled.section`
  flex: 1 1 auto;
  background-color: ${(props) => props.theme.colors.bg[50]};
  overflow-y: scroll;
`;

export const Option = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 16px 4px 16px;

  color: ${(props) => props.theme.colors.brand[800]};
  input {
    margin-right: 8px;
  }
  label {
    flex: 1 1 auto;
  }
  &:hover {
    background-color: ${(props) => props.theme.colors.brand[400]};
    color: #fff;
  }

  &:last-of-type {
    border-bottom: none;
  }
`;
