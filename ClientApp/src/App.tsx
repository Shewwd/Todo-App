import { useEffect } from "react";
import { AppContext } from "./AppContext";
import TodoList from "./components/TodoList";
import DataProvider from "./models/DataProvider";

const App = () => {

    const apiUrl = `${window.location.origin.replace(window.location.port, '8080')}/api`

    useEffect(() => {
        // Adjust layout on mount and on resize/orientation change
        AdjustLayout();
        window.addEventListener('resize', AdjustLayout);
        window.addEventListener('orientationchange', AdjustLayout);

        // Cleanup event listeners on unmount
        return () => {
            window.removeEventListener('resize', AdjustLayout);
            window.removeEventListener('orientationchange', AdjustLayout);
        };
    }, []);

    function AdjustLayout () {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);      
    }


    return (
        <AppContext.Provider value={{
            DataProvider: new DataProvider(apiUrl),
        }}>
            <TodoList />
        </AppContext.Provider>
    );
};

export default App;