import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useClient } from "urql";
import { folderStore } from "../stores/folderStore";
import { Link } from "react-router-dom";
import {
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Container,
  Button,
  IconButton,
  Box,
} from "@mui/material";
import { Delete, Edit, Image } from "@mui/icons-material";
import FolderForm from "./FolderForm";
import AlertTask from "./AlertTask";

const FolderList: React.FC = observer(() => {
  const client = useClient();
  const [openForm, setOpenForm] = useState(false);
  const [dialog, setDialog] = useState({ open: false, id: "" });

  const openDeleteDialog = (id: string) => setDialog({ open: true, id: id });
  const closeDeleteDialog = () => setDialog({ open: false, id: "" });

  const handleAddFolder = () => {
    setOpenForm(true); // Открываем форму при нажатии на кнопку
  };

  const handleCloseForm = () => {
    setOpenForm(false); // Закрываем форму
  };

  useEffect(() => {
    folderStore.fetchFolders(client);
  }, [client]);

  const handleUpdateFolder = (id: string) => {
    const newName = prompt("Введите новое название папки:");
    if (newName) {
      folderStore.updateFolder(client, id, newName);
    }
  };

  const handleDeleteFolder = () => {
    if (dialog.id) {
      folderStore.deleteFolder(client, dialog.id);
      // setSnackbar({ open: true, message: "Task successfully deleted!" });
    }
    closeDeleteDialog();
  };

  const handleImageChange = (
    id: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const imagePath = `images/${file.name}`; // Сохраняем путь
    folderStore.updateFolder(client, id, undefined, imagePath);
  };

  return (
    <Container>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={15}
        mb={3}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{
            background: "linear-gradient(30deg, #2ECC71, #3498DB)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Folders
        </Typography>
        <Button variant="contained" color="secondary" onClick={handleAddFolder}>
          + Add folder
        </Button>
      </Box>
      <Grid container spacing={3}>
        {folderStore.sortedFolders.map((folder) => (
          <Grid item xs={10} sm={6} md={4} key={folder.id}>
            <Card
              sx={{
                background: "rgba(20, 20, 50, 0.3)",
                borderRadius: "12px",
                boxShadow: "12px 11px 21px 0px rgba(29, 34, 37, 0.48)",
                transition:
                  "transform 0.4s cubic-bezier(.25,.46,.45,.94), box-shadow 0.4s cubic-bezier(.25,.46,.45,.94)",
                "&:hover": {
                  transform: "scale(1.02)",
                  boxShadow: "0px 4px 20px rgba(0,0,0,0.35)",
                },
              }}
            >
              <CardActionArea component={Link} to={`/folders/${folder.id}`}>
                <CardMedia
                  component="img"
                  height="140"
                  image={`/${folder.image_url || "images/default.jpg"}`}
                  alt={folder.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" color="#e1e0e0">
                    {folder.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#b9b9b9" }}>
                    Дата создания:{" "}
                    {new Date(folder.created_at).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  id={`upload-${folder.id}`}
                  onChange={(e) => handleImageChange(folder.id, e)}
                />
                <label htmlFor={`upload-${folder.id}`}>
                  <IconButton color="primary" component="span">
                    <Image />
                  </IconButton>
                </label>
                <IconButton
                  color="primary"
                  onClick={() => handleUpdateFolder(folder.id)}
                >
                  <Edit />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => openDeleteDialog(folder.id)}
                >
                  <Delete />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <FolderForm open={openForm} onClose={handleCloseForm} />
      <AlertTask
        open={dialog.open}
        onClose={closeDeleteDialog}
        onConfirm={handleDeleteFolder}
        itemType="Folder"
      />
    </Container>
  );
});

export default FolderList;
