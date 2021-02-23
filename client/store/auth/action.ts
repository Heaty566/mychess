import { createAsyncThunk } from "@reduxjs/toolkit";

//* Import

import { RegisterUserDto } from "../../service/auth/dto";
import { authService } from "../../service/auth";

export const registerUser = createAsyncThunk<null, RegisterUserDto>("registerUser", async (input) => {
        await authService.registerUser(input);
        return null;
});
