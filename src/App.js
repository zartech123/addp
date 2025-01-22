import { useRef, useState } from "react";
import { makeStyles } from "@mui/styles";
import Box from "@mui/material/Box";
import * as React from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import ButtonBase from "@mui/material/ButtonBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import ClearIcon from "@mui/icons-material/Clear";

const FileInput = ({ label, onChange, error }) => {
  const ref = useRef();
  const classes = useStyles();
  const [severity, setSeverity] = useState("info");
  const [attachment, setAttachment] = useState(null);
  const [snackbar, setSnackbar] = React.useState(
    "Please browse the File first"
  );
  const [open, setOpen] = React.useState(false);
  const handleCloseSnackbar = () => {
    setSnackbar("Please browse the File first");
    setAttachment(null);
    setSeverity("info");
    setOpen(false);
  };

  const handleClick = () => {
    if (attachment !== null) {
      axios
        .post("upload_file", attachment, {
          headers: { "Content-Type": attachment.type }
        })
        .then((response) => {
          setSnackbar("File " + attachment.name + " has been uploaded");
          setSeverity("success");
        })
        .catch((err) => {
          setSnackbar(err.message);
          setSeverity("error");
        });
    }
    setOpen(true);
  };

  const handleChange = (event) => {
    const files = Array.from(event.target.files);
    const [file] = files;
    setAttachment(file);
    setSnackbar(null);
    //    console.log(file);
    if (!!onChange) onChange({ target: { value: file } });
  };

  return (
    <>
      <Box
        height={60}
        color={!!error ? "#d32f2f" : "#424242"}
        sx={{ m: 0.5 }}
        borderBottom={0}
      >
        <Box position="absolute" top={75} bottom={0} left={0} right={0} mx={1}>
          <TextField
            className={classes.field}
            variant="standard"
            InputProps={{ disableunderline: true }}
            margin="normal"
            fullWidth
            variant="outlined"
            disabled
            label={label}
            size="small"
            value={attachment?.name || "Browse"}
            //error={!!error}
            //            helperText={error?.message || ""}
          />
        </Box>
        <ButtonBase
          size="small"
          className={classes.button}
          component="label"
          onKeyDown={(e) => e.keyCode === 32 && ref.current?.click()}
        >
          <input
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            ref={ref}
            type="file"
            hidden
            onChange={handleChange}
          />
        </ButtonBase>
      </Box>
      <IconButton color="primary" size="small" onClick={handleClick}>
        <FileUploadIcon />
      </IconButton>
      <IconButton color="primary" size="small" onClick={handleCloseSnackbar}>
        <ClearIcon />
      </IconButton>
      {!!snackbar && (
        <Snackbar
          open={open}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          onClose={handleCloseSnackbar}
          autoHideDuration={6000}
        >
          <Alert severity={severity} onClose={handleCloseSnackbar}>
            {snackbar}
          </Alert>
        </Snackbar>
      )}
      <div>
        <br />
      </div>
      <Divider />
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  field: {
    "& .MuiFormLabel-root.Mui-disabled": {
      color: "#1565c0"
    }
  },
  button: {
    width: "100%",
    height: "100%",
    overflow: "hidden"
  }
}));

export default FileInput;
