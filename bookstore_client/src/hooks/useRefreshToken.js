import axios, {loginAxios} from '../api/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {

    const { auth, setAuth } = useAuth();

    const clientId = process.env.REACT_APP_IS_CLIENT_ID;
    const clientSecret = process.env.REACT_APP_IS_CLIENT_SECRETE;

    const authString = btoa(`${clientId}:${clientSecret}`); // Base64 encode

    const params = new URLSearchParams();
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', auth.refresh_token);

    return async () => {
        console.log("Refresh Token Used");
        const response = await loginAxios.get('/oauth2/token',
            params.toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                        'Authorization': `Basic ${authString}`
                },
            }
        );
        response.data.role = response?.data?.role.replace("_", " ");
        setAuth({
            ...auth,
            access_token: response.data.access_token,
        });
        return response.data.access_token;
    };
};

export default useRefreshToken;
