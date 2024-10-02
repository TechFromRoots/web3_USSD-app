import { Request, Response } from "express";
import UserService from "../services/user.service";
import IUser from "../interfaces/user.interface";
const { create, findOne, editById } = new UserService();

export default class USSDController {

    async ussd(req: Request, res: Response) {
        const {
            sessionId,
            serviceCode,
            phoneNumber,
            text
        } = req.body;

        // Fetch user information if it exists
        const user: IUser | null = await findOne({ phoneNumber: phoneNumber });

        let response = "";

        // Split the text input by "*" to handle multi-step inputs
        const textArray = text.split('*');

        if (text == "") {
            // Initial USSD menu
            response = `CON What would you like to do?
            1. Create Wallet
            2. Link Wallet
            3. Send Token
            4. Get Wallet Address
            5. Check Balance
            6. Pay Bills
            7. View Current Crypto Prices
            8. Pin Setup
            0. Exit`;

        } else if (text == "1") {
            // Create Wallet
            if (!user) {
                // Implement the logic to create a wallet


                const newWalletAddress = "Dfo4P23Au7U5ZdZV8myrh3j7gY4HKai7qoVop33EaKwd";
                // Save the new user with the generated wallet address
                await create({
                    phoneNumber: phoneNumber,
                    address: newWalletAddress,
                    pin: null
                });

                response = `END Wallet created successfully. You can now send tokens.`;

            } else {
                response = `END You already have a wallet linked.`;
            }

        } else if (text == "2") {
            // Link Wallet
            if (!user) {
                // Implement logic to link an existing wallet


                const walletAddress = "Dfo4P23Au7U5ZdZV8myrh3j7gY4HKai7qoVop33EaKwd";
                // Save the new user with the wallet address
                await create({
                    phoneNumber: phoneNumber,
                    address: walletAddress,
                    pin: null
                });

                response = `END Wallet linked successfully. You can now send tokens.`;

            } else {
                response = `END You already have a wallet linked.`;
            }

        } else if (textArray[0] == "3") {
            // Send Token
            if (user) {
                if (textArray.length === 1) {
                    // Ask for the recipient wallet address or phone number
                    response = `CON Enter recipient wallet address or phone number:`;
                } else if (textArray.length === 2) {
                    // Ask for the amount of tokens to send
                    response = `CON Enter amount to send:`;
                } else if (textArray.length === 3) {
                    // Process the token sending
                    const recipient = textArray[1];
                    const amount = textArray[2];

                    // Validate the recipient and amount


                    // Logic to send tokens


                    response = `END Token of ${amount} sent successfully to ${recipient}.`;
                }
            } else {
                response = `END You don't have a wallet linked.`;
            }
        } else if (text == "4") {
            // Fetch Wallet address
            if (user?.address) {
                // Return user address
                response = `END Your wallet address is ${user.address}.`;

            } else {
                response = `END No linked wallet found.`;
            }

        } else if (text == "5") {
            // Check Wallet Balance
            if (user) {
                // Implement logic to fetch and display the balance


                const balance = "50.5";
                response = `END Your wallet balance is ${balance} tokens.`;
            } else {
                response = `END You don't have a wallet linked.`;
            }

        } else if (textArray[0] == "6") {
            // Pay Bills
            if (user) {
                if (textArray.length === 1) {
                    // Ask for the bill type
                    response = `CON Select bill to pay:
                    1. Airtime
                    2. Data
                    3. Electricity`;
                } else if (textArray[1] == "1") {
                    // Process airtime payment


                    response = `END Airtime bill paid successfully.`;
                } else if (textArray[1] == "2") {
                    // Process data payment


                    response = `END Data bill paid successfully.`;
                } else if (textArray[1] == "3") {
                    // Process Electricity bill payment


                    response = `END Electricity bill paid successfully.`;
                }
            } else {
                response = `END You don't have a wallet linked.`;
            }

        } else if (text == "7") {
            // View Current Crypto Prices
            // Fetch and display current crypto prices


            const bitcoinPrice = "30000";
            const ethereumPrice = "2000";
            response = `END Current crypto prices:
            Bitcoin: $${bitcoinPrice}
            Ethereum: $${ethereumPrice}`;

        } else if (textArray[0] == "8") {
            // Setup or Change PIN
            if (user) {
                if (user.pin && textArray.length === 1) {
                    // If the user has a PIN, ask for the current PIN
                    response = `CON Enter your current PIN:`;
                } else if (user.pin && textArray.length === 2) {
                    // If the user entered their current PIN, verify it
                    const enteredPin = textArray[1];

                    if (user.pin !== enteredPin) {
                        response = `END Incorrect PIN entered.`;
                    } else {
                        // Correct current PIN entered, proceed to ask for a new PIN
                        response = `CON Enter new PIN:`;
                    }
                } else if (textArray.length === 1 && !user?.pin) {
                    // If the user does not have a PIN, ask for a new PIN directly
                    response = `CON Enter new PIN:`;
                } else if ((textArray.length === 2 && !user?.pin) || (textArray.length === 3 && user.pin && (user.pin === textArray[1]))) {
                    // Ask for confirmation of the new PIN (after asking for the new PIN)
                    response = `CON Confirm new PIN:`;
                } else if ((textArray.length === 3 && textArray[1] === textArray[2] && !user?.pin) || (textArray.length === 4 && user.pin && (user.pin === textArray[1]) && (textArray[2] === textArray[3]))) {
                    // If the new PIN and confirmation PIN match, set the PIN
                    const newPin = textArray[2];

                    // Update the user's PIN in the database
                    await editById(user._id, { pin: newPin });

                    response = `END Your PIN has been set successfully.`;
                } else if (textArray.length === 3 && textArray[1] !== textArray[2]) {
                    // If the new PIN and confirmation PIN do not match
                    response = `END PINs do not match. Please try again.`;
                }

            } else {
                response = `END You don't have a wallet linked.`;
            }
        } else if (text == "0") {
            // Exit the session
            response = `END Thank you for using our service.`;

        } else {
            // Handle invalid inputs
            response = `END Invalid option selected. Please try again.`;
        }

        // Send the response back to the USSD gateway
        res.set('Content-Type', 'text/plain');
        res.send(response);
    }
}