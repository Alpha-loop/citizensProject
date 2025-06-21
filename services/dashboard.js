import axios from "../backendapi";
import axiosHttp from "axios";


const YouTubeApiKey = "AIzaSyBF2eu05KOwIebR41kdhLZoTWw2L2sifF8"

export const ChurchFeeds = async (tenantId, userId) => {
    const userIdParams = userId ? `&&userId=${userId}` : ""
    try {
        return await axios.get(`MobileOnboarding/GetChurchFeed?TenantId=${tenantId}${userIdParams}`)
    } catch (error) {
        return error
    }
}

export const SingleChurchFeeds = async (postId, tenantId) => {
    try {
        return await axios.get(`MobileOnboarding/GetFeedById?postId=${postId}&TenantId=${tenantId}`)
    } catch (error) {
        return error
    }
}

export const ChurchProfile = async (tenantId) => {
    try {
        return await axios.get(`MobileOnboarding/GetChurchMobile?TenantId=${tenantId}`)
    } catch (error) {
        return error
    }
}

export const YouTubeChannelVideoIds = async (channelId) => {
    try {
        return await axiosHttp.get(`https://www.googleapis.com/youtube/v3/search?part=id&order=date&maxResults=30&channelId=${channelId}&key=${YouTubeApiKey}`)
    } catch (error) {
        return error
    }
}

export const YouTubeChannelVideoDetails = async (videoIds) => {
    try {
        return await axiosHttp.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoIds.join(",")}&key=${YouTubeApiKey}`)
    } catch (error) {
        return error
    }
}

export const GetAllCelebrants = async (tenantId) => {
    try {
        return await axios.get(`MobileOnboarding/GetCelebrations?TenantId=${tenantId}`)
    } catch (error) {
        return error
    }
}