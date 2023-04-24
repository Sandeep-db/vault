import file from "../models/file.js";

export default function SearchController() {
    return {
        searchFiles: async function ({ group_id, file_name }) {
            try {
                const regex = new RegExp(`^${file_name}*`)
                const result = await file.find({ group_id, name: { $regex: regex } }).limit(10)
                return { result, status: 200 }
            } catch (e) {
                return { result: e, status: 400 }
            }
        }
    }
}