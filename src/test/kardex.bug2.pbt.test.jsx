/**
 * Property-Based Test for Bug 2 fix
 *
 * Feature: kardex-infinite-loading-fix
 * Property 2: `buscadorkardex` no muta durante edición del input
 * Validates: Requirements 2.2
 *
 * Uses fast-check to verify that for any arbitrary string typed into the
 * KardexTemplate search input:
 * 1. setBuscador is NOT called during typing (onChange behavior)
 * 2. setBuscador IS called exactly once when Enter is pressed
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as fc from 'fast-check';
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
vi.mock('../store/KardexStore', () => ({
  useKardexStore: vi.fn(),
}));

import { useKardexStore } from '../store/KardexStore';

/**
 * Sanitize an arbitrary string for use with userEvent.type.
 * userEvent.type interprets characters like `{`, `}`, `[`, `]` as special keys.
 * We escape them or strip characters that would break the typing simulation.
 * We also limit length to keep tests fast.
 */
function sanitizeForUserEvent(str) {
  return str
    .replace(/[{}[\]]/g, '') // remove special userEvent key syntax characters
    .replace(/[\x00-\x1F\x7F]/g, '') // remove control characters
    .slice(0, 50); // limit length for performance
}

describe('Property 2 PBT — buscadorkardex no muta durante edición del input', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('para cualquier texto arbitrario: onChange no llama a setBuscador, Enter sí lo llama exactamente una vez', async () => {
    /**
     * **Validates: Requirements 2.2**
     *
     * Property: For any string typed into the input:
     * - setBuscador is NOT called during typing (onChange)
     * - setBuscador IS called exactly once after pressing Enter, with the typed value
     */
    await fc.assert(
      fc.asyncProperty(
        // Generate printable ASCII strings of reasonable length
        fc.string({ minLength: 0, maxLength: 30 }).filter(
          (s) => !s.includes('{') && !s.includes('}') &&
                 !s.includes('[') && !s.includes(']') &&
                 !/[\x00-\x1F\x7F]/.test(s)
        ),
        async (randomText) => {
          const setBuscadorSpy = vi.fn();

          useKardexStore.mockReturnValue({
            setBuscador: setBuscadorSpy,
            datakardex: [],
            buscador: '',
            mostrarKardex: vi.fn(),
            buscarKardex: vi.fn(),
          });

          const user = userEvent.setup();
          const { unmount } = render(<KardexTemplate data={[]} />);

          const input = screen.getByPlaceholderText('Buscar...');

          // Type the generated string
          if (randomText.length > 0) {
            await user.type(input, randomText);
          } else {
            // For empty string, just click the input to focus it
            await user.click(input);
          }

          // During typing: setBuscador must NOT have been called
          expect(setBuscadorSpy).not.toHaveBeenCalled();

          // Press Enter to confirm
          await user.keyboard('{Enter}');

          // After Enter: setBuscador must have been called exactly once
          expect(setBuscadorSpy).toHaveBeenCalledTimes(1);

          // The value passed to setBuscador must match what was typed
          expect(setBuscadorSpy).toHaveBeenCalledWith(randomText);

          // Clean up between iterations
          unmount();
          setBuscadorSpy.mockClear();
        }
      ),
      { numRuns: 20 }
    );
  });

  it('para cualquier texto: presionar otras teclas no llama a setBuscador', async () => {
    /**
     * **Validates: Requirements 2.2**
     *
     * Property: Non-Enter keys never trigger setBuscador.
     */
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 20 }).filter(
          (s) => !s.includes('{') && !s.includes('}') &&
                 !s.includes('[') && !s.includes(']') &&
                 !/[\x00-\x1F\x7F]/.test(s)
        ),
        async (randomText) => {
          const setBuscadorSpy = vi.fn();

          useKardexStore.mockReturnValue({
            setBuscador: setBuscadorSpy,
            datakardex: [],
            buscador: '',
            mostrarKardex: vi.fn(),
            buscarKardex: vi.fn(),
          });

          const user = userEvent.setup();
          const { unmount } = render(<KardexTemplate data={[]} />);

          const input = screen.getByPlaceholderText('Buscar...');

          await user.type(input, randomText);
          // Press Escape instead of Enter
          await user.keyboard('{Escape}');

          expect(setBuscadorSpy).not.toHaveBeenCalled();

          unmount();
          setBuscadorSpy.mockClear();
        }
      ),
      { numRuns: 15 }
    );
  });
});
