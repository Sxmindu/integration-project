import useAxiosPrivate from "../hooks/useAxiosPrivate";

const useAxiosMethods = () => {

    const axiosPrivate = useAxiosPrivate();

    const get = (url, setResponse, resources = false) => {

        let isMounted = true;
        const controller = new AbortController();

        const getRecord = async () => {
            try {
                const response = await axiosPrivate.get(url, {
                    signal: controller.signal,
                });
                isMounted && setResponse(response.data);
            } catch (err) {
                console.log(err);
            }
        }

        const getResources = async () => {
            try {
                const response = await axiosPrivate.get(url, {
                    signal: controller.signal,
                    responseType: 'blob',
                });
                isMounted && setResponse(URL.createObjectURL(response.data));
            } catch (err) {
                console.log(err);
            }
        }

        if (resources) {
            getResources().then();
        } else {
            getRecord().then();
        }

        return () => {
            isMounted = false;
            controller.abort();
        }

    }

    const post = (url, data, setResponse, images = false) => {

            let isMounted = true;
            const controller = new AbortController();

            const postRecord = async () => {
                try {
                    const response = await axiosPrivate.post(url, data, {
                        signal: controller.signal,
                    });
                    isMounted && setResponse(response.data);
                    console.log(response);

                } catch (err) {
                    console.log(err);
                }
            }

            const postImage = async () => {
                try {
                    const response = await axiosPrivate.post(url, data, {
                        signal: controller.signal,
                        headers: { 'Content-Type': 'multipart/form-data' },
                    });
                    isMounted && setResponse(response.data);
                } catch (err) {
                    console.log(err);
                }
            }

            if (images) {
                postImage().then();
            } else {
                postRecord().then();
            }

            return () => {
                isMounted = false;
                controller.abort();
            }

    }

    const put = (url, data, setResponse) => {

        let isMounted = true;
        const controller = new AbortController();

        const putRecord = async () => {
            try {
                const response = await axiosPrivate.put(url, data, {
                    signal: controller.signal,
                });
                isMounted && setResponse(response.data);
            } catch (err) {
                console.log(err);
            }
        }

        putRecord().then();

        return () => {
            isMounted = false;
            controller.abort();
        }

    }

    const del = (url, setResponse) => {

            let isMounted = true;
            const controller = new AbortController();

            const deleteRecord = async () => {
                try {
                    const response = await axiosPrivate.delete(url, {
                        signal: controller.signal,
                    });
                    isMounted && setResponse(response.data);
                } catch (err) {
                    console.log(err);
                }
            }

            deleteRecord().then();

            return () => {
                isMounted = false;
                controller.abort();
            }
    }

    return { get, post, put, del };

}

export default useAxiosMethods;