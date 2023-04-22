import mongoose, { Schema } from "mongoose"

const groupSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    }],
})

export default mongoose.model("group", groupSchema)
