import styled from "styled-components";
import { GiPadlock } from "react-icons/gi";
export function FooterLogin() {
  return (
    <Container>
      <section className="lock">
        <GiPadlock />
        <span>
          Esta es una página segura de Transforma SAS. Si necesitas ayuda, comunícate con nosotros al ____ <br/> 
          para otros medios a través de <a href="https://www.youtube.com/" target="_blank" className="aranda" style={{ color: "#ff8616" }}>Aranda</a>, Albi o correo electrónico.
        </span>
      </section>
      <section className="derechos">
        <span>soporte@transformateam.com </span>
        <div className="separador"></div>
        <span> Todos los derechos reservados </span>
        <div className="separador"></div>
        <span>© 2026 Transforma SAS</span>
      </section>
    </Container>
  );
}
const Container = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 12.2px;
  color: #91a4b7;
  gap:5px;
  .lock {
    border-bottom: 1px solid rgba(145, 164, 183,0.3);
    gap:5px;
    display:flex;
    align-items:center;
  }
  .aranda {
    text-decoration: none; 
  }
  .derechos {
    display: flex;
    justify-content: space-between;
   .separador{
    width:1px;
    background-color:rgba(145, 164, 183,0.3);
    margin-top:4px;
    height:80%;
    align-items:center;
    display:flex;
   }
    span{
      margin-top:5px;
    }
  }
`;