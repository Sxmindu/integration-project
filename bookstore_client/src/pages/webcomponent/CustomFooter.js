// import styles from "../style";
// import { logo } from "../assets";
// import { footerLinks } from "../constants";
// import { socialMedia } from "../constants";


import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import {faFacebook, faInstagram, faTwitter} from "@fortawesome/free-brands-svg-icons";
import {Link} from "react-router-dom";

const CustomFooter = () => {

    const footerLinks = [
        {
            title: "Company info",
            links: [
                {
                    name: "About Us",
                    link: "/About",
                },
                {
                    name: "We are hiring",
                    link: "#",
                },
                {
                    name: "Blog",
                    link: "#"
                },

            ],
        },
        {
            title: "Features",
            links: [
                {
                    name: "Business Marketing",
                    link: "#",
                },
                {
                    name: "User Analytic",
                    link: "#",
                },
                {
                    name: "Live Chat",
                    link: "#",
                },
                {
                    name: "Unlimited Support",
                    link: "#",
                },
            ],
        },
    ];

    const socialMedia = [
        {
            id: "social-media-1",
            icon: faFacebook,
            link: "https://www.instagram.com/",
        },
        {
            id: "social-media-2",
            icon: faInstagram,
            link: "https://www.facebook.com/",
        },
        {
            id: "social-media-3",
            icon: faTwitter,
            link: "https://www.twitter.com/",
        }
    ];

    return (
        <div className="w-full bg-[#494D5F]">
            <div className="flex justify-center items-center">
                <section className="flex flex-col justify-center items-center md:px-16 px-6 w-full">
                    <div className="flex justify-center items-start md:flex-row flex-col md:py-[4rem] py-6 w-full">
                        <div className="flex-[1.5] w-full flex flex-col justify-around flex-wrap lg:flex-row md:mt-0 mt-10">
                            <div key="Get In Touch" className={`flex flex-col gap-[1rem] ss:my-0 my-4 min-w-[150px]`}>
                                <h4 className="font-[700] text-[1.5rem] leading-[2rem] tracking-[0.1px] text-white">
                                    Get In Touch
                                </h4>
                                <ul className="list-none w-auto">
                                    <li className={`font-[400] text-[0.875rem] leading-[1.5rem] tracking-[0.2px] text-light-purple hover:text-secondary cursor-pointer`}>
                                        Join our community and keep in touch with the latest updates.
                                    </li>
                                </ul>
                                <div className="flex flex-row gap-[1.5rem]">
                                    {
                                        socialMedia.map((social, index) => (
                                            <FontAwesomeIcon
                                                icon={social.icon}
                                                className={`w-[1.5rem] h-[1.5rem] text-white object-contain cursor-pointer `}
                                                key={social.id}
                                                onClick={() => window.open(social.link)}
                                            />
                                        ))
                                    }
                                </div>
                            </div>
                            {
                                footerLinks.map((footerLink) => (
                                    <div key={footerLink.title}
                                         className={`flex flex-col gap-[1rem] ss:my-0 my-4 min-w-[150px]`}>
                                        <h4 className="font-[700] text-[1.5rem] leading-[2rem] tracking-[0.1px] text-white">
                                            {footerLink.title}
                                        </h4>
                                        <ul className="list-none flex flex-col gap-[1rem]">
                                            {footerLink.links.map((link, index) => (
                                                <li
                                                    key={link.name}
                                                    className={`font-[700] text-[0.875rem] leading-[1.5rem] tracking-[0.2px] text-light-purple hover:text-secondary cursor-pointer`}
                                                >
                                                    {link.link !== "#" && <Link to={link.link}>{link.name}</Link>}
                                                    {link.link === "#" && <span>{link.name}</span>}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    <div className="w-full flex md:flex-row flex-col justify-center items-center md:py-[1rem] py-6 ">
                        <p className="font-[700] text-[0.75rem] leading-[1.5rem] tracking-[0.2px] text-white">
                            Copyright Ⓒ 2023 VentureVerse. All Rights Reserved.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}


export default CustomFooter;