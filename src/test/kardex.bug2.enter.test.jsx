/**
 * Unit test for Bug 2 fix (complete) — `onKeyDown` Enter muta el store exactamente una vez
 *
 * Property 2 (completa): confirmación explícita muta el store una sola vez
 * Validates: Requirements 2.2 criterios 2 y 3
 *
 * Verifies that:
 * 1. Typing text then pressing Enter calls `KardexStore.setBuscador` exactly once
 *    with the current input value.
 * 2. Pressing Enter with an empty input calls `setBuscador` exactly once with "".
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
        () => {
          const Comp = React.forwardRef(({ children, ...props }, ref) =>
            React.createElement(tag, { ref, ...props }, children)
          );
          Comp.displayName = tag;
          return Comp;
        },
    }
  );
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

describe('Bug 2 — onKeyDown Enter muta el store exactamente una vez', () => {
  it('escribir "cable" y presionar Enter llama a setBuscador exactamente una vez con "cable"', async () => {
    const user = userEvent.setup();

    render(<KardexTemplate data={[]} />);

    const input = screen.getByPlaceholderText('Buscar...');

    await user.type(input, 'cable');

    // setBuscador must NOT have been called yet (only typing)
    expect(setBuscadorSpy).not.toHaveBeenCalled();

    await user.keyboard('{Enter}');

    // Now setBuscador must have been called exactly once with "cable"
    expect(setBuscadorSpy).toHaveBeenCalledTimes(1);
    expect(setBuscadorSpy).toHaveBeenCalledWith('cable');
  });

  it('presionar Enter con el input vacío llama a setBuscador exactamente una vez con ""', async () => {
    const user = userEvent.setup();

    render(<KardexTemplate data={[]} />);

    const input = screen.getByPlaceholderText('Buscar...');

    // Input is empty, press Enter directly
    await user.click(input);
    await user.keyboard('{Enter}');

    expect(setBuscadorSpy).toHaveBeenCalledTimes(1);
    expect(setBuscadorSpy).toHaveBeenCalledWith('');
  });

  it('presionar Enter múltiples veces llama a setBuscador en cada Enter', async () => {
    const user = userEvent.setup();

    render(<KardexTemplate data={[]} />);

    const input = screen.getByPlaceholderText('Buscar...');

    await user.type(input, 'cable');
    await user.keyboard('{Enter}');
    await user.keyboard('{Enter}');

    // Each Enter press triggers setBuscador
    expect(setBuscadorSpy).toHaveBeenCalledTimes(2);
    expect(setBuscadorSpy).toHaveBeenNthCalledWith(1, 'cable');
    expect(setBuscadorSpy).toHaveBeenNthCalledWith(2, 'cable');
  });

  it('otras teclas especiales (Escape, Tab) no llaman a setBuscador', async () => {
    const user = userEvent.setup();

    render(<KardexTemplate data={[]} />);

    const input = screen.getByPlaceholderText('Buscar...');

    await user.type(input, 'cable');
    await user.keyboard('{Escape}');
    await user.keyboard('{Tab}');

    expect(setBuscadorSpy).not.toHaveBeenCalled();
  });
});
