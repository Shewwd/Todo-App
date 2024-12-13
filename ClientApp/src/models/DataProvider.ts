export default class DataProvider {

    constructor(public baseUrl: string) {};

    public async Post<T>(endpoint: string, data: T): Promise<T> {
        try {
            const requestUrl = `${this.baseUrl}/${endpoint}`;
            const requestOptions: RequestInit = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            };

            const response = await fetch(requestUrl, requestOptions);
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
            const requestUrl = `${this.baseUrl}/${endpoint}`;

            const response = await fetch(requestUrl);
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
            const requestUrl = `${this.baseUrl}/${endpoint}`;
            const requestOptions: RequestInit = {
                method: "DELETE"
            };

            const response = await fetch(requestUrl, requestOptions);
            if (!response.ok) {
                throw new Error(`Error in Delete Call - Response: ${response}`);
            }
            return true;
        } catch(error) {
            throw new Error(error instanceof Error ? error.message : `Unknown error occurred: ${error}`);
        }
    }
}