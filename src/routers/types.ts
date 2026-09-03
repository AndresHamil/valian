export type AppRoute = {
  path: string;
  importPath: string;
  theme: boolean;
};

type AppRouteDefinition = {
  canonicalPath: string;
  importPath: string;
  theme?: boolean;
  legacyPaths?: string[];
};

export function createAppRoutes(definitions: AppRouteDefinition[]): AppRoute[] {
  return definitions.flatMap(({ canonicalPath, importPath, theme = true, legacyPaths = [] }) =>
    [canonicalPath, ...legacyPaths].map((path) => ({
      path,
      importPath,
      theme,
    }))
  );
}