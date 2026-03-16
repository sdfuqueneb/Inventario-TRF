import styled from "styled-components";
import { Btnsave } from "../../components/moleculas/Btnsave";
import {useAuthStore} from "../../store/AuthStore"

export function HomeTemplate() {
    const {signOut} = useAuthStore();
    return (
    <Container>
        <h1>Home Template</h1>
        <Btnsave titulo="Cerrar sesión" bgcolor="#fff" funcion={signOut}/>
    </Container>);
}

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    overflow: hidden;
    background-color: ${(props) => props.theme.bgtotal};
    color: ${(theme) => theme.text};
    width: 100%;
`