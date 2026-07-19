export const codeSnippetRegistry = {
  name: "code-snippet",
  type: "registry:ui",
  dependencies: [
    "highlight.js",
    "class-variance-authority",
    "clsx",
    "tailwind-merge",
  ],
  registryDependencies: ["button"],
  files: [
    { path: "code-snippet.tsx", target: "components/ui/code-snippet.tsx" },
  ],
} as const;
