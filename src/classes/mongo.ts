import pkg, { mongo } from 'mongoose';
const { Schema, model, connect } = pkg;

const userSchema = new Schema({
    _id: { type: String, require: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, required: true },
    password: { type: String, required: true },
    city: { type: String },
    state: { type: String },
    pinCode: { type: String },
    instagram: {},
    youtube: {}

});
const instagraSchema = new Schema({
    _id: { type: String, require: true },
    userId: { type: String, require: true },
    active: { type: String, require: true },
    story: { type: Boolean },
    reel: { type: Boolean },
    post: { type: Boolean }
});

const youtubeSchema = new Schema({
    _id: { type: String, require: true },
    userId: { type: String, require: true },
    active: { type: String, require: true },
    story: { type: Boolean },
    short: { type: Boolean },
    post: { type: Boolean }
})



const User = model('User', userSchema);
const Instagram = model('Instagram', instagraSchema);
const Youtube = model("Youtube", youtubeSchema)

export class MongoConnection {
    static async initialization(url: any) {
        try {
            await connect(url)
            return true;
        } catch (e: any) {
            console.log(e);
            return false
        }
    }
    static async addUser(data: any) {
        try {
            console.log(data)
            let user = new User(data);
            await user.save();
            return {
                success: true
            }
        }
        catch (e: any) {
            console.log(e);
            return {
                success: false,
                error: e.toString()
            }
        }
    }
    static async addInstagram(data: any) {
        try {
            console.log(data);
            let instagram = new Instagram(data);
            await instagram.save();
            return { success: true };
        } catch (e: any) {
            console.log(e);
            return {
                success: false,
                error: e.toString()
            }
        }

    }
}