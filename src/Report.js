import * as React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Box from "@mui/material/Box";
import moment from "moment";
import Grid from "@mui/material/Grid";
import { alpha, styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import Pagination from "@mui/material/Pagination";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { grey, blue } from "@mui/material/colors";
import {
  useGridApiRef,
  DataGridPro,
  GridToolbarContainer,
  GridLinkOperator,
  GridToolbarQuickFilter,
  GridToolbarFilterButton,
  GRID_CHECKBOX_SELECTION_COL_DEF,
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
  gridClasses
} from "@mui/x-data-grid-pro";
import { randomUpdatedDate, randomId } from "@mui/x-data-grid-generator";

const url = "http://localhost:5000/";
const axiosInterval = 60000;
const dateTimeFormat = "DD-MMM-YYYY HH:mm:ss";
const timeZone = "+0700";
const pageSize = 10;

const StyledGridOverlay = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  "& .ant-empty-img-1": {
    fill: theme.palette.mode === "light" ? "#aeb8c2" : "#262626"
  },
  "& .ant-empty-img-2": {
    fill: theme.palette.mode === "light" ? "#f5f5f7" : "#595959"
  },
  "& .ant-empty-img-3": {
    fill: theme.palette.mode === "light" ? "#dce0e6" : "#434343"
  },
  "& .ant-empty-img-4": {
    fill: theme.palette.mode === "light" ? "#fff" : "#1c1c1c"
  },
  "& .ant-empty-img-5": {
    fillOpacity: theme.palette.mode === "light" ? "0.8" : "0.08",
    fill: theme.palette.mode === "light" ? "#f5f5f5" : "#fff"
  }
}));

function CustomNoRowsOverlay() {
  return (
    <StyledGridOverlay>
      <svg
        width="120"
        height="100"
        viewBox="0 0 184 152"
        aria-hidden
        focusable="false"
      >
        <g fill="none" fillRule="evenodd">
          <g transform="translate(24 31.67)">
            <ellipse
              className="ant-empty-img-5"
              cx="67.797"
              cy="106.89"
              rx="67.797"
              ry="12.668"
            />
            <path
              className="ant-empty-img-1"
              d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
            />
            <path
              className="ant-empty-img-2"
              d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
            />
            <path
              className="ant-empty-img-3"
              d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
            />
          </g>
          <path
            className="ant-empty-img-3"
            d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
          />
          <g className="ant-empty-img-4" transform="translate(149.65 15.383)">
            <ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815" />
            <path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z" />
          </g>
        </g>
      </svg>
      <Box sx={{ mt: 1 }}>No Rows</Box>
    </StyledGridOverlay>
  );
}

function CustomPagination() {
  const apiRef = useGridApiContext();
  const page = useGridSelector(apiRef, gridPageSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <Pagination
      color="primary"
      variant="outlined"
      count={pageCount}
      page={page + 1}
      onChange={(event, value) => apiRef.current.setPage(value - 1)}
    />
  );
}

const initialState = {
  filter: {
    filterModel: {
      items: [
        {
          id: 1,
          columnField: "name",
          operatorValue: "contains",
          value: ""
        }
      ]
    }
  }
};

function customCheckbox() {
  return {
    "& .MuiCheckbox-root svg": {
      width: 12,
      height: 12,
      backgroundColor: "transparent",
      border: `1px solid rgb(67, 67, 67)`,
      borderRadius: 2
    },
    "& .MuiCheckbox-root svg path": {
      display: "none"
    },
    "& .MuiCheckbox-root.Mui-checked:not(.MuiCheckbox-indeterminate) svg": {
      backgroundColor: "#1890ff",
      borderColor: "#1890ff"
    },
    "& .MuiCheckbox-root.Mui-checked .MuiIconButton-label:after": {
      position: "absolute",
      display: "table",
      border: "2px solid #fff",
      borderTop: 0,
      borderLeft: 0,
      transform: "rotate(45deg) translate(-50%,-50%)",
      opacity: 1,
      transition: "all .2s cubic-bezier(.12,.4,.29,1.46) .1s",
      content: '""',
      top: "50%",
      left: "39%",
      width: 5.71428571,
      height: 9.14285714
    },
    "& .MuiCheckbox-root.MuiCheckbox-indeterminate .MuiIconButton-label:after": {
      width: 8,
      height: 8,
      backgroundColor: "#1890ff",
      transform: "none",
      top: "39%",
      border: 0
    }
  };
}

var rows = [
  {
    id: randomId(),
    fileName: "File Output1.xlsx",
    lastUpdate: randomUpdatedDate()
  },
  {
    id: randomId(),
    fileName: "File Output2.xlsx",
    lastUpdate: randomUpdatedDate()
  },
  {
    id: randomId(),
    fileName: "File Output3.xlsx",
    lastUpdate: randomUpdatedDate()
  },
  {
    id: randomId(),
    fileName: "File Output4.xlsx",
    lastUpdate: randomUpdatedDate()
  }
];

function EditToolbar(props) {
  return (
    <>
      <Grid container spacing={0}>
        <Grid
          item
          xs={7}
          md={7}
          justifyContent="flex-end"
          alignItems="flex-end"
        >
          <IconButton color="primary">
            <Typography>List Report</Typography>
          </IconButton>
        </Grid>
        <Grid item xs={5} md={5}>
          <Box display="flex" justifyContent="flex-end">
            <GridToolbarContainer>
              <GridToolbarFilterButton />
              &nbsp;&nbsp;
              <GridToolbarQuickFilter />
            </GridToolbarContainer>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

EditToolbar.propTypes = {
  apiRef: PropTypes.shape({
    current: PropTypes.object.isRequired
  }).isRequired
};

export default function FullFeaturedCrudGrid() {
  const apiRef = useGridApiRef();
  function getLastUpdate(params) {
    return moment(params.value).utcOffset(timeZone).format(dateTimeFormat);
  }

  const columns = [
    {
      field: "fileName",
      headerName: "File Name",
      headerAlign: "center",
      width: 350,
      resizable: true,
      headerClassName: "required--header",
      renderCell: (params) => <Link href="">{params.row.fileName}</Link>,
      editable: false
    },
    {
      field: "lastUpdate",
      headerName: "Uploaded Time",
      type: "dateTime",
      headerAlign: "center",
      resizable: false,
      valueGetter: getLastUpdate,
      width: 180
    }
  ];

  const ODD_OPACITY = 0.2;

  return (
    <Box
      sx={{
        height: 400,
        //        width: "100%",
        "& .actions": {
          color: "text.secondary"
        },
        "& .textPrimary": {
          color: "text.primary"
        }
      }}
    >
      <DataGridPro
        sx={{
          border: 0,
          fontFamily: [
            "-apple-system",
            "BlinkMacSystemFont",
            '"Segoe UI"',
            "Roboto",
            '"Helvetica Neue"',
            "Arial",
            "sans-serif",
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"'
          ].join(","),
          "& .required--header": {
            color: blue[500]
          },
          WebkitFontSmoothing: "auto",
          letterSpacing: "normal",
          [`& .${gridClasses.row}.even`]: {
            backgroundColor: grey[200],
            "&:hover, &.Mui-hovered": {
              backgroundColor: alpha("#1976d2", ODD_OPACITY),
              "@media (hover: none)": {
                backgroundColor: "transparent"
              }
            },
            "&.Mui-selected": {
              backgroundColor: alpha("#1976d2", ODD_OPACITY + 0.08),
              "&:hover, &.Mui-hovered": {
                backgroundColor: alpha("#1976d2", ODD_OPACITY + 0.08 + 0.04),
                // Reset on touch devices, it doesn't add specificity
                "@media (hover: none)": {
                  backgroundColor: alpha("#1976d2", ODD_OPACITY + 0.08)
                }
              }
            }
          },
          /*"& .MuiDataGrid-columnsContainer": {
            backgroundColor: "#fafafa"
          },
          "& .MuiDataGrid-columnHeader, .MuiDataGrid-cell": {
            borderRight: `1px solid ${"#f0f0f0"}`
          },
          "& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell": {
            borderBottom: `1px solid ${"#f0f0f0"}`
          },
          "& .MuiDataGrid-cell": {
            color: "rgba(0,0,0,0.85)"
          },*/
          "& .MuiPaginationItem-root": {
            borderRadius: 20
          },
          ...customCheckbox()
        }}
        density="compact"
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
        }
        columns={columns}
        apiRef={apiRef}
        pagination
        pageSize={pageSize}
        rows={rows}
        components={{
          Toolbar: EditToolbar,
          Pagination: CustomPagination,
          LoadingOverlay: LinearProgress,
          NoRowsOverlay: CustomNoRowsOverlay
        }}
        componentsProps={{
          toolbar: {
            apiRef
          },
          filterPanel: {
            // Force usage of "And" operator
            linkOperators: [GridLinkOperator.And],
            // Display columns by ascending alphabetical order
            columnsSort: "asc",
            filterFormProps: {
              // Customize inputs by passing props
              linkOperatorInputProps: {
                variant: "outlined",
                size: "small"
              },
              columnInputProps: {
                variant: "outlined",
                size: "small",
                sx: { mt: "auto" }
              },
              operatorInputProps: {
                variant: "outlined",
                size: "small",
                sx: { mt: "auto" }
              },
              deleteIconProps: {
                sx: {
                  "& .MuiSvgIcon-root": { color: "#d32f2f" }
                }
              }
            },
            sx: {
              // Customize inputs using css selectors
              "& .MuiDataGrid-filterForm": { p: 2 },
              "& .MuiDataGrid-filterForm:nth-child(even)": {
                backgroundColor: (theme) =>
                  theme.palette.mode === "dark" ? "#444" : "#f5f5f5"
              },
              "& .MuiDataGrid-filterFormLinkOperatorInput": { mr: 2 },
              "& .MuiDataGrid-filterFormColumnInput": { mr: 2, width: 150 },
              "& .MuiDataGrid-filterFormOperatorInput": { mr: 2 },
              "& .MuiDataGrid-filterFormValueInput": { width: 200 }
            }
          }
        }}
        initialState={
          (initialState,
          {
            pinnedColumns: {
              left: [GRID_CHECKBOX_SELECTION_COL_DEF.field],
              right: ["actions"]
            }
          })
        }
      />
      <Typography variant="caption"></Typography>
    </Box>
  );
}
