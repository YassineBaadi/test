import { createSlice } from "@reduxjs/toolkit";
import { generatePrice } from "./gameSlice";
import { calculateCouponDiscount } from "./couponSlice";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    originalPrices: {}, // Store original prices for each game
    discountedPrices: {}, // Store discounted prices for each game
    couponDiscount: 0,
    subtotal: 0,
    total: 0,
  },
  reducers: {
    setCartItems: (state, action) => {
      const items = action.payload;
      state.items = items;

      // Calculate prices for each item
      items.forEach((item) => {
        const gameId = item.id;
        const priceInfo = generatePrice(gameId);

        // Store original price
        state.originalPrices[gameId] = parseFloat(priceInfo.price);

        // Store discounted price (if applicable)
        if (priceInfo.hasDiscount) {
          state.discountedPrices[gameId] = parseFloat(
            priceInfo.discountedPrice
          );
        } else {
          state.discountedPrices[gameId] = parseFloat(priceInfo.price);
        }
      });

      // Calculate subtotal (with individual discounts)
      state.subtotal = items.reduce((sum, item) => {
        return sum + state.discountedPrices[item.id];
      }, 0);

      // Calculate coupon discount (4+1)
      const couponInfo = calculateCouponDiscount(
        items.map((item) => ({
          ...item,
          price: state.originalPrices[item.id],
          priceToPay: state.discountedPrices[item.id],
        }))
      );

      state.couponDiscount = couponInfo.discountAmount;

      // Calculate final total
      state.total = Math.max(0, state.subtotal - state.couponDiscount);
    },

    clearCart: (state) => {
      state.items = [];
      state.originalPrices = {};
      state.discountedPrices = {};
      state.couponDiscount = 0;
      state.subtotal = 0;
      state.total = 0;
    },

    updateCouponDiscount: (state, action) => {
      state.couponDiscount = action.payload;
      state.total = Math.max(0, state.subtotal - state.couponDiscount);
    },
  },
});

export const { setCartItems, clearCart, updateCouponDiscount } =
  cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectOriginalPrices = (state) => state.cart.originalPrices;
export const selectDiscountedPrices = (state) => state.cart.discountedPrices;
export const selectCouponDiscount = (state) => state.cart.couponDiscount;
export const selectSubtotal = (state) => state.cart.subtotal;
export const selectTotal = (state) => state.cart.total;
export const selectIsCouponApplicable = (state) => state.cart.items.length >= 5;

export default cartSlice.reducer;
