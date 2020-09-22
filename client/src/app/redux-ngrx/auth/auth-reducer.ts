import { UserModel } from "../../models/User";
import { LOGIN_START, AUTHENTICATE_SUCCESS, AUTHENTICATE_FAIL, AuthActionTypes, LOAD_USER, LOGIN_WITH_FACEBOOK, LOGIN_WITH_GOOGLE, REGISTER_START, LOGOUT } from "./auth-actions-types";
import { AuthState } from "./auth-type";

const authReducerDefaultState: AuthState = {
    token: localStorage.getItem("token"),
    isAuthenticated: false,
    loading: false,
    user: new UserModel(),
    errorMessage: null,

};


export function authReducer(state = authReducerDefaultState, action: AuthActionTypes) {
    switch (action.type) {
        case AUTHENTICATE_SUCCESS:
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                user: action.payload,
                errorMessage: null,

            };
        case LOGIN_START:
        case LOGIN_WITH_FACEBOOK:
        case LOGIN_WITH_GOOGLE:
        case REGISTER_START:
            return {
                ...state,
                loading: true,
                errorMessage: null,
                isAuthenticated: false


            };
        case LOAD_USER:
            return {
                ...state,
                loading: true,
                token: action.payload.token,
                errorMessage: null,
            };
        case AUTHENTICATE_FAIL:
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                loading: false,   
                errorMessage: action.payload,
            };
        case LOGOUT:
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                loading: false,
                errorMessage: null,
                token: null,
            };

        default:
            return state;

    }

}