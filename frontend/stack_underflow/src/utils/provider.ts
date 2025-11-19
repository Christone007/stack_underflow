import * as anchor from "@coral-xyz/anchor";
import { Connection, clusterApiUrl } from "@solana/web3.js";

export const getProvider = () => {
    // Connect to Devnet
    const connection = new Connection(clusterApiUrl("devnet"), "processed");

    // Use Phantom wallet injected in browser
    const wallet = (window as any).solana;

    if (!wallet || !wallet.isPhantom) {
        throw new Error("Phantom wallet not found");
    }

    const provider = new anchor.AnchorProvider(connection, wallet, {
        preflightCommitment: "processed",
    });

    return provider;
};