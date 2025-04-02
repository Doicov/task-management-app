import { graphql } from "../../generated/tada/graphql";

export const GET_TASKS = graphql(`
  query GetTasks($folderId: uuid) {
    tasks(where: { folder_id: { _eq: $folderId } }) {
      id
      title
      description
      due_date
      status
      created_at
    }
  }
`);

export const GET_FOLDER_BY_ID = graphql(`
  query GetFolderById($id: uuid!) {
    folder: folders_by_pk(id: $id) {
      name
    }
  }
`);

//folderStore
export const GET_FOLDERS_QUERY = graphql(`
  query GetFolders {
    folders {
      id
      name
      created_at
      image_url
    }
  }
`);