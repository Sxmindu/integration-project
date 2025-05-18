import React, {useEffect, useState} from "react";
import {Alert, Button, Footer, Input, Navbar, Select} from "../webcomponent";
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
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCross, faPen, faX} from "@fortawesome/free-solid-svg-icons";
import {setActive} from "@material-tailwind/react/components/Tabs/TabsContext";


const Orders = () => {

    const {auth} = useAuth();
    const navigate  = useNavigate() ;

    const [list, setList] = useState(null);
    const [update, setUpdate] = useState({});
    const [page, setPage] = useState(1);
    const [fetch, setFetch] = useState(5);
    const [errorMsg, setErrorMsg] = useState({State: false, Type: "", Message: ""});
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [addBook, setAddBook] = useState(false);
    const [newBook, setNewBook] = useState({
        title: "",
        price: "",
        quantity: "",
    });

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
        setPrice(update.price)
        setQuantity(update.stock_quantity);
    }, [update]);

    useEffect(() => {
        const getDetails = async () => {

            try {
                let response = await axios.get(`/books?page=${page}&fetch=${fetch}&role=${auth.role}`,
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                    }
                );
                setList(response.data);
            } catch (error) {
                console.error(error);
                if (error.response?.data.code === 404) {
                    setList([])
                }
            }

        }

        getDetails().then();

    }, [page]);

    const deleteBook = (book_id) => {

        const del = async () => {

            try {
                let response = await axios.delete(`/books/${book_id}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${auth?.access_token}`
                        },
                    }
                );
                setErrorMsg({State: true, Type: "Success", Message: response.data.message});
                setPage(1);
            } catch (error) {
                console.error(error.response.data);
                if (error.response?.data.code === 404 || error.response?.data.code === 409) {
                    setErrorMsg({State: true, Type: "Error", Message: error.response.data.message});
                }
            }

        }

        del().then();
    }

    const updateBook = (book_id) => {

        const updateB = async () => {

            let data = {}

            if (update.stock_quantity !== quantity && update.price !== price) {
                data = {
                    stock_quantity: parseInt(quantity),
                    price: parseFloat(price),
                }
            } else if (update.stock_quantity !== quantity) {
                data = {
                    stock_quantity: parseInt(quantity)
                }
            } else if (update.price !== price) {
                data = {
                    price: parseFloat(price)
                }
            } else {
                return;
            }

            try {
                let response = await axios.put(`/books/${book_id}`,
                    JSON.stringify(data),
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${auth?.access_token}`
                        },
                    }
                );
                setErrorMsg({State: true, Type: "Success", Message: response.data.message});
                setPage(1);
            } catch (error) {
                console.error(error.response.data);
                if (error.response?.data.code === 404 || error.response?.data.code === 409) {
                    setErrorMsg({State: true, Type: "Error", Message: error.response.data.message});
                }
            }

        }

        updateB().then(() => setUpdate({}));
    }

    const handleSubmit = (e) => {

        e.preventDefault();

        const addOrder = async () => {

            try {
                let response = await axios.post(`/books`,
                    JSON.stringify({
                        title: newBook.title,
                        price: parseFloat(newBook.price),
                        stock_quantity: parseInt(newBook.quantity),
                    }),
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${auth?.access_token}`
                        },
                    }
                );
                setErrorMsg({State: true, Type: "Success", Message: 'Book ordered successfully'});
                setNewBook({
                    title: "",
                    price: "",
                    quantity: "",
                })
                setAddBook(false);
            } catch (error) {
                console.log(error.response.data);
                if (error.response?.data.code === 404 || error.response?.data.code === 409) {
                    setErrorMsg({State: true, Type: "Error", Message: error.response.data.message});
                }
            }

        }

        addOrder().then();
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

            <Navbar active="Books"/>

            {
                addBook === false ?
                    <>
                        <Button
                            type="button"
                            label="Add New Book"
                            onClick={() => {
                                setAddBook(true)
                            }}
                            className="absolute top-[5.4rem] right-8 w-[15rem] !bg-main-purple !border-main-purple hover:!text-white"
                        />

                        <section className="flex flex-col md:flex-row  md:space-y-0 md:space-x-16 justify-items-center md:mx-0 m-20 lg:my-[5rem]  items-center">
                            <div className=" flex flex-col justify-center items-center my-130">
                                <Alert Type={errorMsg.Type} Message={errorMsg.Message} State={errorMsg.State} />
                                {
                                    list?.Books && list?.Books.length > 0 ?
                                        <>
                                            <div className="flex flex-wrap gap-4 justify-center mb-8">
                                                {
                                                    list?.Books.map((book, index) => (
                                                        <Card className="w-96 shadow-none border-2" key={index}>
                                                            <CardBody>
                                                                <div className="flex justify-between items-center gap-2">
                                                                    <Typography variant="h6" color="black" className="mb-2 font-bold">
                                                                        Book Details
                                                                    </Typography>
                                                                    {
                                                                        update?.book_id === book.book_id ?
                                                                            <FontAwesomeIcon icon={faX} onClick={() => setUpdate({price:'', stock_quantity:''})} /> :
                                                                            <FontAwesomeIcon icon={faPen} onClick={() => setUpdate(book)} />
                                                                    }
                                                                </div>
                                                                <Typography variant="small" color="black"
                                                                            className="border-l pl-4 mb-2 font-bold">
                                                                    {book.book_id}
                                                                </Typography>
                                                                <Typography variant="small" color="blue-gray" className="border-l pl-4  mb-2">
                                                                    {book.title}
                                                                </Typography>
                                                                {
                                                                    update?.book_id === book.book_id ?
                                                                        <div className={'flex flex-col items-center gap-4'}>
                                                                            <Input
                                                                                type="text"
                                                                                label="Price"
                                                                                onChange={(e) => setPrice(e.target.value)}
                                                                                value={price}
                                                                            />
                                                                            <Input
                                                                                type="number"
                                                                                label="Quantity"
                                                                                onChange={(e) => setQuantity(e.target.value)}
                                                                                value={quantity}
                                                                                required
                                                                            />
                                                                            <Button
                                                                                type="button"
                                                                                label="Update Book"
                                                                                onClick={() => {
                                                                                    updateBook(book.book_id)
                                                                                }}
                                                                                className="w-full !bg-amber-200 !border-amber-200 hover:!text-white"
                                                                            />
                                                                        </div>
                                                                        :
                                                                        <>
                                                                            <Typography variant="small" color="blue-gray"
                                                                                        className="border-l pl-4  mb-2">
                                                                                Rs. {book.price}
                                                                            </Typography>
                                                                            <Typography variant="small" color="blue-gray"
                                                                                        className="border-l pl-4  mb-2">
                                                                                Quantity : {book.stock_quantity}
                                                                            </Typography>
                                                                            <Button
                                                                                type="button"
                                                                                label="Delete Book"
                                                                                onClick={() => {
                                                                                    deleteBook(book.book_id)
                                                                                }}
                                                                                className="w-full !bg-red-700 !border-red-700 hover:!text-white"
                                                                            />
                                                                        </>
                                                                }
                                                            </CardBody>
                                                        </Card>
                                                    ))
                                                }
                                            </div>
                                            <DefaultPagination/>
                                        </>
                                        :
                                        list?.Books ?
                                            <>
                                                <div className="flex flex-wrap gap-4 justify-center mb-8">
                                                    <Card className="w-96 shadow-none border-2">
                                                        <CardBody>
                                                            <Typography variant="h6" color="black" className="mb-2 font-bold">
                                                                Book Details
                                                            </Typography>
                                                            <Typography variant="small" color="black"
                                                                        className="border-l pl-4 mb-2 font-bold">
                                                                {list?.Books.book_id}
                                                            </Typography>
                                                            <Typography variant="small" color="blue-gray" className="border-l pl-4  mb-2">
                                                                {list?.Books.title}
                                                            </Typography>
                                                            {
                                                                update?.book_id === list?.Books.book_id ?
                                                                    <>
                                                                        <Input
                                                                            type="text"
                                                                            label="Price"
                                                                            onChange={(e) => setPrice(e.target.value)}
                                                                            value={price}
                                                                        />
                                                                        <Input
                                                                            type="number"
                                                                            label="Quantity"
                                                                            onChange={(e) => setQuantity(e.target.value)}
                                                                            value={quantity}
                                                                            required
                                                                        />
                                                                        <Button
                                                                            type="button"
                                                                            label="Update Book"
                                                                            onClick={() => {
                                                                                updateBook(list?.Books.book_id)
                                                                            }}
                                                                            className="mt-4 w-full !bg-amber-200 !border-amber-200 hover:!text-white"
                                                                        />
                                                                    </>
                                                                    :
                                                                    <>
                                                                        <Typography variant="small" color="blue-gray"
                                                                                    className="border-l pl-4  mb-2">
                                                                            Rs. {list?.Books.price}
                                                                        </Typography>
                                                                        <Typography variant="small" color="blue-gray"
                                                                                    className="border-l pl-4  mb-2">
                                                                            Quantity : {list?.Books.stock_quantity}
                                                                        </Typography>
                                                                        <Button
                                                                            type="button"
                                                                            label="Delete Book"
                                                                            onClick={() => {
                                                                                deleteBook(list?.Books.book_id)
                                                                            }}
                                                                            className="w-full !bg-red-700 !border-red-700 hover:!text-white"
                                                                        />
                                                                    </>
                                                            }
                                                        </CardBody>
                                                    </Card>
                                                </div>
                                                <DefaultPagination/>
                                            </>
                                            :
                                            <Typography variant="small" color="black" className="mb-2 font-bold">
                                                No Books Found
                                            </Typography>
                                }

                            </div>
                        </section>
                    </> :
                    <section className="flex flex-col md:flex-row  md:space-y-0 md:space-x-16 justify-items-center md:mx-0 m-20 lg:my-[5rem] h-[60vh] items-center">
                        <div className="flex flex-row gap-12 my-130">
                            <form className="mt-2 mb-2 w-80 max-w-screen-lg sm:w-96" onSubmit={handleSubmit}>
                                <Alert Type={errorMsg.Type} Message={errorMsg.Message} State={errorMsg.State} />
                                <div className="flex flex-col gap-[0.75rem] items-center">
                                    <Input
                                        type="text"
                                        label="Title"
                                        value={newBook.title}
                                        onChange={(e) => setNewBook({...newBook, title: e.target.value})}
                                        required
                                    />
                                    <Input
                                        type="text"
                                        label="Price"
                                        value={newBook.price}
                                        onChange={(e) => setNewBook({...newBook, price: e.target.value})}
                                        required
                                    />
                                    <Input
                                        type="number"
                                        label="Stock Quantity"
                                        value={newBook.quantity}
                                        onChange={(e) => setNewBook({...newBook, quantity: e.target.value})}
                                        required
                                    />
                                    <Button
                                        type="submit"
                                        label="Add Book"
                                        className="w-full"
                                    />
                                </div>
                            </form>
                        </div>
                    </section>
            }



            <Footer position={`${list?.Books && list?.Books.length > 0 ? 'absolute' : 'absolute'}`}/>

        </div>

    )

}

export default Orders