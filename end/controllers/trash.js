import file from "../models/file.js";

export default function TrashController() {
    return {
        getFolders: async function ({ group_id }) {
            try {
                const result = await file.find({ group_id })
                let folders = []
                for (let folder of result) {
                    for (let child of folder.children) {
                        if (child.trash) {
                            folders.push(child)
                        }
                    }
                }
                return { result: folders, status: 200 }
            } catch (e) {
                return { result: e, status: 400 }
            }
        },
        restoreFolders: async function ({ _id }) {
            try {
                const doc = await file.findOne({ _id });
                const parent = doc.parent;
                const updatedDoc = await file.findOneAndUpdate(
                    { _id: parent, "children._id": _id },
                    { $set: { "children.$.trash": false } },
                    { new: true }
                );
                return { result: updatedDoc, status: 200 };
            } catch (e) {
                return { result: e, status: 400 };
            }
        }
    }
}