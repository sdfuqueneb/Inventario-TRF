/**
 * Preservation Tests (regression prevention) — Kardex Infinite Loading Fix
 *
 * Validates: Requirements 3.1, 3.5, 3.6, 3.7
 *
 * Property 5: Preservation — comportamientos no afectados por los bugs.
 * For any input X where NOT (isBugCondition_Bug1(X) OR isBugCondition_Bug2(X)
 * OR isBugCondition_Bug3(X) OR isBugCondition_Bug4(X)), the corrected system
 * SHALL produce identical observable behavior to the original system.
 *
 * These tests verify that the four bug fixes did not introduce regressions
 * in core behaviors: spinner during loading, permission blocking, empty-data
 * guard, and correct column rendering for non-empty data.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import * as fc from 'fast-check';
import { Kardex } from '../pages/Kardex';
import { TablaKardex } from '../components/organismos/Tablas/TablaKardex';

// ============================================================
// Shared mocks for Kardex page tests (8.1, 8.2)
// ============================================================

vi.mock('../components/templates/KardexTemplate', () => ({
  KardexTemplate: ({ data }) => (
    <div data-testid="kardex-template">
      {data && data.map((item, idx) => (
        <div key={idx} data-testid={`kardex-row-${idx}`}>{item.descripcion}</div>
      ))}
    </div>
  ),
}));

vi.mock('../store/KardexStore', () => ({
  useKardexStore: vi.fn(),
}));

vi.mock('../store/ProductosStore', () => ({
  useProductosStore: vi.fn(),
}));

vi.mock('../store/PermisosStore', () => ({
  usePermisosStore: vi.fn(),
}));

vi.mock('../store/EmpresaStore', () => ({
  useEmpresaStore: vi.fn(),
}));

vi.mock('../components/moleculas/SpinnerLoader', () => ({
  SpinnerLoader: () => <div data-testid="spinner" />,
}));

vi.mock('../components/moleculas/BloqueoPagina', () => ({
  BloqueoPagina: ({ modulo }) => <div data-testid="bloqueo">{modulo}</div>,
}));

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}));

// ============================================================
// Shared mocks for TablaKardex tests (8.3, 8.4)
// ============================================================

vi.mock('../components/organismos/Tablas/Paginacion', () => ({
  Paginacion: () => <div data-testid="paginacion" />,
}));

vi.mock('../components/organismos/ContentAccionesTabla', () => ({
  ContentAccionesTabla: () => <div data-testid="acciones-tabla" />,
}));

vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn(() => Promise.resolve({ isConfirmed: false })),
  },
}));

vi.mock('react-icons/fa', () => ({
  FaArrowsAltV: () => <span data-testid="sort-icon" />,
}));

vi.mock('../styles/variables', () => ({
  variable: {
    bpbart: '768px',
    bphomer: '1200px',
    bpmarge: '992px',
    bplisa: '576px',
  },
}));

vi.mock('../styles/breackpoints', () => ({
  Device: {
    tablet: '(min-width: 768px)',
    mobile: '(min-width: 576px)',
  },
}));

// ============================================================
// Imports after vi.mock
// ============================================================
import { useKardexStore } from '../store/KardexStore';
import { useProductosStore } from '../store/ProductosStore';
import { usePermisosStore } from '../store/PermisosStore';
import { useEmpresaStore } from '../store/EmpresaStore';
import { useQuery } from '@tanstack/react-query';

// ============================================================
// Helpers
// ============================================================

const defaultTablaKardexProps = {
  SetopenRegistro: vi.fn(),
  setdataSelect: vi.fn(),
  setAccion: vi.fn(),
};

/**
 * Fast-check arbitrary for a valid kardex record.
 * All 7 fields that map to table columns must be present.
 */
const kardexRecordArbitrary = fc.record({
  descripcion: fc.string({ minLength: 1, maxLength: 50 }),
  fecha: fc
    .integer({ min: 0, max: 2189 }) // days from 2020-01-01 to 2025-12-31
    .map((offset) => {
      const d = new Date(2020, 0, 1 + offset);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    }),
  tipo: fc.constantFrom('entrada', 'salida'),
  detalle: fc.string({ minLength: 0, maxLength: 100 }),
  nombres: fc.string({ minLength: 1, maxLength: 50 }),
  cantidad: fc.integer({ min: 1, max: 1000 }),
  stock: fc.integer({ min: 0, max: 10000 }),
});

// ============================================================
// 8.1 — Preservation: Spinner durante carga (Requirements 3.1)
// ============================================================

describe('8.1 Preservation — Spinner durante carga (Requirements 3.1)', () => {
  /**
   * Verifies that the loading spinner is still rendered when the kardex query
   * is in-flight (isLoading: true). This confirms the Bug 1 fix did not
   * accidentally remove or skip the loading branch.
   */
  it('debe mostrar <SpinnerLoader /> cuando la query kardex está cargando', () => {
    usePermisosStore.mockReturnValue({
      datapermisos: [{ modulos: { nombre: 'Kardex' } }],
      permisosListos: true,
    });
    useEmpresaStore.mockReturnValue({
      dataempresa: { id: 1 },
    });
    useKardexStore.mockReturnValue({
      mostrarKardex: vi.fn(),
      buscarKardex: vi.fn(),
      buscador: '',
      datakardex: [],
      setBuscador: vi.fn(),
    });
    useProductosStore.mockReturnValue({
      mostrarProductos: vi.fn(),
    });

    // First call: productos query → not loading
    // Second call: kardex query → loading
    useQuery
      .mockReturnValueOnce({ isLoading: false, error: null })
      .mockReturnValueOnce({ isLoading: true, error: null });

    render(<Kardex />);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(screen.queryByTestId('kardex-template')).not.toBeInTheDocument();
  });
});

// ============================================================
// 8.2 — Preservation: BloqueoPagina para usuarios sin permiso (Requirements 3.7)
// ============================================================

describe('8.2 Preservation — BloqueoPagina para usuarios sin permiso (Requirements 3.7)', () => {
  /**
   * Verifies that <BloqueoPagina> is rendered when the logged-in user does
   * not have the "Kardex" module in their permissions. The permission check
   * is unrelated to the bug fixes; this test guards against regressions.
   */
  it('debe mostrar <BloqueoPagina> cuando el usuario no tiene permiso "Kardex"', () => {
    // datapermisos does NOT include the Kardex module
    usePermisosStore.mockReturnValue({
      datapermisos: [{ modulos: { nombre: 'Productos' } }],
      permisosListos: true,
    });
    useEmpresaStore.mockReturnValue({
      dataempresa: { id: 1 },
    });
    useKardexStore.mockReturnValue({
      mostrarKardex: vi.fn(),
      buscarKardex: vi.fn(),
      buscador: '',
      datakardex: [],
      setBuscador: vi.fn(),
    });
    useProductosStore.mockReturnValue({
      mostrarProductos: vi.fn(),
    });

    // Both queries return non-loading; they won't even be enabled without permission
    useQuery.mockReturnValue({ isLoading: false, error: null });

    render(<Kardex />);

    expect(screen.getByTestId('bloqueo')).toBeInTheDocument();
    expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    expect(screen.queryByTestId('kardex-template')).not.toBeInTheDocument();
  });

  it('debe mostrar <BloqueoPagina> cuando datapermisos está vacío', () => {
    usePermisosStore.mockReturnValue({
      datapermisos: [],
      permisosListos: true,
    });
    useEmpresaStore.mockReturnValue({
      dataempresa: { id: 1 },
    });
    useKardexStore.mockReturnValue({
      mostrarKardex: vi.fn(),
      buscarKardex: vi.fn(),
      buscador: '',
      datakardex: [],
      setBuscador: vi.fn(),
    });
    useProductosStore.mockReturnValue({
      mostrarProductos: vi.fn(),
    });

    useQuery.mockReturnValue({ isLoading: false, error: null });

    render(<Kardex />);

    expect(screen.getByTestId('bloqueo')).toBeInTheDocument();
  });
});

// ============================================================
// 8.3 — Preservation: TablaKardex devuelve null con array vacío (Requirements 3.6, 2.4 criterio 3)
// ============================================================

describe('8.3 Preservation — TablaKardex devuelve null con array vacío (Requirements 3.6, 2.4 criterio 3)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useKardexStore.mockReturnValue({ eliminarKardex: vi.fn() });
  });

  afterEach(() => {
    cleanup();
  });

  /**
   * Verifies that TablaKardex returns null (no <table>) when data=[] is passed.
   * This is the guard `if (data?.length === 0) return null` in TablaKardex.
   * The Bug 4 fix must not have removed this guard.
   */
  it('no debe renderizar ningún <table> cuando data es un array vacío', () => {
    const { container } = render(
      <TablaKardex
        data={[]}
        {...defaultTablaKardexProps}
      />
    );

    const table = container.querySelector('table');
    expect(table).toBeNull();
  });

  it('el componente devuelve null (sin elementos en el DOM) con data=[]', () => {
    const { container } = render(
      <TablaKardex
        data={[]}
        {...defaultTablaKardexProps}
      />
    );

    // The container should be essentially empty (just the wrapper div from RTL)
    expect(container.firstChild).toBeNull();
  });
});

// ============================================================
// 8.4 — PBT Preservation: Columnas correctas para cualquier array no vacío (Requirements 3.5)
// ============================================================

describe('8.4 PBT Preservation — Columnas correctas para cualquier array no vacío (Requirements 3.5)', () => {
  /**
   * Property 5: Preservation — comportamientos no afectados por los bugs
   *
   * For any non-empty array of kardex records, <TablaKardex data={records} />
   * must:
   *   1. Render exactly records.length rows in <tbody>
   *   2. Display all 7 column headers: Producto, Fecha, Tipo, Detalle,
   *      Usuario, Cantidad, Stock
   *
   * This verifies that the Bug 4 fix (removing dead `datas` state) preserved
   * the column structure and row count behavior.
   *
   * Feature: kardex-infinite-loading-fix
   * Property 5: Preservation — comportamientos no afectados por los bugs
   * Validates: Requirements 3.5
   */
  beforeEach(() => {
    vi.clearAllMocks();
    useKardexStore.mockReturnValue({ eliminarKardex: vi.fn() });
  });

  afterEach(() => {
    cleanup();
  });

  it('PBT: tbody tiene exactamente records.length filas y las 7 cabeceras están presentes para cualquier array no vacío', () => {
    const EXPECTED_HEADERS = [
      'Producto',
      'Fecha',
      'Tipo',
      'Detalle',
      'Usuario',
      'Cantidad',
      'Stock',
    ];

    fc.assert(
      fc.property(
        fc.array(kardexRecordArbitrary, { minLength: 1, maxLength: 10 }),
        (records) => {
          const { container } = render(
            <TablaKardex data={records} {...defaultTablaKardexProps} />
          );

          // --- Row count assertion ---
          const tbody = container.querySelector('tbody');
          expect(tbody).not.toBeNull();
          const rows = tbody.querySelectorAll('tr');
          expect(rows).toHaveLength(records.length);

          // --- Column headers assertion ---
          const ths = container.querySelectorAll('thead th');
          const headerTexts = Array.from(ths).map((th) => th.textContent.trim());

          for (const expectedHeader of EXPECTED_HEADERS) {
            const found = headerTexts.some((text) =>
              text.includes(expectedHeader)
            );
            expect(found, `Expected column header "${expectedHeader}" to be present`).toBe(true);
          }

          cleanup();
        }
      ),
      { numRuns: 30 }
    );
  });
});
