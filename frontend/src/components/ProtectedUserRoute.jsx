import React from "react";
import { useNavigate } from "react-router";
import { useState } from "react";
import { UserDataContext } from "../context/UserContext";
import { useEffect } from "react";
import { getUserProfile } from "../services/UserService";

const ProtectedUserRoute = ({ children }) => {

    const token = localStorage.getItem('token')

    const { user, setUser } = React.useContext(UserDataContext)

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        getUserProfile(token).then((data) => {
            setUser(data.user);
            setIsLoading(false);
        }).catch((error) => {
            console.error('Error fetching user profile:', error);
            // Handle expired or invalid token
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                sessionStorage.removeItem('token');
            }

            navigate('/login');
        });
    }, [token])

    return (
        <>
            {children}
        </>
    )
}

export default ProtectedUserRoute