import React from "react";
import {useNavigate} from "react-router-dom";
import {
    Navbar,
    Collapse,
    Typography,
    Button,
    List,
    ListItem
} from "@material-tailwind/react";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCircleInfo,
    faHouse,
    faTag,
    faUser,
    faUserPlus,
} from '@fortawesome/free-solid-svg-icons'

import {MenuButton} from "../webcomponent"

const NavList = (props) => {

    let { active } = props;

    let navList = [
        {'icon': faHouse, 'title': "Home", 'link': "/"},
        {'icon': faCircleInfo, 'title': "About", 'link': "/About"},
        {'icon': faTag, 'title': "Pricing", 'link': "/Pricing"},
    ]

    return (
        <List className="mt-4 mb-6 p-0 lg:mt-0 lg:mb-0 lg:flex-row lg:p-1">
            {
                navList.map(({icon, title, link}, key) => (
                    <Typography
                        as="a"
                        href={link}
                        variant="small"
                        className="font-normal"
                        key={key}
                    >
                        <ListItem className="py-0 px-0 justify-center hover:!bg-transparent">
                            <div className={active === title ? "navigation active" : "navigation"}>
                                <FontAwesomeIcon icon={icon}/>
                                {title}
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

    const { active } = props;

    let navAuthentications = [
        {'icon': faUserPlus, 'title': "Sign Up", 'link': "/Signup"},
        {'icon': faUser, 'title': "Login", 'link': "/Login"},
    ]

    return (
        <>
            {
                navAuthentications.map(({icon, title, link}, key) => (
                    <Button
                        variant="text"
                        size="sm"
                        className={active === title ? "flex items-center gap-2 navigation hover:!bg-transparent active" : "flex items-center gap-2 navigation hover:!bg-transparent"}
                        key={key}
                        onClick={() => navigate(link)}
                    >
                        <FontAwesomeIcon icon={icon}/>
                        {title}
                    </Button>
                ))
            }
        </>
    );

}

const CustomNavbar = (props) => {

    const [openNav, setOpenNav] = React.useState(false);

    React.useEffect(() => {
        window.addEventListener("resize", () => window.innerWidth >= 960 && setOpenNav(false));
    }, []);

    const { active } = props;

    return (
        <Navbar className="max-w-full rounded-none px-4 py-2">
            <div className="flex items-center justify-between text-blue-gray-900">
                <img src="/assets/images/VentureVerse-Black.png" className="w-[6rem] h-[2.5rem]" alt="Logo"/>

                <div className="hidden lg:block">
                    <NavList active={active} />
                </div>
                <div className="hidden gap-2 lg:flex">
                    <NavAuthentications active={active} />
                </div>
                <MenuButton className="lg:hidden" onClick={() => setOpenNav(!openNav)}/>
            </div>
            <Collapse open={openNav}>
                <NavList active={active} />
                <div className="flex w-full flex-nowrap items-center gap-2 lg:hidden justify-center">
                    <NavAuthentications active={active} />
                </div>
            </Collapse>
        </Navbar>
    );
}

export default CustomNavbar;


