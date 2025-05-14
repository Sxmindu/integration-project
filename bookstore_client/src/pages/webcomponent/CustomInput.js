import { Input } from "@material-tailwind/react";

const CustomInput = (props) => {

    let { type, label, state = "", className = "", ...rest } = props;

    let border, labelColor;

    if (state.State === "Valid" || state.State === "" || state === "") {
        border = "focus:border-main-purple "
        labelColor = " peer-focus:!text-main-purple peer-focus:before:!border-main-purple peer-focus:after:!border-main-purple  "
    } else if (state.State === "Invalid") {
        border = "focus:border-error-red "
        labelColor = " peer-focus:!text-error-red peer-focus:before:!border-error-red peer-focus:after:!border-error-red  "
        label = state.Message
    } else if (state.State === "Success") {
        border = "focus:border-success-green "
        labelColor = " peer-focus:!text-success-green peer-focus:before:!border-success-green peer-focus:after:!border-success-green  "
        label = state.Message || label
    }

    let labelClass;

    if ( label === "hidden") {
        labelClass = "hidden"
        border = border + "focus:border-t-main-purple "
    } else {
        labelClass = "text-gray peer-placeholder-shown:leading-[3.5]" + labelColor + className
    }

    className = border + className

    return (
        <Input
            type={type}
            size="md"
            className={className}
            autoComplete="off"
            label={label}
            labelProps={{
                className: labelClass
            }}
            {...rest}
        />
    )

}

export default CustomInput