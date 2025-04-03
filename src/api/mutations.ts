// import gql from "gql.tada";
import { graphql } from "../../generated/tada/graphql";

export const ADD_TASKS = graphql(`
  mutation insertTask($objects: [tasks_insert_input!]!) {
    insert_tasks(objects: $objects) {
      returning {
        id
        title
        description
        due_date
        status
        folder_id
      }
    }
  }
`);

export const TOGGLE_TASK_STATUS = graphql(`
  mutation ToggleTaskStatus($id: uuid!, $status: Boolean!) {
    update_tasks_by_pk(pk_columns: { id: $id }, _set: { status: $status }) {
      id
      status
    }
  }
`);

export const DELETE_TASK = graphql(`
  mutation DeleteTask($id: uuid!) {
    delete_tasks_by_pk(id: $id) {
      id
    }
  }
`);

export const UPDATE_TASK = graphql(`
  mutation UpdateTask(
    $id: uuid!
    $title: String!
    $description: String
    $due_date: timestamptz!
  ) {
    update_tasks_by_pk(
      pk_columns: { id: $id }
      _set: { title: $title, description: $description, due_date: $due_date }
    ) {
      id
      title
      description
      due_date
      status
      created_at
    }
  }
`);

//folderStore
export const CREATE_FOLDER_MUTATION = graphql(`
  mutation CreateFolder($name: String!, $image_url: String) {
    insert_folders_one(object: { name: $name, image_url: $image_url }) {
      id
      name
      image_url
      created_at
    }
  }
`);

export const UPDATE_FOLDER_MUTATUIN = graphql(`
  mutation UpdateFolder($id: uuid!, $name: String, $image_url: String) {
    update_folders_by_pk(
      pk_columns: { id: $id }
      _set: { name: $name, image_url: $image_url }
    ) {
      id
      name
      image_url
    }
  }
`);

export const DELETE_FOLDER_MUTATION = graphql(`
  mutation DeleteFolder($id: uuid!) {
    delete_folders_by_pk(id: $id) {
      id
    }
  }
`);
