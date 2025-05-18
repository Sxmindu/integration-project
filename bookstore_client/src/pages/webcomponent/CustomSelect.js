import {Select, Option} from "@material-tailwind/react";

const CustomSelect = (props) => {

    let {className = "", label, options, ...rest} = props;


    let border = "select"
    let labelColor = "select-label"

    // let labelClass;

    // if ( label === "hidden") {
    //     labelClass = "hidden"
    //     border = border + "!border-t-main-purple "
    // } else {
    //     labelClass = "peer-placeholder-shown:leading-[3.5]" + labelColor
    // }

    className = border + className

    return (
        <Select
            size="md"
            className={className}
            label={label}
            labelProps={{
                className: labelColor
            }}
            animate={{
                mount: {y: 0},
                unmount: {y: 25},
            }}
            {...rest}
        >
            {
                // check for empty
                options && options.length > 0 ?
                    options.map((option, index) => {
                        return <Option key={index} value={option.value}>{option.show}</Option>
                    }) : <Option aria-selected={true}> No Books Found </Option>
            }
        </Select>
    );

}

export default CustomSelect