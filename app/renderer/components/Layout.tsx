import React, { ReactNode } from "react";
import Link from "next/link";
import Head from "next/head";
import styled from "@emotion/styled";
import { MainNav } from "./nav/MainNav";

type Props = {
  children: ReactNode;
  title?: string;
};

const Layout = ({ children, title = "VNG Dekkingskaart" }: Props) => (
  <LayoutContainer>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>

    <MainNav />

    <Slot>{children}</Slot>
  </LayoutContainer>
);

export default Layout;

const LayoutContainer = styled.main`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1;

  display: grid;
  gap: 0 0;
  grid-template-columns: 1fr;
  grid-template-rows: 44px 1fr;
  grid-template-areas:
    "nav"
    "slot";
`;

const Slot = styled.main`
  grid-area: slot;
  background-color: white;
  overflow: hidden;
  display: flex;
  align-items: stretch;
`;
