import axios from "../backendapi";

export const PersonPledges = async (personId, tenantId) => {
    return await axios.get(`PaymentForm/GetPledgesByPerson?personId=${personId}&tenantId=${tenantId}`)
}

export const SinglePledge = async (pledgeId, tenantId) => {
    return await axios.get(`PaymentForm/GetPledgeByID?pledgeId=${pledgeId}&tenantId=${tenantId}`)
}