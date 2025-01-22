import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid2";
import Autocomplete from "@mui/material/Autocomplete";
import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import DialogContentText from "@mui/material/DialogContentText";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import {
  GridRowModes,
  gridClasses,
  useGridApiContext,
  DataGridPro,
  GridToolbarQuickFilter,
  GridToolbarContainer,
  GridToolbarExport,
  GridActionsCellItem,
  GridRowEditStopReasons,
  GridEditInputCell,
} from "@mui/x-data-grid-pro";
import { randomId } from "@mui/x-data-grid-generator";
import { Typography } from "@mui/material";

var initialRows = [
  {
    id: randomId(),
    appName: "Application",
    ip1: "11.11.11.11",
    port1: "0",
    ip2: "10.10.10.10",
    port2: "0",
    composite: false,
    changeControl: false,
    trigger: [],
  },
];

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

function EditToolbar(props) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = randomId();
    setRows((oldRows) => [
      ...oldRows,
      {
        id,
        appName: "Application",
        ip1: "11.11.11.11",
        port1: "0",
        ip2: "10.10.10.10",
        port2: "0",
        composite: false,
        changeControl: false,
        trigger: [],
        isNew: true,
      },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "appName" },
    }));
  };

  return (
    <GridToolbarContainer>
      <IconButton onClick={handleClick} size="small" color="primary">
        <AddIcon />
      </IconButton>
      <Typography component="div" sx={{ flexGrow: 1 }}></Typography>
      <GridToolbarExport />
      &nbsp;|&nbsp; <GridToolbarQuickFilter />
    </GridToolbarContainer>
  );
}

const useFakeMutation = () => {
  return React.useCallback(
    (app) =>
      new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(app);
        }, 200);
      }),
    []
  );
};

function computeMutation(newRow, oldRow) {
  var confMessage = "";
  var composite = "Disabled";
  var changeControl = "Disabled";
  var trigger = "";
  if (newRow.composite === true) composite = "Enabled";
  if (newRow.changeControl === true) changeControl = "Enabled";
  newRow.trigger.map(function (data) {
    trigger = trigger + data.name + ", ";
  });

  confMessage = (
    <Grid container spacing={2}>
      <Grid size={4}>
        <Item>
          Application Name :{" "}
          <strong style={{ color: "brown" }}>{newRow.appName}</strong>
        </Item>
      </Grid>
      <Grid size={4}>
        <Item>
          Primary IP : <strong style={{ color: "blue" }}>{newRow.ip1}</strong>
        </Item>
      </Grid>
      <Grid size={4}>
        <Item>
          Primary Port :{" "}
          <strong style={{ color: "blue" }}>{newRow.port1}</strong>
        </Item>
      </Grid>
      <Grid size={4}>
        <Item>
          Secondary IP :{" "}
          <strong style={{ color: "green" }}>{newRow.ip2}</strong>
        </Item>
      </Grid>
      <Grid size={4}>
        <Item>
          Secondary Port :{" "}
          <strong style={{ color: "green" }}>{newRow.port2}</strong>
        </Item>
      </Grid>
      <Grid size={4}>
        <Item>
          Composite Trigger :{" "}
          <strong style={{ color: "darkcyan" }}>{composite}</strong>
        </Item>
      </Grid>
      <Grid size={4}>
        <Item>
          Change Control :{" "}
          <strong style={{ color: "darkcyan" }}>{changeControl}</strong>
        </Item>
      </Grid>
      <Grid size={8}>
        <Item>
          Trigger Rule :{" "}
          <strong style={{ color: "darkgoldenrod" }}>{trigger}</strong>
        </Item>
      </Grid>
    </Grid>
  );
  if (confMessage != "") {
    return confMessage;
  }
  return null;
  //  return null;
}

const StyledBox = styled("div")(({ theme }) => ({
  width: "100%",
  "& .MuiDataGrid-cell--editable": {
    backgroundColor: "#ffffff",
    "& .MuiInputBase-root": {
      height: "100%",
    },
    ...theme.applyStyles("dark", {
      backgroundColor: "#376331",
    }),
  },
  "& .Mui-error": {
    backgroundColor: "rgb(126,10,15, 0.1)",
    color: "#750f0f",
    ...theme.applyStyles("dark", {
      backgroundColor: "rgb(126,10,15, 0)",
      color: "#ff4343",
    }),
  },
}));

const StyledTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
  },
}));

export function CustomFooterStatusComponent(props) {
  return (
    <Box sx={{ p: 1, display: "flex" }}>
      <FiberManualRecordIcon
        fontSize="small"
        sx={{
          mr: 1,
          color: props.status === "connected" ? "#4caf50" : "#d9182e",
        }}
      />
      Status : {props.status}
    </Box>
  );
}

export default function FullFeaturedCrudGrid() {
  const [rows, setRows] = React.useState(initialRows);
  const [numRows, setNumRows] = React.useState(null);
  const [status, setStatus] = React.useState("connected");
  useEffect(() => {
    const getDestination = async () => {
      await axios
        .get("https://67864edbf80b78923aa65030.mockapi.io/destination")
        .then((response) => {
          console.log("xxx");
          setNumRows(response.data.length);
          //setRows(response.data);
        })
        .catch((error) => {
          alert(error.message);
        });
    };
    getDestination();
  }, []);

  const mutateRow = useFakeMutation();
  const noButtonRef = React.useRef(null);
  const [promiseArguments, setPromiseArguments] = React.useState(null);
  const [snackbar, setSnackbar] = React.useState(null);
  const [rowModesModel, setRowModesModel] = React.useState({});

  const handleCloseSnackbar = () => setSnackbar(null);
  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    console.log(rows);
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  /*const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setSnackbar({ children: "Data successfully saved", severity: "success" });
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };*/

  const processRowUpdate = React.useCallback(
    (newRow, oldRow) =>
      new Promise((resolve, reject) => {
        const mutation = computeMutation(newRow, oldRow);
        if (mutation) {
          // Save the arguments to resolve or reject the promise later
          setPromiseArguments({ resolve, reject, newRow, oldRow });
        } else {
          resolve(oldRow); // Nothing was changed
        }
      }),
    []
  );

  const handleNo = () => {
    const { oldRow, resolve } = promiseArguments;
    resolve(oldRow); // Resolve with the old row to not update the internal state
    setPromiseArguments(null);
  };

  const handleYes = async () => {
    const { newRow, oldRow, reject, resolve } = promiseArguments;
    try {
      const response = await mutateRow(newRow);
      resolve(response);
      setPromiseArguments(null);
      console.log(newRow.isNew);
      if (newRow.isNew) {
        const updatedRow = { ...newRow, isNew: false };
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        /*const insertDestination = async () => {
        let appName = newRow.appName;
        let ip1 = newRow.ip1;
        let port1 = newRow.port1;
        let ip2 = newRow.ip2;
        let port2 = newRow.port2;
        let composite = newRow.composite;
        let changeControl = newRow.changeControl;
        await axios
          .post("https://67864edbf80b78923aa65030.mockapi.io/destination", {
            nameName: appName,
            id: id,
            ip1: ip1,
            ip2: ip2,
            port1: port1,
            port2: port2,
            composite: composite,
            changeControl: changeControl,
            trigger: [],
          })
          .then((res) => {
            setSnackbar({
              children: "Data successfully saved",
              severity: "success",
            });
          })
          .catch((err) => {
            setSnackbar({ children: err.message, severity: "error" });
          });
      };
      insertDestination();
      */
        console.log(newRow);
      } else {
        const updatedRow = { ...newRow, isNew: false };
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        console.log(newRow);
        /*const updateDestination = async () => {
        let appName = newRow.appName;
        let ip1 = newRow.ip1;
        let id = numRows+1;
        let port1 = newRow.port1;
        let ip2 = newRow.ip2;
        let port2 = newRow.port2;
        let composite = newRow.composite;
        let changeControl = newRow.changeControl;
        await axios
          .patch("https://67864edbf80b78923aa65030.mockapi.io/destination/{id}", {
            nameName: appName,
            id: id,
            ip1: ip1,
            ip2: ip2,
            port1: port1,
            port2: port2,
            composite: composite,
            changeControl: changeControl,
            trigger: [],
          })
          .then((res) => {
            setSnackbar({
              children: "Data successfully saved",
              severity: "success",
            });
          })
          .catch((err) => {
            setSnackbar({ children: err.message, severity: "error" });
          });
      };*/
        //updateDestination();
      }
      // Make the HTTP request to save in the backend
    } catch (error) {
      setSnackbar({ children: error.message, severity: "error" });
      reject(oldRow);
      setPromiseArguments(null);
    }
  };

  const handleEntered = () => {
    // The `autoFocus` is not used because, if used, the same Enter that saves
    // the cell triggers "No". Instead, we manually focus the "No" button once
    // the dialog is fully open.
    // noButtonRef.current?.focus();
  };

  const renderConfirmDialog = () => {
    if (!promiseArguments) {
      return null;
    }

    const { newRow, oldRow } = promiseArguments;
    const mutation = computeMutation(newRow, oldRow);

    return (
      <Dialog
        maxWidth="md"
        aria-labelledby="responsive-dialog-title"
        TransitionProps={{ onEntered: handleEntered }}
        open={!!promiseArguments}
      >
        <DialogTitle id="responsive-dialog-title">
          Data will be Updated
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText>{mutation}.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button ref={noButtonRef} onClick={handleNo}>
            No
          </Button>
          <Button onClick={handleYes}>Yes</Button>
        </DialogActions>
      </Dialog>
    );
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const StyledTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.error.main,
      color: theme.palette.error.contrastText,
    },
  }));

  function NameEditInputCell(props) {
    const { error } = props;

    return (
      <StyledTooltip open={!!error} title={error}>
        <GridEditInputCell {...props} />
      </StyledTooltip>
    );
  }

  function renderEditName(params) {
    return <NameEditInputCell {...params} />;
  }

  const CategoryCell = (props) => {
    const { id, value, field } = props;
    const apiRef = useGridApiContext();
    const [dataSet, setDataSet] = useState([]);
    useEffect(() => {
      const category = [
        { id: 1, name: "New Equipment" },
        { id: 2, name: "New Subscriber" },
        { id: 3, name: "Equipment Change" },
        { id: 4, name: "Subscriber Change" },
        { id: 5, name: "Location Change" },
        { id: 6, name: "Cell ID Change" },
        { id: 7, name: "TAC Change" },
        { id: 8, name: "MME Change" },
      ];
      setDataSet(category);
    }, []);
    const handleChange = async (event, item) => {
      const isValid = await apiRef.current.setEditCellValue({
        id,
        field,
        value: item,
      });
      if (isValid) {
        apiRef.current.stopCellEditMode({ id, field });
      }
    };
    const handleDelete = (index) => {
      const updatedValue = [...value];
      // Remove the item at the specified index
      updatedValue.splice(index, 1);
      // Update the state with the new value array
      handleChange(null, updatedValue);
    };
    return (
      <Autocomplete
        fullWidth
        variant="soft"
        id="size-small-outlined-multi"
        size="small"
        value={value}
        multiple
        limitTags={8}
        options={dataSet}
        getOptionLabel={(option) => option.name}
        filterSelectedOptions
        onChange={handleChange}
        renderInput={(params) => (
          <TextField {...params} placeholder="Choose Trigger Rule" />
        )}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        renderTags={(value) => (
          <Stack spacing={1}>
            {value.map((option, index) => (
              <Chip
                direction="row"
                size="small"
                key={index}
                label={option.name}
                onDelete={() => handleDelete(index)}
              />
            ))}
          </Stack>
        )}
      />
    );
  };

  const editCategory = (params) => {
    return <CategoryCell {...params} />;
  };

  const columns = [
    {
      field: "appName",
      renderHeader: () => (
        <Chip size="small" color="primary" label="Application Name" />
      ),
      headerAlign: "center",
      align: "center",
      width: 200,
      preProcessEditCellProps: (params) => {
        const hasError = params.props.value === "";
        var errMessage = "";
        if (hasError) {
          errMessage = "Application Name can't be blank";
        }
        return { ...params.props, error: errMessage };
      },
      renderEditCell: renderEditName,
      editable: true,
    },
    {
      field: "ip1",
      renderHeader: () => (
        <Chip size="small" color="primary" label="Primary IP" />
      ),
      align: "center",
      width: 150,
      preProcessEditCellProps: (params) => {
        const hasError =
          /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
            params.props.value
          ) === false;
        var errMessage = "";
        if (hasError) {
          errMessage = "Invalid IP Address";
        }
        return { ...params.props, error: errMessage };
      },
      headerAlign: "center",
      renderEditCell: renderEditName,
      editable: true,
    },
    {
      field: "port1",
      renderHeader: () => <Chip size="small" color="primary" label="Port" />,
      align: "center",
      type: "number",
      preProcessEditCellProps: (params) => {
        const hasError = params.props.value > 65535;
        var errMessage = "";
        if (hasError) {
          errMessage = "Port Number Range is 0 - 65535";
        }
        return { ...params.props, error: errMessage };
      },
      valueGetter: (value, row) => {
        return `${row.port1}`;
      },
      width: 110,
      headerAlign: "center",
      renderEditCell: renderEditName,
      editable: true,
    },
    {
      field: "ip2",
      renderHeader: () => (
        <Chip size="small" color="primary" label="Secondary IP" />
      ),
      width: 160,
      align: "center",
      preProcessEditCellProps: (params) => {
        const hasError =
          /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
            params.props.value
          ) === false;
        var errMessage = "";
        if (hasError) {
          errMessage = "Invalid IP Address";
        }
        return { ...params.props, error: errMessage };
      },
      headerAlign: "center",
      renderEditCell: renderEditName,
      editable: true,
    },
    {
      field: "port2",
      renderHeader: () => <Chip size="small" color="primary" label="Port" />,
      type: "number",
      align: "center",
      preProcessEditCellProps: (params) => {
        const hasError = params.props.value > 65535;
        var errMessage = "";
        if (hasError) {
          errMessage = "Port Number Range is 0 - 65535";
        }
        return { ...params.props, error: errMessage };
      },
      valueGetter: (value, row) => {
        return `${row.port2}`;
      },
      width: 110,
      headerAlign: "center",
      renderEditCell: renderEditName,
      editable: true,
    },
    {
      field: "composite",
      renderHeader: () => (
        <Chip size="small" color="primary" label="Composite Trigger" />
      ),
      type: "boolean",
      width: 180,
      headerAlign: "center",
      editable: true,
    },
    {
      field: "changeControl",
      renderHeader: () => (
        <Chip size="small" color="primary" label="Change Control" />
      ),
      type: "boolean",
      headerAlign: "center",
      align: "center",
      width: 160,
      editable: true,
    },
    {
      field: "trigger",
      renderHeader: () => (
        <Chip size="small" color="primary" label="Trigger Rule" />
      ),
      headerAlign: "center",
      width: 170,
      editable: true,
      renderCell: (params) => {
        return (
          <Stack spacing={1}>
            {params.value.map((item) => (
              <Chip
                direction="row"
                size="small"
                key={item.id}
                label={item.name}
              />
            ))}
          </Stack>
        );
      },
      renderEditCell: editCategory,
    },
    {
      field: "actions",
      type: "actions",
      renderHeader: () => <Chip size="small" label="Actions" color="success" />,
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              color="success"
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              //              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="error"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            //            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Box
      sx={{
        height: 500,
        width: "100%",
        "& .actions": {
          color: "text.secondary",
        },
        "& .textPrimary": {
          color: "text.primary",
        },
      }}
    >
      <StyledBox>
        {renderConfirmDialog()}
        <DataGridPro
          rows={rows}
          pagination
          disableColumnMenu
          columns={columns}
          getRowHeight={() => "auto"}
          initialState={{
            pinnedColumns: { left: ["appName"], right: ["actions"] },
            pagination: { paginationModel: { pageSize: 5 } },
          }}
          sx={{
            [`& .${gridClasses.cell}`]: {
              py: 1,
            },
          }}
          pageSizeOptions={[5, 10, 25, { value: -1, label: "All" }]}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          slots={{ footer: CustomFooterStatusComponent, toolbar: EditToolbar }}
          slotProps={{
            footer: { status },
            toolbar: { setRows, setRowModesModel },
          }}
        />
        {!!snackbar && (
          <Snackbar open onClose={handleCloseSnackbar} autoHideDuration={6000}>
            <Alert {...snackbar} onClose={handleCloseSnackbar} />
          </Snackbar>
        )}
      </StyledBox>
    </Box>
  );
}
