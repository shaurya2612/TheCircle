export const SET_ERROR_MESSAGE = 'SET_ERROR_MESSAGE';
export const CLEAR_ERROR_MESSAGE = 'CLEAR_ERROR_MESSAGE';

export const setErrorMessage = (error, showErrorHeading = true) => {
  return {
    type: SET_ERROR_MESSAGE,
    payload: {errorMessage: error.message, showErrorHeading},
  };
};

export const clearErrorMessage = () => {
  return {type: CLEAR_ERROR_MESSAGE};
};
