export default class DataProvider {

    constructor(public baseURL: string) {};

    public async Post<T>(endpoint: string, data: T): Promise<T> {
        try {
            const response = await fetch(`${this.baseURL}/${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error(`Error in Post Call - Response: ${response}`);
            }

            const responseData: T = await response.json();
            return responseData;
        } catch(error) {
            throw new Error(error instanceof Error ? error.message : `Unknown error occurred: ${error}`);
        }        
    }

    public async Get<T>(endpoint: string): Promise<T> {
        try {
            const response = await fetch(`${this.baseURL}/${endpoint}`);
            if (!response.ok) {
                throw new Error(`Error in Get Call - Response: ${response}`);
            }

            const responseData: T = await response.json();
            return responseData;
        } catch(error) {
            throw new Error(error instanceof Error ? error.message : `Unknown error occurred: ${error}`);
        }
    }

    public async Delete(endpoint: string): Promise<boolean> {
        try {
            const response = await fetch(`${this.baseURL}/${endpoint}`, {
                method: "DELETE"
            });
            if (!response.ok) {
                throw new Error(`Error in Delete Call - Response: ${response}`);
            }
            return true;
        } catch(error) {
            throw new Error(error instanceof Error ? error.message : `Unknown error occurred: ${error}`);
        }
    }
}