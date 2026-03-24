import styled from "styled-components";

export function Btnsave({ funcion, titulo, bgcolor = "#879dff79", url, type = "button" }) {
  return (
    <Container
      as={url ? "a" : "button"}
      type={url ? undefined : type}
      onClick={funcion}
      href={url}
      target={url ? "_blank" : undefined}
      rel={url ? "noreferrer" : undefined}
    >
      <div className="slider" style={{ background: bgcolor }}>
        <svg
          className="icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1024 1024"
          height="25px"
          width="25px"
        >
          <path
            d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
            fill="#ffffff"
          />
          <path
            d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
            fill="#ffffff"
          />
        </svg>
      </div>
      <span className="text">{titulo}</span>
    </Container>
  );
}

const Container = styled.a`
  background: #879dff79;
  width: 196px;
  height: 56px;
  border-radius: 16px;
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  text-decoration: none;

  display: flex;
  align-items: center;
  justify-content: center;

  .slider {
    position: absolute;
    left: 4px;
    top: 4px;
    height: calc(100% - 8px);
    width: 46px;
    border-radius: 12px;

    display: flex;
    align-items: center;
    justify-content: center;

    transition: width 0.5s ease;
    z-index: 2;
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .text {
    font-size: 16px;
    font-weight: 600;
    white-space: nowrap;
    color: black;
    z-index: 1;
    padding-left: 8px;
  }

  &:hover .slider {
    width: calc(100% - 8px);
  }
`;