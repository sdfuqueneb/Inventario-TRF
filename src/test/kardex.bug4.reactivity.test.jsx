/**
 * Unit test for Bug 4 fix — Estado local `datas` en `TablaKardex` es un snapshot congelado
 *
 * Property 4: Bug Condition — `TablaKardex` refleja el prop `data` actualizado
 * Validates: Requirements 2.4 criterios 1 y 2
 *
 * Verifies that TablaKardex correctly reacts to prop `data` changes:
 * - When data is empty, the guard `return null` is active (no rows rendered)
 * - When data is updated to a non-empty array, exactly N rows are rendered in tbody
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { TablaKardex } from '../components/organismos/Tablas/TablaKardex';

// --- Mock: useKardexStore ---
vi.mock('../store/KardexStore', () => ({
  useKardexStore: vi.fn(() => ({
    eliminarKardex: vi.fn(),
  })),
}));

// --- Mock: sweetalert2 ---
vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn(() => Promise.resolve({ isConfirmed: false })),
  },
}));

// --- Mock: Paginacion — renders nothing to keep test focused ---
vi.mock('../components/organismos/Tablas/Paginacion', () => ({
  Paginacion: () => <div data-testid="paginacion" />,
}));

// --- Mock: ContentAccionesTabla ---
vi.mock('../components/organismos/ContentAccionesTabla', () => ({
  ContentAccionesTabla: () => <div data-testid="acciones-tabla" />,
}));

// --- Mock: react-icons/fa ---
vi.mock('react-icons/fa', () => ({
  FaArrowsAltV: () => <span data-testid="sort-icon" />,
}));

// --- Mock: styles/variables ---
vi.mock('../styles/variables', () => ({
  variable: {
    bpbart: '768px',
    bphomer: '1200px',
    bpmarge: '992px',
    bplisa: '576px',
    iconoflechaderecha: () => null,
    iconotodos: () => null,
    iconoconfiguracion: null,
    iconocorreo: null,
  },
}));

// --- Mock: styles/breackpoints ---
vi.mock('../styles/breackpoints', () => ({
  Device: {
    tablet: '(min-width: 768px)',
    mobile: '(min-width: 576px)',
  },
}));

// --- Mock: react-router-dom (Paginacion uses useNavigate) ---
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

const mockKardexRecords = [
  {
    descripcion: 'Producto A',
    fecha: '2024-01-01',
    tipo: 'entrada',
    detalle: 'Compra inicial',
    nombres: 'Juan Pérez',
    cantidad: 10,
    stock: 10,
  },
  {
    descripcion: 'Producto B',
    fecha: '2024-01-02',
    tipo: 'salida',
    detalle: 'Venta',
    nombres: 'María García',
    cantidad: 5,
    stock: 5,
  },
  {
    descripcion: 'Producto C',
    fecha: '2024-01-03',
    tipo: 'entrada',
    detalle: 'Reposición',
    nombres: 'Carlos López',
    cantidad: 20,
    stock: 25,
  },
];

const defaultProps = {
  SetopenRegistro: vi.fn(),
  setdataSelect: vi.fn(),
  setAccion: vi.fn(),
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('TablaKardex Bug 4 — Reactivity to prop data updates', () => {
  it('no renderiza tabla cuando data es array vacío (guard return null activo)', () => {
    const { container } = render(<TablaKardex data={[]} {...defaultProps} />);

    // Guard `if (data?.length === 0) return null` should be active
    const table = container.querySelector('table');
    expect(table).toBeNull();
  });

  it('renderiza exactamente 3 filas en tbody cuando data tiene 3 registros', () => {
    const { container } = render(
      <TablaKardex data={mockKardexRecords} {...defaultProps} />
    );

    const tbody = container.querySelector('tbody');
    expect(tbody).not.toBeNull();

    const rows = tbody.querySelectorAll('tr');
    expect(rows).toHaveLength(3);
  });

  it('Property 4: TablaKardex refleja el prop data actualizado — de vacío a 3 registros', () => {
    const { container, rerender } = render(
      <TablaKardex data={[]} {...defaultProps} />
    );

    // Initially: guard active, no table rendered
    expect(container.querySelector('table')).toBeNull();

    // Update prop data to 3 records
    rerender(<TablaKardex data={mockKardexRecords} {...defaultProps} />);

    // After rerender: tbody must have exactly 3 rows
    const tbody = container.querySelector('tbody');
    expect(tbody).not.toBeNull();

    const rows = tbody.querySelectorAll('tr');
    expect(rows).toHaveLength(mockKardexRecords.length);
  });

  it('cuando data cambia de 1 registro a 2 registros, tbody refleja el nuevo count', () => {
    const oneRecord = [mockKardexRecords[0]];
    const twoRecords = mockKardexRecords.slice(0, 2);

    const { container, rerender } = render(
      <TablaKardex data={oneRecord} {...defaultProps} />
    );

    let rows = container.querySelector('tbody').querySelectorAll('tr');
    expect(rows).toHaveLength(1);

    rerender(<TablaKardex data={twoRecords} {...defaultProps} />);

    rows = container.querySelector('tbody').querySelectorAll('tr');
    expect(rows).toHaveLength(2);
  });
});
