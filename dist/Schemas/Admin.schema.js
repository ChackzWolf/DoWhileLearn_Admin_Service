"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TempAdmin = exports.Otp = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ENV_configs_1 = require("../configs/ENV_configs/ENV.configs");
const AdminSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    wallet: {
        type: Number,
        default: 0
    }
});
const TempAdminSchema = new mongoose_1.Schema({
    adminData: {
        type: Object,
        require: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 900 // expires after 15 minutes
    }
}, {
    timestamps: true,
});
const otpSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true }
});
// Hash password
AdminSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcryptjs_1.default.hash(this.password || "", 10);
    next();
});
// sign access token
AdminSchema.methods.SignAccessToken = function () {
    return jsonwebtoken_1.default.sign({ id: this._id, role: this.role }, ENV_configs_1.configs.JWT_SECRET || "", {
        expiresIn: ENV_configs_1.configs.JWT_EXPIRATION_TIME,
    });
};
// sign refresh token
AdminSchema.methods.SignRefreshToken = function () {
    return jsonwebtoken_1.default.sign({ id: this._id, role: this.role }, ENV_configs_1.configs.REFRESH_TOKEN_SECRET, {
        expiresIn: ENV_configs_1.configs.REFRESH_TOKEN_EXPIRATION_TIME,
    });
};
// compare password
AdminSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcryptjs_1.default.compare(enteredPassword, this.password);
};
exports.Otp = mongoose_1.default.model("setOTP", otpSchema);
exports.TempAdmin = mongoose_1.default.model("TempAdminData", TempAdminSchema);
const AdminModel = mongoose_1.default.model("Admin", AdminSchema);
exports.default = AdminModel;
