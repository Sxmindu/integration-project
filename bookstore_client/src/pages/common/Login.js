import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import {Card, Typography} from "@material-tailwind/react";
import {Button, Footer, Input, Navbar} from "../webcomponent";
import {jwtDecode} from 'jwt-decode';
import {CheckIcon, DocumentDuplicateIcon} from "@heroicons/react/24/outline";

import {useCopyToClipboard} from "usehooks-ts";
import {loginAxios} from "../../api/axios";

const Login = () => {

    const {auth, setAuth} = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

    useEffect( () => {
        const queryParams = new URLSearchParams(location.search);

        const auth_code = queryParams.get('code')

        if (auth_code) {
            getTokens(auth_code).then();
        }
    }, []);

    const decodeToken = (token) => {
        try {
            return jwtDecode(token);
        } catch (error) {
            return null;
        }
    };

    const getTokens = async (code) => {
        const clientId = process.env.REACT_APP_IS_CLIENT_ID;
        const clientSecret = process.env.REACT_APP_IS_CLIENT_SECRETE;
        const redirect_uri = process.env.REACT_APP_IS_REDIRECT_URI;

        const authString = btoa(`${clientId}:${clientSecret}`); // Base64 encode

        const params = new URLSearchParams();
        params.append('grant_type', 'authorization_code');
        params.append('code', code);
        params.append('redirect_uri', redirect_uri);

        try {
            let response = await loginAxios.post('/oauth2/token',
                params.toString(),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                        'Authorization': `Basic ${authString}`
                    },
                }
            );

            let data;
            const payload = decodeToken(response.data?.id_token);
            if (payload) {
                data = {
                    code: code,
                    access_token: response.data.access_token,
                    refresh_token: response.data.refresh_token,
                    id_token: response.data.id_token,
                    scope: response.data.scope,
                    username: payload?.username,
                    email: payload?.email,
                    role: payload?.roles[0]
                }
            }

            setAuth(data)

            navigate(`/`);
        } catch (error) {
            console.error('Token request failed:', error.response?.data || error.message);
            navigate(`/login`);
        }
    }

    const handleSubmit = (e) => {

        e.preventDefault();

        const tokens = "code"
        const base_url = process.env.REACT_APP_IS_BASE_URL
        const client_id = process.env.REACT_APP_IS_CLIENT_ID;
        const redirect_uri = process.env.REACT_APP_IS_REDIRECT_URI;
        const scope = process.env.REACT_APP_IS_SCOPE;
        window.open(`${base_url}/oauth2/authorize?response_type=${tokens}&client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&nonce=1213134`, "_self");

    }

    function ClipboardCopyInput(props) {

        const string = props.string;

        const [value, copy] = useCopyToClipboard();
        const [copied, setCopied] = useState(false);
        const [inputValue, setInputValue] = useState(string);

        return (
            <div className="flex items-center gap-4">
                <div className="w-full">
                    <Input
                        type="text"
                        label="Access Token"
                        defaultValue={inputValue}
                        readOnly={true}
                    />
                </div>
                <Button
                    size="md"
                    onMouseLeave={() => setCopied(false)}
                    onClick={() => {
                        copy(inputValue).then();
                        setCopied(true);
                    }}
                    className="flex items-center gap-2 hover:!bg-main-purple hover:!text-white"
                >
                    {copied ? (
                        <>
                            <CheckIcon className="h-4 w-4 text-white" />
                            Copied
                        </>
                    ) : (
                        <>
                            <DocumentDuplicateIcon className="h-4 w-4 text-white" />
                            Copy
                        </>
                    )}
                </Button>
            </div>
        );
    }

    return (

        <div className="flex flex-col justify-between items-center w-full overflow-hidden">

            <Navbar active="Login"/>

            <section className="flex flex-col md:flex-row  md:space-y-0 md:space-x-16 justify-items-center md:mx-0 m-20 lg:my-[5rem] h-[60vh] items-center">
                <div className="my-130">
                    <Card color="transparent" className="items-center" shadow={false}>
                        <Typography variant="h1" className="text-[6rem] text-700 text-main-purple">
                            books.com
                        </Typography>
                        {
                            auth?.access_token ?
                                <div className={"flex flex-col gap-4 w-full"}>
                                    <ClipboardCopyInput string={auth?.access_token}/>
                                    <Input
                                        type="text"
                                        label="Scope"
                                        defaultValue={auth?.scope}
                                        readOnly={true}
                                    />
                                </div> :
                                <>
                                    <form className="mt-2 mb-2 w-80 max-w-screen-lg sm:w-96" onSubmit={handleSubmit}>
                                        <div className="flex flex-col gap-[0.75rem] items-center">
                                            <Button
                                                type="submit"
                                                label="Login"
                                                className="w-full rounded-[0rem]"
                                            />
                                        </div>
                                    </form>
                                </>
                        }

                    </Card>
                </div>
            </section>

            <Footer/>

        </div>

    )

}

export default Login