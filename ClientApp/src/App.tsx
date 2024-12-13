import TodoList from "./components/TodoList";
import DataProvider from "./models/DataProvider";
import { AppContext } from "./AppContext";

const App = () => {

    return (
        <AppContext.Provider value={{
            DataProvider: new DataProvider("http://localhost:8080"),
        }}>
            <TodoList />
        </AppContext.Provider>
    );
};

export default App;