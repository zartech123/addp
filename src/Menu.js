import * as React from "react";
import Grid from "@mui/material/Grid2";
import Chip from "@mui/material/Chip";
import ListItemButton from "@mui/material/ListItemButton";
import LoginIcon from "@mui/icons-material/Login";
import Upload from "./Upload";
import AppsIcon from "@mui/icons-material/Apps";
import LogoutIcon from "@mui/icons-material/Logout";
import Report from "./Report";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Message from "./Message";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import List from "@mui/material/List";
import TextField from "@mui/material/TextField";
import ListItem from "@mui/material/ListItem";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import CssBaseline from "@mui/material/CssBaseline";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import RuleIcon from "@mui/icons-material/Rule";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";

const setCookie = (name, value, days) => {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + days);

  document.cookie = `${name}=${value}; expires=${expirationDate.toUTCString()}; path=/`;
};

const getCookie = (name) => {
  const cookies = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));

  return cookies ? cookies.split("=")[1] : null;
};

const deleteCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
};

const drawerWidth = 200;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(7)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      },
    },
  ],
}));

export default function MenuListComposition() {
  const [page, setPage] = React.useState();
  const [username, setUsername] = React.useState(null);
  const [password, setPassword] = React.useState(null);
  const [logged, setLogged] = React.useState(false);
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleClose = () => {
    //    setAtlet(null);
  };
  const handleLogout = () => {
    deleteCookie("user");
    setLogged(false);
    window.location.reload(false);
  };

  const handleLogin = () => {
    if (username === "admin" && password === "admin") {
      setCookie("user", username, 1);
      setLogged(true);
    } else {
    }
  };
  const goTo = (x) => {
    setPage(x);
    handleClose();
    handleCloseNavMenu();
  };

  const [state, setState] = React.useState({
    left: false,
  });

  const list = (anchor) => (
    <List>
      <ListItem
        disablePadding
        sx={{ display: "block" }}
        disableGutters
        dense
        key="application"
        onClick={() => goTo(1)}
      >
        <ListItemButton>
          <ListItemIcon>
            <AppsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Application" />
        </ListItemButton>
      </ListItem>
      <ListItem
        disablePadding
        sx={{ display: "block" }}
        disableGutters
        dense
        key="trigger"
        onClick={() => goTo(2)}
      >
        <ListItemButton>
          <ListItemIcon>
            <TrackChangesIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Trigger Rule" />
        </ListItemButton>
      </ListItem>
      <ListItem
        disablePadding
        sx={{ display: "block" }}
        disableGutters
        dense
        key="tac_trigger"
        onClick={() => goTo(4)}
      >
        <ListItemButton>
          <ListItemIcon>
            <RuleIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="TAC Trigger Rule" />
        </ListItemButton>
      </ListItem>
      <ListItem
        disablePadding
        sx={{ display: "block" }}
        disableGutters
        dense
        key="mm6"
        onClick={() => goTo(3)}
      >
        <ListItemButton>
          <ListItemIcon>
            <SettingsSuggestIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="MM6" />
        </ListItemButton>
      </ListItem>
    </List>
  );

  return (
    <>
      {(logged === true || getCookie("user") !== null) && (
        <Box>
          <AppBar position="fixed" open={open}>
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={[
                  {
                    marginRight: 5,
                  },
                  open && { display: "none" },
                ]}
              >
                <MenuIcon />
              </IconButton>
              <Typography component="div" sx={{ flexGrow: 1 }}></Typography>
              <Box>
                <Typography>
                  Sign In as {getCookie("user")}&nbsp;
                  <IconButton onClick={handleLogout}>
                    <LogoutIcon size="small" />
                  </IconButton>
                </Typography>
              </Box>
            </Toolbar>
          </AppBar>
          <Drawer variant="permanent" open={open}>
            <DrawerHeader>
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === "rtl" ? (
                  <ChevronRightIcon />
                ) : (
                  <ChevronLeftIcon />
                )}
              </IconButton>
            </DrawerHeader>
            <Divider />
            {list("left")}
          </Drawer>
          <Box component="main" sx={{ flexGrow: 1, marginLeft: 7 }}>
            <DrawerHeader />
            {(logged === true || getCookie("user") !== null) && page === 1 && (
              <>
                <Typography>
                  <Chip
                    size="small"
                    icon={<AppsIcon />}
                    color="success"
                    label="List of Application"
                  />
                </Typography>
                <Typography>&nbsp;</Typography>
                <Upload />
              </>
            )}
            {(logged === true || getCookie("user") !== null) && page === 2 && (
              <Message />
            )}
            {(logged === true || getCookie("user") !== null) && page === 3 && (
              <Report />
            )}
          </Box>
        </Box>
      )}
      {logged === false && getCookie("user") === null && (
        <Grid sx={{ flexGrow: 1 }} container spacing={0}>
          <Grid item xs={9}>
            <Grid
              container
              justifyContent="flex-end"
              alignItems="center"
              direction="row"
              spacing={0}
            >
              <Grid item>
                <img style={{ width: "100%" }} src="/ADD.jpeg" />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={3}>
            <Grid container justifyContent="center" spacing={0}>
              <Grid item>
                <Typography
                  align="center"
                  variant="h4"
                  style={{ color: "blue" }}
                >
                  <br />
                  <b>ADD</b>
                  <br />
                </Typography>
                <Typography
                  align="center"
                  variant="h6"
                  style={{ color: "blue" }}
                >
                  (Automatic Device Detection)
                  <br />
                  <br />
                  <TextField
                    onChange={(event) => {
                      setUsername(event.target.value);
                    }}
                    required
                    label="Username"
                    size="small"
                  />
                  <br />
                  <TextField
                    required
                    type="password"
                    label="Password"
                    size="small"
                    onChange={(event) => {
                      setPassword(event.target.value);
                    }}
                  />
                  <br />
                  <br />
                  <Button
                    onClick={handleLogin}
                    startIcon={<LoginIcon />}
                    variant="outlined"
                    size="small"
                  >
                    Login
                  </Button>
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
    </>
  );
}
