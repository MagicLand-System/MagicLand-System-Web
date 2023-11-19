import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import { getCurrentUser } from '../../api/user';
const initialState = {
    user: null,
    loading: true,
    error: null,
}
export const fetchUser = createAsyncThunk(
    'auth/fetch_user',
    async () => {
        try {
            const data = getCurrentUser()
            return data
        } catch (error) {
            return thunkAPI.rejectWithValue({ message: error.message });
        }
    }
)
const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        removeUser: (state, action) => {
            state.user = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchUser.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(fetchUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
        });

        builder.addCase(fetchUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        });
    },
});

export const { removeUser } = authSlice.actions;
export default authSlice.reducer;