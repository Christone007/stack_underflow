import * as anchor from "@coral-xyz/anchor";
import idl from "../idl/stack_underflow.json"; // make sure this file exists
import { PROGRAM_ID } from "./pdas";
import { Connection, clusterApiUrl } from "@solana/web3.js";

export function getProvider() {
    const connection = new Connection(clusterApiUrl("devnet"), "processed");
    const wallet = (window as any).solana; // Phantom wallet injected in browser
    if (!wallet || !wallet.isPhantom) {
        throw new Error("Phantom wallet not found");
    }
    return new anchor.AnchorProvider(connection, wallet, {
        preflightCommitment: "processed",
    });
}

export function getProgram() {
    const provider = getProvider();
    return new anchor.Program(idl as anchor.Idl, PROGRAM_ID, provider);
}
