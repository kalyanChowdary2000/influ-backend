import { rmSync } from 'fs';
import pkg, { mongo } from 'mongoose';
const { Schema, model, connect } = pkg;

const userSchema = new Schema({
    _id: { type: String, require: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, required: true },
    password: { type: String, required: true },
    gender: { type: String, required: true },
    dob: { type: String, required: true },
    city: { type: String },
    state: { type: String },
    pinCode: { type: String },
    imageLink: { type: String },
    category:{},
    instagram: {},
    youtube: {},

});
const addSchema = new Schema({
    _id: { type: String, require: true },
    tittle: { type: String, required: true },
    description: { type: String, required: true },
    socialMediaLinks: {},
    category: {},
    status: {},
    influencersList: {}
});
const instagraSchema = new Schema({
    _id: { type: String, require: true },
    userId: { type: String, require: true },
    followerCount:{},
    engagementRate:{},
    reach:{},
    active: { },
    story: { type: Boolean },
    reel: { type: Boolean },
    post: { type: Boolean }
});

const youtubeSchema = new Schema({
    _id: { type: String, require: true },
    userId: { type: String, require: true },
    followerCount:{},
    engagementRate:{},
    customUrl:{},
    reach:{},
    active: { },
    story: { type: Boolean },
    short: { type: Boolean },
    post: { type: Boolean }
})



const User = model('User', userSchema);
const Instagram = model('Instagram', instagraSchema);
const Youtube = model("Youtube", youtubeSchema);
const Add = model('Add', addSchema);
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
    static async editUser(find: any, update: any) {
        try {
            console.log(find, update)
            await User.findByIdAndUpdate(find, update);
            let response: any = await User.findById(find);
            return response;
        }
        catch (e: any) {
            console.log(e);
            return {
                success: false,
                error: e.toString()
            }
        }
    }
    static async findUser(data: any) {
        try {
            let res = await User.find(data);
            return {
                success: true,
                data: res
            }
        } catch (e: any) {
            console.log(e);
            return {
                success: false,
                error: e.toString()
            }
        }
    }
    static async findAllUsers() {
        try {
            let res = await User.find();
            return {
                success: true,
                data: res
            }
        } catch (e: any) {
            console.log(e);
            return {
                success: false,
                error: e.toString()
            }
        }
    }
    static async addAdd(data: any) {
        try {
            console.log(data);
            let add = new Add(data);
            await add.save();
            return { success: true };
        } catch (e: any) {
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
    static async fetchInstagram(instagramId: any) {
        try {
            console.log(instagramId);
            let instagramData = await Instagram.findById(instagramId);
            return { success: true,data:instagramData };
        } catch (e: any) {
            console.log(e);
            return {
                success: false,
                error: e.toString()
            }
        }

    }
    static async fetchAllInstagram(){
        try {
            let instagramData = await Instagram.find();
            return { success: true,data:instagramData };
        } catch (e: any) {
            console.log(e);
            return {
                success: false,
                error: e.toString()
            }
        }
    }
    static async addYoutube(data: any) {
        try {
            console.log(data);
            let youtube = new Youtube(data);
            await youtube.save();
            return { success: true };
        } catch (e: any) {
            console.log(e);
            return {
                success: false,
                error: e.toString()
            }
        }

    }
    static async fetchYoutube(channelId: any) {
        try {
            console.log("channel Id is",channelId)
            let youtubeData = await Youtube.findById(channelId);
            return { success: true,data:youtubeData };
        } catch (e: any) {
            console.log(e);
            return {
                success: false,
                error: e.toString()
            }
        }

    }
    static async fetchAllYoutube() {
        try {
            
            let youtubeData = await Youtube.find();
            return { success: true,data:youtubeData };
        } catch (e: any) {
            console.log(e);
            return {
                success: false,
                error: e.toString()
            }
        }

    }
}