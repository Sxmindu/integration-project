import { useContext } from "react";
import DataContext from "../context/DataProvider.jsx";

const useData = () => {
    return useContext(DataContext);
}

export default useData;