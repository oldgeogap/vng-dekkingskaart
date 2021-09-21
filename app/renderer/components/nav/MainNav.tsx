import { Button, IconButton } from "@chakra-ui/react";
import Link from "next/link";
import * as React from "react";
import { styled } from "renderer/ui/theme";
import { IoSettingsOutline } from "react-icons/io5";
import { useRouter } from "next/router";

export interface MainNavProps {}

export function MainNav({}: MainNavProps) {
  const { asPath } = useRouter();

  const check = (s: string) => {
    return asPath.startsWith("/" + s) ? "active" : undefined;
  };

  return (
    <NavContainer>
      <LogoType>
        <img src="/logo.svg" />
      </LogoType>
      <Tabs>
        <Tab className={check("home")}>
          <Link href="/home">
            <a>Test</a>
          </Link>
        </Tab>
        <Tab className={check("upload")}>
          <Link href="/upload">
            <a>Dekkingskaarten</a>
          </Link>
        </Tab>
        <Tab className={check("minicompetitie")}>
          <Link href="/minicompetitie">
            <a>Minicompetitie</a>
          </Link>
        </Tab>
        <Tab className={check("locatiecheck")}>
          <Link href="/locatiecheck">
            <a>Locatiecheck</a>
          </Link>
        </Tab>
        <Tab className={check("randomizer")}>
          <Link href="/randomizer">
            <a>Randomizer</a>
          </Link>
        </Tab>
      </Tabs>
      <SideNav>
        <Link href="/instellingen">
          <IconButton aria-label="Instellingen" icon={<IoSettingsOutline />} size="sm" isRound variant="ghost" />
        </Link>
      </SideNav>
    </NavContainer>
  );
}

const NavContainer = styled.nav`
  grid-area: nav;
  background-color: #fff;
  border-bottom: 1px solid ${(props) => props.theme.colors.bg[100]};
  display: flex;
  align-items: stretch;
  justify-content: space-between;
`;

const LogoType = styled.aside`
  flex: 0 0 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    height: 24px;
  }
`;

const Tabs = styled.ul`
  flex: 1 1 auto;
  display: flex;
  list-style: none;
`;

const Tab = styled.li`
  height: 44px;
  margin-bottom: -1px;
  display: flex;
  align-items: center;
  margin-right: 16px;
  border-bottom: 1px solid ${(props) => props.theme.colors.bg[100]};
  &:hover {
    border-bottom: 1px solid ${(props) => props.theme.colors.bg[200]};
    a {
      color: #000;
    }
  }
  &.active {
    border-bottom: 1px solid black;
    a {
      color: #000;
    }
  }

  a {
    text-transform: uppercase;
    font-weight: bold;
    font-size: 12px;
    color: ${(props) => props.theme.colors.bg[500]};
  }
`;

const SideNav = styled.aside`
  display: flex;
  align-items: center;
  padding: 0 10px;
`;
