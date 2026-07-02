import styled from "styled-components";
import { TablaCategoria } from "../../components/organismos/Tablas/TablaCategoria";
import { Header } from "../organismos/Header";
import { useState, useCallback, useMemo } from "react";
import { RegistrarCategoria } from "../organismos/formularios/RegistrarCategoria";
import { variable } from "../../styles/variables";
import { useCategoriaStore } from "../../store/CategoriaStore";
import { useEmpresaStore } from "../../store/EmpresaStore";

export function CategoriaTemplate({ data = [] }) {
    const [state, setState] = useState(false);
    const [dataSelect, setDataSelect] = useState({});
    const [action, setAction] = useState("");
    const [openRegistro, SetopenRegistro] = useState(false);
    const [busqueda, setBusqueda] = useState("");
    const { dataempresa } = useEmpresaStore();

    const handleSetState = useCallback(() => setState(prev => !prev), []);
    const stateConfig = useMemo(() => ({ state, setState: handleSetState }), [state, handleSetState]);

    const categoriasFiltradas = useMemo(() => {
        if (!busqueda.trim()) return data;
        
        const termino = busqueda.toLowerCase().trim();

        return data.filter((categoria) => {
            if (!categoria) return false;

            return Object.values(categoria).some((valor) => {
                if (valor === null || valor === undefined) return false;
                return String(valor).toLowerCase().includes(termino);
            });
        });
    }, [busqueda, data]);

    const handleBuscar = (e) => {
        setBusqueda(e.target.value);
    };

    const handleLimpiarBusqueda = () => {
        setBusqueda("");
    };

    return (
        <Container>
            {openRegistro && (
                <RegistrarCategoria
                    dataSelect={dataSelect}
                    accion={action}
                    onClose={() => SetopenRegistro(false)}
                />
            )}

            <header className="header">
                <Header stateConfig={stateConfig} />
            </header>

            <div className="page-content">
                <TopBar>
                    <PageTitle>Categorias</PageTitle>
                    <BtnAgregar 
                    onClick={() => {
                        setDataSelect({});
                        setAction("Registrar");
                        SetopenRegistro(true);
                    }}>
                        <variable.agregar />
                        Nueva Categoria
                    </BtnAgregar>
                </TopBar>

                <SearchBar>
                    <span className="search-icon">
                        <variable.iconobuscar />
                    </span>
                    <input
                        type="text"
                        placeholder="Buscar Categoria..."
                        value={busqueda}
                        onChange={handleBuscar}
                    />
                    {busqueda.trim() !== "" && (
                        <BtnLimpiar onClick={handleLimpiarBusqueda} title="Limpiar búsqueda">
                            x
                        </BtnLimpiar>
                    )}
                </SearchBar>
                <TableWrapper>
                    <TablaCategoria
                        data={categoriasFiltradas}
                        onEditar={(Categoria) => {
                            setDataSelect(Categoria);
                            setAction("Editar");
                            SetopenRegistro(true);
                        }}
                    />
                </TableWrapper>
            </div>
        </Container>
    );
}

const Container = styled.div`
    height: 100vh;
    width: 100%;
    background-color: ${({ theme }) => theme.bgtotal};
    color: ${({ theme }) => theme.text};
    display: grid;
    grid-template-rows: 70px 1fr;
    overflow: hidden;

    .header { grid-row: 1; }

    .page-content {
        grid-row: 2;
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 24px 32px;
        overflow-y: auto;
        min-height: 0;  
    }
`;

const TopBar = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
`;

const PageTitle = styled.h1`
    font-size: 22px;
    font-weight: 600;
    margin: 0;
    color: ${({ theme }) => theme.text};
`;

const BtnAgregar = styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    background: ${({ theme }) => theme.bg5};
    color: ${({ theme }) => theme.bg};
    border: none;
    border-radius: 10px;
    padding: 9px 20px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: opacity 0.15s, transform 0.1s;

    svg { font-size: 18px; }

    &:hover  { opacity: 0.88; }
    &:active { transform: scale(0.97); }
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
    max-width: 400px;
    transition: border-color 0.2s;

    &:focus-within {
        border-color: ${({ theme }) => theme.bg5};
    }

    .search-icon {
        color: ${({ theme }) => theme.bg5};
        display: flex;
        align-items: center;
        svg { font-size: 18px; }
    }

    input {
        flex: 1;
        border: none;
        background: transparent;
        outline: none;
        font-size: 14px;
        color: ${({ theme }) => theme.text};
        padding-right: 10px;

        &::placeholder {
            color: ${({ theme }) => theme.text}88;
        }
    }
`;

const BtnLimpiar = styled.button`
    background: transparent;
    border: none;
    color: ${({ theme }) => theme.text}88;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    padding: 0 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.15s;

    &:hover {
        color: ${({ theme }) => theme.bg5};
    }
`;

const TableWrapper = styled.div`
    width: 100%;
    background: ${({ theme }) => theme.bg3};
    border-radius: 12px;
    border: 0.5px solid ${({ theme }) => theme.bg2};
    overflow: auto;
    flex: 1;
    min-height: 0; 
`;