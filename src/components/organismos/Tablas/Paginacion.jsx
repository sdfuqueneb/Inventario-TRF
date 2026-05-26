import styled from "styled-components";
import { variable } from "../../../styles/variables";

export function Paginacion({ table, pagina, maximo, irinicio }) {
  return (
  <Container>
    <button onClick={irinicio} disabled={!table.getCanPreviousPage()}>
      <span className="iconos"><variable.iconotodos /></span>
    </button>
    <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
      <span className="iconos izq"><variable.iconoflechaderecha /></span>
    </button>
    <span>{pagina}</span>
    <p>de {maximo}</p>
    <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
      <span className="iconos"><variable.iconoflechaderecha /></span>
    </button>
  </Container>
);
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  padding: 12px 0;  
  width: 100%;

  button{
  background-color: #2EC971;
    border: none;
    padding: 5px 10px;
    border-radius: 3px;
    height: 40px;
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    text-align: center;
    transition: 0.3s;
    flex-shrink: 0;  

    &:hover{
      box-shadow: 0px 10px 15px -3px ${(props) => props.$colorCategoria}
    }

    .iconos{
      color: #fff;
      &.izq{
        transform: rotate(-180deg);
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }

  button[disabled]{
    background-color: #646464;
    cursor: no-drop;
    box-shadow: none;
  }

  span, p {
    font-size: 14px;
    color: ${({ theme }) => theme.text};
  }
`;