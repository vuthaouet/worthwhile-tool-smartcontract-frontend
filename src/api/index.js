import axios from 'axios'
const baseUrl = "http://localhost:5000";
export const createApiRequest = async ({url, method, data, params}) => {
    try {
        const {data: resp} = await axios({
            method,
            url: `${baseUrl}${url}`,
            data,
            params,
        })

        return {
            success: true,
            data: resp,
        }
    } catch (e) {
        const {response} = e
        const message = response ? response.statusText : e.message || e
        const data = response ? response.data : ''
        return {
            success: false,
            message,
            data
        }
    }
}