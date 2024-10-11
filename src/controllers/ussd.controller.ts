import { Request, Response } from "express";
import UserService from "../services/user.service";
import IUser from "../interfaces/user.interface";
import {
  createWallet,
  encryptWallet,
  getERC20Balance,
  getEthBalance,
  getAddressFromPrivateKey,
  getWalletFromMnemonic,
  decryptWallet,
  transferEth,
  transferUSDC,
  transferDAI,
} from "../services/wallet.service";
import BillService from "../services/bill.service";
import { determineInputType } from "../utils/walletRecoveryType.utiil";
import { determineRecipientInputType } from "../utils/recipientInputType";
const { create, findOne, editById } = new UserService();
const { getBillCategory, buyAirtime } = new BillService();

export default class USSDController {
  async ussd(req: Request, res: Response) {
    const { sessionId, serviceCode, phoneNumber, text } = req.body;

    // Fetch user information if it exists
    const user: IUser | null = await findOne({ phoneNumber: phoneNumber });

    let response = "";

    // Split the text input by "*" to handle multi-step inputs
    const textArray = text.split("*");

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
    } else if (textArray[0] == "1") {
      // Create Wallet
      if (!user) {
        if (textArray.length === 1) {
          // Ask for 4 digit transaction pin/password to encrypt wallet
          response = `CON Enter a 4 digit transaction pin for your wallet:`;
        } else if (textArray.length === 2) {
          const pin = textArray[1] || process.env.DEFAULT_WALLET_PIN!;
          // Implement the logic to create a wallet
          const newWalletAddress = createWallet();
          // encrypts the wallet with the default password.TODO: the user will be prompted to provide a password, which will be used rencrypt the wallet after creating wallet or importing wallet
          const encryptedWalletDetails = await encryptWallet(
            pin,
            newWalletAddress.privateKey
          );

          // Save the new user with the generated wallet address
          const saved = await create({
            phoneNumber: phoneNumber,
            address: newWalletAddress.address,
            walletDetails: encryptedWalletDetails.json,
            pin,
          });

          response = `END Wallet created successfully. You can now send tokens.\nAddress: ${saved?.address}\nPhrase: ${newWalletAddress.mnemonic}`;
        }
      } else {
        response = `END You already have a wallet linked. ${user.address}`;
      }
    } else if (textArray[0] == "2") {
      // Link Wallet
      if (!user) {
        if (textArray.length === 1) {
          //prompt the user to either provide a privateKey or wallet Phrase
          response = `CON enter wallet's seed phrase or private key :`;
        } else if (textArray.length === 2) {
          // Ask for 4 digit transaction pin/password to encrypt wallet
          response = `CON Enter a 4 digit transaction pin for your wallet:`;
        } else if (textArray.length === 3) {
          // Implement logic to link an existing wallet
          const input = textArray[1];
          const pin = textArray[2] || process.env.DEFAULT_WALLET_PIN!;

          if (determineInputType(input) === "Private Key") {
            const wallet = getAddressFromPrivateKey(input);
            const encryptedWalletDetails = await encryptWallet(pin, input);

            // Save the new user with the wallet address
            await create({
              phoneNumber: phoneNumber,
              address: wallet.address,
              walletDetails: encryptedWalletDetails.json,
              pin,
            });

            response = `END Wallet: ${wallet.address} linked successfully. You can now send tokens.`;
          } else if (determineInputType(input) === "Seed Phrase") {
            const wallet = getWalletFromMnemonic(input);
            const encryptedWalletDetails = await encryptWallet(
              pin,
              wallet.privateKey
            );

            await create({
              phoneNumber: phoneNumber,
              address: wallet.address,
              walletDetails: encryptedWalletDetails.json,
              pin,
            });

            response = `END Wallet: ${wallet.address} linked successfully. You can now send tokens.`;
          } else if (determineInputType(input) === "Invalid Input") {
            response = `END invalid privateKey/Seed phrase.`;
          }
        }
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
          const EthBalance = await getEthBalance(user.address);
          const USDCbalance = await getERC20Balance(
            user.address,
            "0x6E2c0695F1EC6eAC90C1C4A8bbaF6dD26651d2D1"
          ); // change this address when moving to mainnet
          const DAIbalance = await getERC20Balance(
            user.address,
            "0xAE7BD344982bD507D3dcAa828706D558cf281F13"
          );

          response = `CON select Token:
            1. ETH: ${EthBalance.balance}
            2. USDC: ${USDCbalance.balance}
            3. DAI: ${DAIbalance.balance}`;
        } else if (textArray.length === 3) {
          // Ask for the amount of tokens to send
          const token = textArray[2];

          switch (token) {
            case "1":
              response = `CON Enter amount of ETH to send:`;
              break;

            case "2":
              response = `CON Enter amount of USDC to send:`;
              break;

            case "3":
              response = `CON Enter amount of DAI to send:`;
              break;

            default:
              break;
          }
        } else if (textArray.length === 4) {
          response = `CON Enter your transaction pin`;
        } else if (textArray.length === 5) {
          // Process the token sending
          const recipient = textArray[1];
          const token = textArray[2];
          const amount = textArray[3];
          const pin = textArray[4];

          // decrypt wallet
          const senderDetails = await decryptWallet(pin, user.walletDetails);
          if (
            !senderDetails.privateKey &&
            senderDetails.address === user.address
          ) {
            response = `END Invalid transaction pin`;
          }
          // Validate the recipient and amount
          const recipientWalletType = determineRecipientInputType(recipient);
          if (recipientWalletType === "Phone Number") {
            const recipientDetails: IUser | null = await findOne({
              phoneNumber: recipient,
            });
            if (recipientDetails?.address) {
              // Logic to send tokens
              let transaction: any;
              switch (token) {
                case "1":
                  transaction = await transferEth(
                    senderDetails.privateKey,
                    recipientDetails.address,
                    amount
                  );
                  console.log(transaction);

                  response = `END Token of ${amount} Eth sent successfully to ${recipient}.\nhash:${
                    transaction.hash
                  }\nstatus:${
                    transaction.confirmations === 0 ? "Pending" : "Confirmed"
                  }`;
                  break;

                case "2":
                  transaction = await transferUSDC(
                    senderDetails.privateKey,
                    recipientDetails.address,
                    amount
                  );
                  console.log(transaction);

                  response = `END Token of ${amount} USDC sent successfully to ${recipient}.\nhash:${
                    transaction.hash
                  }\nstatus:${
                    transaction.confirmations === 0 ? "Pending" : "Confirmed"
                  }`;
                  break;

                case "3":
                  transaction = await transferDAI(
                    senderDetails.privateKey,
                    recipientDetails.address,
                    amount
                  );
                  console.log(transaction);

                  response = `END Token of ${amount} DAI sent successfully to ${recipient}.\nhash:${
                    transaction.hash
                  }\nstatus:${
                    transaction.confirmations === 0 ? "Pending" : "Confirmed"
                  }`;
                  break;

                default:
                  response = `END Token not sent, invalid token`;
                  break;
              }
            }
          }

          // response = `END Token of ${amount} sent successfully to ${recipient}.`;
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
        const EthBalance = await getEthBalance(user.address);
        const USDCbalance = await getERC20Balance(
          user.address,
          "0x6E2c0695F1EC6eAC90C1C4A8bbaF6dD26651d2D1"
        ); // change this address when moving to mainnet
        const DAIbalance = await getERC20Balance(
          user.address,
          "0xAE7BD344982bD507D3dcAa828706D558cf281F13"
        );

        response = `END Your wallet balance are:\n${EthBalance.balance} ETH.\n${USDCbalance.balance} USDC.\n${DAIbalance.balance} DAI.`;
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
          response = `CON for:
                    1. Self
                    2. Another number`;
          if (textArray.length === 3) {
            response = `CON Enter airtime amount:`;
          } else if (textArray.length === 4) {
            const EthBalance = await getEthBalance(user.address);
            const USDCbalance = await getERC20Balance(
              user.address,
              "0x6E2c0695F1EC6eAC90C1C4A8bbaF6dD26651d2D1"
            ); // change this address when moving to mainnet
            const DAIbalance = await getERC20Balance(
              user.address,
              "0xAE7BD344982bD507D3dcAa828706D558cf281F13"
            );

            response = `CON select Token:
            1. ETH: ${EthBalance.balance}
            2. USDC: ${USDCbalance.balance}
            3. DAI: ${DAIbalance.balance}`;
          } else if (textArray.length === 5) {
            response = `CON Enter your transaction pin`;
          } else if (textArray.length === 6) {
            const airtimeAmount = textArray[3];
            const token = textArray[4];
            const pin = textArray[5];

            // decrypt wallet
            const userDetails = await decryptWallet(pin, user.walletDetails);
            let transaction: any;
            switch (token) {
              case "1":
                transaction = await transferEth(
                  userDetails.privateKey,
                  process.env.ADMIN_WALLET!,
                  Number(airtimeAmount) / Number(process.env.ETH_RATE!)
                );
                console.log(transaction);

                response = `END Token of ${amount} Eth sent successfully to ${recipient}.\nhash:${
                  transaction.hash
                }\nstatus:${
                  transaction.confirmations === 0 ? "Pending" : "Confirmed"
                }`;
                break;

              case "2":
                transaction = await transferUSDC(
                  userDetails.privateKey,
                  recipientDetails.address,
                  amount
                );
                console.log(transaction);

                response = `END Token of ${amount} USDC sent successfully to ${recipient}.\nhash:${
                  transaction.hash
                }\nstatus:${
                  transaction.confirmations === 0 ? "Pending" : "Confirmed"
                }`;
                break;

              case "3":
                transaction = await transferDAI(
                  userDetails.privateKey,
                  recipientDetails.address,
                  amount
                );
                console.log(transaction);

                response = `END Token of ${amount} DAI sent successfully to ${recipient}.\nhash:${
                  transaction.hash
                }\nstatus:${
                  transaction.confirmations === 0 ? "Pending" : "Confirmed"
                }`;
                break;

              default:
                response = `END Token not sent, invalid token`;
                break;
            }
          }

          // response = `END Airtime bill paid successfully.`;
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
        } else if (
          (textArray.length === 2 && !user?.pin) ||
          (textArray.length === 3 && user.pin && user.pin === textArray[1])
        ) {
          // Ask for confirmation of the new PIN (after asking for the new PIN)
          response = `CON Confirm new PIN:`;
        } else if (
          (textArray.length === 3 &&
            textArray[1] === textArray[2] &&
            !user?.pin) ||
          (textArray.length === 4 &&
            user.pin &&
            user.pin === textArray[1] &&
            textArray[2] === textArray[3])
        ) {
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
    res.set("Content-Type", "text/plain");
    res.send(response);
  }
}
