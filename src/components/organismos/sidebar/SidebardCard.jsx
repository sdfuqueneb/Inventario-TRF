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
            bgcolor={variable.colorPrincipal} 
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

  .cardContent {
    position: relative;
    padding: 1.5rem 1rem 1rem;
    background: linear-gradient(135deg, ${(props) => props.theme.text}11, ${(props) => props.theme.primary}11);
    border: 1px solid ${(props) => props.theme.text}22;
    border-radius: 14px;
    overflow: hidden;
    box-shadow: ${variable.boxshadowGray};

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: ${(props) => props.theme.primary};
      border-radius: 14px 14px 0 0;
    }

    h3 {
      font-size: 1.1rem;
      margin-top: 0.5rem;
      font-weight: 800;
      color: ${(props) => props.theme.text};
    }

    .subtitle {
      font-size: 0.85rem;
      color: ${(props) => props.theme.colorSubtitle || "#666"};
      margin-bottom: 1.2rem;
    }

    .contentBtn {
      position: relative;
      display: flex;
      justify-content: center;
      margin-top: 0.5rem;
    }
  }
`;