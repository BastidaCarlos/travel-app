import { useGoogleLogin } from "@react-oauth/google";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "./useAuth";

export const useGoogleAuth = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    const { googleLoginContext } = useAuth();

    const loginWithGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                await googleLoginContext({ token: tokenResponse.access_token })
                navigate(from, { replace: true });
            } catch (error) {
                console.error('Error during Google authentication: ', error)
            }
        },
        onError: () => console.log('Failed Login')
    })
    return { loginWithGoogle }
}