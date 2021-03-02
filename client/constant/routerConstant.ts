import { Dictionary } from "../helper/i18n.helper";

interface RouterItem {
        url: string;
        label: Dictionary;
}

export const ROUTER: Record<string, RouterItem> = {
        login: { url: "/user/login", label: "Login User" },

        home: { url: "/", label: "MyGame home" },
        register: { url: "/user/register", label: "Register User" },
        ticTacToe: { url: "/tictactoe", label: "Tic Tac Toe" },
        forgotPassword: { url: "/tictactoe", label: "Tic Tac Toe" },
};
