import axios from "../backendapi"

export const GetAllMedia = async (tenantId) => {
    return await axios.get(`MobileMedia/GetAllMedia?TenantID=${tenantId}`)
}

export const GetAllAudios = async (tenantId) => {
    return await axios.get(`MobileMedia/GetAllAudioProducts?TenantID=${tenantId}`)
}

export const GetSingleMedia = async (mediaId, tenantId) => {
    return await axios.get(`MobileMedia/GetMediaById?mediaId=${mediaId}&TenantID=${tenantId}`)
}