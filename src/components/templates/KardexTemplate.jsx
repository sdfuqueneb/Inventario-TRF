import styled from "styled-components";
import { Header } from "../organismos/Header";
import { useState } from "react";
import { variable } from "../../styles/variables";
import { useKardexStore } from "../../store/KardexStore";
import { Btnsave } from "../moleculas/Btnsave";
import { Title } from "../atomos/Title";
import { Tabs } from "../organismos/Tabs";
import { RegistrarSalidaEntrada } from "../organismos/formularios/RegistrarSalidaEntrada";

export function KardexTemplate({ data }) {
  const { setBuscador, datakardex } = useKardexStore();
  const [state, setState] = useState(false);
  const [openRegistro, SetopenRegistro] = useState(false);
  const [accion, setAccion] = useState("");
  const [dataSelect, setdataSelect] = useState({});
  const [tipo, setTipo] = useState("");
  const [busqueda, setBusqueda] = useState("");

  function nuevaentrada() {
    SetopenRegistro(true);
    setTipo("entrada");
  }

  function nuevasalida() {
    SetopenRegistro(true);
    setTipo("salida");
  }

  function handleBuscar(e) {
    setBusqueda(e.target.value);
  }

  function handleConfirmarBusqueda(e) {
    if (e.key === 'Enter') {
      setBuscador(busqueda);
    }
  }

  return (
    <Container>
      {openRegistro && (
        <RegistrarSalidaEntrada
          tipo={tipo}
          dataSelect={dataSelect}
          onClose={() => SetopenRegistro(false)}
          accion={accion}
        />
      )}
      <header className="header">
        <Header
          stateConfig={{ state: state, setState: () => setState(!state) }}
        />
      </header>
      <section className="area1">
        <ContentFiltro>
          <Title>Kardex</Title>
          <Btnsave
            titulo="Entrada"
            bgcolor="#52de65"
            icono={<variable.iconoflechaderecha />}
            funcion={nuevaentrada}
          />
          <Btnsave titulo="Salida" bgcolor="#fb6661" funcion={nuevasalida} />
        </ContentFiltro>
      </section>
      <section className="area2">
        <SearchBar>
          <span className="search-icon">
            <variable.iconobuscar />
          </span>
          <input
            type="text"
            placeholder="Buscar..."
            value={busqueda}
            onChange={handleBuscar}
            onKeyDown={handleConfirmarBusqueda}
          />
        </SearchBar>
      </section>

      <section className="main">
        <Tabs
          data={datakardex}
          SetopenRegistro={SetopenRegistro}
          setdataSelect={setdataSelect}
          setAccion={setAccion}
        />
      </section>
    </Container>
  );
}

const Container = styled.div`
  min-height: 100vh;
  padding: 15px;
  width: 100%;
  background: ${({ theme }) => theme.bgtotal};
  color: ${({ theme }) => theme.text};
  display: grid;
  grid-template:
    "header" 100px
    "area1" 100px
    "area2" 60px
    "main" auto;
  .header {
    grid-area: header;
    display: flex;
    align-items: center;
  }
  .area1 {
    grid-area: area1;
    display: flex;
    align-items: center;
  }
  .area2 {
    grid-area: area2;
    display: flex;
    align-items: center;
    justify-content: end;
  }
  .main {
    margin-top: 20px;
    grid-area: main;
  }
`;

const ContentFiltro = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: end;
  width: 100%;
  gap: 15px;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: ${({ theme }) => theme.bg3};
  border: 0.5px solid ${({ theme }) => theme.bg2};
  border-radius: 10px;
  padding: 8px 14px;
  width: 100%;
  max-width: 320px;
  transition: border-color 0.2s;

  &:focus-within {
    border-color: ${({ theme }) => theme.bg5};
  }

  .search-icon {
    color: ${({ theme }) => theme.bg5};
    display: flex;
    align-items: center;
    svg {
      font-size: 18px;
    }
  }

  input {
    flex: 1;
    border: none;
    background: transparent;
    outline: none;
    font-size: 14px;
    color: ${({ theme }) => theme.text};

    &::placeholder {
      color: ${({ theme }) => theme.text}88;
    }
  }
`;