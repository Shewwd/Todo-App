import DataProvider from "./DataProvider";

export default class TodoItem {
    constructor (public ID: number, public Name: string, public Description: string) {};
    private static endpoint: string = "todoitem";

    static async CreateTodoItem(item: TodoItem, dataProvider: DataProvider): Promise<TodoItem> {
        try {
            return await dataProvider.Post<TodoItem>(this.endpoint, item);
        } catch (error) {
            throw new Error(`Error in creating TodoItem: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    static async GetTodoItems(dataProvider: DataProvider): Promise<TodoItem[]> {
        try {
            return await dataProvider.Get<TodoItem[]>(this.endpoint);
        } catch (error) {
            throw new Error(`Error in getting TodoItems: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    static async DeleteItem(id: number, dataProvider: DataProvider) {
        try {
            await dataProvider.Delete(`${this.endpoint}/${id}`);
        } catch (error) {
            throw new Error(`Error in deleting TodoItem: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}