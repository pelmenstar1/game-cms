export type NameGenerator = ReturnType<typeof nameGenerator>;

function sanitizeName(name: string) {
  return name.replaceAll(/[^a-z\d]/gi, '_').replace(/^\d/, '_');
}

export function nameGenerator() {
  const registry = new Set<string>();

  return {
    create: (prefix: string) => {
      prefix = sanitizeName(prefix);

      for (let i = 0; ; i++) {
        const name = `${prefix}${i}`;

        if (!registry.has(name)) {
          registry.add(name);

          return name;
        }
      }
    },
  };
}
