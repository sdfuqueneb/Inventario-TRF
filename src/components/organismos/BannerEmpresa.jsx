import styled from "styled-components";
import { variable } from "../../styles/variables";
import { CardDatosEmpresa } from "../moleculas/CardDatosEmpresa";
import { useEmpresaStore } from "../../store/EmpresaStore";

export function BannerEmpresa() {
    const { dataempresa, contadorusuarios } = useEmpresaStore();
    if (!dataempresa?.empresa) return null;
    
    return (
        <Container>
            <div className="content-wrapper-context">
                <span className="titulo">
                    {<variable.iconoempresa/>}
                    {dataempresa.empresa?.nombre}
                </span>
                <div className="content-text">
                    Mejora y tecnología
                </div>
                <ContentCards>
                    <CardDatosEmpresa titulo="Moneda" valor={dataempresa.empresa.simbolomoneda}/>
                    <CardDatosEmpresa titulo="Usuarios" valor={contadorusuarios}/>
                </ContentCards>
            </div>
        </Container>
    );
}

const Container = styled.div`
    width: 100%;
    height: 100%;
    positon: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 0 solid #6B6B6B;
    background-size: contain;
    background-position: center;
    border-radius: 14px;
    overflow: hidden;

    .content-wrapper-context{
        paddingp: 20px;
        gap: 10px;
        display: flex;
        flex-direction: column;
        .titulo{
            font-size: 30px;
            font-weight: 700;
            gap: 10px;
            display: flex;
            align-items: center;
        }
    }
`
const ContentCards = styled.div`
    display: flex;
    gap: 10px;
    padding-top: 15px;
    cursor: pointer;
`