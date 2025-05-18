const CustomFooter = (props) => {

    let {position} = props;

    if (!position) {
        position = "absolute";
    }

    return (
        <div className={`w-full bg-[#008000] ${position} bottom-0`}>
            <div className="flex justify-center items-center">
                <section className="flex flex-col justify-center items-center md:px-16 px-6 w-full">
                    <div className="w-full flex md:flex-row flex-col justify-center items-center md:py-[1rem] py-6 ">
                        <p className="font-[700] text-[0.75rem] leading-[1.5rem] tracking-[0.2px] text-white">
                            Copyright Ⓒ 2025 Books.com. All Rights Reserved.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}


export default CustomFooter;