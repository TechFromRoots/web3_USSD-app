export function determineInputType(input: string): string {
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

// Example Usage:
const userInput1 =
  "c873fea86c17fa8e298df716c59c1c64f5b2c64a1e5a3ff296db731bbf2cbf8d";
const userInput2 =
  "abandon ability able about above absent absorb abstract absurd abuse access accident";
const userInput3 = "notAValidInput";

console.log(determineInputType(userInput1)); // "Private Key"
console.log(determineInputType(userInput2)); // "Seed Phrase"
console.log(determineInputType(userInput3)); // "Invalid Input"
