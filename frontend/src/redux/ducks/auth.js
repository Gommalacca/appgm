const LOGIN = "login";
const LOGOUT = "logout";

export const loginUser = () => ({
  type: LOGIN,
});
export const logoutUser = () => ({
  type: LOGOUT,
});

const initialState = {
  auth: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return { ...state, auth: true };
    case LOGOUT:
      localStorage.removeItem("nicktoken");
      localStorage.removeItem("companyName");
      localStorage.removeItem("owner");
      localStorage.removeItem("moderator");
      localStorage.removeItem("nicktoken");
      localStorage.removeItem("firstname");
      localStorage.removeItem("lastname");
      localStorage.removeItem("userID");
      localStorage.removeItem("userTag");
      localStorage.removeItem("role");
      return { ...state, auth: false };
    default:
      return state;
  }
};
