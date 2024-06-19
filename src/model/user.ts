import { compare, genSalt, hash } from "bcrypt";
import { Schema, model } from "mongoose";

// enum Role {
//     Guest = 'guest',
//     User = 'user',
//     Admin = 'admin',
//     Pharmacy = 'pharmacy',
//   }

interface userDocument{
    firstName: string;
	lastName: string;
    phoneNumber: string;
    email: string;
    password: string;
	address: string; 
	streetNumber: string 
	streetName: string;
    city: string;
	state: string;
    role: "admin" | "pharmacy" | "user" | "guest";
    pharmacyDetails:{
        premisesLicence: string; 
        annualLicence: string; 
        businessName: string;
    }
}

interface methods{
    comparePassword(password: string): Promise<boolean>
}
const userSchema = new Schema<userDocument, {}, methods>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String},
    email: { type: String, required: true },
    password: { type: String, required: true },
	address: { type: String},
    streetNumber: { type: String},
    streetName: { type: String},
    city: { type: String},
    state: { type: String},
    role: {type: String, enum: ['guest', 'user', 'admin', 'pharmacy'], required: true, default: 'user'},
    pharmacyDetails:{
        premisesLicence: String,
        annualLicence: String,
        businessName: String,
    }
}, {timestamps: true})

userSchema.pre('save', async function(next){
    if(this.isModified('password')){
        const salt = await genSalt(10)
        this.password = await hash(this.password, salt)
    }
    next()
})
userSchema.methods.comparePassword = async function(password){
  return  await compare(password, this.password)
}

const userModel = model("User", userSchema)
export default userModel
