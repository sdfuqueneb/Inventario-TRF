import styled from "styled-components";
import { useContext } from "react";
import { ThemeContext } from "../../App";

export function ToggleTema() {
  const { theme, setTheme } = useContext(ThemeContext);

  const CambiarTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <Container>
      <label className="switch">
        <input
          type="checkbox"
          checked={theme === "light"}
          onChange={CambiarTheme}
        />
        <span className="slider"></span>
      </label>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: flex;
  align-items: center;
  margin-left: 5px;

  /* switch */
  .switch {
    font-size: 17px;
    position: relative;
    display: inline-block;
    width: 3.5em;
    height: 2em;
  }

  /* hide checkbox */
  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  /* slider */
  .slider {
    --background: ${({ theme }) => theme.bgToggle || "#633af7"};
    position: absolute;
    cursor: pointer;
    inset: 0;
    background-color: var(--background);
    transition: 0.5s;
    border-radius: 30px;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 1.4em;
    width: 1.4em;
    border-radius: 50%;
    left: 10%;
    bottom: 15%;
    box-shadow: inset 8px -4px 0px 0px #fff000;
    background: var(--background);
    transition: 0.5s;
  }

  input:checked + .slider {
    background-color: ${({ theme }) => theme.bgToggleActive || "#522ba7"};
  }

  input:checked + .slider:before {
    transform: translateX(100%);
    box-shadow: inset 15px -4px 0px 15px #fff000;
  }
`;