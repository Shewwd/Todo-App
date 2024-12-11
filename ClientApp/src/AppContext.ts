import { createContext } from "react";
import DataProvider from "./models/DataProvider";

export const AppContext = createContext<{
    DataProvider: DataProvider,
}>({
    DataProvider: {} as DataProvider,
})