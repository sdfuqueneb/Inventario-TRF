import styled from "styled-components";
import { TablaProductos } from "../organismos/Tablas/TablaProductos";
import { Header } from "../organismos/Header";
import { useState, useCallback, useMemo, useEffect } from "react";
import { RegistrarProductos } from "../organismos/formularios/RegistrarProductos";
import { variable } from "../../styles/variables";
import { useProductosStore } from "../../store/ProductosStore";
import { useEmpresaStore } from "../../store/EmpresaStore";
import { useCategoriaStore } from "../../store/CategoriaStore";
import { useMarcaStore } from "../../store/MarcaStore";

export function ProductosTemplate({ data = [] }) {
    const [state, setState] = useState(false);
    const [dataSelect, setDataSelect] = useState({});
    const [action, setAction] = useState("");
    const [openRegistro, SetopenRegistro] = useState(false);
    const [busqueda, setBusqueda] = useState("");

    // Filtros
    const [filtroCategoria, setFiltroCategoria] = useState(""); // guarda id_categoria
    const [filtroMarca, setFiltroMarca] = useState(""); // guarda id_marca
    const [filtroAsignacion, setFiltroAsignacion] = useState("");
    const [filtroModelo, setFiltroModelo] = useState("");
    const [mostrarFiltros, setMostrarFiltros] = useState(false);

    const { dataempresa } = useEmpresaStore();
    // Catálogos reales de categoría y marca (tablas categorias / marca), cada uno con { id, descripcion }
    const { dataCategoria = [], mostrarCategoria } = useCategoriaStore();
    const { datamarca = [], mostrarMarca } = useMarcaStore();

    const handleSetState = useCallback(() => setState(prev => !prev), []);
    const stateConfig = useMemo(() => ({ state, setState: handleSetState }), [state, handleSetState]);

    // Carga los catálogos de categoría y marca si aún no están en el store (p. ej. si esta
    // vista se abre directo sin haber pasado antes por sus módulos correspondientes)
    useEffect(() => {
        if (dataempresa?.id && dataCategoria.length === 0) {
            mostrarCategoria({ id_empresa: dataempresa.id });
        }
    }, [dataempresa?.id]);

    useEffect(() => {
        if (dataempresa?.id && datamarca.length === 0) {
            mostrarMarca({ id_empresa: dataempresa.id });
        }
    }, [dataempresa?.id]);

    const getAsignacionLabel = (producto) => producto?.asignacion ?? "";
    const getModeloLabel = (producto) => producto?.modelo ?? "";

    // Opciones de categoría y marca: se toman directo del catálogo, no solo de lo que aparece en productos
    const opcionesCategoria = useMemo(() => {
        return [...dataCategoria]
            .map((c) => ({ id: c.id, label: c.descripcion ?? c.nombre ?? String(c.id) }))
            .sort((a, b) => a.label.localeCompare(b.label));
    }, [dataCategoria]);

    const opcionesMarca = useMemo(() => {
        return [...datamarca]
            .map((m) => ({ id: m.id, label: m.descripcion ?? m.nombre ?? String(m.id) }))
            .sort((a, b) => a.label.localeCompare(b.label));
    }, [datamarca]);

    // Asignación no tiene tabla catálogo propia conocida: se deriva de los valores presentes en productos
    const opcionesAsignacion = useMemo(() => {
        const set = new Set();
        data.forEach((p) => {
            const val = getAsignacionLabel(p);
            if (val !== "" && val !== null && val !== undefined) set.add(String(val));
        });
        return Array.from(set).sort();
    }, [data]);

    // Modelo tampoco tiene catálogo propio: es un campo de texto libre en productos
    const opcionesModelo = useMemo(() => {
        const set = new Set();
        data.forEach((p) => {
            const val = getModeloLabel(p);
            if (val !== "" && val !== null && val !== undefined) set.add(String(val));
        });
        return Array.from(set).sort();
    }, [data]);

    const productosFiltrados = useMemo(() => {
        let resultado = data;

        if (busqueda.trim()) {
            const termino = busqueda.toLowerCase().trim();
            resultado = resultado.filter((producto) => {
                if (!producto) return false;
                return Object.values(producto).some((valor) => {
                    if (valor === null || valor === undefined) return false;
                    return String(valor).toLowerCase().includes(termino);
                });
            });
        }

        if (filtroCategoria) {
            resultado = resultado.filter(
                (producto) => String(producto?.id_categoria) === String(filtroCategoria)
            );
        }

        if (filtroMarca) {
            resultado = resultado.filter(
                (producto) => String(producto?.id_marca) === String(filtroMarca)
            );
        }

        if (filtroAsignacion) {
            resultado = resultado.filter(
                (producto) => String(getAsignacionLabel(producto)) === filtroAsignacion
            );
        }

        if (filtroModelo) {
            resultado = resultado.filter(
                (producto) => String(getModeloLabel(producto)) === filtroModelo
            );
        }

        return resultado;
    }, [busqueda, data, filtroCategoria, filtroMarca, filtroAsignacion, filtroModelo]);

    const hayFiltrosActivos =
        busqueda.trim() !== "" || filtroCategoria !== "" || filtroMarca !== "" || filtroAsignacion !== "" || filtroModelo !== "";

    const handleBuscar = (e) => {
        setBusqueda(e.target.value);
    };

    const handleLimpiarBusqueda = () => {
        setBusqueda("");
    };

    const handleLimpiarFiltros = () => {
        setBusqueda("");
        setFiltroCategoria("");
        setFiltroMarca("");
        setFiltroAsignacion("");
        setFiltroModelo("");
    };

    return (
        <Container>
            {openRegistro && (
                <RegistrarProductos
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
                    <PageTitle>Activos</PageTitle>
                    <BtnAgregar
                    onClick={() => {
                        setDataSelect({});
                        setAction("Registrar");
                        SetopenRegistro(true);
                    }}>
                        <variable.agregar />
                        Nuevo Activo
                    </BtnAgregar>
                </TopBar>

                <SearchFilterRow>
                    <SearchBar>
                        <span className="search-icon">
                            <variable.iconobuscar />
                        </span>
                        <input
                            type="text"
                            placeholder="Buscar Activo..."
                            value={busqueda}
                            onChange={handleBuscar}
                        />
                        {busqueda.trim() !== "" && (
                            <BtnLimpiar onClick={handleLimpiarBusqueda} title="Limpiar búsqueda">
                                x
                            </BtnLimpiar>
                        )}
                    </SearchBar>

                    <BtnFiltros
                        type="button"
                        $activo={mostrarFiltros}
                        onClick={() => setMostrarFiltros((prev) => !prev)}
                    >
                        Filtros
                        {(filtroCategoria || filtroMarca || filtroAsignacion || filtroModelo) && (
                            <FiltroBadge>
                                {[filtroCategoria, filtroMarca, filtroAsignacion, filtroModelo].filter(Boolean).length}
                            </FiltroBadge>
                        )}
                    </BtnFiltros>

                    {hayFiltrosActivos && (
                        <BtnLimpiarFiltros type="button" onClick={handleLimpiarFiltros}>
                            Limpiar todo
                        </BtnLimpiarFiltros>
                    )}

                    <Contador>
                        {hayFiltrosActivos ? (
                            <>
                                <strong>{productosFiltrados.length}</strong> de {data.length} activos
                            </>
                        ) : (
                            <>
                                <strong>{data.length}</strong> activos
                            </>
                        )}
                    </Contador>
                </SearchFilterRow>

                {mostrarFiltros && (
                    <FiltrosPanel>
                        <FiltroGrupo>
                            <label>Categoría</label>
                            <select
                                value={filtroCategoria}
                                onChange={(e) => setFiltroCategoria(e.target.value)}
                            >
                                <option value="">Todas</option>
                                {opcionesCategoria.map((opcion) => (
                                    <option key={opcion.id} value={opcion.id}>
                                        {opcion.label}
                                    </option>
                                ))}
                            </select>
                        </FiltroGrupo>

                        <FiltroGrupo>
                            <label>Marca</label>
                            <select
                                value={filtroMarca}
                                onChange={(e) => setFiltroMarca(e.target.value)}
                            >
                                <option value="">Todas</option>
                                {opcionesMarca.map((opcion) => (
                                    <option key={opcion.id} value={opcion.id}>
                                        {opcion.label}
                                    </option>
                                ))}
                            </select>
                        </FiltroGrupo>

                        <FiltroGrupo>
                            <label>Asignación</label>
                            <select
                                value={filtroAsignacion}
                                onChange={(e) => setFiltroAsignacion(e.target.value)}
                            >
                                <option value="">Todas</option>
                                {opcionesAsignacion.map((opcion) => (
                                    <option key={opcion} value={opcion}>
                                        {opcion}
                                    </option>
                                ))}
                            </select>
                        </FiltroGrupo>

                        <FiltroGrupo>
                            <label>Modelo</label>
                            <select
                                value={filtroModelo}
                                onChange={(e) => setFiltroModelo(e.target.value)}
                            >
                                <option value="">Todos</option>
                                {opcionesModelo.map((opcion) => (
                                    <option key={opcion} value={opcion}>
                                        {opcion}
                                    </option>
                                ))}
                            </select>
                        </FiltroGrupo>
                    </FiltrosPanel>
                )}

                <TableWrapper>
                    <TablaProductos
                        data={productosFiltrados}
                        onEditar={(Productos) => {
                            setDataSelect(Productos);
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

const SearchFilterRow = styled.div`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
`;

const Contador = styled.div`
    font-size: 13px;
    color: ${({ theme }) => theme.text}99;
    white-space: nowrap;
    margin-left: auto;

    strong {
        color: ${({ theme }) => theme.text};
        font-weight: 600;
    }
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
    position: relative;
    &:focus-within { border-color: ${({ theme }) => theme.bg5}; }
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
        &::placeholder { color: ${({ theme }) => theme.text}88; }
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
    &:hover { color: ${({ theme }) => theme.bg5}; }
`;

const BtnFiltros = styled.button`
    display: flex;
    align-items: center;
    gap: 6px;
    background: ${({ theme, $activo }) => ($activo ? theme.bg5 : theme.bg3)};
    color: ${({ theme, $activo }) => ($activo ? theme.bg : theme.text)};
    border: 0.5px solid ${({ theme }) => theme.bg2};
    border-radius: 10px;
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: opacity 0.15s, transform 0.1s;
    &:hover { opacity: 0.88; }
    &:active { transform: scale(0.97); }
`;

const FiltroBadge = styled.span`
    background: ${({ theme }) => theme.bg};
    color: ${({ theme }) => theme.bg5};
    border-radius: 50%;
    font-size: 11px;
    font-weight: 700;
    min-width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 4px;
`;

const BtnLimpiarFiltros = styled.button`
    background: transparent;
    border: none;
    color: ${({ theme }) => theme.bg5};
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    padding: 4px 6px;
    text-decoration: underline;
    &:hover { opacity: 0.8; }
`;

const FiltrosPanel = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    background: ${({ theme }) => theme.bg3};
    border: 0.5px solid ${({ theme }) => theme.bg2};
    border-radius: 10px;
    padding: 16px;
`;

const FiltroGrupo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 180px;

    label {
        font-size: 12px;
        font-weight: 600;
        color: ${({ theme }) => theme.text}aa;
        text-transform: uppercase;
        letter-spacing: 0.4px;
    }

    select {
        background: ${({ theme }) => theme.bg};
        color: ${({ theme }) => theme.text};
        border: 0.5px solid ${({ theme }) => theme.bg2};
        border-radius: 8px;
        padding: 8px 10px;
        font-size: 14px;
        outline: none;
        cursor: pointer;
        transition: border-color 0.2s;
        &:focus { border-color: ${({ theme }) => theme.bg5}; }
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