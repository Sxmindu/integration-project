import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import useAuth from "../../hooks/useAuth.jsx";
import axios from "../../api/axios";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faApple, faFacebook, faGoogle} from "@fortawesome/free-brands-svg-icons";
import {Avatar, Card, CardBody, CardHeader, Typography} from "@material-tailwind/react";
import { Navbar, Footer, Carousel, Alert, Input, Button } from "../webcomponent";

const Login = () => {

    const {setAuth} = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState({"State": "", "Message": ""});

    const [password, setPassword] = useState('');
    const [validPassword, setValidPassword] = useState({"State": "", "Message": ""});

    const [errorMsg, setErrorMsg] = useState({State: false, Type: "", Message: ""});

    useEffect(() => {
        setValidEmail({State: "Valid", Message: ""});
        setValidPassword({State: "Valid", Message: ""});
        setErrorMsg({State: false, Type: "", Message: ""});
    }, [email, password])

    useEffect(() => {
        if (errorMsg.State) {
            setValidEmail({State: "Invalid", Message: "Email"});
            setValidPassword({State: "Invalid", Message: "Password"});
        }
    }, [errorMsg])

    const handleSubmit = async (e) => {

        if (email === '' || password === '') {
            setErrorMsg({State: true, Type: "Error", Message: 'Username and Password are required'});
            return;
        }

        e.preventDefault();

        try {

            let response = await axios.post('/auth/authenticate',
                JSON.stringify({email, password}),
                {
                    headers: {'Content-Type': 'application/json'},
                    withCredentials: true,

                }
            );
            console.log(response?.data)
            response.data.role = response?.data?.role.replace("_", " ");
            console.log(response?.data)
            setAuth(response?.data);
            
            setEmail('');
            setPassword('');

            let role;
            if (response?.data?.role === "INDIVIDUAL INVESTOR" || response?.data?.role === "ENTERPRISE INVESTOR") {
                role = "investor";
            } else if (response?.data?.role === "CO ADMIN") {
                role = "admin";
            } else {
                role = response?.data?.role.toLowerCase();
            }

            const from = location?.state?.from || {pathname: "/" + role +"/dashboard"};
            navigate(from, {replace: true});

        } catch (err) {
            if (!err?.response) {
                setErrorMsg({State: true, Type: "Error", Message: 'No Server Response'});
            } else if (err.response?.status === 403) {
                setErrorMsg({State: true, Type: "Error", Message: 'Invalid Username or Password'});
            } else {
                setErrorMsg({State: true, Type: "Error", Message: err.response?.data?.message});
            }
        }
    }

    const CarouselItem = () => {
        return (
            <div>
                <Card color="white" shadow={false}
                      className="w-full h-full justify-center overflow-hidden text-center gap-[1.5rem] p-[2rem]">
                    <CardHeader
                        color="transparent"
                        floated={false}
                        shadow={false}
                        className="mx-0 flex justify-center items-center gap-4"
                    >
                        <Avatar
                            size="lg"
                            variant="circular"
                            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
                            alt="candice wu"
                            className=" items-center w-[5rem] h-[5rem]"
                        />
                    </CardHeader>
                    <CardBody className="flex flex-col gap-[1rem] mb-6 p-0">
                        <Typography className="font-[700] capitalize">
                            Our top Entrepreneur
                        </Typography>
                        <Typography>
                            &quot;I found solution to all my design needs from Creative Tim. I use
                            them as a freelancer in my hobby projects for fun! And its really
                            affordable, very humble guys !!!&quot;
                        </Typography>
                        <div>
                            <Typography variant="h5" color="blue-gray">
                                Candice Wu
                            </Typography>
                            <Typography>
                                San Francisco, CA
                            </Typography>
                        </div>
                    </CardBody>
                </Card>
            </div>
        )
    }

    return (

        <div className="flex flex-col justify-between items-center w-full overflow-hidden">

            <Navbar active="Login"/>

            <section className="flex flex-col md:flex-row  md:space-y-0 md:space-x-16 justify-items-center md:mx-0 m-20 lg:my-[5rem]">
                <div className="lg:flex hidden bg-[#c7d2fe] place-items-center">
                    <div className="max-w-lg p-10">
                        <Carousel
                            prevArrow={() => ("")}
                            nextArrow={() => ("")}
                        >

                            <CarouselItem/>
                            <CarouselItem/>
                            <CarouselItem/>

                        </Carousel>
                    </div>
                </div>
                <div className="my-130">
                    <Card color="transparent" className="items-center lg:items-start" shadow={false}>
                        <Typography variant="h4" className="text-[2rem] text-700 text-main-purple">
                            Login
                        </Typography>
                        <Typography color="gray" className="mt-1 font-normal">
                            Enter your details to Login.
                        </Typography>
                        <form className="mt-2 mb-2 w-80 max-w-screen-lg sm:w-96" onSubmit={handleSubmit}>
                            <Alert Type={errorMsg.Type} Message={errorMsg.Message} State={errorMsg.State} />
                            <div className="flex flex-col gap-[0.75rem] items-center">
                                <Input
                                    type="text"
                                    label="Email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email || ''}
                                    state={validEmail}
                                    required
                                />
                                <Input
                                    type="password"
                                    label="Password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                    state={validPassword}
                                    required
                                />
                                <Button
                                    type="submit"
                                    label="Login"
                                    className="w-full"
                                />
                                <Typography as="a" href="/forgot-password"
                                    className="font-[400] text-[0.875rem] leading-[1.5rem] tracking-[0.2px] text-main-purple hover:text-secondary cursor-pointer">
                                    Forgot Password?
                                </Typography>
                            </div>
                            <div className="flex flex-col gap-[0.75rem] items-center p-[1rem]">
                                <Typography
                                    className="font-[400] text-[0.875rem] leading-[1.5rem] tracking-[0.2px] text-main-gray hover:text-secondary cursor-pointer">
                                    or
                                </Typography>
                            </div>
                            <div className="flex flex-col gap-[0.75rem] items-center">
                                <Button
                                    type="button"
                                    variant="clear"
                                    className="w-full !gap-[1rem]"
                                >
                                    <FontAwesomeIcon icon={faGoogle} className="text-[1.2rem]"/>Continue with Google
                                </Button>
                                <Button
                                    type="button"
                                    variant="clear"
                                    className="w-full !gap-[1rem]"
                                >
                                    <FontAwesomeIcon icon={faFacebook} className="text-[1.2rem]"/>Continue with Facebook
                                </Button>
                                <Button
                                    type="button"
                                    variant="clear"
                                    className="w-full !gap-[1rem]"
                                >
                                    <FontAwesomeIcon icon={faApple} className="text-[1.2rem]"/>Continue with Apple
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </section>

            <Footer/>

        </div>

    )

}

export default Login