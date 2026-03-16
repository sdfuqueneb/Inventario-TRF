import styled from "styled-components";
import { variable } from "../../../styles/variables";
import { Btnsave } from "../../moleculas/Btnsave";

export function SidebarCard() {
  
  return (
    <Container>
      <span className="icon">{<variable.iconoayuda />}</span>
      <div className="cardContent">
        <h3>Cerrar sesión</h3>
        <div className="contentBtn">
          <Btnsave titulo="Cerrar" bgcolor="#997ff78e"  />
        </div>
      </div>
    </Container>
  );
}
const Container = styled.div`
  width: 100%;
  padding: 1rem;
  text-align: center;
  position: relative;

  .icon {
    position: absolute;
    font-size: 3rem;
    border-radius: 50%;
    top: -8px;
    right: 50%;
    transform: translate(50%);
    z-index: 100;
  }
  .cardContent {
    position: relative;
    padding: 1rem;
    background: ${(props) => props.theme.bg5};
    border-radius: 10px;
    overflow: hidden;

    h3 {
      font-size: 1.1rem;
      margin-top: 1rem;
      padding: 1rem 0;
      font-weight: 800;
      color: #000;
    }
    .contentBtn {
      position:relative;
      margin-left:-8px;
    }
  }
`;