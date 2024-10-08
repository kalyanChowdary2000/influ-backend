import { rmSync } from 'fs';
import pkg, { mongo } from 'mongoose';
const { Schema, model, connect } = pkg;

const userSchema = new Schema({
    _id: { type: String, require: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, required: true },
    password: { type: String, required: true },
    walletMoney: {},
    address: {},
    active:{type:Boolean,required:true},
    gender: { type: String },
    dob: { type: String },
    city: { type: String },
    state: { type: String },
    pinCode: { type: String },
    imageLink: { type: String },
    category: {},
    instagram: {},
    youtube: {},
    designaiton: {},
    accountNumber: {},
    ifscCode: {},
    branch: {},
    bankName: {},
    accountHolderName: {},
});
const transactionSchema = new Schema({
    _id: { type: String, required: true },
    amount: { type: String, required: true },
    userId: { type: String, required: true },
    createTime: { type: String, required: true },
    isDeposit: { type: Boolean, required: true },
    status: { type: Boolean, required: true },
    accountHolderName: { type: String },   // Added field
    accountNumber: { type: String },       // Added field
    ifscCode: { type: String },            // Added field
    branch: { type: String },              // Added field
    bankName: { type: String },   
});
const testAddSchema = new Schema({
    _id: { type: String, require: true },
    tittle: { type: String, required: true },
    description: { type: String, required: true },
    active: {},
    createdTime: {},
    category: {},
    companyUserId: { type: String, required: true },
    instaFlag: {},
    ytFlag: {}
});
const addSchema = new Schema({
    _id: { type: String, require: true },
    tittle: { type: String, required: true },
    description: { type: String, required: true },
    socialMediaLinks: {},
    createdTime: {},
    category: {},
    status: {},
    tagPeopleList: {},
    approveStatus: {},
    companyUserId: { type: String, required: true },
    influencersList: {},
    instaFlag: {},
    ytFlag: {}
});
const comAddSchema = new Schema({
    _id: { type: String, require: true },
    addId: { type: String, require: true },
    addData: {},
    active: { type: Boolean, require: true },
    influId: { type: String, require: true },
    instaFlag: { type: Boolean, require: true },
    ytFlag: { type: Boolean, require: true },
    ytPostLink: { type: String, require: true },
    instaPostLink: { type: String, require: true },
    instagram: {},
    youtube: {},
    instaData: {},
    ytData: {}
});
const instagraSchema = new Schema({
    _id: { type: String, require: true },
    userId: { type: String, require: true },
    followerCount: {},
    engagementRate: {},
    reach: {},
    active: {},
    story: { type: Boolean },
    reel: { type: Boolean },
    post: { type: Boolean }
});

const youtubeSchema = new Schema({
    _id: { type: String, require: true },
    userId: { type: String, require: true },
    followerCount: {},
    engagementRate: {},
    customUrl: {},
    reach: {},
    active: {},
    story: { type: Boolean },
    short: { type: Boolean },
    post: { type: Boolean }
})

const contactSchema = new Schema({
    _id: { type: String, require: true },
    queryTittle: { type: String, require: true },
    queryContent: { type: String, require: true },
    contactDetails: { type: String, require: true },
    active: {}
});


const User = model('User', userSchema);
const Instagram = model('Instagram', instagraSchema);
const Youtube = model("Youtube", youtubeSchema);
const Add = model('Add', addSchema);
const Transaction = model('Transaction', transactionSchema);
const ComAdd = model('ComAdd', comAddSchema);
const Contact = model('Contact', contactSchema);
const TestAdd = model('TestAdd', testAddSchema);



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
    static async deleteUser(find: any) {
        try {
            let res = await User.deleteOne(find);
            return res;
        }
        catch (e: any) {
            console.log(e);
            return false;
        }
    }
    static async addTransaction(data: any) {
        try {
            console.log(data)
            let transaction = new Transaction(data);
            await transaction.save();
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
    static async fetchTransaction(data: any) {
        try {
            console.log(data);
            let add = await Transaction.find(data);
            return { success: true, data: add };
        } catch (e: any) {
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
    static async findUserById(id: any) {
        try {
            let res = await User.findById(id);
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
            let res = await User.find({ role: "influ" });
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
    static async fetchAdd(data: any) {
        try {
            console.log(data);
            let add = await Add.find(data);
            return { success: true, data: add };
        } catch (e: any) {
            console.log(e);
            return {
                success: false,
                error: e.toString()
            }
        }

    }
    static async fetchTestAdd(data: any) {
        try {
            console.log(data);
            let add = await TestAdd.find(data);
            return { success: true, data: add };
        } catch (e: any) {
            console.log(e);
            return {
                success: false,
                error: e.toString()
            }
        }

    }
    static async updateAdd(find: any, update: any) {
        try {

            console.log(find, update)
            console.log("-------------------- find -------------  update")
            await Add.findOneAndUpdate(find, update);
            return true;
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
    static async fetchInstagram(instagramId: any) {
        try {
            console.log(instagramId.trim());
            let instagramData = await Instagram.findById(instagramId.trim());
            return { success: true, data: instagramData };
        } catch (e: any) {
            console.log(e);
            return {
                success: false,
                error: e.toString()
            }
        }

    }
    static async updateInstagram(instagramId: String, update: any) {
        try {
            console.log(instagramId, update);
            let res = await Instagram.findByIdAndUpdate(instagramId, update);
            console.log("instagram update response ", res);
            return { success: true };
        } catch (e: any) {
            console.log(e);
            return {
                success: false,
                error: e.toString()
            }
        }

    }
    static async fetchAllInstagram() {
        try {
            let instagramData = await Instagram.find();
            return { success: true, data: instagramData };
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
            console.log("channel Id is", channelId)
            let youtubeData = await Youtube.findById(channelId);
            return { success: true, data: youtubeData };
        } catch (e: any) {
            console.log(e);
            return {
                success: false,
                error: e.toString()
            }
        }

    }
    static async updateYoutube(channelId: String, update: any) {
        try {
            console.log(channelId, update);
            let res = await Youtube.findByIdAndUpdate(channelId, update);
            console.log("Youtube update response ", res);
            return { success: true };
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
            return { success: true, data: youtubeData };
        } catch (e: any) {
            console.log(e);
            return {
                success: false,
                error: e.toString()
            }
        }

    }


    static async addComAdd(data: any) {
        try {
            console.log(data);
            let comAdd = new ComAdd(data);
            await comAdd.save();
            return { success: true };
        } catch (e: any) {
            console.log(e);
            return {
                success: false,
                error: e.toString()
            }
        }

    }
    static async fetchComAdd(data: any) {
        try {
            console.log(data);
            let add = await ComAdd.find(data);
            return { success: true, data: add };
        } catch (e: any) {
            console.log(e);
            return {
                success: false,
                error: e.toString()
            }
        }

    }
    static async fetchAllComAdd() {
        try {
            // console.log(data);
            let add = await ComAdd.find({});
            return { success: true, data: add };
        } catch (e: any) {
            console.log(e);
            return {
                success: false,
                error: e.toString()
            }
        }

    }
    static async editComAdd(find: any, update: any) {
        try {
            console.log(find, update)
            await ComAdd.findByIdAndUpdate(find, update);
            return true;
        }
        catch (e: any) {
            console.log(e);
            return {
                success: false,
                error: e.toString()
            }
        }
    }

    static async addTestAdd(data: any) {
        try {
            console.log(data);
            let testAdd = new TestAdd(data);
            await testAdd.save();
            return { success: true }
        } catch (e: any) {
            console.log(e);
            return {
                success: false
            }
        }
    }
    static async addContact(data: any) {
        try {
            console.log(data);
            let contact = new Contact(data);
            await contact.save();
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