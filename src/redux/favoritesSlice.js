import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite(state, action) {
      if (!state.items.find(item => item.idEvent === action.payload.idEvent)) {
        state.items.push(action.payload);
      }
    },
    removeFavorite(state, action) {
      state.items = state.items.filter(item => item.idEvent !== action.payload);
    },
  },
});

export const { addFavorite, removeFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
