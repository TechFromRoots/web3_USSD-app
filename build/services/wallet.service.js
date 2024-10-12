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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionReceipt = exports.transferDAI = exports.transferUSDC = exports.transferEth = exports.getERC20Balance = exports.getEthBalance = exports.decryptWallet = exports.encryptWallet = exports.getAddressFromPrivateKey = exports.getWalletFromMnemonic = exports.createWallet = void 0;
const multichainWallet = __importStar(require("multichain-crypto-wallet"));
//https://sepolia.base.org
//https://sepolia.basescan.org
const createWallet = () => {
    const wallet = multichainWallet.createWallet({ network: "ethereum" });
    return wallet;
};
exports.createWallet = createWallet;
const getWalletFromMnemonic = (mnemonic) => {
    const wallet = multichainWallet.generateWalletFromMnemonic({
        mnemonic,
        network: "ethereum",
    });
    return wallet;
};
exports.getWalletFromMnemonic = getWalletFromMnemonic;
const getAddressFromPrivateKey = (privateKey) => {
    const wallet = multichainWallet.getAddressFromPrivateKey({
        privateKey,
        network: "ethereum",
    });
    return wallet;
};
exports.getAddressFromPrivateKey = getAddressFromPrivateKey;
const encryptWallet = (password, privateKey) => __awaiter(void 0, void 0, void 0, function* () {
    const encrypted = yield multichainWallet.getEncryptedJsonFromPrivateKey({
        network: "ethereum",
        privateKey,
        password,
    });
    return encrypted;
});
exports.encryptWallet = encryptWallet;
const decryptWallet = (password, encryptedWallet) => __awaiter(void 0, void 0, void 0, function* () {
    const decrypted = yield multichainWallet.getWalletFromEncryptedJson({
        network: "ethereum",
        json: encryptedWallet,
        password,
    });
    return decrypted;
});
exports.decryptWallet = decryptWallet;
const getEthBalance = (address) => __awaiter(void 0, void 0, void 0, function* () {
    const balance = yield multichainWallet.getBalance({
        address,
        network: "ethereum",
        rpcUrl: "https://sepolia.base.org",
    });
    return balance;
});
exports.getEthBalance = getEthBalance;
const getERC20Balance = (address, tokenAddress) => __awaiter(void 0, void 0, void 0, function* () {
    const balance = yield multichainWallet.getBalance({
        address,
        network: "ethereum",
        rpcUrl: "https://sepolia.base.org",
        tokenAddress: tokenAddress,
    });
    return balance;
});
exports.getERC20Balance = getERC20Balance;
const transferEth = (privateKey, recipientAddress, amount, description) => __awaiter(void 0, void 0, void 0, function* () {
    const transer = yield multichainWallet.transfer({
        recipientAddress,
        amount,
        network: "ethereum",
        rpcUrl: "https://sepolia.base.org",
        privateKey,
        // gasPrice: "10", // TODO: increase this for faster transaction
        data: description || "",
    });
    return transer;
});
exports.transferEth = transferEth;
const transferUSDC = (privateKey, recipientAddress, amount, description) => __awaiter(void 0, void 0, void 0, function* () {
    const transer = yield multichainWallet.transfer({
        recipientAddress,
        amount,
        network: "ethereum",
        rpcUrl: "https://sepolia.base.org",
        privateKey,
        gasPrice: "10", // TODO: increase this for faster transaction
        tokenAddress: "0x6E2c0695F1EC6eAC90C1C4A8bbaF6dD26651d2D1",
        data: description || "",
    });
    return transer;
});
exports.transferUSDC = transferUSDC;
const transferDAI = (privateKey, recipientAddress, amount, description) => __awaiter(void 0, void 0, void 0, function* () {
    const transer = yield multichainWallet.transfer({
        recipientAddress,
        amount,
        network: "ethereum",
        rpcUrl: "https://sepolia.base.org",
        privateKey,
        gasPrice: "10", // TODO: increase this for faster transaction
        tokenAddress: "0xAE7BD344982bD507D3dcAa828706D558cf281F13",
        data: description || "",
    });
    return transer;
});
exports.transferDAI = transferDAI;
const getTransactionReceipt = (hash) => __awaiter(void 0, void 0, void 0, function* () {
    const receipt = yield multichainWallet.getTransaction({
        hash,
        network: "ethereum",
        rpcUrl: "https://sepolia.base.org",
    });
    return receipt;
});
exports.getTransactionReceipt = getTransactionReceipt;
