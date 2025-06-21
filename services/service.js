import axios from "../backendapi"
import axios2 from "axios"

export const Onboard = async () => {
    return await axios.get(`MobileOnboarding/Onboard`)
}
export const LoginUser = async (model) => {
    return await axios.post(`Account/SignIn`, model)
}
export const RegisterUser = async (model) => {
    return await axios.post(`Account/SignUp`, model)
}

export const ForgotPasswordRequest = async (email) => {
    return await axios.post(`Account/ForgotPassword/${email}`)
}

export const ResetPasswordRequest = async (payload) => {
    return await axios.post(`Account/ResetPassword`, payload)
}

export const CheckUserSyncedData = async (payload) => {
    return await axios.post(`Account/IsUserAlreadySyncedWithChurch`, payload)
}

export const ConfirmOTP = async (code, otp) => {
    return await axios.get(`Account/ConfirmOTP?token=${code}&otp=${otp}`)
}

export const SyncAndUpdateData = async (payload) => {
    return await axios.post(`Account/UpdateAndSynProfileDataV2`, payload, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

export const DeleteMobileUserAccount = async (userId) => {
    return await axios.post(`Account/CloseAndDeleteMobileAccount?mobileUserID=${userId}`)
}

export const GetUserProfile = async (personId) => {
    return await axios.get(`Account/GetSinglePersonInformation/${personId}`)
}

export const SendUserOTP = async ({ phoneNumber, email, tenantId }) => {
    return await axios.get(`Account/SendOTP?phoneNumber=${phoneNumber}&email=${email}&tenantId=${tenantId}`)
}

export const GetLookUps = async () => {
    return await axios2.get(`https://churchplusv3coreapi.azurewebsites.net/api/LookUp/GetAllLookUps`, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export const GetChurchGroups = async (tenantId) => {
    return await axios2.get(`https://churchplusv3coreapi.azurewebsites.net/public/groups?tenantId=${tenantId}`, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export const GetChurchEvents = async (tenantId) => {
    return await axios.get(`Attendance/GetEventsAttendance?TenantID=${tenantId}`)
}

export const GetAttendanceQRCode = async ({ userId, attendanceCode, tenantId }) => {
    return await axios.get(`Attendance/GenerateAttendanceQRCode?userId=${userId}&attendanceCode=${attendanceCode}&tenantId=${tenantId}`)
}

export const GetAllCustomFields = async (tenantId) => {
    return await axios.get(`https://churchplusv3coreapi.azurewebsites.net/GetAllCustomFields?entityType=${0}&tenantId=${tenantId}`)
}

// export const CheckinAttendanceByLocation = async ({person: {}, CheckInAttendanceID, CheckInChannel}) => {
//     return await axios.post(`Attendance/CheckinAttendanceByLocation`, {
//         person: {
//             ...person
//         },
//         CheckInAttendanceID,
//         CheckInChannel
//     })
// }

export const CheckinAttendanceByLocation = async (payload) => {
    return await axios2.post(`https://churchplusv3coreapi.azurewebsites.net/MarkAttendance`, payload)
}