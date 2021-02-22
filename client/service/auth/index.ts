import axios, { AxiosStatic } from "axios";
import { ApiResponse } from "../../store/api/dto";
import { RegisterUserDto } from "./dto";

class AuthService {
        private endPoint: string = "/auth";
        constructor(private http: AxiosStatic) {}

        public async registerUser(input: RegisterUserDto) {
                return await this.http.post<ApiResponse<null>>(this.endPoint + "/register", { ...input });
        }
}

export const authService = new AuthService(axios);
