import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import { Cocktail } from "../../shared/types";

type DeleteCocktailDialogProps = {
  open: boolean;
  closeDialog: () => void;
  cocktail: Cocktail;
  deleteError: string | null;
  handleDelete: () => void;
};

const DeleteCocktailDialog = ({
  open,
  closeDialog,
  cocktail,
  handleDelete,
  deleteError,
}: DeleteCocktailDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={closeDialog}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
    >
      <DialogTitle id="delete-dialog-title">Delete Cocktail</DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-dialog-description">
          Are you sure you want to delete {cocktail.name} cocktail?
        </DialogContentText>
        {deleteError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {deleteError}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog} color="primary">
          Cancel
        </Button>
        <Button onClick={handleDelete} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteCocktailDialog;
