import { roles } from "../../Utils/eNums/enums.js";

const endPoints = {
    addJob:[roles.user],
    updateJob:[roles.user],
    deleteJob:[roles.user],
    searchJobsForACompany:[roles.user],
    jobsFilter:[roles.user],
    applyToJob :[roles.user],
    getApplications :[roles.user],
    acceptRejectApp :[roles.user]


}
export default endPoints