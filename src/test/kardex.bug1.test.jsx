/**
 * Unit test for Bug 1 fix — Prop `data` mal conectada en `Kardex.jsx`
 *
 * Validates: Requirements 2.1
 *
 * Verifies that Kardex.jsx passes `datakardex` (from useKardexStore)
 * as the `data` prop to KardexTemplate, NOT `dataproductos`/`dataProductos`
 * from useProductosStore.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Kardex } from '../pages/Kardex';

// --- Mock: KardexTemplate — captures the `data` prop it receives ---
vi.mock('../components/templates/KardexTemplate', () => ({
  KardexTemplate: ({ data }) => (
    <div data-testid="kardex-template">
      {data && data.map((item) => (
        <div key={item.id} data-testid={`kardex-row-${item.id}`}>
          {item.descripcion ?? item.id}
        </div>
      ))}
    </div>
  ),
}));

// --- Mock: useKardexStore ---
vi.mock('../store/KardexStore', () => ({
  useKardexStore: vi.fn(),
}));

// --- Mock: useProductosStore ---
vi.mock('../store/ProductosStore', () => ({
  useProductosStore: vi.fn(),
}));

// --- Mock: usePermisosStore ---
vi.mock('../store/PermisosStore', () => ({
  usePermisosStore: vi.fn(),
}));

// --- Mock: useEmpresaStore ---
vi.mock('../store/EmpresaStore', () => ({
  useEmpresaStore: vi.fn(),
}));

// --- Mock: SpinnerLoader and BloqueoPagina ---
vi.mock('../components/moleculas/SpinnerLoader', () => ({
  SpinnerLoader: () => <div data-testid="spinner" />,
}));

vi.mock('../components/moleculas/BloqueoPagina', () => ({
  BloqueoPagina: ({ modulo }) => <div data-testid="bloqueo">{modulo}</div>,
}));

// --- Mock: TanStack Query useQuery ---
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}));

import { useKardexStore } from '../store/KardexStore';
import { useProductosStore } from '../store/ProductosStore';
import { usePermisosStore } from '../store/PermisosStore';
import { useEmpresaStore } from '../store/EmpresaStore';
import { useQuery } from '@tanstack/react-query';

const kardexData = [{ id: 1, descripcion: 'Test' }];
const productosData = [{ id: 99, descripcion: 'Producto 99' }];

beforeEach(() => {
  vi.clearAllMocks();

  // Permisos válidos con módulo Kardex
  usePermisosStore.mockReturnValue({
    datapermisos: [{ modulos: { nombre: 'Kardex' } }],
    permisosListos: true,
  });

  // Empresa válida
  useEmpresaStore.mockReturnValue({
    dataempresa: { id: 42 },
  });

  // KardexStore con datakardex poblado
  useKardexStore.mockReturnValue({
    mostrarKardex: vi.fn(),
    buscarKardex: vi.fn(),
    buscador: '',
    datakardex: kardexData,
    setBuscador: vi.fn(),
  });

  // ProductosStore con dataProductos diferente
  useProductosStore.mockReturnValue({
    mostrarProductos: vi.fn(),
    dataProductos: productosData,
  });

  // TanStack Query — ambas queries retornan cargadas y sin error
  useQuery.mockReturnValue({ isLoading: false, error: null });
});

describe('Kardex Bug 1 — prop data conectada a datakardex', () => {
  it('debe pasar datakardex (id:1) como prop data a KardexTemplate, no dataProductos (id:99)', () => {
    render(<Kardex />);

    // La fila con id:1 (kardex) debe estar presente
    expect(screen.getByTestId('kardex-row-1')).toBeInTheDocument();

    // La fila con id:99 (productos) NO debe estar presente
    expect(screen.queryByTestId('kardex-row-99')).not.toBeInTheDocument();
  });

  it('KardexTemplate recibe exactamente los registros de datakardex', () => {
    render(<Kardex />);

    const template = screen.getByTestId('kardex-template');
    expect(template).toBeInTheDocument();

    // datakardex tiene 1 registro con descripcion 'Test'
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('cuando datakardex y dataProductos tienen longitudes distintas, se muestran las filas de kardex', () => {
    // 3 kardex records vs 1 producto record
    const multipleKardex = [
      { id: 1, descripcion: 'Kardex A' },
      { id: 2, descripcion: 'Kardex B' },
      { id: 3, descripcion: 'Kardex C' },
    ];
    useKardexStore.mockReturnValue({
      mostrarKardex: vi.fn(),
      buscarKardex: vi.fn(),
      buscador: '',
      datakardex: multipleKardex,
      setBuscador: vi.fn(),
    });

    render(<Kardex />);

    // Todas las filas kardex deben aparecer
    expect(screen.getByTestId('kardex-row-1')).toBeInTheDocument();
    expect(screen.getByTestId('kardex-row-2')).toBeInTheDocument();
    expect(screen.getByTestId('kardex-row-3')).toBeInTheDocument();

    // La fila de productos NO debe aparecer
    expect(screen.queryByTestId('kardex-row-99')).not.toBeInTheDocument();
  });
});
