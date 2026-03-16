import { MyRoutes } from "./routers/routes"
import { AuthContextProvider } from "./context/AuthContext";
import styled, { ThemeProvider } from "styled-components";
import { createContext, useState } from "react";
import { Light, Dark } from "./styles/themes";
import { Device } from "./styles/breackpoints";
import { Sidebar } from "./components/organismos/sidebar/Sidebar";
import { MenuHamburguesa } from "./components/organismos/MenuHamburguesa";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useLocation } from "react-router-dom";
import { Login } from "./pages/Login";

export const ThemeContext = createContext (null);

function App() {
  const [themeuse, setTheme] = useState("dark");
  const theme = themeuse === "light" ? "light" : "dark";
  const themeStyle = theme === "light" ? Light : Dark;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {pathname} = useLocation();

  return (
    <>
      <ThemeContext.Provider value={{theme, setTheme}}>
        <ThemeProvider theme={themeStyle}>
          <AuthContextProvider>
            {
              pathname!="/login" ? (
                <Container className={sidebarOpen ? "active" : ""}>
                  <section className="ContentSidebar">
                    <Sidebar state={sidebarOpen} setState={() => setSidebarOpen(!sidebarOpen)}/>
                  </section>
                  <section className="ContentMenuHamburguesa">
                    <MenuHamburguesa/>
                  </section>
                  <section className="ContentRoutes">
                    <MyRoutes/>
                  </section>
                </Container>
              ) : (<Login/>)
            }
            
            <ReactQueryDevtools initialIsOpen={false}/>
          </AuthContextProvider>
        </ThemeProvider>
      </ThemeContext.Provider>
    </>
  );
}

const Container = styled.main`
  display: grid;
  grid-template-columns: 1fr;
  background-color: ${({theme}) => theme.bgtotal};
  .ContentSidebar{
    display: none;
  }
  .ContentMenuHamburguesa{
    display: block;
    position: absolute;
    left: 20px;
  }
@media ${Device.tablet} {
  grid-template-columns: 65px 1fr;

  &.active{
    grid-template-columns: 220px 1fr;
  }

  .ContentSidebar{
    display: initial;
  }

  .ContentMenuHamburguesa{
    display: none;
  }

  .ContentRoutes{
    grid-column: 2;
    width: 100%;
  }
}
`;

export default App;
