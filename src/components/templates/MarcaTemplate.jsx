import styled from "styled-components";
import { Btnsave } from "../../components/moleculas/Btnsave";
import { TablaMarca } from "../../components/organismos/Tablas/TablaMarca";
import {useAuthStore} from "../../store/AuthStore"
import { Header } from "..//organismos/Header";
import { useState, useCallback, useMemo } from "react";
import { RegistrarMarca } from "../organismos/formularios/RegistrarMarca";
import { Btnfiltro } from "../moleculas/Btnfiltro";
import { ContentFiltro } from "../atomos/ContentFiltro";
import { Title } from "../atomos/Title";
import { variable } from "../../styles/variables";

export function MarcaTemplate({data}) {
    const [state, setState] = useState(false);
    const [dataSelect, setDataSelect] = useState("");
    const [action, setAction] = useState("");
    const [openRegistro, SetopenRegistro] = useState(false);

    const handleSetState = useCallback(() => setState(prev => !prev), []);
    const stateConfig = useMemo(() => ({ state, setState: handleSetState }), [state, handleSetState]);

    return (
    <Container>
        {openRegistro && (
            <RegistrarMarca
                dataSelect={dataSelect}
                accion={action}
                onClose={() => SetopenRegistro(false)}
            />
        )}
        <header className="header">
            <Header stateConfig={stateConfig} />
        </header>
        <section className="area1">
            <ContentFiltro>
                <Title>Marcas</Title>
                <Btnfiltro bgcolor="#F6F3F3" textcolor="#353535" icono={<variable.agregar/>}/>
            </ContentFiltro>
        </section>
        <section className="area2">

        </section>
        <section className="main">
            <TablaMarca data={data}/>
        </section>
    </Container>);
}

const Container = styled.div`
    height: 100vh;    
    width: 100%;
    background-color: ${(props) => props.theme.bgtotal};
    color: ${({ theme }) => theme.text};
    display: grid;
    padding: 15px;
    grid-template:
        "header" 100px
        "area1" 100px
        "area2" 100px
        "main" auto;
    .header{
        grid-area: header;
        background-color: #5980ff;
        display: flex;
        align-items: center;
    }
    .area1{
        grid-area: area1;
        background-color: #59f9ff;
        display: flex;
        align-items: center;
    }
    .area2{
        grid-area: area2;
        background-color: #59ff7d;
        display: flex;
        align-items: center;
    }
    .main{
        grid-area: main;
        background-color: #f959ff;
    }
`