import {createApiRequest} from "./index";


export const uploadfile = (data) => {
    return createApiRequest({
        url: `/wortwhile/uploadfile`,
        data: {data},
        method: 'post'
    })
}
export const getTime = (data) => {
    return createApiRequest({
        url: `/time`,
        data: {},
        method: 'get'
    })
}

export const wortwhile = (data) => {
    return createApiRequest({
        url: `/wortwhile`,
        data: {data},
        method: 'post'
    })
}
export const combine_results_api = (data) => {
    return createApiRequest({
        url: `/combine_results`,
        data: {data},
        method: 'post'
    })
}