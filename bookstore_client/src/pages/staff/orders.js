import React, {useEffect, useState} from "react";
import {Alert, Button, Footer, Navbar} from "../webcomponent";
import {
    Card,
    CardBody,
    IconButton,
    Typography,
} from "@material-tailwind/react";
import {Link, useNavigate} from "react-router-dom";
import axios, {axiosPrivate} from "../../api/axios";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import useAuth from "../../hooks/useAuth";


const Orders = () => {

    const {auth} = useAuth();

    const [list, setList] = useState(null);
    const [page, setPage] = useState(1);
    const [fetch, setFetch] = useState(5);
    const [errorMsg, setErrorMsg] = useState({State: false, Type: "", Message: ""});

    useEffect(() => {
        if (errorMsg.State) {
            const timer = setTimeout(() => {
                setErrorMsg({ State: false, Type: "", Message: "" });
                setPage(page)// Reset after 10s
            }, 5000); // 10,000ms = 10 seconds

            return () => clearTimeout(timer); // Cleanup if the component unmounts or error changes
        }
    }, [errorMsg]);

    useEffect(() => {
        const getDetails = async () => {

            try {
                let response = await axios.get(`/orders?page=${page}&fetch=${fetch}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${auth?.access_token}`
                        },
                    }
                );
                setList(response.data);
            } catch (error) {
                if (error.response?.data.code === 404) {
                    setList([])
                }
            }

        }

        getDetails().then();

    }, [page]);

    const completeOrder = (book_id) => {

        const complete = async () => {

            try {
                let response = await axios.put(`/orders/${book_id}`, undefined,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${auth?.access_token}`
                        },
                    }
                );
                setErrorMsg({State: true, Type: "Success", Message: response.data.message});
            } catch (error) {
                if (error.response?.data.code === 404 || error.response?.data.code === 409) {
                    setErrorMsg({State: true, Type: "Error", Message: error.response.data.message});
                }
            }

        }

        complete().then();
    }

    function DefaultPagination() {
        const [active, setActive] = useState(list?.meta?.current_page);
        const [numbers, setNumbers] = useState([]);

        useEffect(() => {
            let listItems = []
            for (let i = 1; i < list?.meta?.total_pages + 1; i++) {
                listItems.push(
                    <IconButton
                        key={i}
                        variant={active === i ? "filled" : "text"}
                        className={active === i ? "bg-main-purple text-white" : "text-black"}
                        onClick={() => {
                            setActive(i)
                            setPage(i)
                        }}
                    >
                        {i}
                    </IconButton>
                );
            }
            setNumbers(listItems)
        }, [active]);

        const next = () => {
            if (active === list?.meta?.total_pages) return;
            setPage(active + 1);
            setActive(active + 1);
        };

        const prev = () => {
            if (active === 1) return;
            setPage(active - 1);
            setActive(active - 1);
        };

        return (
            <div className="flex items-center gap-4">
                <Button
                    variant="text"
                    className="flex items-center gap-2"
                    onClick={prev}
                    disabled={active === 1}
                >
                    <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" /> Previous
                </Button>
                <div className="flex items-center gap-2">
                    {numbers}
                </div>
                <Button
                    variant="text"
                    className="flex items-center gap-2"
                    onClick={next}
                    disabled={active === list?.meta?.total_pages}
                >
                    Next
                    <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
                </Button>
            </div>
        );
    }

    return (

        <div className="flex flex-col justify-between items-center w-full overflow-hidden">

            <Navbar active="Orders"/>

            <section className="flex flex-col md:flex-row  md:space-y-0 md:space-x-16 justify-items-center md:mx-0 m-20 lg:my-[5rem]  items-center">
                <div className=" flex flex-col justify-center items-center my-130">
                    <Alert Type={errorMsg.Type} Message={errorMsg.Message} State={errorMsg.State} />
                    {
                        list?.Orders && list?.Orders.length > 0 ?
                        <>
                            <div className="flex flex-wrap gap-4 justify-center mb-8">
                                {
                                    list?.Orders.map((order, index) => (
                                        <Card className="w-96 shadow-none border-2" key={index}>
                                            <CardBody>
                                                <div className="flex justify-between items-center gap-2">
                                                    <Typography variant="h6" color="black" className="mb-2 font-bold">
                                                        Order Details
                                                    </Typography>
                                                    <Typography variant="small" color="blue-gray"
                                                                className={`rounded-md ${order.payment_status === "completed" ? 'bg-main-purple' : 'bg-amber-200'} text-white font-bold px-4 py-1`}>
                                                        {order.payment_status.toUpperCase()}
                                                    </Typography>
                                                </div>
                                                <Typography variant="small" color="black"
                                                            className="border-l pl-4  mb-2 font-bold">
                                                    {order.order_id}
                                                </Typography>
                                                <Typography variant="small" color="blue-gray" className="border-l pl-4  mb-2">
                                                    Amount : Rs. {order.payment_amount}
                                                </Typography>
                                                <Typography variant="small" color="blue-gray" className="border-l pl-4  mb-2">
                                                    Qty : {order.quantity}
                                                </Typography>
                                                <Typography variant="h6" color="black" className="mb-2 font-bold">
                                                    Book Details
                                                </Typography>
                                                <Typography variant="small" color="black"
                                                            className="border-l pl-4 mb-2 font-bold">
                                                    {order.book_id}
                                                </Typography>
                                                <Typography variant="small" color="blue-gray" className="border-l pl-4  mb-2">
                                                    {order.title}
                                                </Typography>
                                                <Typography variant="small" color="blue-gray" className="border-l pl-4  mb-2">
                                                    Rs. {order.price}
                                                </Typography>
                                                <Button
                                                    type="button"
                                                    label="Complete Order"
                                                    onClick={() => {
                                                        completeOrder(order.order_id)
                                                    }}
                                                    disabled={order.payment_status === "completed"}
                                                    className="mt-4 w-full"
                                                />
                                            </CardBody>
                                        </Card>
                                    ))
                                }
                            </div>
                            <DefaultPagination/>
                        </>
                        :
                        <Typography variant="small" color="black" className="mb-2 font-bold">
                        No Orders Found
                        </Typography>
                    }

                </div>
            </section>

            <Footer position={`${list?.Orders && list?.Orders.length > 0 ? 'relative' : ''}`}/>

        </div>

    )

}

export default Orders