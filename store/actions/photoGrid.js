export const SET_DATA = "SET_DATA";

export const setData = (data) => {
  return {
    type: SET_DATA,
    payload: data,
  };
};
