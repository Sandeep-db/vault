import user from '../models/user.js'
import group from '../models/group.js'
import file from '../models/file.js'
import NodeRSA from "node-rsa"

export default function GroupController() {
    return {
        createGroup: async function ({ name, user_id, user_name }) {
            try {
                const key = new NodeRSA({ b: 2048 })
                const public_key = key.exportKey('pkcs1-public-pem')
                const private_key = key.exportKey('pkcs1-private-pem')
                const new_group = new group({ name, public_key, private_key })
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