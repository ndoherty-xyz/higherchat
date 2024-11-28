import { GRAPHQL_URL } from "./src/constants/server";
import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: GRAPHQL_URL,
  overwrite: true,
  documents: ["src/**/*.gql"],
  generates: {
    "./src/graphql/_generated_/": {
      plugins: ["typescript-apollo-client-helpers"],
      preset: "client",
      presetConfig: {
        fragmentMasking: false,
      },
    },
  },
  config: {
    nonOptionalTypename: true,
    exportFragmentSpreadSubTypes: true,
    preResolveTypes: true,
    strictScalars: true,
    maybeValue: "T | null | undefined",
    documentMode: "graphQLTag",
    gqlImport: "@apollo/client#gql",
  },
};

export default config;
