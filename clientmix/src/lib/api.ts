import axios from "axios";

export async function getUserDetails(token : string) {

    try {
        const result = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/userdetails`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return result.data;
    } catch (error) {
        throw new Error(`Failed to fetch user details: ${error}`);
    }
}

