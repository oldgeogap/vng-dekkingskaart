import { Page } from "@react-pdf/renderer";
import { PageHeader } from "./Header";
export const VNGPage: React.FC = ({ children }) => {
  return (
    <Page size="A4" style={{ padding: "16px 32px 16px 32px" }}>
      <PageHeader />
      {children}
    </Page>
  );
};
