import user from '../models/user.js'
import group from '../models/group.js'
import file from '../models/file.js'


export default function GroupController() {
    return {
        
        addMember: async function ({ group_id, user_email, user_name }) {
            try {
                const cur_user = await user.findOne({ email: user_email })
                const user_id = cur_user._id
                const result = await group.updateOne({ _id: group_id }, {
                    $push: {
                        members: {
                            name: user_name,
                            _id: user_id,
                        }
                    }
                })
                console.log("result", result)
                const result2 = await user.updateOne({ _id: user_id }, {
                    $push: {
                        groups: {
                            name: user_name,
                            group_id: group_id
                        }
                    }
                })
                console.log("result2", result2)
                return { result: cur_user, status: 200 }
            } catch (e) {
                console.log("error")
                return { result: e, status: 400 }
            }
        },
        getGroup: async function ({ group_id }) {
            try {
                const result = await group.findOne({ _id: group_id })
                return { result: result, status: 200 }
            } catch (e) {
                return { result: e, status: 400 }
            }
        }
    }
}
