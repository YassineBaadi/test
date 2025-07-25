import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// API service for user operations
export const fetchUserByCredentials = createAsyncThunk(
  "auth/fetchUserByCredentials",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/users/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Authentication failed");
      }

      return data.user;
    } catch (error) {
      return rejectWithValue(error.message || "Authentication failed");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/users/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, description: "" }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Registration failed");
      }

      return data.user;
    } catch (error) {
      return rejectWithValue(error.message || "Registration failed");
    }
  }
);

export const updateUserDescription = createAsyncThunk(
  "auth/updateUserDescription",
  async ({ userId, description, name, email }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description, name, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Update failed");
      }

      return data.user;
    } catch (error) {
      return rejectWithValue(error.message || "Update failed");
    }
  }
);

export const addCredits = createAsyncThunk(
  "auth/addCredits",
  async ({ userId, amount }, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/users/add-credits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, amount }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to add credits");
      }

      return data.user;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to add credits");
    }
  }
);

export const purchaseGamesWithCredits = createAsyncThunk(
  "auth/purchaseGamesWithCredits",
  async ({ userId, total }, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/users/purchase-with-credits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, total }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Purchase failed");
      }

      return data.user;
    } catch (error) {
      return rejectWithValue(error.message || "Purchase failed");
    }
  }
);

export const purchaseGames = createAsyncThunk(
  "auth/purchaseGames",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/users/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Purchase failed");
      }

      return data.user;
    } catch (error) {
      return rejectWithValue(error.message || "Purchase failed");
    }
  }
);

export const syncOAuthUser = createAsyncThunk(
  "auth/syncOAuthUser",
  async (sessionUser, { rejectWithValue, getState }) => {
    try {
      // Get current state
      const { auth } = getState();

      // Skip if already connected or sync was already attempted
      if (auth.user.isConnected || auth.oauthSyncAttempted) {
        console.log("Skipping OAuth sync - already connected or attempted");
        return auth.user; // Return current user if already synced
      }

      // Skip if no session user
      if (!sessionUser || !sessionUser.email) {
        console.log("Skipping OAuth sync - no valid session user");
        return rejectWithValue("No valid OAuth user provided");
      }

      console.log("Performing OAuth sync for:", sessionUser.email);

      const oauthData = {
        name: sessionUser.name || "User",
        email: sessionUser.email,
        image: sessionUser.image || null,
        provider: sessionUser.provider || "google",
      };

      const response = await fetch("/api/users/oauth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(oauthData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("OAuth sync API error:", data.message);
        return rejectWithValue(data.message || "Failed to sync OAuth user");
      }

      console.log("OAuth sync successful for:", sessionUser.email);
      return data.user; // API now returns the full user object
    } catch (error) {
      console.error("OAuth sync error:", error);
      return rejectWithValue(error.message || "Failed to sync OAuth user");
    }
  }
);

const initialState = {
  // --------------------------------------------------------------------|
  // --------------------- Array of registered users --------------------|
  users: [
    {
      id: "1",
      name: "admin",
      email: "a@a.a",
      password: "123",
      description: "",
      purchasedGames: [],
      isConnected: false,
      creditBalance: 0,
    },
  ],
  // --------------------------------------------------------------------|
  // ------------------------- user object ------------------------------|
  user: {
    id: "",
    name: "",
    email: "",
    description: "",
    purchasedGames: [],
    isConnected: false,
    creditBalance: 0,
  },
  setEmail: "",
  setPassword: "",
  setName: "",
  isError: false,
  isLoading: false,
  error: {
    register: "Cette adresse mail est déjà utilisée.",
    login: "Adresse mail ou mot de passe invalide",
    update: "Mise à jour échouée",
  },
  successMessage: "",
  redirectTo: null,
  oauthSyncAttempted: false, // Track OAuth sync attempts globally
};

const AuthSlice = createSlice({
  name: "auth",
  initialState,

  // --------------------------------------------------------------------|
  // --------------------------- Reducers -------------------------------|
  reducers: {
    authSetEmail: (state, action) => {
      state.setEmail = action.payload;
    },
    authSetPassword: (state, action) => {
      state.setPassword = action.payload;
    },
    authSetName: (state, action) => {
      state.setName = action.payload;
    },
    authResetError: (state) => {
      state.isError = false;
    },
    authLogout: (state) => {
      state.user = initialState.user;
    },
    authSetRedirect: (state, action) => {
      state.redirectTo = action.payload;
    },
    authClearRedirect: (state) => {
      state.redirectTo = null;
    },
    authSetSuccessMessage: (state, action) => {
      state.successMessage = action.payload;
    },
    authClearSuccessMessage: (state) => {
      state.successMessage = "";
    },
    // This is for updating local state from NextAuth session
    authSetUserFromSession: (state, action) => {
      const sessionUser = action.payload;
      if (sessionUser) {
        state.user = {
          id: sessionUser.id,
          name: sessionUser.name || sessionUser.username,
          email: sessionUser.email,
          description: "",
          purchasedGames: [],
          isConnected: true,
          creditBalance: sessionUser.creditBalance || 0,
        };
      }
    },
    authUpdatePurchasedGames: (state, action) => {
      state.user.purchasedGames = action.payload;
    },
    authSetOAuthSyncAttempted: (state, action) => {
      state.oauthSyncAttempted = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(fetchUserByCredentials.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchUserByCredentials.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = {
          ...action.payload,
          isConnected: true,
        };
        state.setEmail = "";
        state.setPassword = "";
      })
      .addCase(fetchUserByCredentials.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error.login = action.payload || "Authentication failed";
      })

      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = {
          ...action.payload,
          isConnected: true,
        };
        state.setName = "";
        state.setEmail = "";
        state.setPassword = "";
        state.successMessage = "Account created successfully";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error.register = action.payload || "Registration failed";
      })

      // Update user
      .addCase(updateUserDescription.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(updateUserDescription.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = {
          ...state.user,
          description: action.payload.description,
          name: action.payload.name,
          email: action.payload.email,
        };
        state.successMessage = "Profile updated successfully";
      })
      .addCase(updateUserDescription.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error.update = action.payload || "Update failed";
      })

      // Add credits
      .addCase(addCredits.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(addCredits.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = {
          ...state.user,
          creditBalance: action.payload.creditBalance,
        };
        state.successMessage = "Credits added successfully";
      })
      .addCase(addCredits.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error.update = action.payload || "Failed to add credits";
      })

      // Purchase games with credits
      .addCase(purchaseGamesWithCredits.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(purchaseGamesWithCredits.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user.purchasedGames = action.payload.purchasedGames;
        state.user.creditBalance = action.payload.creditBalance;
        state.successMessage = "Purchase completed successfully with credits";
      })
      .addCase(purchaseGamesWithCredits.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error.update = action.payload || "Purchase failed";
      })

      // Purchase games
      .addCase(purchaseGames.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(purchaseGames.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user.purchasedGames = action.payload.purchasedGames;
        state.successMessage = "Purchase completed successfully";
      })
      .addCase(purchaseGames.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error.update = action.payload || "Purchase failed";
      })

      // OAuth sync
      .addCase(syncOAuthUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.oauthSyncAttempted = true; // Mark sync as attempted when it starts
      })
      .addCase(syncOAuthUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = {
          ...action.payload,
          isConnected: true,
        };
        state.successMessage = "Profile synchronized";
      })
      .addCase(syncOAuthUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error.update = action.payload || "Failed to sync OAuth user";
      });
  },
});

// --------------------------------------------------------------------|
// ---------------------------- Exports -------------------------------|
export const {
  authSetEmail,
  authSetPassword,
  authSetName,
  authResetError,
  authLogout,
  authSetRedirect,
  authClearRedirect,
  authSetSuccessMessage,
  authClearSuccessMessage,
  authSetUserFromSession,
  authUpdatePurchasedGames,
  authSetOAuthSyncAttempted,
} = AuthSlice.actions;

export default AuthSlice.reducer;
