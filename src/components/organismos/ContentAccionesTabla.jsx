import styled from "styled-components";
import { AccionTabla} from "../atomos/AccionTabla"
import { variable } from "../../styles/variables"

export function ContentAccionesTabla({funcionEditar, funcionEliminar}) {
    return(
        <Container>
            <AccionTabla funcion={funcionEditar} fontsize="18px" color="#7d7d7d" icono={<variable.iconeditarTabla/>}/>
            <AccionTabla funcion={funcionEliminar} fontsize="18px" color="#ff5151" icono={<variable.iconeliminarTabla/>}/>
        </Container>
    )
}

const Container = styled.div`
    display:flex;
    gap: 10px;
    justify-content: center;
    flex-wrap: wrap;
    @media (max-width: 48em) {
    justify-content: end;}
`