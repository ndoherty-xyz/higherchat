import { GRAPHQL_URL } from "@/constants/server";
import { FieldMergeFunction, from, HttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import {
  ApolloClient,
  InMemoryCache,
} from "@apollo/experimental-nextjs-app-support";
import { getCookie } from "cookies-next";
import { StrictTypedTypePolicies } from "../_generated_/graphql";
import { ArrayElement } from "./types";
import assert from "assert";
import { removeTypenameFromVariables } from "@apollo/client/link/remove-typename";

export const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = getCookie("higherchat-auth");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? token : "",
    },
  };
});

/**
 * Merge a field that has an array subfield (arrayField).
 * Sort the array by the value of arrayItemField.
 * arrayItemField expected to be a unique identifier.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function mergeAndSortArrayByField<
  Query extends Record<ArrayField, unknown[]>,
  ArrayField extends string & keyof Query
>(args: {
  fragment: Query;
  arrayField: Query[ArrayField] extends unknown[] ? ArrayField : never;
  arrayItemFields: (string & keyof ArrayElement<Query[ArrayField]>)[];
  keepExistingFieldsIfCursorIsNull: (string & keyof Query)[];
}): FieldMergeFunction {
  return (existing, incoming, options) => {
    /**
     * Asserts that cursor is an argument for the query
     */
    assert(
      !!options.args &&
        (typeof options.args?.cursor === "number" ||
          typeof options.args?.cursor === "string" ||
          typeof options.args?.cursor === "undefined" ||
          options.args.cursor === null)
    );

    if (!existing) {
      return incoming;
    }

    try {
      const existingArr = options.readField(args.arrayField, existing);
      if (!Array.isArray(existingArr)) {
        throw new Error();
      }

      const incomingArr = options.readField(args.arrayField, incoming);
      if (!Array.isArray(incomingArr)) {
        throw new Error();
      }

      /**
       * If cursor, add new items to end. Otherwise add to start
       */
      const existingAndIncomingArr = options.args.cursor
        ? [...existingArr, ...incomingArr]
        : [...incomingArr, ...existingArr];

      /**
       * Create map of all entries keyed by arrayItemField.
       * Map data structure enforces no duplicates.
       */
      const map = new Map();
      for (const item of existingAndIncomingArr) {
        const arrayItemFieldValues = args.arrayItemFields.map((field) =>
          options.readField(field, item)
        );

        const mergeAndSortArrayKey = arrayItemFieldValues.join("::");
        if (!mergeAndSortArrayKey) {
          if (process.env.NODE_ENV === "development") {
            console.error(
              "mergeAndSortArrayByField: no mergeAndSortArrayKey for incoming item"
            );
          }
          continue;
        }

        map.set(mergeAndSortArrayKey, item);
      }

      /**
       * Sort entries by arrayItemField
       */
      const items = Array.from(map.values());

      return {
        ...incoming,
        ...(options.args.cursor
          ? null
          : Object.fromEntries(
              args.keepExistingFieldsIfCursorIsNull.map(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (field): [typeof field, any] => [
                  field,
                  options.readField(field, existing),
                ]
              )
            )),
        [args.arrayField]: items,
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("apollo cache error in mergeAndSortArrayByField");
        throw new Error("apollo cache error in mergeAndSortArrayByField");
      }
      return incoming;
    }
  };
}

export const typePolicies: StrictTypedTypePolicies = {};

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies,
  }),
  link: from([
    removeTypenameFromVariables(),
    authLink,
    new HttpLink({
      uri: GRAPHQL_URL,
    }),
  ]),
});
