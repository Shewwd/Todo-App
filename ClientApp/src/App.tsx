import TodoList from "./components/TodoList";
import DataProvider from "./models/DataProvider";
import { AppContext } from "./AppContext";

const App = () => {

    const appContextValue = {
        DataProvider: new DataProvider("http://localhost:8080"),
    }

    return (
        <AppContext.Provider value={appContextValue}>
            <TodoList />
        </AppContext.Provider>
    );
};

export default App;