"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.determineInputType = determineInputType;
function determineInputType(input) {
    // Trim input to remove extra spaces
    const trimmedInput = input.trim();
    // Regex to check if the input is a 64-character hexadecimal string (private key)
    const privateKeyRegex = /^[a-fA-F0-9]{64}$/;
    // Split the input by spaces to get the words (for seed phrase)
    const words = trimmedInput.split(/\s+/);
    // Check if input is a private key
    if (privateKeyRegex.test(trimmedInput)) {
        return "Private Key";
    }
    // Check if input has 12, 15, 18, 21, or 24 words (for seed phrase)
    const validWordCounts = [12, 15, 18, 21, 24];
    if (validWordCounts.includes(words.length)) {
        return "Seed Phrase";
    }
    // If it doesn't match either, return "Invalid Input"
    return "Invalid Input";
}
