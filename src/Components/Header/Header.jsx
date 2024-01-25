import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { decode } from "../../Services/jwtDecoder.jsx";
import PersonIcon from "@mui/icons-material/Person";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import { useSelector } from "react-redux";
import Groups3Icon from "@mui/icons-material/Groups3";

export const Header = () => {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [userData, setUserData] = useState("");
  const [FirstNameData, setFirstNameData] = useState("");
  const [LastNameData, setLastNameData] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const profileUpdateDetail = useSelector((state) => state.profileUpdateDetail);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  useEffect(() => {
    if (profileUpdateDetail.data.length !== 0)
      setUserData(profileUpdateDetail.data.filePath);
  }, [profileUpdateDetail.data]);

  useEffect(() => {
    setUserData(decode().filePath);
    setFirstNameData(decode().firstName);
    setLastNameData(decode().lastName);
    setIsAdmin(decode().currentRole === "Admin");
    setIsOwner(decode().currentRole === "SiteAdmin");
  }, []);

  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Container maxWidth="xxl">
        <Toolbar disableGutters>
          <img
            src="https://i.ibb.co/G9mmRQd/1a08f6f0-c084-4b5c-b05f-94b2dfe404be-removebg-preview-copy.png"
            alt="Logo"
            style={{ width: "60px", height: "60px" }}
          />
          <Typography
            variant="h2"
            noWrap
            component={Link}
            to="/"
            sx={{
              marginLeft: 2,
              flexGrow: 1,
              fontSize: "1.5rem",
              display: { md: "flex" },
              fontFamily: "Century Gothic, Roboto",
              color: "#d2f5e3",
              textDecoration: "none",
              letterSpacing: "1px",
            }}
          >
            TeamPulse
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontSize: "1.2vw",
              marginRight: "35vw",
              marginTop: "3px",
              fontFamily: "Century Gothic, Roboto",
              color: "#d2f5e3",
            }}
          >
            {decode().companyName}
          </Typography>
          <Box
            sx={{
              flexGrow: 0,
              right: 0,
              position: "absolute",
              display: "flex",
              alignItems: "center",
            }}
          >
            {isAdmin && (
              <Tooltip title="Admin olarak giriş yaptınız" arrow>
                <SupervisorAccountIcon
                  sx={{
                    color: "#eaecf7",
                    "&:hover": {
                      color: "#ff0000",
                      transform: "scale(1.3)",
                      transition:
                        "color 0.6s ease-out, transform 0.3s ease-out",
                    },
                  }}
                />
              </Tooltip>
            )}

            {isOwner && (
              <Tooltip title="Site yöneticisi olarak giriş yaptınız" arrow>
                <Groups3Icon
                  sx={{
                    color: "#eaecf7",
                    "&:hover": {
                      color: "#ff0000",
                      transform: "scale(1.3)",
                      transition:
                        "color 0.6s ease-out, transform 0.3s ease-out",
                    },
                  }}
                />
              </Tooltip>
            )}

            {!isOwner && !isAdmin && (
              <Tooltip title="Kullanıcı olarak giriş yaptınız" arrow>
                <SupervisorAccountIcon
                  sx={{
                    color: "#eaecf7",
                    "&:hover": {
                      color: "#ff0000",
                      transform: "scale(1.3)",
                      transition:
                        "color 0.6s ease-out, transform 0.3s ease-out",
                    },
                  }}
                />
              </Tooltip>
            )}

            <Tooltip>
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: "2px" }}>
                <Typography
                  variant="h5"
                  sx={{
                    p: 0,
                    mr: "3px",
                    fontSize: "1.1rem",
                    color: "#d2f5e3",
                    fontFamily: "Century Gothic, Roboto",
                  }}
                >
                  {FirstNameData}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    p: 0,
                    fontSize: "1.1rem",
                    color: "#d2f5e3",
                    fontFamily: "Century Gothic, Roboto",
                  }}
                >
                  {LastNameData}
                </Typography>
                <Avatar
                  alt="Profile Picture"
                  src={userData}
                  sx={{ ml: "6px", mr: "5px" }}
                />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "40px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem
                key="Profile"
                onClick={handleCloseUserMenu}
                component={Link}
                to="/Profile"
              >
                <Typography textAlign="center">Profil</Typography>
              </MenuItem>
              <MenuItem
                key="logout"
                onClick={handleCloseUserMenu}
                component={Link}
                to="/login"
              >
                <Typography textAlign="center">Çıkış</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
