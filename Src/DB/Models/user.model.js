import joi from "joi";
import mongoose, { Schema, Types } from "mongoose";
import cron from "node-cron";
import {
  providers,
  genders,
  roles,
  defaultProfilePicture,
  OTPTypes,
} from "../../Utils/eNums/enums.js";
import { hash } from "../../Utils/Hashing/Hash.js";
import { decrypt, encrypt } from "../../Utils/Encryption/Encryption.js";

//schema
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First Name is required"],
      minlength: [3, "First Name must be at least 3 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last Name is required"],
      minlength: [3, "Last Name must be at least 3 characters"],
    },
    email: {
      type: String,
      required: true,
      unique: [true, "Email ALready Exists"],
      lowercase: true,
      match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    },
    password: {
      type: String,
      required: function () {
        return this.provider == providers.system ? true : false;
      },
    },
    provider: {
      type: String,
      enum: Object.values(providers),
      required: true,
      default: providers.system,
    },
    gender: { type: String, enum: Object.values(genders) },
    DOB: {
      type: Date,
      validate: {
        validator: function (value) {
          const currentDate = new Date();
          if (value >= currentDate) return false;

          if (currentDate.getFullYear() - value.getFullYear() < 18)
            return false;

          return true;
        },
        message:
          "Date of Birth must be before the current date and the person must be older than 18 years",
      },
    },
    mobileNumber: {
      type: String,
      required: function () {
        return this.provider == providers.system ? true : false;
      },
    },
    role: { type: String, enum: Object.values(roles), default: roles.user },
    HR : {type:Boolean, default:false},
    companyOwner : {type:Boolean, default:false},
    isConfirmed: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    isBanned : {type: Boolean, default: false },
    bannedAt: { type: Date },
    updatedBy: { type: Types.ObjectId, ref: "Users" },
    changeCredentialTime: { type: Date },
    profilePicture: {
      secure_url: { type: String, default: defaultProfilePicture.secure_url },
      public_id: { type: String, default: defaultProfilePicture.public_id },
    },
    coverPicture: {
      secure_url: { type: String, default: defaultProfilePicture.secure_url },
      public_id: { type: String, default: defaultProfilePicture.public_id },
    },
    OTP: [
      {
        code: { type: String },
        type: { type: String, enum: Object.values(OTPTypes) },
        expiresIn: { type: Date },
      },
    ],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtual: true } }
);


userSchema.virtual("username").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Hooks
userSchema.pre("save", function (next) {

  if (this.isNew && this.password && this.mobileNumber) {
    this.password = hash({ plainText: this.password });
    this.mobileNumber = encrypt({ plainText: this.mobileNumber });
  }

  if (this.updatePassword) {
    this.password = hash({ plainText: this.password });
    //Updating Credential Change Time
    this.changeCredentialTime = new Date();
  }

  if (this.updateMobileNumber) {
    this.mobileNumber = encrypt({ plainText: this.mobileNumber });
  }
  next();
});

userSchema.post("findOne",function (doc, next) {

  
  if (doc && doc.mobileNumber) {
    doc.mobileNumber = decrypt({ cipherText: doc.mobileNumber });
  }
  next ()
});

//model
const User = mongoose.model("Users", userSchema);
export default User;

// delete OTPs after 6 hours
cron.schedule("0 */6 * * *", async () => {
  try {
    const result = await User.updateMany(
      { isConfirmed: true },
      { $pull: { OTP: {} } }
    );
  } catch (error) {
  }
});
