"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.determineRecipientInputType = determineRecipientInputType;
function determineRecipientInputType(input) {
    // Regular expression to match Nigerian phone numbers in the format "07065353374"
    const phoneRegex = /^0\d{10}$/;
    // Regular expression to match a generic Ethereum wallet address (42-character hexadecimal starting with 0x)
    const walletAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    // Check if input matches the phone number format
    if (phoneRegex.test(input)) {
        return "Phone Number";
    }
    // Check if input matches the wallet address format
    if (walletAddressRegex.test(input)) {
        return "Wallet Address";
    }
    // If it doesn't match either, return "Invalid Input"
    return "Invalid Input";
}
// Example Usage:
const input1 = "07065353374"; // A phone number
const input2 = "0x32Be343B94f860124dC4fEe278FDCBD38C102D88"; // A wallet address
const input3 = "InvalidString";
console.log(determineRecipientInputType(input1)); // "Phone Number"
console.log(determineRecipientInputType(input2)); // "Wallet Address"
console.log(determineRecipientInputType(input3)); // "Invalid Input"
