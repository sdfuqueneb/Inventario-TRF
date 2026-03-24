import styled from "styled-components";


export function ErrorMolecula({ mensaje }) {
  return (
    <Container>
        <span>ERROR {mensaje}</span>
    </Container>
  );
}

const Container = styled.div`
    color: ${({theme}) => theme.text};
`