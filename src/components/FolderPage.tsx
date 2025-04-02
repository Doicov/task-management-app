import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { Container } from "@mui/material";
import Home from "./Home";

const FolderPage = observer(() => {
  const { folderId } = useParams<{ folderId: string }>();

  return (
    <Container>
      <Home folderId={folderId} />
    </Container>
  );
});

export default FolderPage;
