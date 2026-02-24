import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const registeruser = createAsyncThunk(
    'users/registeruser',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await fetch(`http://localhost:3000/api/user/register`, {
                method: "POST",
                body: formData
            });

            const result = await response.json();

            if (!response.ok) {
                return rejectWithValue(result.message || 'Registration failed');
            }

            return result;
        } catch (error) {

            return rejectWithValue(error.message);
        }
    }
);
export const loginuser = createAsyncThunk(
    'users/loginuser',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await fetch(`http://localhost:3000/api/user/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credentials)
            });
            const result = await response.json();
            if (!response.ok) return rejectWithValue(result.message || 'Login failed');
            return result;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


const userSlice = createSlice({
    name: "users",
    initialState: {
        user: JSON.parse(localStorage.getItem("user")) || null,
        accessToken: localStorage.getItem("accessToken") || null,
        isLoading: false,
        isError: false,
        errorMessage: "",
        registrationSuccess: false
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.accessToken = null;
            localStorage.removeItem("user");
            localStorage.removeItem("accessToken");
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(registeruser.pending, (state) => {
                state.isLoading = true; // Added 'state.'
                state.isError = false;
                state.registrationSuccess = false;
            })
            .addCase(registeruser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isLoading = false; // Added 'state.'
                state.isError = false;
                state.registrationSuccess = true;
            })
            .addCase(registeruser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.errorMessage = action.payload;
                state.registrationSuccess = false; // Store the error from the backend
            })
            .addCase(loginuser.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(loginuser.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken; // ← add this
                state.isLoading = false;
                state.isError = false;

                localStorage.setItem("user", JSON.stringify(action.payload.user));
                localStorage.setItem("accessToken", action.payload.accessToken);
            })

            .addCase(loginuser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.errorMessage = action.payload;
            });
    }
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;