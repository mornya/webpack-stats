declare module 'cliui' {
  type Opts = {
    width?: number;
    wrap?: boolean;
  };
  type Column = {
    text?: string;
    width?: number;
    align?: 'right' | 'center';
    padding?: [number, number, number, number];
    border?: boolean;
  };
  type DivArg = Column | string | number | null | undefined;

  export default function (opts?: Opts): {
    div (...args: DivArg[]): void;
    span (...args: DivArg[]): void;
    resetOutput (): void;
  };
}
