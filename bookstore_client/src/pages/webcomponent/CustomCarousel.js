import {Carousel} from "@material-tailwind/react";

const CustomCarousel = (props) => {

    const {children, navigationActive="main-purple", navigationInactive="light-purple", ...rest} = props;
    return (
        <Carousel
            autoplay={true}
            autoplayspeed={5000}
            loop={true}
            className="rounded-xl overflow-hidden"
            navigation={({setActiveIndex, activeIndex, length}) => (
                <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
                    {new Array(length).fill("").map((_, i) => (
                        <span
                            key={i}
                            className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${
                                activeIndex === i ? `bg-${navigationActive} w-8` : `bg-${navigationInactive} w-4`
                            }`}
                            onClick={() => setActiveIndex(i)}
                        />
                    ))}
                </div>
            )}
            {...rest}
        >
            {children}
        </Carousel>
    )
}

export default CustomCarousel;