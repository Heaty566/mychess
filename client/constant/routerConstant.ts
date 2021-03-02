import { Dictionary } from "../helper/i18n.helper";

interface RouterItem {
        url: string;
        label: Dictionary;
}

export const ROUTER: Record<string, RouterItem> = {
        login: { url: "/auth/login", label: "login" },
        home: { url: "/", label: "MyGame" },
        register: { url: "/auth/register", label: "register" },
        ticTacToe: { url: "/tictactoe", label: "tic tac toe" },
        forgotPassword: { url: "/auth/forgot-password", label: "tic tac toe" },
        updatePhone: { url: "/tictactoe", label: "tic tac toe" },
        forgotPasswordPhone: { url: "/auth/forgot-password-phone", label: "or log in with" },
};
