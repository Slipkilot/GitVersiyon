import axios from "axios";

export const authLogin = async (email, password, callback) => {
  let message = null;
  let badResponse = null;
  try {
    const response = await axios.post(
      `https://localhost:7048/api/Account/Login`,
      {
        email,
        password,
      }
    );
    if (response.data) {
      localStorage.setItem("jwt", JSON.stringify(response.data));
      localStorage.setItem("auth", JSON.stringify("true"));
      message = "Giriş Başarılı";
    } else {
      badResponse = "Giriş yaparken hata oluştu";
    }
  } catch (error) {
    localStorage.setItem("auth", JSON.stringify(false));
    const errorResponse = error.response ? error.response.data : null;
    badResponse = errorResponse;
  }
  callback(message,badResponse);
};

export const logOut = () => {
  localStorage.setItem("auth", JSON.stringify(false));
  localStorage.removeItem("jwt");
};
