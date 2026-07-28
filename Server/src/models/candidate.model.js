import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    street1: {
      type: String,
      required: true,
      trim: true,
    },

    street2: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  }
);

const candidateSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    dateOfBirth: {
      type: Date,
      required: true,
    },

    residentialAddress: {
      type: addressSchema,
      required: true,
    },

    sameAsResidential: {
      type: Boolean,
      default: false,
    },

    permanentAddress: {
      type: addressSchema,
      required: function () {
        return !this.sameAsResidential;
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Candidate", candidateSchema);