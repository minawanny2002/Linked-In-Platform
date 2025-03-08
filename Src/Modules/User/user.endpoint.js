import { roles } from "../../Utils/eNums/enums.js"

const endPoints = {
    updateProfile : [roles.user, roles.admin, roles.superAdmin],
    profile:[roles.user, roles.admin, roles.superAdmin],
    getAnotherProfile:[roles.user, roles.admin, roles.superAdmin],
    updatePassword:[roles.user, roles.admin, roles.superAdmin],
    uploadProfilePicture:[roles.user, roles.admin, roles.superAdmin],
    uploadCoverPicture:[roles.user, roles.admin, roles.superAdmin],
    deleteProfilePicture:[roles.user, roles.admin, roles.superAdmin],
    deleteCoverPicture:[roles.user, roles.admin, roles.superAdmin],
    softDeleteAccount:[roles.user, roles.admin, roles.superAdmin]
}

export default endPoints