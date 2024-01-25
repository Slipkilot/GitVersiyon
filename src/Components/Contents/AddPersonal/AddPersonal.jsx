import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import DateRangeIcon from "@mui/icons-material/DateRange";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import PhoneIcon from "@mui/icons-material/Phone";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/system";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import SaveIcon from "@mui/icons-material/Save";
import { useDispatch, useSelector } from "react-redux";
import { location } from "../../../Services/apis/locationService";
import { addEmployee, getJobs } from "../../../Services/apis/employeeService";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ProfilePictureCard } from "./profilePictureCard/ProfilePictureCard";
import { warning } from "framer-motion";
import { Today } from "@mui/icons-material";
import { date } from "yup";
import { CircularProgress } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";


const StyledCard = styled(Paper)({
  padding: "24px",
  borderRadius: "16px",
  transition: "all 0.5s ease-in-out",
  height: "100%",
  width: "100%",
  maxWidth: "800px",
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",

  "&:hover": {
    boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
  },

  ".profile-picture-container": {
    marginTop: "12px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  ".profile-picture": {
    borderRadius: "50%",
    width: "100%",
    height: "auto",
    maxWidth: "200px",
  },

  ".avatar": {
    width: 100,
    height: 100,
    backgroundColor: "background.paper",
    transition: "all 0.5s ease-in-out",
  },

  ".profile-upload": {
    textAlign: "center",
    marginTop: "12px",
  },
});

const StyledTextField = styled(TextField)({
  marginBottom: "16px",
  width: "100%",
  transition: "all 0.5s ease-in-out",
  "& .MuiInputBase-root": {
    background: "transperent",
    borderRadius: "8px",
    fontSize: "1rem",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)", 
  },
  "& .MuiInputLabel-root": {
    fontSize: "1rem",
  },
  "& .MuiInputBase-root.Mui-focused": {
    background: "transperent", 
  },
  "& .MuiInput-underline:after": {
    fontSize: "2rem",
  },
});

const StyledButton = styled(Button)({
  borderRadius: "8px",
  marginTop: "4px",
  marginBottom: "16px",
  fontSize: "16px",
  background: "background.default",
  color: "text.primary",
  transition: "all 0.5s ease-in-out",

  "&:hover": {
    background: "background.paper",
  },

  width: "100%",
  maxWidth: "300px",
  margin: "0 auto",
  display: "block",
});

const AddPersonal = () => {
  const [generateEmail, setGenerateEmail] = useState(true);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [cities, setCities] = useState([]);
  const [counties, setCounties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const locations = useSelector((select) => select.locations);
  const jobs = useSelector((select) => select.jobs);

  const [personalData, setPersonalData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    secondLastName: "",
    birthDate: "",
    placeOfBirth: "",
    trIdentityNumber: "",
    city: "",
    county: "",
    address: "",
    phone: "",
    salary: "",
    startDate: "",
    Department: "",
    Profession: "",
    profilePicture: "",
  });

  const handleProfilePictureUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPersonalData((prevData) => ({
        ...prevData,
        profilePicture: file,
      }));
      setImageUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (locations.data.length === 0) dispatch(location());
    if (jobs.data.length === 0) dispatch(getJobs());
  }, []);

  useEffect(() => {
    if (jobs.data.length !== 0) {
      setPositions(jobs.data.professions);
      setDepartments(jobs.data.departments);
    }
  }, [jobs.data]);

  useEffect(() => {
    setCities(locations.data.map((item) => item.name));
  }, [locations.data]);

  useEffect(() => {
    if (personalData.city) {
      setPersonalData((prev) => ({ ...prev, county: "" }));
      setCounties(
        locations.data
          .filter((item) => item.name === personalData.city)[0]
          .districts.map((item) => item.name)
      );
      console.log("girdi");
    }
  }, [personalData.city, locations]);

  useEffect(() => {
    if (generateEmail) {
      // Generate email only if the checkbox is checked
      const generatedEmail = `${personalData.firstName.toLowerCase()}.${personalData.lastName.toLowerCase()}@bilgeadamboost.com`;
      setPersonalData((prevData) => ({ ...prevData, email: generatedEmail }));
    } else {
      // Clear the email if the checkbox is not checked
      setPersonalData((prevData) => ({ ...prevData, email: "" }));
    }
  }, [generateEmail, personalData.firstName, personalData.lastName]);

  const handleInputChange = (name) => (event) => {
    setPersonalData({ ...personalData, [name]: event.target.value });
  };

  const handleValidations = () => {
    const newErrors = {};

    for (const key in personalData) {
      if (personalData.hasOwnProperty(key) && personalData[key] === "") {
        if (key != "secondLastName") {
          if (key != "middleName") newErrors[key] = ` Bu alan boş bırakılamaz.`;
        }
      }
    }

    if (!newErrors.address) {
      if (personalData.address.length < 21) {
        newErrors.address = "Adres en az 20 karekter olmalıdır.";
      }
    }

    if (!newErrors.phone) {
      if (
        personalData.phone.slice(0, 2) !== "05" ||
        personalData.phone.length != 11
      ) {
        newErrors.phone =
          "Telefon numarası 05 ile başlamalı ve toplam 11 sayıdan oluşmalı.";
      }
    }

    if (!newErrors.startDate) {
      const startYear = parseInt(personalData.startDate.split("-")[0], 10);
      const startDate = new Date(personalData.startDate);
      const today = new Date();
      if (startYear < 2005 || startDate > today) {
        newErrors.startDate = `2005 yılı ile "${today.getDate()}/${
          today.getMonth() + 1
        }/${today.getFullYear()}" arasında bir değer seçiniz `;
      }
    }

    if (!newErrors.birthDate) {
      const bDate = new Date(personalData.birthDate);
      const today = new Date();
      today.setFullYear(today.getFullYear()-18)
      if (bDate > today) {
        newErrors.birthDate = "Personel 18 yaşından büyük olmalı.";
      }
    }

    if (!newErrors.salary) {
      if (personalData.salary < 17000) {
        newErrors.salary = "Maaş, asgari maaştan küçük olmaz.";
      }
    }

    if (!newErrors.trIdentityNumber) {
      if (personalData.trIdentityNumber.length !== 11) {
        newErrors.trIdentityNumber = " TC no 11 haneli olmalıdır.";
      }
    }

    return newErrors;
  };

  const handleSave = () => {
    const newErrors = handleValidations();
    setErrors(newErrors);
    console.log(newErrors);
    if (Object.keys(newErrors).length !== 0) {
      toast.warning(
        "Eksik veya hatalı bilgi girilmiştir. Lütfen kontrol ediniz."
      );
      return 0;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("firstName", personalData.firstName);
    formData.append("middleName", personalData.middleName);
    formData.append("lastName", personalData.lastName);
    formData.append("secondLastName", personalData.secondLastName);
    formData.append("birthDate", personalData.birthDate);
    formData.append("placeOfBirth", personalData.placeOfBirth);
    formData.append("trIdentityNumber", personalData.trIdentityNumber);
    formData.append("city", personalData.city);
    formData.append("county", personalData.county);
    formData.append("address", personalData.address);
    formData.append("phone", personalData.phone);
    formData.append("salary", personalData.salary);
    formData.append("startDate", personalData.startDate);
    formData.append("Department", personalData.Department);
    formData.append("Profession", personalData.Profession);
    formData.append("profilePicture", personalData.profilePicture);

    addEmployee(formData, (message, error) => {
      setLoading(false);
      if (message) {
        toast.success(message);
      } else if (error) {
        toast.error("Lütfen tüm alanları eksiksiz doldurunuz " + error);
      } else {
        toast.warning("Bir hata alındı. Lütfen tekrar deneyiniz");
      }
    });
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        <Step key="ProfilePicture">
          <StepLabel>Profil Resmi Ekle</StepLabel>
        </Step>
        <Step key="ContactInfo">
          <StepLabel>İletişim Bilgilerini Ekle</StepLabel>
        </Step>
        <Step key="PersonalInfo">
          <StepLabel>Kişisel Bilgileri Ekle</StepLabel>
        </Step>
        <Step key="JobInfo">
          <StepLabel>İş Bilgilerini Ekle</StepLabel>
        </Step>
        <Step key="BirthInfo">
          <StepLabel>Doğum Bilgilerini Ekle</StepLabel>
        </Step>
      </Stepper>
      <Grid container spacing={5} justifyContent="center">
        {activeStep === 0 && (
          <Grid item xs={12} mt={5} marginBottom={"10px"}>
            <ProfilePictureCard
              pictureURL={imageUrl}
              handleProfilePictureUpload={handleProfilePictureUpload}
            />
          </Grid>
        )}

        <Grid
          item
          xs={12}
          md={8}
          style={{ marginBottom: "12px", marginTop: "0px" }}
        >
          {activeStep === 0 && <Grid container spacing={2}></Grid>}

          {activeStep === 1 && (
            <Grid
              container
              spacing={1}
              style={{ marginTop: "30px", marginBottom: "20px" }}
            >
              <StyledCard
                elevation={5}
                style={{
                  borderRadius: "8px",
                  background: "card.backgroundSecondary",
                  minHeight: "400px",
                }}
              >
                <Typography variant="h4" sx={{ marginTop: 3, marginBottom: 3 }}>
                  Kişisel Bilgiler
                </Typography>
                <StyledTextField
                  label="Ad"
                  fullWidth
                  value={personalData.firstName}
                  onChange={handleInputChange("firstName")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PermIdentityIcon />
                      </InputAdornment>
                    ),
                  }}
                  error={errors.firstName}
                  helperText={errors.firstName}
                />
                <StyledTextField
                  label="İkinci Ad"
                  fullWidth
                  value={personalData.middleName}
                  onChange={handleInputChange("middleName")}
                />
                <StyledTextField
                  label="Soyad"
                  fullWidth
                  value={personalData.lastName}
                  onChange={handleInputChange("lastName")}
                  error={errors.lastName}
                  helperText={errors.lastName}
                />
                <StyledTextField
                  label="İkinci Soyad"
                  fullWidth
                  value={personalData.secondLastName}
                  onChange={handleInputChange("secondLastName")}
                />
                
                <StyledTextField
              label="Email"
              fullWidth
              value={personalData.email}
              onChange={handleInputChange("email")}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AlternateEmailIcon />
                  </InputAdornment>
                ),
              }}
              disabled={generateEmail}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={generateEmail}
                  onChange={() => setGenerateEmail(!generateEmail)}
                />
              }
              label="Email'i otomatik oluştur"
            />
              </StyledCard>
              
            </Grid>
          )}

          {activeStep === 2 && (
            <Grid
              container
              spacing={1}
              style={{ marginTop: "30px", marginBottom: "20px" }}
            >
              <StyledCard
                elevation={5}
                style={{
                  borderRadius: "8px",
                  background: "card.backgroundSecondary",
                  minHeight: "400px",
                }}
              >
                <Typography variant="h4" sx={{ marginTop: 3, marginBottom: 3 }}>
                  İletişim Bilgileri
                </Typography>
                <FormControl
                  fullWidth
                  variant="outlined"
                  sx={{ marginBottom: "15px" }}
                >
                  <InputLabel htmlFor="city">Şehir</InputLabel>
                  <Select
                    id="city"
                    label="Şehir"
                    name="city"
                    value={personalData.city}
                    sx={{ borderRadius: "8px" }}
                    onChange={handleInputChange("city")}
                    error={errors.city}
                  >
                    {cities.map((city) => (
                      <MenuItem key={city} value={city}>
                        {city}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl
                  fullWidth
                  variant="outlined"
                  sx={{ marginBottom: "15px" }}
                  disabled={!personalData.city}
                >
                  <InputLabel htmlFor="county">İlçe</InputLabel>
                  <Select
                    id="county"
                    label="İlçe"
                    name="county"
                    value={personalData.county}
                    sx={{ borderRadius: "8px" }}
                    onChange={handleInputChange("county")}
                    error={errors.county}
                  >
                    {counties.map((county) => (
                      <MenuItem key={county} value={county}>
                        {county}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <StyledTextField
                  label="Adres"
                  fullWidth
                  value={personalData.address}
                  onChange={handleInputChange("address")}
                  error={errors.address}
                  helperText={errors.address}
                />
                <StyledTextField
                  label="Telefon"
                  fullWidth
                  value={personalData.phone}
                  onChange={handleInputChange("phone")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon />
                      </InputAdornment>
                    ),
                  }}
                  error={errors.phone}
                  helperText={errors.phone}
                />
              </StyledCard>
            </Grid>
          )}

          {activeStep === 3 && (
            <Grid
              container
              spacing={1}
              style={{ marginTop: "30px", marginBottom: "20px" }}
            >
              <StyledCard
                elevation={5}
                style={{
                  borderRadius: "8px",
                  background: "card.backgroundSecondary",
                  minHeight: "400px",
                }}
              >
                <Typography variant="h4" sx={{ marginTop: 3, marginBottom: 3 }}>
                  İş Bilgileri
                </Typography>
                <FormControl
                  fullWidth
                  variant="outlined"
                  sx={{ marginBottom: "15px" }}
                >
                  <InputLabel htmlFor="county">Departman</InputLabel>
                  <Select
                    id="Department"
                    label="Departman"
                    name="Department"
                    value={personalData.Department}
                    sx={{ borderRadius: "8px" }}
                    onChange={handleInputChange("Department")}
                    error={errors.Departments}
                  >
                    {departments.map((Department) => (
                      <MenuItem key={Department} value={Department}>
                        {Department}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl
                  fullWidth
                  variant="outlined"
                  sx={{ marginBottom: "15px" }}
                >
                  <InputLabel htmlFor="county">Pozisyon</InputLabel>
                  <Select
                    id="Profession"
                    label="Pozisyon"
                    name="Profession"
                    value={personalData.Profession}
                    sx={{ borderRadius: "8px" }}
                    onChange={handleInputChange("Profession")}
                    error={errors.Profession}
                  >
                    {positions.map((Profession) => (
                      <MenuItem key={Profession} value={Profession}>
                        {Profession}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <StyledTextField
                  label="Başlangıç Tarihi"
                  fullWidth
                  type="date"
                  value={personalData.startDate}
                  disableFuture
                  onChange={handleInputChange("startDate")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DateRangeIcon />
                      </InputAdornment>
                    ),
                  }}
                  error={errors.startDate}
                  helperText={errors.startDate}
                />
                <StyledTextField
                  label="Maaş"
                  fullWidth
                  value={personalData.salary}
                  onChange={handleInputChange("salary")}
                  error={errors.salary}
                  helperText={errors.salary}
                />
              </StyledCard>
            </Grid>
          )}
          {activeStep === 4 && (
            <Grid
              container
              spacing={1}
              style={{ marginTop: "30px", marginBottom: "20px" }}
            >
              <StyledCard
                elevation={5}
                style={{
                  borderRadius: "8px",
                  background: "card.backgroundSecondary",
                  minHeight: "400px",
                }}
              >
                <Typography variant="h4" sx={{ marginTop: 3, marginBottom: 3 }}>
                  Doğum Bilgileri
                </Typography>
                <StyledTextField
                  label="Doğum Tarihi"
                  fullWidth
                  type="date"
                  value={personalData.birthDate}
                  onChange={handleInputChange("birthDate")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DateRangeIcon />
                      </InputAdornment>
                    ),
                  }}
                  error={errors.birthDate}
                  helperText={errors.birthDate}
                />
                <StyledTextField
                  label="Doğum Yeri"
                  fullWidth
                  value={personalData.placeOfBirth}
                  onChange={handleInputChange("placeOfBirth")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOnIcon />
                      </InputAdornment>
                    ),
                  }}
                  error={errors.placeOfBirth}
                  helperText={errors.placeOfBirth}
                />
                <StyledTextField
                  label="TC Kimlik No"
                  fullWidth
                  value={personalData.trIdentityNumber}
                  onChange={handleInputChange("trIdentityNumber")}
                  error={errors.trIdentityNumber}
                  helperText={errors.trIdentityNumber}
                />
              </StyledCard>
            </Grid>
          )}
          <StyledButton
        variant="contained"
        onClick={activeStep === 4 ? handleSave : handleNext}
        startIcon={loading ? <CircularProgress size={20} /> : activeStep === 4 ? <SaveIcon /> : null}
        disabled={loading} // Disable the button when loading
      >
        {loading ? "Kaydediliyor..." : activeStep === 4 ? "Kaydet" : "İleri"}
      </StyledButton>
          {activeStep !== 0 && (
            <StyledButton
              onClick={handleBack}
              variant="outlined"
              sx={{ marginTop: "8px", fontSize: "1rem", color: "text.primary" }}
            >
              Geri
            </StyledButton>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddPersonal;
