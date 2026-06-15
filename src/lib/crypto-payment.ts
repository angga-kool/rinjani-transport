/**
 * USDT Crypto Payment Verification
 * Supports: TRC20 (Tron), BEP20 (BSC), ERC20 (Ethereum)
 * 
 * Auto-checks blockchain for incoming USDT transfers to our wallet.
 */

export type CryptoNetwork = "trc20" | "bep20" | "erc20";

interface NetworkConfig {
  name: string;
  symbol: string;
  wallet: string;
  contractAddress: string;
  decimals: number;
  explorerUrl: string;
  apiUrl: string;
  minConfirmations: number;
}

export function getNetworkConfig(network: CryptoNetwork): NetworkConfig | null {
  const configs: Record<CryptoNetwork, NetworkConfig> = {
    trc20: {
      name: "Tron (TRC20)",
      symbol: "USDT-TRC20",
      wallet: process.env.USDT_WALLET_TRC20 || "",
      contractAddress: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t", // USDT on Tron
      decimals: 6,
      explorerUrl: "https://tronscan.org/#/transaction/",
      apiUrl: "https://api.trongrid.io",
      minConfirmations: 19,
    },
    bep20: {
      name: "BNB Smart Chain (BEP20)",
      symbol: "USDT-BEP20",
      wallet: process.env.USDT_WALLET_BEP20 || "",
      contractAddress: "0x55d398326f99059fF775485246999027B3197955", // USDT on BSC
      decimals: 18,
      explorerUrl: "https://bscscan.com/tx/",
      apiUrl: "https://api.bscscan.com/api",
      minConfirmations: 12,
    },
    erc20: {
      name: "Ethereum (ERC20)",
      symbol: "USDT-ERC20",
      wallet: process.env.USDT_WALLET_ERC20 || "",
      contractAddress: "0xdAC17F958D2ee523a2206206994597C13D831ec7", // USDT on ETH
      decimals: 6,
      explorerUrl: "https://etherscan.io/tx/",
      apiUrl: "https://api.etherscan.io/api",
      minConfirmations: 12,
    },
  };

  const config = configs[network];
  return config.wallet ? config : null;
}

export function getAvailableNetworks(): { id: CryptoNetwork; name: string; fee: string; speed: string }[] {
  const networks: { id: CryptoNetwork; name: string; fee: string; speed: string }[] = [];

  if (process.env.USDT_WALLET_TRC20) {
    networks.push({ id: "trc20", name: "Tron (TRC20)", fee: "~$1", speed: "~1 min" });
  }
  if (process.env.USDT_WALLET_BEP20) {
    networks.push({ id: "bep20", name: "BNB Chain (BEP20)", fee: "~$0.1", speed: "~15 sec" });
  }
  if (process.env.USDT_WALLET_ERC20) {
    networks.push({ id: "erc20", name: "Ethereum (ERC20)", fee: "$3-20", speed: "~3 min" });
  }

  return networks;
}

/**
 * Verify a USDT payment on TRC20 (Tron) network.
 * Checks recent TRC20 transfers to our wallet.
 */
async function verifyTRC20(
  walletAddress: string,
  expectedAmount: number,
  afterTimestamp: number
): Promise<{ verified: boolean; txHash?: string }> {
  try {
    const apiKey = process.env.TRONGRID_API_KEY || "";
    const url = `https://api.trongrid.io/v1/accounts/${walletAddress}/transactions/trc20?only_to=true&limit=20&min_timestamp=${afterTimestamp}`;

    const res = await fetch(url, {
      headers: apiKey ? { "TRON-PRO-API-KEY": apiKey } : {},
    });

    if (!res.ok) return { verified: false };

    const data = await res.json();
    const transfers = data.data || [];

    // USDT contract on Tron
    const usdtContract = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";

    for (const tx of transfers) {
      if (
        tx.token_info?.address === usdtContract &&
        tx.to === walletAddress
      ) {
        const amount = Number(tx.value) / 1e6; // 6 decimals
        // Allow small tolerance (0.01 USDT)
        if (Math.abs(amount - expectedAmount) <= 0.01) {
          return { verified: true, txHash: tx.transaction_id };
        }
      }
    }

    return { verified: false };
  } catch (error) {
    console.error("[Crypto TRC20 Verify]", error);
    return { verified: false };
  }
}

/**
 * Verify a USDT payment on BEP20 (BSC) network.
 */
async function verifyBEP20(
  walletAddress: string,
  expectedAmount: number,
  afterTimestamp: number
): Promise<{ verified: boolean; txHash?: string }> {
  try {
    const apiKey = process.env.BSCSCAN_API_KEY || "";
    const usdtContract = "0x55d398326f99059fF775485246999027B3197955";

    const startBlock = 0;
    const url = `https://api.bscscan.com/api?module=account&action=tokentx&contractaddress=${usdtContract}&address=${walletAddress}&startblock=${startBlock}&endblock=99999999&sort=desc&apikey=${apiKey}`;

    const res = await fetch(url);
    if (!res.ok) return { verified: false };

    const data = await res.json();
    if (data.status !== "1") return { verified: false };

    const transfers = data.result || [];
    const afterSec = Math.floor(afterTimestamp / 1000);

    for (const tx of transfers) {
      const txTime = parseInt(tx.timeStamp);
      if (txTime < afterSec) continue;
      if (tx.to.toLowerCase() !== walletAddress.toLowerCase()) continue;

      const amount = Number(tx.value) / 1e18; // BEP20 USDT = 18 decimals
      if (Math.abs(amount - expectedAmount) <= 0.01) {
        return { verified: true, txHash: tx.hash };
      }
    }

    return { verified: false };
  } catch (error) {
    console.error("[Crypto BEP20 Verify]", error);
    return { verified: false };
  }
}

/**
 * Verify a USDT payment on ERC20 (Ethereum) network.
 */
async function verifyERC20(
  walletAddress: string,
  expectedAmount: number,
  afterTimestamp: number
): Promise<{ verified: boolean; txHash?: string }> {
  try {
    const apiKey = process.env.ETHERSCAN_API_KEY || "";
    const usdtContract = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

    const startBlock = 0;
    const url = `https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=${usdtContract}&address=${walletAddress}&startblock=${startBlock}&endblock=99999999&sort=desc&apikey=${apiKey}`;

    const res = await fetch(url);
    if (!res.ok) return { verified: false };

    const data = await res.json();
    if (data.status !== "1") return { verified: false };

    const transfers = data.result || [];
    const afterSec = Math.floor(afterTimestamp / 1000);

    for (const tx of transfers) {
      const txTime = parseInt(tx.timeStamp);
      if (txTime < afterSec) continue;
      if (tx.to.toLowerCase() !== walletAddress.toLowerCase()) continue;

      const amount = Number(tx.value) / 1e6; // ERC20 USDT = 6 decimals
      if (Math.abs(amount - expectedAmount) <= 0.01) {
        return { verified: true, txHash: tx.hash };
      }
    }

    return { verified: false };
  } catch (error) {
    console.error("[Crypto ERC20 Verify]", error);
    return { verified: false };
  }
}

/**
 * Main verification function — dispatches to correct network.
 */
export async function verifyCryptoPayment(
  network: CryptoNetwork,
  expectedAmountUSDT: number,
  afterTimestamp: number // ms since epoch
): Promise<{ verified: boolean; txHash?: string; explorerUrl?: string }> {
  const config = getNetworkConfig(network);
  if (!config) return { verified: false };

  let result: { verified: boolean; txHash?: string };

  switch (network) {
    case "trc20":
      result = await verifyTRC20(config.wallet, expectedAmountUSDT, afterTimestamp);
      break;
    case "bep20":
      result = await verifyBEP20(config.wallet, expectedAmountUSDT, afterTimestamp);
      break;
    case "erc20":
      result = await verifyERC20(config.wallet, expectedAmountUSDT, afterTimestamp);
      break;
    default:
      return { verified: false };
  }

  if (result.verified && result.txHash) {
    return { verified: true, txHash: result.txHash, explorerUrl: `${config.explorerUrl}${result.txHash}` };
  }

  return { verified: false };
}
