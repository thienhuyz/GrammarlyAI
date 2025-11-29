import { Routes, Route } from "react-router-dom";
import path from "../utils/path";

import { Public, Home, Login, ResetPassword, Editor, Profile } from "../pages/public";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path={path.PUBLIC} element={<Public />}>
                <Route path={path.HOME} element={<Home />} />
                <Route path={path.EDITOR} element={<Editor />} />
                <Route path={path.PROFILE} element={<Profile />} />
            </Route>
            <Route path={path.LOGIN} element={<Login />} />
            <Route path={path.RESET_PASSWORD} element={<ResetPassword />} />
        </Routes>

    );
};

export default AppRoutes;