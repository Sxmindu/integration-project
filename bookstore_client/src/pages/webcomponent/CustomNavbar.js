import React from "react";
import {Link, useNavigate} from "react-router-dom";
import {Navbar, Button, Typography, List, ListItem} from "@material-tailwind/react";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from '@fortawesome/free-solid-svg-icons'
import useAuth from "../../hooks/useAuth";

const NavList = (props) => {

    const {auth} = useAuth();
    let { active } = props;

    let navList = {
        'system_primary_staff': [
            {'title': "Books", 'link': "/staff/books", 'role': 'staff'},
            {'title': "Orders", 'link': "/staff/orders", 'role': 'staff'}
        ],
        'system_primary_customer': [
            {'title': "Purchase", 'link': "/customer/purchase", 'role': 'customer'}
        ]
    }

    const userNavItems = navList[auth?.role] || []

    return (
        <List className="mt-4 mb-6 p-0 lg:mt-0 lg:mb-0 lg:flex-row lg:p-1 min-w-0">
            {

                userNavItems.map(({icon, title, link}, key) => (
                    <Typography
                        variant="h5"
                        className="font-normal text-[1rem]"
                        key={key}
                    >
                        <ListItem className="py-0 px-0 justify-center hover:!bg-transparent">
                            <div className={active === title ? "navigation active" : "navigation"}>
                                <Link to={link}>{title}</Link>
                            </div>
                        </ListItem>
                    </Typography>
                ))
            }
        </List>
    );

}

const NavAuthentications = (props) => {

    const navigate = useNavigate();

    const {auth} = useAuth();

    const { active } = props;

    const client_id = process.env.REACT_APP_IS_CLIENT_ID;
    const redirect_uri = process.env.REACT_APP_IS_REDIRECT_URI;

    return (
        <>
            {
                auth?.access_token ?
                    <Button
                        variant="text"
                        size="sm"
                        className={"flex items-center gap-2 navigation hover:!bg-transparent active"}
                        key={1}
                        onClick={() => window.open(`https://is.books.com/oidc/logout?client_id=${client_id}&post_logout_redirect_uri=${redirect_uri}`, "_self")}
                    >
                        <FontAwesomeIcon icon={faUser}/>
                        Logout
                    </Button> :
                    <Button
                        variant="text"
                        size="sm"
                        className={active === "Login" ? "flex items-center gap-2 navigation hover:!bg-transparent active" : "flex items-center gap-2 navigation hover:!bg-transparent"}
                        key={1}
                        onClick={() => navigate("/login")}
                    >
                        <FontAwesomeIcon icon={faUser}/>
                        Login
                    </Button>
            }
        </>
    );

}

const CustomNavbar = (props) => {

    const { active } = props;

    return (
        <Navbar className="max-w-full rounded-none px-4 py-2">
            <div className="flex items-center justify-between text-blue-gray-900">
                <Typography variant="h1" className="text-[1.5rem] text-700 text-main-purple">
                    <Link to={`/`}>books.com</Link>
                </Typography>
                <div className="hidden lg:flex">
                    <NavList active={active} />
                </div>
                <div className="hidden gap-2 lg:flex">
                    <NavAuthentications active={active} />
                </div>
            </div>
        </Navbar>
    );
}

export default CustomNavbar;


