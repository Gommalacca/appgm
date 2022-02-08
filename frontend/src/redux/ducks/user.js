const SET_FIRSTNAME = "setfirstname";
const REMOVE_FIRSTNAME = "removefirstname";
const SET_COMPANY = "setCompany";

export const setFirstname = (username) => ({
  type: SET_FIRSTNAME,
  payload: username,
});

export const removeFirstname = () => ({
  type: REMOVE_FIRSTNAME,
});
export const setCompany = (company) => ({
  type: SET_COMPANY,
  payload: company,
});

const initialState = {
  firstname: "",
  company: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_FIRSTNAME:
      return { ...state, firstname: action.payload };
    case SET_COMPANY:
      return { ...state, company: action.payload };
    case REMOVE_FIRSTNAME:
      localStorage.removeItem("nicktoken");
      return { ...state, fistname: "" };
    default:
      return state;
  }
};
