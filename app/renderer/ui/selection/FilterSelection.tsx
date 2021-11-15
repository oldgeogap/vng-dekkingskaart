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

  label {
    flex: 1 1 auto;
  }
  &.option-prop {
    label {
      flex: 0 0 24px;
    }
  }

  &.over {
    flex: 0 0 45%;
    overflow-y: auto;
  }

  &.scrollit {
    overflow-y: auto;
    padding-bottom: 32px;
  }
`;

export const Options = styled.section`
  flex: 1 1 auto;
  background-color: ${(props) => props.theme.colors.bg[50]};
  overflow-y: scroll;

  label {
    flex: 1 1 auto;
  }
  &.option-prop {
    label {
      flex: 0 0 24px;
    }
  }
`;

export const Option = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 16px 4px 16px;
  cursor: pointer;

  color: ${(props) => props.theme.colors.brand[800]};
  input {
    margin-right: 8px;
  }

  &:hover {
    background-color: ${(props) => props.theme.colors.brand[400]};
    color: #fff;
  }

  &:last-of-type {
    border-bottom: none;
  }
`;

export const OptionProp = styled.div`
  flex: 1 1 auto;
  h6 {
    font-weight: bold;
    display: flex;
    justify-content: space-between;
  }

  p {
    margin: 0;
    padding: 0;

    font-size: 12px;
    text-transform: uppercase;

    span {
      color: ${(props) => props.theme.colors.brand[500]};
    }
  }
`;
