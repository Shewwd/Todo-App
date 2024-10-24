import { useState } from "react";
import Board from "./components/Board";

const App = () => {
    const [numItems, setNumItems] = useState(1);

    return (
        <Board class="d-flex flex-direction-row h-100" numItems={numItems} setNumItems={(num: number) => setNumItems(num)}/>
    );
};

export default App;