import styled, { keyframes } from "styled-components";
import { Header } from "../../components/organismos/Header";
import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/AuthStore";
import { useEmpresaStore } from "../../store/EmpresaStore";
import { MostrarUsuarios, MostrarPermisos } from "../../supabase/crudUsuarios";

export function HomeTemplate() {
    const [state, setState] = useState(false);
    const user = useAuthStore((s) => s.user);
    const { dataempresa } = useEmpresaStore();

    const [usuarioDB, setUsuarioDB] = useState(null);
    const [cantidadModulos, setCantidadModulos] = useState(null);

    useEffect(() => {
        async function cargarDatos() {
            const udb = await MostrarUsuarios();
            setUsuarioDB(udb);
            if (udb?.id) {
                const permisos = await MostrarPermisos({ id_usuario: udb.id });
                setCantidadModulos(permisos?.length ?? 0);
            }
        }
        cargarDatos();
    }, [user]);

    const nombreCompleto = usuarioDB?.nombre
        ?? user?.user_metadata?.nombre
        ?? user?.user_metadata?.full_name
        ?? user?.email?.split("@")[0]
        ?? "Usuario";
    
    const primerNombre = nombreCompleto.split(" ")[0];

    const rol = usuarioDB?.tipo_usuario
        ?? user?.user_metadata?.tipo_usuario
        ?? "—";

    const rolLabel = rol === "admin" ? "Administrador"
        : rol === "empleado" ? "Empleado"
        : rol;

    const empresaNombre = dataempresa?.nombre ?? "—";

    const hora = new Date().getHours();
    const saludo =
        hora < 12 ? "Buenos días" :
        hora < 18 ? "Buenas tardes" :
        "Buenas noches";

    return (
        <Container>
            
            <header className="header">
                <Header stateConfig={{ state, setState: () => setState(!state) }} />
            </header>

            <section className="area1">
                <Eyebrow>Panel de administración</Eyebrow>
            </section>

            <section className="main">
                <MainWrapper>
                    <Card>
                        <PulseOrb />
                        <Greeting>
                            {saludo},<br />
                            <span className="name">{primerNombre}</span>
                        </Greeting>
                        <Subtitle>
                            Bienvenido de vuelta. Aquí tienes un resumen de tu sesión.
                        </Subtitle>

                        <Divider />

                        <StatsRow>
                            <Stat>
                                <span className="label">Empresa activa</span>
                                <span className="value empresa">{empresaNombre}</span>
                            </Stat>
                            <Stat>
                                <span className="label">Módulos disponibles</span>
                                <span className="value">
                                    {cantidadModulos === null ? "…" : cantidadModulos}
                                </span>
                            </Stat>
                            <Stat>
                                <span className="label">Rol</span>
                                <span className="value">{rolLabel}</span>
                            </Stat>
                        </StatsRow>

                        <TagRow>
                            <Tag>Gestión de usuarios</Tag>
                            <Tag>Permisos</Tag>
                            <Tag>Productos</Tag>
                            <Tag>Empresas</Tag>
                        </TagRow>
                    </Card>
                </MainWrapper>
            </section>
        </Container>
    );
}


const fadeUp = keyframes`
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
    0%, 100% { transform: scale(1);   opacity: 0.55; }
    50%       { transform: scale(1.18); opacity: 0.85; }
`;

const Container = styled.div`
    height: 100vh;
    width: 100%;
    background-color: ${(p) => p.theme.bgtotal};
    color: ${(p) => p.theme.text};
    display: grid;
    padding: 15px;
    grid-template:
        "header" 100px
        "area1"  60px
        "main"   auto / 1fr;

    .header { grid-area: header; display: flex; align-items: center; }
    .area1  { grid-area: area1;  display: flex; align-items: center; justify-content: flex-end; }
    .main   { grid-area: main;   display: flex; align-items: flex-start; justify-content: center; padding-top: 32px; }
`;

const MainWrapper = styled.div`
    position: relative;
    width: 100%;
    max-width: 680px;
    display: flex;
    align-items: flex-start;
    justify-content: center;
`;

const Eyebrow = styled.span`
    font-size: ${(p) => p.theme.fontsm};
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: ${(p) => p.theme.primary};
    opacity: 0.85;
`;

const Card = styled.div`
    position: relative;
    z-index: 1;
    background: ${(p) => p.theme.bgcards};
    border-radius: 20px;
    padding: 48px 52px 40px;
    width: 100%;
    max-width: 680px;
    box-shadow: 0 4px 32px rgba(1, 36, 82, 0.07);
    overflow: hidden;
    animation: ${fadeUp} 0.5s ease both;
`;

const PulseOrb = styled.div`
    position: absolute;
    top: -60px;
    right: -60px;
    width: 220px;
    height: 220px;
    border-radius: 50%;
    background: ${(p) => p.theme.primary};
    opacity: 0.08;
    animation: ${pulse} 4s ease-in-out infinite;
    pointer-events: none;
`;

const Greeting = styled.h1`
    font-size: clamp(1.8rem, 4vw, 2.6rem);
    font-weight: 700;
    line-height: 1.15;
    color: ${(p) => p.theme.colortitlecard};
    margin: 0 0 14px;

    .name {
        color: ${(p) => p.theme.primary};
        display: block;
    }
`;

const Subtitle = styled.p`
    font-size: ${(p) => p.theme.fontsm};
    color: ${(p) => p.theme.colorSubtitle};
    margin: 0;
    line-height: 1.6;
`;

const Divider = styled.hr`
    border: none;
    border-top: 1px solid ${(p) => p.theme.bg2};
    margin: 28px 0;
`;

const StatsRow = styled.div`
    display: flex;
    gap: 32px;
    flex-wrap: wrap;
    margin-bottom: 28px;
`;

const Stat = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;

    .label {
        font-size: ${(p) => p.theme.fontxs};
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: ${(p) => p.theme.colorSubtitle};
        opacity: 0.7;
    }

    .value {
        font-size: ${(p) => p.theme.fontlg};
        font-weight: 700;
        color: ${(p) => p.theme.colortitlecard};
    }

    .value.empresa {
        font-size: ${(p) => p.theme.fontmd};
        font-weight: 700;
    }
`;

const TagRow = styled.div`
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
`;

const Tag = styled.span`
    font-size: ${(p) => p.theme.fontxs};
    font-weight: 600;
    padding: 5px 14px;
    border-radius: 999px;
    background: ${(p) => p.theme.bgAlpha};
    color: ${(p) => p.theme.colorsubtitlecard};
    border: 1px solid ${(p) => p.theme.primary}33;
    letter-spacing: 0.04em;
`;