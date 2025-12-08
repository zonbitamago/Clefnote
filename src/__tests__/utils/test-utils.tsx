import { ReactElement, ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ScoreProvider } from '../../context/ScoreContext';

// カスタムProviderラッパー
function AllProviders({ children }: { children: ReactNode }) {
  return <ScoreProvider>{children}</ScoreProvider>;
}

// カスタムrender関数
function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: AllProviders, ...options });
}

// re-export everything
export * from '@testing-library/react';
export { customRender as render };
