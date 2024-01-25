import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Avatar,
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { passwordRenewal } from "../../../Services/apis/profileService";
import { toast } from "react-toastify";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const PasswordChange = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isNewPasswordEntered, setIsNewPasswordEntered] = useState(false);
  const navigate = useNavigate();

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });

    if (name === "newPassword") {
      setIsNewPasswordEntered(true);
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    strength += /[a-z]/.test(password) ? 10 : 0;
    strength += /[A-Z]/.test(password) ? 10 : 0;
    strength += /\d/.test(password) ? 10 : 0;
    strength += /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password) ? 10 : 0;
    strength += Math.max(password.length * 10 - 40, 10);
    return Math.min(strength, 100);
  };

  const handleShowPassword = () => setShowPassword(!showPassword);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (calculatePasswordStrength(passwords.oldPassword) !== 100) {
      toast.error("Eski şifrenizi kontrol ediniz");
      return;
    }

    passwordRenewal(passwords, (message, error) => {
      if (message) {
        toast.success(message);
        navigate("/profile");
      } else if (error) {
        toast.error("Mevcut şifrenizi kontrol ediniz.");
      } else {
        toast.warning("Bir hata alındı. Lütfen tekrar deneyiniz.");
      }
    });
  };

  const isPasswordMatch = passwords.newPassword === passwords.confirmPassword;
  const isPasswordValid = passwordStrength >= 100 && isNewPasswordEntered;

  return (
    <Box m={2}>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Paper
              elevation={5}
              sx={{
                p: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                borderRadius: 12,
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                <Typography variant="h5" gutterBottom>
                  Şifre Değiştirme
                </Typography>
                {["oldPassword", "newPassword", "confirmPassword"].map(
                  (name) => (
                    <TextField
                      key={name}
                      label={
                        name === "oldPassword"
                          ? "Mevcut Şifre"
                          : name === "newPassword"
                          ? "Yeni Şifre"
                          : "Yeni Şifre Tekrar"
                      }
                      type={
                        name === "newPassword" || name === "confirmPassword"
                          ? showPassword
                            ? "text"
                            : "password"
                          : "password"
                      }
                      name={name}
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      onChange={handleChange}
                      value={passwords[name]}
                      required={name !== "confirmPassword"}
                      error={name === "confirmPassword" && !isPasswordMatch}
                      helperText={
                        name === "newPassword" && !isPasswordValid
                          ? "Şifreniz en az 10 karakterli olmalı ve en az 1 küçük harf, büyük harf, sembol ve sayı içermelidir."
                          : null
                      }
                      InputProps={
                        name === "newPassword" ||
                        (name === "confirmPassword" && {
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={handleShowPassword}>
                                {showPassword ? (
                                  <VisibilityOffIcon />
                                ) : (
                                  <VisibilityIcon />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        })
                      }
                    />
                  )
                )}
                <LinearProgress
                  variant="determinate"
                  value={isNewPasswordEntered ? passwordStrength : 0}
                  sx={{ mt: 2, height: 8, borderRadius: 4 }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={!isPasswordMatch || !isPasswordValid}
                  sx={{ borderRadius: 8, mt: 2 }}
                >
                  Şifreyi Değiştir
                </Button>
              </form>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PasswordChange;
