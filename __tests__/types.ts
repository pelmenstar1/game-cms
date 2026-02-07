export type TsConfig = {
  extends?: string;
  references?: { path: string }[];
  compilerOptions?: {
    composite?: boolean;
  };
};

export type PackageInfo = {
  name: string;
  main?: string;
  types?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  exports?: Record<string, { import?: string; types?: string }>;
};
