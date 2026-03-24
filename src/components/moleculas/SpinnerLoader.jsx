import styled from "styled-components";
import MoonLoader from "react-spinners/MoonLoader";


export function SpinnerLoader() {
  return (
    <Container>
        <MoonLoader color="#7ba5ff" size={100}/>
    </Container>
  );
}

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;    
    width: 100vw;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1000;
    background: ${({theme}) => theme.bgtotal};
    transform: all 0.3s;
`