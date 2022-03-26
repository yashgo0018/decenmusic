import { createContext } from "react";

const LoginContext = createContext({ user: { address: '', token: '', loggedIn: false }, setUser(user) { } });
export default LoginContext;