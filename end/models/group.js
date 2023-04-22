import mongoose, { Schema } from "mongoose"

const groupSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    members: [{
        _id: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
    }],
})

export default mongoose.model("group", groupSchema)
