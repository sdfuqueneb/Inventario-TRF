import styled from "styled-components";

/**
 * Btnnew: Botón con efecto hover dinámico.
 * @param {function} funcion - Acción al hacer clic.
 * @param {string} titulo - Texto del botón.
 * @param {string} color - Color principal (ej: "#0077ff").
 * @param {string} url - Si se provee, el botón actúa como enlace.
 * @param {string} type - Tipo de botón (button, submit, reset).
 */
export function Btnnew({ funcion, titulo, color = "#0077ff", url, type = "button" }) {
  return (
    <Container
      as={url ? "a" : "button"}
      type={url ? undefined : type}
      onClick={funcion}
      href={url}
      target={url ? "_blank" : undefined}
      rel={url ? "noreferrer" : undefined}
      $color={color}
    >
      {titulo}
    </Container>
  );
}

const Container = styled.button`
  --color: ${(props) => props.$color};
  font-family: inherit;
  display: inline-block;
  width: auto;
  min-width: 120px;
  height: 2.6em;
  line-height: 2.5em;
  overflow: hidden;
  cursor: pointer;
  margin: 10px;
  padding: 0 20px;
  font-size: 17px;
  z-index: 1;
  color: var(--color);
  border: 2px solid var(--color);
  border-radius: 6px;
  position: relative;
  background: transparent;
  transition: color 0.3s ease;
  text-decoration: none;
  text-align: center;
  font-weight: 500;

  &::before {
    position: absolute;
    content: "";
    background: var(--color);
    width: 150px;
    height: 200px;
    z-index: -1;
    border-radius: 50%;
    top: 100%;
    left: 100%;
    transition: 0.3s all;
  }

  &:hover {
    color: white;
  }

  &:hover::before {
    top: -30px;
    left: -30px;
  }
`;