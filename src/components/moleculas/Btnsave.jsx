import styled from "styled-components";
import { Icono } from "../atomos/Icono";

export function Btnsave({ funcion, titulo, bgcolor = "#594ade", icono, url }) {
  return (
    <Container onClick={funcion}>
      <div className="slider" style={{ background: bgcolor }}>
        <Icono className="icon">{icono}</Icono>
      </div>
      <span className="text">
        <a href={url} target="_blank" rel="noreferrer">
          {titulo}
        </a>
      </span>
    </Container>
  );
}

const Container = styled.button`
  background: #ffffff;
  width: 100%;
  height: 50px;
  border-radius: 14px;
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: center;

  .slider {
    position: absolute;
    left: 4px;
    top: 4px;
    height: calc(100% - 8px);
    width: 42px;
    border-radius: 10px;

    display: flex;
    align-items: center;
    justify-content: center;

    transition: 0.4s;
    z-index: 2;
  }

  .icon {
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .text {
    font-size: 16px;
    font-weight: 600;
    white-space: nowrap;
    z-index: 1;

    a {
      text-decoration: none;
      color: black;
    }
  }

  &:hover .slider {
    width: calc(100% - 8px);
  }
`;