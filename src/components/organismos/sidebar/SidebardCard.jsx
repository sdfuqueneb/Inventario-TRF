import styled from "styled-components";
import { variable } from "../../../styles/variables";
import { Btnsave } from "../../moleculas/Btnsave";
import { useAuthStore } from "../../../store/AuthStore";
import { useNavigate } from "react-router-dom";

export function SidebarCard() {
  const { signOut } = useAuthStore();
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut();
    navigate("/login");
  }

  return (
    <Container>
      <div className="cardContent">
        <h3>Cerrar sesión</h3>
        <p className="subtitle">¿Deseas salir de tu cuenta?</p>
        <div className="contentBtn">
          <Btnsave
            titulo="Cerrar"
            bgcolor="#5776FF"
            funcion={handleLogout}
          />
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
    display: flex;       
    align-items: center;
    justify-content: center;
    line-height: 0;         
    flex-shrink: 0;
  svg {              
    display: block;
  }}

  .cardContent {
    position: relative;
    padding: 1.5rem 1rem 1rem;
    background: linear-gradient(135deg, #5776ff22, #997ff722);
    border: 1px solid #5776ff33;
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 4px 16px rgba(87, 118, 255, 0.15);

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #5776ff, #997ff7);
      border-radius: 14px 14px 0 0;
    }

    h3 {
      font-size: 1.1rem;
      margin-top: 1rem;
      padding: 0.5rem 0 0.25rem;
      font-weight: 800;
      color: ${(props) => props.theme.text || "#000"};
    }

    .subtitle {
      font-size: 0.8rem;
      color: ${(props) => props.theme.text2 || "#666"};
      margin-bottom: 1rem;
    }

    .contentBtn {
      position: relative;
      display: flex;
      justify-content: center;
      margin-top: 0.5rem;
    }
  }
`;