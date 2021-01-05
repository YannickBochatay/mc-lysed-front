import * as actions from "./actions";

const updateOneValue = (value, index, state) => {
  const newValues = [...state.values];
  newValues[index][0] = value;
  return { ...state, values: newValues };
};

export const globalReducer = (state, action) => {
  switch (action.type) {
    case actions.UPDATE_VALUE:
      return updateOneValue(action.value, action.index, state);

    case actions.UPDATE_RESULTS:
      return { ...state, results: action.results };

    default:
      return state;
  }
};
