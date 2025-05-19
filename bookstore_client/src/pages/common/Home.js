import React, {useEffect, useState} from "react";
import {Alert, Button, Footer, Navbar} from "../webcomponent";
import {
    Card,
    CardBody,
    IconButton,
    Typography,
} from "@material-tailwind/react";
import {Link, useNavigate} from "react-router-dom";
import axios from "../../api/axios";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import useAuth from "../../hooks/useAuth";


const Home = () => {

    const {auth, setAuth} = useAuth();

    const [list, setList] = useState(null);
    const [page, setPage] = useState(1);
    const [fetch, setFetch] = useState(5);

    useEffect(() => {
        console.log(auth)
        const getDetails = async () => {

            try {
                let response = await axios.get(`/books?page=${page}&fetch=${fetch}`,
                    {
                        headers: {'Content-Type': 'application/json'},
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

    const navigate  = useNavigate() ;

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

            <Navbar active="Home"/>

            <section className="flex flex-col md:flex-row  md:space-y-0 md:space-x-16 justify-items-center md:mx-0 m-20 lg:my-[5rem] h-[60vh] items-center">
                <div className="my-130">
                    <Card color="transparent" className="items-center" shadow={false}>
                        <Typography variant="h1" className="text-[6rem] text-700 text-main-purple">
                            Welcome {auth.username ? auth.username : ""}!
                        </Typography>
                        {
                            auth?.role === "system_primary_staff" ?
                                <>
                                    <div className="flex flex-wrap gap-4 justify-center items-center mb-8">
                                        <Link to={'/staff/books'}>
                                            <Card className="w-96 shadow-none border-2 text-center">
                                                <CardBody>
                                                    <Typography variant="h5" color="blue-gray">
                                                        Books
                                                    </Typography>
                                                </CardBody>
                                            </Card>
                                        </Link>
                                        <Link to={'/staff/orders'}>
                                            <Card className="w-96 shadow-none border-2 text-center">
                                                <CardBody>
                                                    <Typography variant="h5" color="blue-gray">
                                                        Orders
                                                    </Typography>
                                                </CardBody>
                                            </Card>
                                        </Link>
                                    </div>
                                </> :
                                <>
                                    {
                                        list?.Books && list?.Books.length > 0 ?
                                            <>
                                                <div className="flex flex-wrap gap-4 justify-center mb-8">
                                                    {
                                                        list?.Books.map((book, index) => (
                                                            <Card className="w-96 shadow-none border-2" key={index}>
                                                                <CardBody>
                                                                    <Typography variant="small" color="black" className="mb-2 font-bold">
                                                                        {book.book_id}
                                                                    </Typography>
                                                                    <Typography variant="h5" color="blue-gray" className="mb-2">
                                                                        {book.title}
                                                                    </Typography>
                                                                    <Typography variant="small" color="blue-gray" className="italic mb-2">
                                                                        Rs. {book.price}
                                                                    </Typography>
                                                                    <Typography className={book.availability === "In Stock" ? "text-green-500 font-medium" : "text-error-red font-medium"}>
                                                                        {book.availability}
                                                                    </Typography>
                                                                </CardBody>
                                                            </Card>
                                                        ))
                                                    }
                                                </div>

                                                <DefaultPagination/>
                                            </> :
                                            <Typography variant="small" color="black" className="mb-2 font-bold">
                                                No Books Found
                                            </Typography>
                                    }
                                </>
                        }

                    </Card>
                </div>
            </section>

            <Footer/>

        </div>

    )

}

export default Home