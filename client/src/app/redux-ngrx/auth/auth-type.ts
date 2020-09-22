import { UserModel } from './../../models/User';
export interface AuthState {
    token: string | object | null;
    isAuthenticated: boolean | null;
    loading: boolean;
    user: UserModel;
    errorMessage:string;
}
export interface AppState {
    auth: AuthState;
}