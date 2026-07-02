import styled from "styled-components";
import { TablaUsuarios } from "../organismos/Tablas/TablaUsuarios";
import { Header } from "../organismos/Header";
import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { RegistrarUsuarios } from "../organismos/formularios/RegistrarUsuarios";
import { variable } from "../../styles/variables";
import { useUsuariosStore } from "../../store/UsuariosStore";
import { useEmpresaStore } from "../../store/EmpresaStore";

export function UsuariosTemplate({ data }) {
    const { buscarUsuarios, mostrarUsuariosTodos, setParametros, dataUsuarios = [] } = useUsuariosStore();
    const { dataempresa } = useEmpresaStore();
    const [state, setState] = useState(false);
    const [dataSelect, setDataSelect] = useState({});
    const [action, setAction] = useState("");
    const [openRegistro, SetopenRegistro] = useState(false);
    const [busqueda, setBusqueda] = useState("");
    const debounceRef = useRef(null);

    const empresaId = useMemo(() => dataempresa?.id ?? dataempresa?.[0]?.id, [dataempresa]);
    const handleSetState = useCallback(() => setState(prev => !prev), []);
    const stateConfig = useMemo(() => ({ state, setState: handleSetState }), [state, handleSetState]);

    useEffect(() => {
        if (empresaId) setParametros({ id_empresa: empresaId });
        return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    }, [empresaId]);

    const usuariosFiltrados = useMemo(() => {
        if (!busqueda.trim()) return dataUsuarios;
        
        const termino = busqueda.toLowerCase().trim();

        return dataUsuarios.filter((usuario) => {
            if (!usuario) return false;

            return Object.values(usuario).some((valor) => {
                if (valor === null || valor === undefined) return false;
                return String(valor).toLowerCase().includes(termino);
            });
        });
    }, [busqueda, dataUsuarios]);

    const handleBuscar = (e) => {
        setBusqueda(e.target.value);
    };

    const handleLimpiarBusqueda = () => {
        setBusqueda("");
    };

    return (
        <Container>
            {openRegistro && (
                <RegistrarUsuarios
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
                    <PageTitle>Usuarios</PageTitle>
                    <BtnAgregar 
                        onClick={() => {
                            setDataSelect({});
                            setAction("Registrar");
                            SetopenRegistro(true);
                        }}
                    >
                        {variable.agregar && <variable.agregar />}
                        Nuevo Usuario
                    </BtnAgregar>
                </TopBar>

                <SearchBar>
                    <span className="search-icon">
                        {variable.iconobuscar && <variable.iconobuscar />}
                    </span>
                    <input
                        type="text"
                        placeholder="Buscar Usuarios..."
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
                    <TablaUsuarios
                        data={usuariosFiltrados}
                        onEditar={(usuario) => {
                            setDataSelect(usuario);
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

    input {
        flex: 1;
        border: none;
        background: transparent;
        outline: none;
        font-size: 14px;
        color: ${({ theme }) => theme.text};
    }
`;

const BtnLimpiar = styled.button`
    background: transparent;
    border: none;
    color: ${({ theme }) => theme.text}88;
    font-size: 16px;
    cursor: pointer;
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