import React, {useEffect, useState} from "react";
import {Button, Footer, Input, Navbar, Alert, Select} from "../webcomponent";
import {
    Card,
    CardBody,
    Typography,
} from "@material-tailwind/react";
import axios, {axiosPrivate} from "../../api/axios";
import useAuth from "../../hooks/useAuth";


const Purchases = () => {

    const {auth} = useAuth();

    const [books, setBooks] = useState('');
    const [qty, setQty] = useState('');
    const [book, setBook] = useState('');
    const [order, setOrder] = useState('');
    const [errorMsg, setErrorMsg] = useState({State: false, Type: "", Message: ""});

    useEffect(() => {
        if (errorMsg.State) {
            const timer = setTimeout(() => {
                setErrorMsg({ State: false, Type: "", Message: "" }); // Reset after 10s
            }, 5000); // 10,000ms = 10 seconds

            return () => clearTimeout(timer); // Cleanup if the component unmounts or error changes
        }
    }, [errorMsg]);

    useEffect(() => {
        console.log(order);
        const getDetails = async () => {

            try {
                let response = await axios.get(`/books`,
                    {
                        headers: {'Content-Type': 'application/json'},
                    }
                );

                const values = []
                response.data?.Books.forEach((book) => {
                    values.push({show: book.title, value: book.book_id});
                })

                setBooks(values);
            } catch (error) {
                if (error.response?.data.code === 404) {
                    setBooks([])
                }
            }

        }

        getDetails().then();

    }, []);

    const handleSubmit = (e) => {

        e.preventDefault();

        const addOrder = async () => {

            try {
                let response = await axios.post(`/orders`,
                    JSON.stringify({
                        book_id: book,
                        user_email: auth?.email,
                        quantity: parseInt(qty),
                    }),
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${auth?.access_token}`
                        },
                    }
                );
                setErrorMsg({State: true, Type: "Success", Message: 'Book ordered successfully'});
                setBook('')
                setQty('')
                setOrder(response.data.data)
            } catch (error) {
                if (error.response?.data.code === 404 || error.response?.data.code === 409) {
                    setErrorMsg({State: true, Type: "Error", Message: error.response.data.message});
                }
            }

        }

        addOrder().then();
    }


    return (

        <div className="flex flex-col justify-between items-center w-full overflow-hidden">

            <Navbar active="Purchase"/>

            <section className="flex flex-col md:flex-row  md:space-y-0 md:space-x-16 justify-items-center md:mx-0 m-20 lg:my-[5rem] h-[60vh] items-center">
                <div className="flex flex-row gap-12 my-130">
                    <form className="mt-2 mb-2 w-80 max-w-screen-lg sm:w-96" onSubmit={handleSubmit}>
                        <Alert Type={errorMsg.Type} Message={errorMsg.Message} State={errorMsg.State} />
                        <div className="flex flex-col gap-[0.75rem] items-center">
                            <Select
                                label="Book"
                                value={book}
                                options={books}
                                onChange={(event)=>
                                    setBook(event)
                                }
                                required={true}
                            />
                            <Input
                                type="text"
                                label="Email"
                                value={auth?.email}
                                readOnly={true}
                            />
                            <Input
                                type="number"
                                label="Quantity"
                                onChange={(e) => setQty(e.target.value)}
                                value={qty}
                                required
                            />
                            <Button
                                type="submit"
                                label="Order"
                                className="w-full"
                            />
                        </div>
                    </form>
                    {
                        order ?
                            <>
                                <div className={"border-r"}/>
                                <div>
                                    <Card className="w-96 shadow-none border-2">
                                        <CardBody>
                                            <Typography variant="h5" color="black" className="mb-2 font-bold">
                                                Last Order Details
                                            </Typography>
                                            <Typography variant="h6" color="black" className="mb-2 font-bold">
                                                Book Details
                                            </Typography>
                                            <Typography variant="small" color="black" className="border-l pl-4 mb-2 font-bold">
                                                {order.book_id}
                                            </Typography>
                                            <Typography variant="small" color="blue-gray" className="border-l pl-4  mb-2">
                                                {order.title}
                                            </Typography>
                                            <Typography variant="small" color="blue-gray" className="border-l pl-4  mb-2">
                                                Rs. {order.price}
                                            </Typography>
                                            <Typography variant="h6" color="black" className="mb-2 font-bold">
                                                Order Details
                                            </Typography>
                                            <Typography variant="small" color="black" className="border-l pl-4  mb-2 font-bold">
                                                {order.order_id}
                                            </Typography>
                                            <Typography variant="small" color="blue-gray" className="border-l pl-4  mb-2">
                                                Status : {order.payment_status.toUpperCase()}
                                            </Typography>
                                            <Typography variant="small" color="blue-gray" className="border-l pl-4  mb-2">
                                                Amount : Rs. {order.payment_amount}
                                            </Typography>
                                            <Typography variant="small" color="blue-gray" className="border-l pl-4  mb-2">
                                                Qty : {order.quantity}
                                            </Typography>
                                        </CardBody>
                                    </Card>
                                </div>
                            </> :
                            null
                    }
                </div>
            </section>

            <Footer/>

        </div>

    )

}

export default Purchases