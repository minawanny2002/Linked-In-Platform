import { roles } from "../../Utils/eNums/enums.js";

const endPoints = {
    addCompany:[roles.user, roles.admin, roles.superAdmin],
    updateCompany:[roles.user, roles.admin, roles.superAdmin],
    softDeleteCompany:[roles.user, roles.admin],
    companyWithJobs:[roles.user,roles.admin,roles.superAdmin],
    searchCompanies:[roles.user, roles.admin,roles.superAdmin],
    uploadLogo:[roles.user, roles.admin, roles.superAdmin],
    uploadCoverPicture:[roles.user, roles.admin, roles.superAdmin],
    deleteLogo:[roles.user, roles.admin, roles.superAdmin],
    deleteCoverPicture:[roles.user, roles.admin, roles.superAdmin],



}
export default endPoints