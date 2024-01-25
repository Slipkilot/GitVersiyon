import axios from "axios";
import { getFailure, getStart, getSuccess } from "../../Redux/features/commonGetFeature";
import { getProfileUpdateDetailFailure, getProfileUpdateDetailStart, getProfileUpdateDetailSuccess } from "../../Redux/features/profileUpdateDetailReducer";

export const updateProfile = async (infos, callback) =>{
  let message = null;
  let badResponse = null;
  try {
    const response = await axios.put(
      `https://localhost:7048/api/Employee/Update`,
      infos,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    message = response.data;
  } catch (error) {
    badResponse = error.message;
  }
  callback(message, badResponse);
};

export const getProfileUpdateDetails = () => async (dispatch) => {
  console.log("inside1")
  dispatch(getProfileUpdateDetailStart());
  try {
    const { data } = await axios.get(`https://localhost:7048/api/Employee/GetUpdateDetails`);
    dispatch(getProfileUpdateDetailSuccess(data));
    console.log("inside2")
  } catch (error) {
    dispatch(getProfileUpdateDetailFailure(error.message));
    console.log("inside3")
  }
};

export const profileDetails = () => async (dispatch) => {
  dispatch(getStart());
  try {
    const { data } = await axios.get(`https://localhost:7048/api/Employee/GetDetails`);
    dispatch(getSuccess(data));
  } catch (error) {
    dispatch(getFailure(error.message));
  }
};

export const profileSummary = () => async (dispatch) => {
  dispatch(getStart());
  try {
    const { data } = await axios.get(`https://localhost:7048/api/Employee/GetSummary`);
    dispatch(getSuccess(data));
  } catch (error) {
    dispatch(getFailure(error.message));
  }
};

export const passwordRenewal = async (passwords, callBack) =>{
  let message = null;
  let badResponse = null;
  try {
    const response = await axios.post(
      `https://localhost:7048/api/Employee/UpdatePassword`,
      passwords,
    );
    console.log(response.data)
    message = response.data;
  } catch (error) {
    badResponse = error.message;
  }

  callBack(message, badResponse);
}

