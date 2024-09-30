import * as multichainWallet from "multichain-crypto-wallet";

export const createWallet = (): Record<string, string> => {
  const wallet = multichainWallet.createWallet({ network: "ethereum" });
  return wallet;
};

export const getWalletFromMnemonic = (
  mnemonic: string
): Record<string, string> => {
  const wallet = multichainWallet.generateWalletFromMnemonic({
    mnemonic,
    network: "ethereum",
  });
  return wallet;
};

export const getAddressFromPrivateKey = (
  privateKey: string
): Record<string, string> => {
  const wallet = multichainWallet.getAddressFromPrivateKey({
    privateKey,
    network: "ethereum",
  });
  return wallet;
};

export const encryptWallet = async (
  password: string,
  privateKey: string
): Promise<Record<string, string>> => {
  const encrypted = await multichainWallet.getEncryptedJsonFromPrivateKey({
    network: "ethereum",
    privateKey,
    password,
  });
  return encrypted;
};

export const decryptWallet = async (
  password: string,
  encryptedWallet: string
): Promise<Record<string, string>> => {
  const decrypted = await multichainWallet.getWalletFromEncryptedJson({
    network: "ethereum",
    json: encryptedWallet,
    password,
  });
  return decrypted;
};

export const getEthBalance = async (
  address: string
): Promise<Record<string, number>> => {
  const balance = await multichainWallet.getBalance({
    address,
    network: "ethereum",
    rpcUrl: "https://sepolia.basescan.org",
  });
  return balance;
};

export const transferEth = async (
  privateKey: string,
  recipientAddress: string,
  amount: number,
  description?: string
): Promise<Record<any, unknown>> => {
  const transer = await multichainWallet.transfer({
    recipientAddress,
    amount,
    network: "ethereum",
    rpcUrl: "https://sepolia.basescan.org",
    privateKey,
    gasPrice: "10", // TODO: increase this for faster transaction
    data: description || "",
  });

  return transer;
};

export const getTransactionReceipt = async (
  hash: string
): Promise<Record<any, unknown>> => {
  const receipt = await multichainWallet.getTransaction({
    hash,
    network: "ethereum",
    rpcUrl: "https://sepolia.basescan.org",
  });

  return receipt;
};
