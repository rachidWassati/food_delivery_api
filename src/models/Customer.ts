import mongoose, { Document, Schema } from "mongoose";
import { OrderDoc } from "./Order";

interface CustomerDoc extends Document {
    email: string;
    password: string;
    salt: string;
    firstname: string;
    lastname: string;
    address: string;
    phone: string;
    verified: boolean;
    otp: number;
    otp_expiry: Date;
    lat: number;
    long: number;
    cart: [any];
    orders: [OrderDoc]
}

const CustomerSchema = new Schema<CustomerDoc>({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    salt: {type: String, required: true},
    firstname: {type: String},
    lastname: {type: String},
    address: {type: String},
    phone: {type: String, required: true},
    verified: {type: Boolean, required: true},
    otp: {type: Number, required: true},
    otp_expiry: {type: Date, required: true},
    lat: {type: Number},
    long: {type: Number},
    cart: [
        {
            food: {type: Schema.Types.ObjectId, ref: 'food', required: true},
            unit: {type: Number, required: true}
        }
    ],
    orders: {type: [Schema.Types.ObjectId], ref: 'order', default: []}
}, {
    toJSON: {
        transform(doc, ret, options) {
            delete ret.password;
            delete ret.salt;
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
        },
    },
    timestamps: true
})

const Customer = mongoose.model('customer', CustomerSchema)

export {Customer}