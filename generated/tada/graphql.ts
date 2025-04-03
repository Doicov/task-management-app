import { initGraphQLTada } from "gql.tada";
import { introspection } from "../tadagraphql-env";

export const graphql = initGraphQLTada<{
  introspection: introspection;
  scalars: {
    uuid: string;
    timestamptz: string;
    citext: string;
    bpchar: string;
    bigint: number;
    smallint: number;
    date: string;
    timestamp: string;
  };
}>();

export type { FragmentOf, ResultOf, VariablesOf } from "gql.tada";
export { readFragment } from "gql.tada";

// export const Add_task = graphql(`
//     mutation ToggleTaskStatus($id: uuid!, $status:Boolean!) {
//         update_tasks_by_pk(pk_columns: {id: $id}, _set: {status: $status}) {
//             id
//             status
//         }
//     }`)
