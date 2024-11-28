import SchemaBuilder from "@pothos/core";
import { YogaInitialContext } from "graphql-yoga";

export type SchemaContext = {
  user?: {
    signerUuid: string;
    fid: number;
  };
} & YogaInitialContext;

export const builder = new SchemaBuilder<{
  Context: SchemaContext;
  DefaultFieldNullability: false;
}>({
  defaultFieldNullability: false,
});

export type QueryBuilderArg = PothosSchemaTypes.QueryFieldBuilder<
  PothosSchemaTypes.ExtendDefaultTypes<{
    Context: SchemaContext;
    DefaultFieldNullability: false;
  }>,
  {}
>;

export type MutationBuilderArg = PothosSchemaTypes.MutationFieldBuilder<
  PothosSchemaTypes.ExtendDefaultTypes<{
    Context: SchemaContext;
    DefaultFieldNullability: false;
  }>,
  {}
>;
