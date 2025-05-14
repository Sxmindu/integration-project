import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons'
const CustomButton = (Object) => {

    let { variant, className, label, icon, children, ...rest } = Object

    const styles = {
        main: "flex flex-row py-2 px-10 items-center justify-center gap-[0.5rem] self-stretch text-[0.8rem] transition duration-500 ease-in-out disabled:opacity-50 ",
        colors: {
            primary: "text-white bg-main-purple hover:bg-white hover:text-main-purple disabled:text-white disabled:hover:bg-main-purple disabled:hover:text-white ",
            clear: "bg-transparent text-main-purple hover:bg-main-purple hover:text-white disabled:text-main-purple disabled:hover:bg-white disabled:hover:text-main-purple ",
        },
        border: {
            normal: "rounded-lg border border-main-purple ",
            oval: "rounded-[2.5rem] border border-main-purple ",
        }
    }

    switch (variant) {
        case "primary":
            className = styles.main + styles.colors.primary + styles.border.normal + className
            break;
        case "clear":
            className = styles.main + styles.colors.clear + styles.border.normal + className
            break;
        case "oval":
            className = styles.main + styles.colors.primary + styles.border.oval + className
            break;
        default:
            className = styles.main + styles.colors.primary + styles.border.normal + className
    }

    return (

        icon === "next"
            ? <button className={className} {...rest}>{children ? children : label }<FontAwesomeIcon icon={faAngleRight} /></button>
            : icon === "previous"
                ? <button className={className} {...rest}><FontAwesomeIcon icon={faAngleLeft} />{children ? children : label }</button>
                : <button className={className} {...rest}>{children ? children : label }</button>

    )

}

export default CustomButton;
