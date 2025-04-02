import { types, flow, toGenerator, cast } from "mobx-state-tree";
import { Client } from "@urql/core";
import { GET_FOLDERS_QUERY } from "../api/quries";
import { CREATE_FOLDER_MUTATION, UPDATE_FOLDER_MUTATUIN, DELETE_FOLDER_MUTATION } from "../api/mutations";

export const Folder = types.model("Folder", {
  id: types.identifier,
  name: types.string,
  image_url: types.maybeNull(types.string),
  created_at: types.string,
});

export const FolderStore = types
  .model("FolderStore", {
    folders: types.array(Folder),
  })
  .views((self) => ({
    get sortedFolders() {
      return self.folders = cast(self.folders.slice().sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      ));
    }
  }))
  .actions((self) => ({

    fetchFolders: flow(function* (client: Client) {
      try {
        const result = yield* toGenerator(client.query(GET_FOLDERS_QUERY, {}).toPromise());
        if (result.data && Array.isArray(result.data.folders)) {
          const folders = result.data.folders.map((folder) => ({
            ...folder,
            created_at: String(folder.created_at),
          }));
          self.folders = cast(folders.sort(
            (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          ));
        }
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
          client.mutation(CREATE_FOLDER_MUTATION, { name, image_url }).toPromise()
        );
        if (result.data?.insert_folders_one) {
          const newFolder = {
            ...result.data.insert_folders_one,
            created_at: String(result.data.insert_folders_one.created_at),
          };
          self.folders.push(cast(newFolder));
          self.folders = cast(self.folders.slice().sort(
            (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          ));
        }
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
          client.mutation(UPDATE_FOLDER_MUTATUIN, { id, name: newName, image_url: newImageUrl }).toPromise()
        );

        if (result.data?.update_folders_by_pk) {
          self.folders[folderIndex] = cast({
            ...folder,
            ...result.data.update_folders_by_pk,
          });
          self.folders = cast(self.folders.slice().sort(
            (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          ));
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
        self.folders.replace(self.folders.filter((folder) => folder.id !== id));
      }
    } catch (error) {
      console.error("Ошибка удаления папки:", error);
    }
    }),
  }));

export const folderStore = FolderStore.create({ folders: [] });
