import user from '../models/user.js'
import group from '../models/group.js'
import file from '../models/file.js'

export default function GroupController() {
    return {
        createGroup: async function ({ name, user_id, user_name }) {
            try {
                const new_group = new group({ name })
                const group_info = await new_group.save()
                const up_group = await group.updateOne({ _id: group_info._id }, {
                    $push: {
                        members: {
                            name: user_name,
                            _id: user_id,
                        }
                    }
                })
                const result = await user.updateOne({ _id: user_id }, {
                    $push: {
                        groups: {
                            name: name,
                            group_id: group_info._id
                        }
                    }
                })
                const root_dir = new file({
                    group_id: group_info._id,
                    name: name,
                    directory: true,
                    location: '/'
                })
                const root = await root_dir.save()
                await file.updateOne({ group_id: group_info._id, }, { parent: root._id })
                return { result: root, status: 200 }
            } catch (e) {
                return { result: e, status: 400 }
            }
        }
    }
}