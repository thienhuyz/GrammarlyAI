import { createSlice } from "@reduxjs/toolkit";
import { getCurrent } from './asyncActions';   // ← sửa ở đây
import { toast } from "react-toastify";

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        isLoggedIn: false,
        current: null,
        token: null,
        isLoading: false,
    },
    reducers: {
        login: (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn;
            state.token = action.payload.token;
        },
        logout: (state) => {
            state.isLoggedIn = false;
            state.current = null;
            state.token = null;
            state.isLoading = false;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getCurrent.pending, (state) => {
            state.isLoading = true;
        });

        builder.addCase(getCurrent.fulfilled, (state, action) => {
            state.isLoading = false;
            state.current = action.payload;
            state.isLoggedIn = true;
        });

        builder.addCase(getCurrent.rejected, (state) => {
            state.isLoading = false;
            state.current = null;
            state.isLoggedIn = false;
            state.token = null;
            toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!", {
                toastId: "session-expired",
            });
        });
    }
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
