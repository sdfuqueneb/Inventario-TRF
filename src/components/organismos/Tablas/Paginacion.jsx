import styled from "styled-components";
import { variable } from "../../../styles/variables";
import { useNavigate } from "react-router-dom";

export function Paginacion({ table, pagina, maximo, irinicio }) {
  const navigate = useNavigate();

  const IconoConfig = variable.iconoconfiguracion || variable.iconocorreo || variable.iconotodos;

  return (
    <Container>
      <button onClick={() => navigate("/configurarcuenta")} title="Volver a Configuración">
        <span className="iconos">
          {variable.iconoconfiguracion ? <variable.iconoconfiguracion /> : "📁"}
        </span>
      </button>

      <div className="separador-controles" />

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

  .separador-controles {
    width: 2px;
    height: 25px;
    background-color: ${({ theme }) => theme.bg2 || "#484848"};
    margin: 0 5px;
  }

  button {
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

    &:hover {
      box-shadow: 0px 10px 15px -3px ${(props) => props.$colorCategoria};
    }

    .iconos {
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      
      &.izq {
        transform: rotate(-180deg);
      }
    }
  }

  button[disabled] {
    background-color: #646464;
    cursor: no-drop;
    box-shadow: none;
  }

  span, p {
    font-size: 14px;
    color: ${({ theme }) => theme.text};
  }
`;