import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cookies: 0,
  cookiesPerSecond: 0,
};

const ClickerSlice = createSlice({
  name: "clicker",
  initialState,
  reducers: {
    clickCookie: (state, action) => {
      const amount = action.payload || 1;
      state.cookies = Math.round((state.cookies + amount) * 10) / 10;
    },
    upgradeCookie: (state) => {
      state.cookiesPerSecond =
        Math.round((state.cookiesPerSecond + 1) * 10) / 10;
    },
    buyUpgrade: (state, action) => {
      if (state.cookies >= action.payload.price) {
        state.cookies =
          Math.round((state.cookies - action.payload.price) * 10) / 10;
        state.cookiesPerSecond =
          Math.round((state.cookiesPerSecond + action.payload.value) * 10) / 10;
      }
    },
  },
});

export const { clickCookie, upgradeCookie, buyUpgrade } = ClickerSlice.actions;

export default ClickerSlice.reducer;
