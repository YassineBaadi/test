import { createSlice } from "@reduxjs/toolkit";

// Helper function to calculate the coupon discount
export const calculateCouponDiscount = (cartItems) => {
  // If less than 5 items in cart, coupon is not applicable
  if (!cartItems || cartItems.length < 5) {
    return {
      isApplicable: false,
      cheapestGame: null,
      discountAmount: 0,
    };
  }

  // Find the cheapest game using priceToPay if available, otherwise use price
  let cheapestGame = cartItems.reduce((cheapest, game) => {
    const gamePrice = parseFloat(game.priceToPay || game.price || 0);
    const cheapestPrice = parseFloat(
      cheapest?.priceToPay || cheapest?.price || Infinity
    );
    return gamePrice < cheapestPrice ? game : cheapest;
  }, null);

  // Calculate the discount amount (price of the cheapest game)
  const discountAmount = parseFloat(
    cheapestGame?.priceToPay || cheapestGame?.price || 0
  );

  return {
    isApplicable: true,
    cheapestGame,
    discountAmount,
  };
};

// Initial state
const initialState = {
  activeCoupons: [],
  availableCoupons: [
    {
      id: "4PLUS1FREE",
      name: "4+1 gratuit",
      description:
        "Le jeu le moins cher est offert lors de l'achat de 5 jeux ou plus.",
      minItems: 5,
      discountType: "FREE_CHEAPEST",
    },
  ],
  couponDiscount: 0,
};

const couponSlice = createSlice({
  name: "coupon",
  initialState,
  reducers: {
    applyCoupon: (state, action) => {
      // Add the coupon to active coupons if it's not already there
      const couponId = action.payload;
      if (!state.activeCoupons.includes(couponId)) {
        state.activeCoupons.push(couponId);
      }
    },
    removeCoupon: (state, action) => {
      // Remove the coupon from active coupons
      const couponId = action.payload;
      state.activeCoupons = state.activeCoupons.filter((id) => id !== couponId);
    },
    updateCouponDiscount: (state, action) => {
      // Update the coupon discount amount
      state.couponDiscount = action.payload;
    },
  },
});

export const { applyCoupon, removeCoupon, updateCouponDiscount } =
  couponSlice.actions;

export default couponSlice.reducer;
