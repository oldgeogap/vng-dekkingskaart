import electron from "electron";
import Link from "next/link";
import * as React from "react";
import { styled } from "renderer/ui/theme";
import { IoSettingsOutline } from "react-icons/io5";
import { useRouter } from "next/router";
import url from "url";
import path from "path";

export interface MainNavProps {}

function openPDF(filePath) {
  let pdfWindow = new electron.remote.BrowserWindow({
    icon: "./build/icon.png",
    width: 1200,
    height: 800,
    webPreferences: {
      plugins: true
    }
  });

  let fullPath = path.resolve(electron.remote.app.getAppPath(), filePath);

  pdfWindow.loadURL(
    url.format({
      pathname: fullPath,
      protocol: "file:",
      slashes: true
    })
  );

  pdfWindow.setMenu(null);

  pdfWindow.on("closed", function () {
    pdfWindow = null;
  });
}

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
        <a
          onClick={() => {
            openPDF("./app/documentatie.pdf");
          }}
        >
          Documentatie
        </a>
        <Link href="/version">
          <a>v{process.env.VERSION}</a>
        </Link>
      </SideNav>
    </NavContainer>
  );
}

const NavContainer = styled.nav`
  grid-area: nav;
  background-color: #fff;
  background-color: ${(props) => props.theme.colors.bg[800]};
  border-bottom: 1px solid ${(props) => props.theme.colors.brand[800]};
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

  border-top: 2px solid ${(props) => props.theme.colors.brand[900]};
  padding: 0 8px;
  &:hover {
    border-top: 2px solid ${(props) => props.theme.colors.bg[200]};
    a {
      color: #fff;
    }
  }
  &.active {
    border-top: 2px solid ${(props) => props.theme.colors.brand[400]};
    a {
      color: ${(props) => props.theme.colors.brand[400]};
    }
  }

  a {
    text-transform: uppercase;
    font-weight: bold;
    font-size: 12px;
    color: ${(props) => props.theme.colors.bg[300]};
  }
`;

const SideNav = styled.aside`
  display: flex;
  align-items: center;
  padding: 0 20px;

  a {
    display: inline-block;
    text-transform: uppercase;
    font-weight: bold;
    font-size: 12px;
    color: ${(props) => props.theme.colors.bg[300]};
    cursor: pointer;
    margin-left: 8px;
  }
`;
