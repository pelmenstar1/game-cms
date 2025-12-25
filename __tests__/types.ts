export type TsConfig = {
  extends?: string;
  references?: { path: string }[];
  compilerOptions?: {
    composite?: boolean;
  };
};
