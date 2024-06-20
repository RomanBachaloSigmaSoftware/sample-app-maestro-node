const initialState = {
  isOpened: false,
  isLoading: false,
  errorMessage: null,
  templateName: null,
};

const popupReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case 'OPEN_POPUP':
      return { ...state, isOpened: true };

    case 'CLOSE_POPUP':
      return { ...state, isOpened: false };

    case 'LOADING_POPUP':
      return { ...state, isLoading: true };

    case 'LOADED_POPUP':
      return { ...state, isLoading: false };

    case 'SET_ERROR_POPUP':
      return {
        ...state,
        isOpened: true,
        errorMessage: payload.errorMessage,
        templateName: payload.templateName,
      };

    case 'CLEAR_ERROR_POPUP':
      return { ...state, errorMessage: null, templateName: null };

    case 'CLEAR_STATE':
      return { ...initialState };

    default:
      return state;
  }
};

export default popupReducer;