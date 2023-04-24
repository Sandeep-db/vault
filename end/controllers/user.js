import user from "../models/user.js"
import file from "../models/file.js"

export default function UserController() {
    return {
        login: async function ({ email, passwd }) {
            try {
                const result = await user.findOne({ email, passwd })
                return result
            } catch (e) {
                return { ...e, errno: 404 }
            }
        },
        createUser: async function ({ email, name, passwd }) {
            try {
                const new_user = new user({ email, name, passwd })
                const result = await new_user.save()
                const root_dir = new file({
                    group_id: result._id,
                    name: 'Home',
                    directory: true,
                    location: '/'
                })
                const root = await root_dir.save()
                await file.updateOne({
                    group_id: result._id,
                }, { parent: root._id })
                return { result, status: 200 }
            } catch (e) {
                return { result: e, status: 400 }
            }
        },
        getfiles: async function ({ group_id, location }) {
            try {
                const result = await file.findOne({ group_id, location })
                return { result, status: 200 }
            } catch (e) {
                return { result: e, status: 400 }
            }
        },
        createFolder: async function ({ group_id, location, parent, folder_name, directory, link }) {
            try {
                const new_folder = new file({
                    group_id, folder_name, parent,
                    name: folder_name, directory: directory,
                    location: location + folder_name + '/',
                    link: link
                })
                let result = await new_folder.save()
                await file.updateOne({ group_id, _id: parent }, {
                    $push: {
                        children: {
                            _id: result._id,
                            name: result.name,
                            folder: (link ? false : true)
                        }
                    }
                })
                return { result, status: 200 }
            } catch (e) {
                return { result: e, status: 400 }
            }
        },
        updateProfile: async function ({ _id, name, email, passwd }) {
            const updateFields = {}
            if (email) {
                updateFields.email = email
            }
            if (name) {
                updateFields.name = name
            }
            if (passwd) {
                updateFields.passwd = passwd
            }
            console.log(updateFields)
            let result = await user.findOneAndUpdate({ _id }, updateFields, { new: true })
            return { result, status: 200 }
        },
        getUserGroups: async function ({ user_id }) {
            try {
                const user_groups = await user.findOne({ _id: user_id }, { groups: 1 })
                const result = user_groups.groups
                return { result, status: 200 }
            } catch (e) {
                return { result: e, status: 400 }
            }
        },

        delete: async function ({ _id }) {
            try {
                const doc = await file.findOne({ _id });
                const parent = doc.parent;
                const updatedDoc = await file.findOneAndUpdate(
                    { _id: parent, "children._id": _id },
                    { $set: { "children.$.trash": true } },
                    { new: true }
                );
                return { result: updatedDoc, status: 200 };
            } catch (e) {
                return { result: e, status: 400 };
            }
        }
    }
}
