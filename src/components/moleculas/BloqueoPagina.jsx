import styled from "styled-components";
import { Lock, LayoutGrid } from "lucide-react";

export function BloqueoPagina({ modulo = "este módulo" }) {
  return (
    <Overlay>
      <Card>
        <IconRing>
          <Lock size={32} />
        </IconRing>

        <Badge>Acceso restringido</Badge>

        <Title>Sin permisos para este módulo</Title>
        <Description>
          No tienes autorización para ver este contenido. Contacta a tu
          administrador si crees que esto es un error.
        </Description>

        <Divider />

        <ModuleRow>
          <LayoutGrid size={16} />
          <span>Módulo: <strong>{modulo}</strong></span>
        </ModuleRow>
      </Card>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-background-secondary, rgba(0,0,0,0.04));
`;

const Card = styled.div`
  background: ${({ theme }) => theme.background};
  border: 0.5px solid rgba(220, 50, 50, 0.4);
  border-radius: 12px;
  padding: 2.5rem 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  max-width: 340px;
  width: 100%;
  text-align: center;
`;

const IconRing = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: rgba(220, 50, 50, 0.08);
  border: 0.5px solid rgba(220, 50, 50, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c0392b;
`;

const Badge = styled.span`
  background: rgba(220, 50, 50, 0.08);
  color: #c0392b;
  border: 0.5px solid rgba(220, 50, 50, 0.3);
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  padding: 4px 12px;
`;

const Title = styled.p`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  margin: 0;
`;

const Description = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
  margin: 0;
  line-height: 1.6;
`;

const Divider = styled.div`
  width: 100%;
  height: 0.5px;
  background: rgba(0,0,0,0.08);
`;

const ModuleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: ${({ theme }) => theme.textSecondary};
`;