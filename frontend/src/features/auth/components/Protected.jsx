import { useSelector } from "react-redux"
import { selectLoggedInUser } from "../AuthSlice"
import { Navigate } from "react-router"

export const Protected = ({ children, requireVerification = true }) => {
    const loggedInUser = useSelector(selectLoggedInUser)

    // If no user is logged in, redirect to login
    if (!loggedInUser) {
        return <Navigate to={'/login'} replace={true} />
    }

    // If verification is required and user is not verified, redirect to login
    if (requireVerification && !loggedInUser.isVerified) {
        return <Navigate to={'/login'} replace={true} />
    }

    // User is logged in and meets verification requirements
    return children
}
