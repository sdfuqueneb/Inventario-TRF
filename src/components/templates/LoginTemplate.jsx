import styled from "styled-components";
import { InputText } from "../organismos/formularios/InputText";
import { FooterLogin } from "../organismos/FooterLogin";
import { variable } from "../../styles/variables";
import { Btnsave } from "../../components/moleculas/Btnsave";
import {useAuthStore} from "../../store/AuthStore"
import { Device } from "../../styles/breackpoints";
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import carrito from "../../assets/carrito.svg";
import logo from "../../assets/inventarioslogo.png";
import { MdOutlineInfo } from "react-icons/md";
import { ThemeContext } from "../../App";
import { RegistrarAdmin } from "../organismos/formularios/RegistrarAdmin";

export function LoginTemplate() {
  const { setTheme } = useContext(ThemeContext);
  useEffect(() => {
    setTheme("light");
  }, []);
  const { signInWithEmail } = useAuthStore();
  const [state, setState] = useState(false);
  const [stateInicio, setStateInicio] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  async function iniciar(data) {
  try {
    const response = await signInWithEmail({
      correo: data.correo,
      pass: data.pass,
    });
      if (response) {
        navigate("/");
      } else {
        setStateInicio(true);
      }
      } catch (error) {
        setStateInicio(true);
        console.error("Error al iniciar sesión:", error);
      }
    } 

  return (
    <Container>
      <div className="contentLogo">
        <img src={logo}></img>
        <span>Transforma</span>
      </div>

      <div className="bannerlateral">
      </div>

      <div className="contentCard">
        <div className="card">
          {
            state && <RegistrarAdmin setState={() => setState(!state)}/>
          }
          <Titulo>Transforma</Titulo>
          {stateInicio && (
            <TextoStateInicio>Datos incorrectos</TextoStateInicio>
          )}
          <p className="frase">Inventario</p>
          <form onSubmit={handleSubmit(iniciar)}>
            <InputText icono={<variable.iconoemail />}>
              <input
                className="form__field"
                type="text"
                placeholder="email"
                {...register("correo", {
                  required: true,
                })}
              />
              <label className="form__label">Correo electrónico</label>
              {errors.correo?.type === "required" && <p>Campo Obligatorio</p>}
            </InputText>
            <InputText icono={<variable.iconopass />}>
              <input
                className="form__field"
                type="password"
                placeholder="contraseña"
                {...register("pass", {
                  required: true,
                })}
              />
              <label className="form__label">Contraseña</label>
              {errors.pass?.type === "required" && <p>Campo Obligatorio</p>}
            </InputText>
            <ContainerBtn>
              <Btnsave 
                type="submit" 
                titulo="Iniciar sesión" 
                bgcolor="#85A1FF" 
              />
              
              <Btnsave
                type="button"
                funcion={() => setState(!state)}
                titulo="Crear cuenta"
                bgcolor="#85A1FF"
              />
            </ContainerBtn>
          </form>
        </div>
        <FooterLogin />
      </div>
    </Container>
  );
}
const Container = styled.div`
  background-size: cover;
  height: 100vh;
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: #262626;
  @media ${Device.tablet} {
    grid-template-columns: 1fr 2fr;
  }
  .contentLogo {
    position: absolute;
    top: 15px;
    font-weight: 700;
    display: flex;
    left: 15px;
    align-items: center;
    color: #fff;

    img {
      width: 50px;
    }
  }
  .cuadros {
    transition: cubic-bezier(0.4, 0, 0.2, 1) 0.6s;
    position: absolute;
    height: 100%;
    width: 100%;
    bottom: 0;
    transition: 0.6s;
  }

  .bannerlateral {
    background-color: #5776FF;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 80%;
    }
  }
  .contentCard {
    grid-column: 2;
    background-color: #ffffff;
    background-size: cover;
    z-index: 100;
    position: relative;
    gap: 30px;
    display: flex;
    padding: 20px;
    box-shadow: 8px 5px 18px 3px rgba(0, 0, 0, 0.35);
    justify-content: center;
    width: auto;
    height: 100%;
    width: 100%;
    align-items: center;
    flex-direction: column;
    justify-content: space-between;
    .card {
      padding-top: 80px;
      width: 100%;
      @media ${Device.laptop} {
        width: 50%;
      }
    }
    .version {
      color: #727272;
      text-align: start;
    }
    .contentImg {
      width: 100%;
      display: flex;
      justify-content: center;

      img {
        width: 40%;

        animation: flotar 1.5s ease-in-out infinite alternate;
      }
    }
    .frase {
      color: #5776FF;
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 30px;
    }
    &:hover {
      .contentsvg {
        top: -100px;
        opacity: 1;
      }
      .cuadros {
        transform: rotate(37deg) rotateX(5deg) rotateY(12deg) rotate(3deg)
          skew(2deg) skewY(1deg) scaleX(1.2) scaleY(1.2);
        color: red;
      }
    }
  }
  @keyframes flotar {
    0% {
      transform: translate(0, 0px);
    }
    50% {
      transform: translate(0, 15px);
    }
    100% {
      transform: translate(0, -0px);
    }
  }
`;
const Titulo = styled.span`
  font-size: 3rem;
  font-weight: 700;
`;
const ContainerBtn = styled.div`
  margin-top: 15px;
  display: flex;
  justify-content: center;
  gap: 12px;
`;
const TextoStateInicio = styled.p`
  color: #5776FF;
`;