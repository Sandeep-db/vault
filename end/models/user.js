import mongoose, { Schema } from "mongoose"

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^[a-zA-z0-9\.]{2,50}@gmail.com$/.test(v)
            },
        },
    },
    name: {
        type: String,
        required: true,
    },
    passwd: {
        type: String,
        required: true,
    },
    picture: {
        type: String,
        default: ''
    },
    date: {
        type: Date,
        default: Date.now,
    },
    groups: {
        type: [{
            name: {
                type: String,
                required: true,
            },
            group_id: {
                type: Schema.Types.ObjectId,
                required: true,
            },
        }],
        default: []
    }
})

userSchema.index({ email: 1 }, { unique: true })

export default mongoose.model("user", userSchema)
