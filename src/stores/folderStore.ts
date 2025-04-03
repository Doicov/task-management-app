import { types, flow, toGenerator, cast } from "mobx-state-tree";
import { Client } from "@urql/core";
import { GET_FOLDERS_QUERY } from "../api/quries";
import {
  CREATE_FOLDER_MUTATION,
  UPDATE_FOLDER_MUTATUIN,
  DELETE_FOLDER_MUTATION,
} from "../api/mutations";

export const Folder = types.model("Folder", {
  id: types.identifier,
  name: types.string,
  image_url: types.maybeNull(types.string),
  created_at: types.maybeNull(types.string),
});

export const FolderStore = types
  .model("FolderStore", {
    folders: types.array(Folder),
  })
  .views((self) => ({
    get sortedFolders() {
      return self.folders.sort((a, b) => {
        const timeA = a.created_at
          ? new Date(a.created_at).getTime()
          : Infinity;
        const timeB = b.created_at
          ? new Date(b.created_at).getTime()
          : Infinity;
        return timeA - timeB;
      });
    },
  }))
  .actions((self) => ({
    fetchFolders: flow(function* (client: Client) {
      try {
        const result = yield* toGenerator(
          client.query(GET_FOLDERS_QUERY, {}).toPromise()
        );

        if (!result?.data) return;

        result?.data.folders?.forEach((f) => f && self.folders.push(f));
      } catch (error) {
        console.error("Ошибка загрузки папок:", error);
      }
    }),

    createFolder: flow(function* (
      client: Client,
      name: string,
      image_url?: string
    ) {
      try {
        const result = yield* toGenerator(
          client
            .mutation(CREATE_FOLDER_MUTATION, { name, image_url })
            .toPromise()
        );

        if (!result.data?.insert_folders_one) return;

        self.folders.push(result.data.insert_folders_one);
      } catch (error) {
        console.error("Ошибка создания папки:", error);
      }
    }),

    updateFolder: flow(function* (
      client: Client,
      id: string,
      name?: string,
      image_url?: string
    ) {
      try {
        const folderIndex = self.folders.findIndex((f) => f.id === id);
        if (folderIndex === -1) return;

        const folder = self.folders[folderIndex];
        const newName = name ?? folder.name;
        const newImageUrl = image_url ?? folder.image_url;

        const result = yield* toGenerator(
          client
            .mutation(UPDATE_FOLDER_MUTATUIN, {
              id,
              name: newName,
              image_url: newImageUrl,
            })
            .toPromise()
        );

        if (result.data?.update_folders_by_pk) {
          self.folders[folderIndex] = cast({
            ...folder,
            ...result.data.update_folders_by_pk,
          });
        }
      } catch (error) {
        console.error("Ошибка обновления папки:", error);
      }
    }),

    deleteFolder: flow(function* (client: Client, id: string) {
      try {
        const result = yield client
          .mutation(DELETE_FOLDER_MUTATION, { id })
          .toPromise();
        if (result.data) {
          self.folders.replace(
            self.folders.filter((folder) => folder.id !== id)
          );
        }
      } catch (error) {
        console.error("Ошибка удаления папки:", error);
      }
    }),
  }));

export const folderStore = FolderStore.create({ folders: [] });
