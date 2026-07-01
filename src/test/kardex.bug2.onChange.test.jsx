/**
 * Unit test for Bug 2 fix (partial) — `onChange` no muta el store
 *
 * Property 2 (parcial): `buscadorkardex` no muta durante keystroke
 * Validates: Requirements 2.2 criterio 1
 *
 * Verifies that typing in the KardexTemplate search input does NOT call
 * `KardexStore.setBuscador` — only local state is updated on each keystroke.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { KardexTemplate } from '../components/templates/KardexTemplate';

// --- Mock: styled-components (avoid theme context issues) ---
vi.mock('styled-components', () => {
  const React = require('react');
  const styled = new Proxy(
    {},
    {
      get: (_target, tag) =>
        (strings, ...vals) => {
          const Comp = React.forwardRef(({ children, ...props }, ref) =>
            React.createElement(tag, { ref, ...props }, children)
          );
          Comp.displayName = tag;
          return Comp;
        },
    }
  );
  styled.div = styled.div;
  styled.section = styled.section;
  styled.header = styled.header;
  styled.span = styled.span;
  styled.input = styled.input;
  return { default: styled, styled };
});

// --- Mock: Header ---
vi.mock('../components/organismos/Header', () => ({
  Header: () => <div data-testid="header" />,
}));

// --- Mock: Btnsave ---
vi.mock('../components/moleculas/Btnsave', () => ({
  Btnsave: ({ titulo }) => <button>{titulo}</button>,
}));

// --- Mock: Title ---
vi.mock('../components/atomos/Title', () => ({
  Title: ({ children }) => <span>{children}</span>,
}));

// --- Mock: Tabs ---
vi.mock('../components/organismos/Tabs', () => ({
  Tabs: () => <div data-testid="tabs" />,
}));

// --- Mock: RegistrarSalidaEntrada ---
vi.mock('../components/organismos/formularios/RegistrarSalidaEntrada', () => ({
  RegistrarSalidaEntrada: () => <div data-testid="registrar-salida-entrada" />,
}));

// --- Mock: variables (icons) ---
vi.mock('../../styles/variables', () => ({
  variable: {
    iconoflechaderecha: () => <span>→</span>,
    iconobuscar: () => <span>🔍</span>,
  },
}));

// --- Mock: useKardexStore ---
const setBuscadorSpy = vi.fn();

vi.mock('../store/KardexStore', () => ({
  useKardexStore: vi.fn(),
}));

import { useKardexStore } from '../store/KardexStore';

beforeEach(() => {
  vi.clearAllMocks();

  useKardexStore.mockReturnValue({
    setBuscador: setBuscadorSpy,
    datakardex: [],
    buscador: '',
    mostrarKardex: vi.fn(),
    buscarKardex: vi.fn(),
  });
});

describe('Bug 2 — onChange no muta KardexStore.setBuscador', () => {
  it('escribir texto en el input no llama a setBuscador', async () => {
    const user = userEvent.setup();

    render(<KardexTemplate data={[]} />);

    const input = screen.getByPlaceholderText('Buscar...');

    // Type "kardex" character by character
    await user.type(input, 'kardex');

    // setBuscador must NOT have been called during typing
    expect(setBuscadorSpy).not.toHaveBeenCalled();
  });

  it('el input refleja el texto escrito (estado local actualizado)', async () => {
    const user = userEvent.setup();

    render(<KardexTemplate data={[]} />);

    const input = screen.getByPlaceholderText('Buscar...');

    await user.type(input, 'kardex');

    expect(input).toHaveValue('kardex');
    // Store is still untouched
    expect(setBuscadorSpy).not.toHaveBeenCalled();
  });

  it('escribir múltiples caracteres no llama a setBuscador en ningún keystroke', async () => {
    const user = userEvent.setup();

    render(<KardexTemplate data={[]} />);

    const input = screen.getByPlaceholderText('Buscar...');

    await user.type(input, 'tela azul grande');

    expect(setBuscadorSpy).not.toHaveBeenCalled();
  });
});
