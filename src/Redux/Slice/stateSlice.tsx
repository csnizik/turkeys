import { createSlice } from '@reduxjs/toolkit';

interface IState {
  stateNameDisplay: string;
  stateCode: string;
  stateAbbreviation: string;
}

export const initialState = {
  stateNameDisplay: 'National',
  stateCode: '00',
  stateAbbreviation: 'National',
} as IState;

/* eslint-disable no-param-reassign */
const stateSlice = createSlice({
  name: 'state',
  initialState,
  reducers: {
    currentState(state, action) {
      state.stateNameDisplay = action?.payload?.stateNameDisplay;
      state.stateCode = action?.payload?.stateCode;
      state.stateAbbreviation = action?.payload?.stateAbbreviation;
    },
  },
});
/* eslint-disable no-param-reassign */

export const { currentState } = stateSlice.actions;
export default stateSlice.reducer;
