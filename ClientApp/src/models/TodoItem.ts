import { UniqueIdentifier } from "@dnd-kit/core";
import { ReactNode } from "react";

interface TodoItem {
    listName: UniqueIdentifier,
    element: ReactNode
};

export default TodoItem;