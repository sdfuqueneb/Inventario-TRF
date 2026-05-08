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
  justify-content: flex-start; 
  align-items: center;
  padding-left: 15px; 
  width: 100%;

  .switch {
    font-size: 14px;
    position: relative;
    display: inline-block;
    width: 3.5em;
    height: 1.8em;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    --background: #012452; 
    position: absolute;
    cursor: pointer;
    inset: 0;
    background-color: var(--background);
    transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 30px;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 1.2em;
    width: 1.2em;
    border-radius: 50%;
    left: 0.3em;
    bottom: 0.25em;
    box-shadow: inset 5px -2px 0px 0px #EFF1F3; 
    background: var(--background);
    transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 1;
  }

  input:checked + .slider {
    background-color: #2EC971; 
  }

  input:checked + .slider:before {
    transform: translateX(1.7em);
    box-shadow: inset 15px -4px 0px 15px #FFD700; 
    background: #FFD700;
  }
`;