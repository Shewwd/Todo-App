import { useState } from "react";
import Board from "./components/Board";

const App = () => {
    const [numItems, setNumItems] = useState(1);

    return (
        <Board numItems={numItems} setNumItems={(num: number) => setNumItems(num)}/>
    );
};

export default App;