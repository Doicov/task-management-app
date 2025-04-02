import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  styled,
} from "@mui/material";
import { Folder, folderStore } from "../stores/folderStore"; // Путь к store для работы с папками
import { client } from "../api/client";
import { CloudUpload } from "@mui/icons-material";
import { Instance } from "mobx-state-tree";

type FolderType = Instance<typeof Folder>;

interface FolderFormProps {
  open: boolean;
  onClose: () => void;
  folder?: FolderType; // Объект папки, если редактируем
  // onFolderAction: (message: string) => void;
}

const FolderForm: React.FC<FolderFormProps> = observer(
  ({ open, onClose, folder }) => {
    const [formData, setFormData] = useState<FolderType>({
      id: "", // Генерация ID будет на сервере
      name: "",
      image_url: null, // Путь к изображению
      created_at: "",
    });

    const [error, setError] = useState<string>("");

    useEffect(() => {
      // При открытии формы для редактирования, если переданы данные папки
      if (folder) {
        setFormData({
          id: folder.id,
          name: folder.name,
          image_url: folder.image_url,
          created_at: folder.created_at,
        });
      }
    }, [folder]);

    // Обработчик изменения данных
    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
      setError(""); // Сброс ошибок
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files ? e.target.files[0] : null;
      if (file) {
        // Тут можно добавить логику для загрузки изображения на сервер или его обработку
        // Например, преобразуем изображение в base64, если нужно
        setFormData({ ...formData, image_url: URL.createObjectURL(file) }); // временно показываем URL объекта
      }
    };

    // Обработчик добавления папки
    const handleSubmit = () => {
      if (!formData.name.trim()) {
        setError("Поле 'Name' обязательно для заполнения!");
        return;
      }

      const imageUrl = formData.image_url ?? undefined;
      // Добавление папкb
      if (folder) {
        folderStore.updateFolder(client, folder.id, formData.name, imageUrl);
      } else {
        folderStore.createFolder(client, formData.name, imageUrl);
      }
      onClose(); // Закрыть диалог после добавления
    };

    const VisuallyHiddenInput = styled("input")({
      clip: "rect(0 0 0 0)",
      clipPath: "inset(50%)",
      height: 1,
      overflow: "hidden",
      position: "absolute",
      bottom: 0,
      left: 0,
      whiteSpace: "nowrap",
      width: 1,
    });

    return (
      <Dialog
        open={open}
        onClose={onClose}
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: "#222227",
            color: "#fff",
            borderRadius: "12px",
            padding: "16px",
            minWidth: "515px",
            minHeight: "280px",
          },
        }}
      >
        <DialogTitle>{folder ? "Edit Folder" : "Add Folder"}</DialogTitle>
        <DialogContent>
          <TextField
            variant="standard"
            fullWidth
            label="Folder Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            margin="normal"
            error={!!error}
            helperText={error}
            sx={{
              input: { color: "white" },
              label: { color: "rgba(255, 255, 255, 0.49)" },
              "& label.Mui-focused": { color: "rgba(255, 255, 255, 0.69)" },
              "& .MuiInput-underline:before": {
                borderBottomColor: "rgba(255, 255, 255, 0.69)",
              },
              "& .MuiInput-underline:hover:before": {
                borderBottomColor: "#ffffff !important",
              },
              "& .MuiInput-underline:after": { borderBottomColor: "#4dab44" },
            }}
          />
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUpload />}
            sx={{ marginTop: "15px" }}
          >
            Upload files
            <VisuallyHiddenInput
              type="file"
              onChange={handleImageChange}
              multiple
            />
          </Button>

          {formData.image_url && (
            <div>
              <img
                src={formData.image_url}
                alt="preview"
                style={{ maxWidth: "30%" }}
              />
            </div>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "flex-start",
            paddingLeft: "25px",
            paddingTop: "5px",
          }}
        >
          <Button onClick={handleSubmit} color="secondary" variant="contained">
            {folder ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
);

export default FolderForm;
