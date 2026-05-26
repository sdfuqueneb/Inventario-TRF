import styled from "styled-components";
import { variable } from "../../styles/variables";
export function BtnCerrar({ funcion }) {
  return <Container onClick={funcion}>{<variable.iconocerrar />}</Container>;
}
const Container = styled.div`
  cursor: pointer;
  font-size: 25px;
  transition: all 0.2s;
  &:hover {
    color: ${variable.colorselector};
  }
`;