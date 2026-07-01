/**
 * Unit test for Bug 3 fix — `queryKey` estable ante cambios en `ProductosStore`
 *
 * Property 3: Bug Condition — `queryKey` de productos en `Kardex.jsx` es estable
 * Validates: Requirements 2.3
 *
 * Verifies that:
 * 1. The products query uses exactly `["productos", empresaId]` (no third element).
 * 2. Changes to `ProductosStore.buscador` do NOT change the products queryKey.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { Kardex } from '../pages/Kardex';

// --- Mock: KardexTemplate — renders nothing, just prevents deep render ---
vi.mock('../components/templates/KardexTemplate', () => ({
  KardexTemplate: () => <div data-testid="kardex-template" />,
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

// --- Mock: TanStack Query useQuery (spy to capture queryKey arguments) ---
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}));

import { useKardexStore } from '../store/KardexStore';
import { useProductosStore } from '../store/ProductosStore';
import { usePermisosStore } from '../store/PermisosStore';
import { useEmpresaStore } from '../store/EmpresaStore';
import { useQuery } from '@tanstack/react-query';

const EMPRESA_ID = 42;

/**
 * Helper: returns all queryKey arrays captured by useQuery calls during a render.
 * useQuery is called twice in Kardex.jsx (productos + kardex), so we collect both.
 */
function getProductosQueryKey() {
  const calls = useQuery.mock.calls;
  // The productos query is the first useQuery call in Kardex.jsx
  if (calls.length === 0) return undefined;
  return calls[0][0].queryKey;
}

beforeEach(() => {
  vi.clearAllMocks();

  // Permisos válidos con módulo Kardex
  usePermisosStore.mockReturnValue({
    datapermisos: [{ modulos: { nombre: 'Kardex' } }],
    permisosListos: true,
  });

  // Empresa válida
  useEmpresaStore.mockReturnValue({
    dataempresa: { id: EMPRESA_ID },
  });

  // KardexStore
  useKardexStore.mockReturnValue({
    mostrarKardex: vi.fn(),
    buscarKardex: vi.fn(),
    buscador: '',
    datakardex: [],
    setBuscador: vi.fn(),
  });

  // ProductosStore — buscador starts empty
  useProductosStore.mockReturnValue({
    mostrarProductos: vi.fn(),
    buscador: '',
    setBuscador: vi.fn(),
    buscarProductos: vi.fn(),
  });

  // TanStack Query — both queries return loaded with no error
  useQuery.mockReturnValue({ isLoading: false, error: null });
});

describe('Kardex Bug 3 — queryKey de productos es estable', () => {
  it('el queryKey de la query de productos es exactamente ["productos", empresaId]', () => {
    render(<Kardex />);

    const productosKey = getProductosQueryKey();

    // Must have exactly 2 elements: the string "productos" and the empresa id
    expect(productosKey).toEqual(['productos', EMPRESA_ID]);
  });

  it('el queryKey de productos NO contiene un tercer elemento (buscador)', () => {
    render(<Kardex />);

    const productosKey = getProductosQueryKey();

    expect(productosKey).toHaveLength(2);
    expect(productosKey[0]).toBe('productos');
    expect(productosKey[1]).toBe(EMPRESA_ID);
  });

  it('cuando buscador de ProductosStore es "", el queryKey de productos sigue siendo ["productos", empresaId]', () => {
    useProductosStore.mockReturnValue({
      mostrarProductos: vi.fn(),
      buscador: '',
      setBuscador: vi.fn(),
      buscarProductos: vi.fn(),
    });

    render(<Kardex />);

    expect(getProductosQueryKey()).toEqual(['productos', EMPRESA_ID]);
  });

  it('cuando buscador de ProductosStore es "cable", el queryKey de productos sigue siendo ["productos", empresaId]', () => {
    // Simulates RegistrarSalidaEntrada having changed ProductosStore.buscador
    useProductosStore.mockReturnValue({
      mostrarProductos: vi.fn(),
      buscador: 'cable',
      setBuscador: vi.fn(),
      buscarProductos: vi.fn(),
    });

    render(<Kardex />);

    const productosKey = getProductosQueryKey();

    // Even with buscador = "cable" in ProductosStore, the key must NOT include it
    expect(productosKey).toEqual(['productos', EMPRESA_ID]);
    expect(productosKey).not.toContain('cable');
  });

  it('un buscador arbitrario en ProductosStore no altera el queryKey de productos', () => {
    const differentBuscadores = ['tela', 'cable USB', '   ', 'PRODUCTO-01', '123'];

    for (const buscador of differentBuscadores) {
      vi.clearAllMocks();
      useQuery.mockReturnValue({ isLoading: false, error: null });
      usePermisosStore.mockReturnValue({
        datapermisos: [{ modulos: { nombre: 'Kardex' } }],
        permisosListos: true,
      });
      useEmpresaStore.mockReturnValue({ dataempresa: { id: EMPRESA_ID } });
      useKardexStore.mockReturnValue({
        mostrarKardex: vi.fn(),
        buscarKardex: vi.fn(),
        buscador: '',
        datakardex: [],
        setBuscador: vi.fn(),
      });
      useProductosStore.mockReturnValue({
        mostrarProductos: vi.fn(),
        buscador,
        setBuscador: vi.fn(),
        buscarProductos: vi.fn(),
      });

      render(<Kardex />);

      const productosKey = getProductosQueryKey();
      expect(productosKey).toEqual(['productos', EMPRESA_ID]);
    }
  });

  it('el queryKey de productos no cambia entre renders cuando buscador de ProductosStore cambia', () => {
    // First render: buscador = ""
    useProductosStore.mockReturnValue({
      mostrarProductos: vi.fn(),
      buscador: '',
      setBuscador: vi.fn(),
      buscarProductos: vi.fn(),
    });

    const { rerender } = render(<Kardex />);
    const keyAfterFirstRender = getProductosQueryKey();

    vi.clearAllMocks();
    useQuery.mockReturnValue({ isLoading: false, error: null });

    // Second render: buscador changes to "nuevo valor" (simulating RegistrarSalidaEntrada interaction)
    useProductosStore.mockReturnValue({
      mostrarProductos: vi.fn(),
      buscador: 'nuevo valor',
      setBuscador: vi.fn(),
      buscarProductos: vi.fn(),
    });

    rerender(<Kardex />);
    const keyAfterSecondRender = getProductosQueryKey();

    // Both renders must produce the same stable key
    expect(keyAfterFirstRender).toEqual(['productos', EMPRESA_ID]);
    expect(keyAfterSecondRender).toEqual(['productos', EMPRESA_ID]);
    expect(keyAfterFirstRender).toEqual(keyAfterSecondRender);
  });
});
