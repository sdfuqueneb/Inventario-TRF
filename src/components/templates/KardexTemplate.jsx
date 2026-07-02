import styled from "styled-components";
import { Header } from "../organismos/Header";
import { useState, useCallback, useMemo } from "react";
import { variable } from "../../styles/variables";
import { useKardexStore } from "../../store/KardexStore";
import { Btnnew } from "../moleculas/Btnnew";
import { Title } from "../atomos/Title";
import { Tabs } from "../organismos/Tabs";
import { RegistrarSalidaEntrada } from "../organismos/formularios/RegistrarSalidaEntrada";

export function KardexTemplate() {
  const { datakardex = [] } = useKardexStore();
  const [state, setState] = useState(false);
  const [openRegistro, SetopenRegistro] = useState(false);
  const [accion, setAccion] = useState("");
  const [dataSelect, setdataSelect] = useState({});
  const [tipo, setTipo] = useState("");
  const [busqueda, setBusqueda] = useState("");

  const handleSetState = useCallback(() => setState(prev => !prev), []);
  const stateConfig = useMemo(() => ({ state, setState: handleSetState }), [state, handleSetState]);

  const kardexFiltrado = useMemo(() => {
    if (!busqueda.trim()) return datakardex;

    const termino = busqueda.toLowerCase().trim();

    return datakardex.filter((registro) => {
      if (!registro) return false;

      return Object.values(registro).some((valor) => {
        if (valor === null || valor === undefined) return false;
        return String(valor).toLowerCase().includes(termino);
      });
    });
  }, [busqueda, datakardex]);

  function nuevaentrada() {
    setdataSelect({});
    setAccion("Registrar");
    setTipo("entrada");
    SetopenRegistro(true);
  }

  function nuevasalida() {
    setdataSelect({});
    setAccion("Registrar");
    setTipo("salida");
    SetopenRegistro(true);
  }

  function handleBuscar(e) {
    setBusqueda(e.target.value);
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
        <Header stateConfig={stateConfig} />
      </header>
      
      <TopBar>
        <LeftSection>
          <Title>Kardex</Title>
          <SearchBar>
            <span className="search-icon">
              <variable.iconobuscar />
            </span>
            <input
              type="text"
              placeholder="Buscar..."
              value={busqueda}
              onChange={handleBuscar}
            />
          </SearchBar>
        </LeftSection>

        <RightSection>
          <Btnnew
            titulo="Entrada"
            color="#52de65"
            funcion={nuevaentrada}
          />
          <Btnnew 
            titulo="Salida" 
            color="#fb6661"
            funcion={nuevasalida} 
          />
        </RightSection>
      </TopBar>

      <section className="main">
        <TableWrapper>
          <Tabs
            data={kardexFiltrado}
            SetopenRegistro={SetopenRegistro}
            setdataSelect={setdataSelect}
            setAccion={setAccion}
          />
        </TableWrapper>
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
  grid-template-rows: 70px auto 1fr;
  overflow-x: hidden;

  .header {
    display: flex;
    align-items: center;
  }
  .main {
    margin-top: 20px;
  }
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 15px;
  width: 100%;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
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
  min-width: 260px;
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

const TableWrapper = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.bg3};
  border-radius: 12px;
  border: 0.5px solid ${({ theme }) => theme.bg2};
  padding: 16px;
  overflow: auto;
`;