import { AxiosStatic } from "axios";
import { ApiResponse } from "../../store/api/dto";
import { RegisterUserDto } from "./dto";
import http from "../http";

class AuthService {
        private readonly endPoint: string = "/auth";
        constructor(private readonly http: AxiosStatic) {}

        public async registerUser(input: RegisterUserDto) {
                return await this.http.post<ApiResponse<null>>(this.endPoint + "/register", { ...input });
        }
}

export const authService = new AuthService(http);
