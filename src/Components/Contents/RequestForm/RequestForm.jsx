import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRetainer } from "../../../Services/apis/EmployeeOperations/RetainerOperations";
import ExistingRequests from "./ExistingRequests/ExistingRequests";
import { AdvanceForm } from "./Forms/AdvanceForm";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import DateRangeIcon from "@mui/icons-material/DateRange";
import MoneyIcon from "@mui/icons-material/Money";
import SaveIcon from "@mui/icons-material/Save";

const StyledCard = styled(Card)({
  borderRadius: "8px",
  padding: "20px",
  boxShadow: "0px 4px 18px rgba(0, 0, 0, 0.1)",
  backgroundColor: "background.main",
  transition: "all 0.5s ease-in-out",
});

const StyledButtonGroup = styled("div")({
  display: "flex",
  justifyContent: "left",
  marginBottom: "5px",
  color: "text.primary",
  padding: "10px",
});

const RequestForm = () => {
  const [requestType, setRequestType] = useState("AdvancePayment");
  const [dayOffType, setDayOffType] = useState("");
  const [beginningDate, setBeginningDate] = useState(null);
  const [endingDate, setEndingDate] = useState(null);
  const [selectedDays, setSelectedDays] = useState(0);
  const [description, setDescription] = useState("");
  const [expenseType, setExpenseType] = useState("Housing");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseCurrency, setExpenseCurrency] = useState("TL");
  const dispatch = useDispatch();
  const retainer = useSelector((select) => select.retainer);

  useEffect(() => {
    if (retainer.data.length === 0) dispatch(getRetainer());
  }, [dispatch, retainer.data.length]);

  const handleDayOffTypeChange = (_, value) => setDayOffType(value);
  const handleBeginningDateChange = (event) => setBeginningDate(event.target.value);
  const handleEndingDateChange = (event) => setEndingDate(event.target.value);

  const calculateSelectedDays = (start, end) => {
    if (start && end) setSelectedDays(Math.round((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)));
  };

  const handleExpenseTypeChange = (event) => setExpenseType(event.target.value);
  const handleExpenseAmountChange = (event) => setExpenseAmount(event.target.value);
  const handleExpenseCurrencyChange = (event) => setExpenseCurrency(event.target.value);
  const handleDescriptionChange = (event) => setDescription(event.target.value);

  const handleRequestTypeChange = (type) => setRequestType(type);

  const handleRequestSubmit = () => {
    // Additional logic for handling request submission
    console.log("Request submitted!");
  };

  return (
    <Box sx={{ padding: 3 }}>
      <StyledCard elevation={5}>
        <CardContent>
          <Typography variant="h5" sx={{ marginBottom: 1 }}>
            İstek Formu
          </Typography>

          <StyledButtonGroup>
            {[ "AdvancePayment", "dayOff", "expense"].map((type) => (
              <Button
                key={type}
                variant={requestType === type ? "contained" : "outlined"}
                onClick={() => handleRequestTypeChange(type)}
                sx={{ marginRight: 2 }} // Add margin-right for spacing
              >
                {type === "dayOff" ? "..." : type === "AdvancePayment" ? "Avans Talebi" : "..."}
              </Button>
            ))}
          </StyledButtonGroup>

          {requestType === "dayOff" && (
            <>
              <Autocomplete
                options={["Doğum İzni", "Ücretli İzin", "Ücretsiz İzin"]}
                renderInput={(params) => <TextField {...params} label="İzin Türü" fullWidth />}
                onChange={handleDayOffTypeChange}
                value={dayOffType}
                sx={{ marginBottom: 2 , color: "text.primary",}}
              />
              <Grid container spacing={1}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Başlangıç Tarihi"
                    type="date"
                    fullWidth
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><DateRangeIcon /></InputAdornment>,
                    }}
                    onChange={handleBeginningDateChange}
                    value={beginningDate}
                  />
                </Grid>
                <Grid item xs={12} sm={4} >
                  <TextField
                    label="Bitiş Tarihi"
                    type="date"
                    fullWidth
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><DateRangeIcon /></InputAdornment>,
                    }}
                    onChange={handleEndingDateChange}
                    value={endingDate}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Açıklama"
                    multiline
                    rows={4}
                    fullWidth
                    onChange={handleDescriptionChange}
                    value={description}
                    sx={{ marginBottom: 2 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Paper elevation={3} sx={{ padding: 2.5, borderRadius: 4 }}>
                    <Typography>
                      {selectedDays} {selectedDays === 1 ? "gün" : "gün"} seçildi
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleRequestSubmit}
                sx={{
                  backgroundColor: "background.main",
                  marginTop: "18px",
                  fontSize: "18px",
                  color: "text.primary",
                }}
              >
                Talebi Gönder
              </Button>
              <ExistingRequests key="dayOff" datas={[]} />
            </>
          )}

          {requestType === "AdvancePayment" && <AdvanceForm />}

          {requestType === "expense" && (
            <>
              <FormControl fullWidth variant="outlined" sx={{ marginBottom: 2 }}>
                <InputLabel htmlFor="expense-type">Gider Türü</InputLabel>
                <Select
                  id="expense-type"
                  label="Gider Türü"
                  value={expenseType}
                  onChange={handleExpenseTypeChange}
                >
                  {["Travel", "Housing", "FoodAndDrinks", "Materials", "Education", "Health", "Fuel"].map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Para Miktarı"
                type="number"
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start"><MoneyIcon /></InputAdornment>,
                }}
                onChange={handleExpenseAmountChange}
                value={expenseAmount}
                sx={{ marginBottom: 2 }}
              />
              <FormControl fullWidth variant="outlined" sx={{ marginBottom: 2 }}>
                <InputLabel htmlFor="expense-currency">Para Birimi</InputLabel>
                <Select
                  id="expense-currency"
                  label="Para Birimi"
                  value={expenseCurrency}
                  onChange={handleExpenseCurrencyChange}
                >
                  {["TL", "USD", "EUR"].map((currency) => (
                    <MenuItem key={currency} value={currency}>{currency}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Açıklama"
                multiline
                rows={4}
                fullWidth
                onChange={handleDescriptionChange}
                value={description}
                sx={{ marginBottom: 2 }}
              />
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleRequestSubmit}
                sx={{
                  backgroundColor: "background.main",
                  marginTop: "28px",
                  fontSize: "18px",
                  color: "text.primary",
                }}
              >
                Talebi Gönder
              </Button>
              <ExistingRequests key="expense" datas={[]} />
            </>
          )}
        </CardContent>
      </StyledCard>
    </Box>
  );
};

export default RequestForm;
