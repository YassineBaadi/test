"use client";

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import carouselReducer from "../features/carouselSlice";
import gameDetailsReducer from "../features/gameDetailsSlice";
import searchReducer from "../features/searchSlice";
import clickerReducer from "../features/clickerSlice";
import gameReducer from "../features/gameSlice";
import couponReducer from "../features/couponSlice";
import cartReducer from "../features/cartSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    carousel: carouselReducer,
    gameDetails: gameDetailsReducer,
    search: searchReducer,
    clicker: clickerReducer,
    game: gameReducer,
    coupon: couponReducer,
    cart: cartReducer,
  },
});

export default store;
