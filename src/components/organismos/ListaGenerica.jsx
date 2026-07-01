import styled from "styled-components";
import { BtnCerrar } from "../atomos/BtnCerrar";
import { Device } from "../../styles/breackpoints";

export function ListaGenerica({ data, setState, funcion, scroll, bottom }) {
  const seleccionar = (p) => {
    funcion(p);
    setState();
  };
  return (
    <Container $scroll={scroll} $bottom={bottom}>
      <section className="contentClose">
        <BtnCerrar funcion={setState}/>
      </section>
      <section className="contentItems">
        {data.map((item, index) => {
          return (
            <ItemContainer key={index} onClick={() => seleccionar(item)}>
              <span>⭐</span>
              <span>{item.descripcion}</span>
            </ItemContainer>
          );
        })}
      </section>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  position: absolute;
  margin-bottom: 15px;
  bottom: ${(props) => props.$bottom};
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  gap: 0px;
  z-index: 3;
  height: 230px;
  
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.12);

  @media ${Device.tablet} {
    width: 400px;
  }
  .contentItems {
    overflow-y: ${(props) => props.$scroll};
  }
`;

const ItemContainer = styled.div`
  gap: 10px;
  display: flex;
  padding: 8px 10px; 
  cursor: pointer;
  transition: 0.2s;
  align-items: center;
  
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 0px; 

  &:first-child {
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
  }

  &:last-child {
    border-bottom: none;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
  }
  
  &:hover {
    background-color: ${({ theme }) => theme.bgtotal || "rgba(0, 0, 0, 0.04)"};
  }
`;