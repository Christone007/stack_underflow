import { PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";

// Replace with your actual program ID from anchor deploy
export const PROGRAM_ID = new PublicKey("GSKUuDySaKJbVUiHqBa2yLpbVXLL2yZCvcp3oks9jLCL");

/**
 * Derive PDA for a Question account
 * Seeds: ["QUESTION", topic, question_authority]
 */
export function getQuestionPDA(topic: string, questionAuthority: PublicKey): PublicKey {
    const [pda] = PublicKey.findProgramAddressSync(
        [
            Buffer.from("QUESTION"),
            Buffer.from(topic),
            questionAuthority.toBuffer(),
        ],
        PROGRAM_ID
    );
    return pda;
}

/**
 * Derive PDA for an Answer account
 * Seeds: ["ANSWER", questionPDA, answerIndex (u32 LE)]
 */
export function getAnswerPDA(questionPDA: PublicKey, answerIndex: number): PublicKey {
    const indexBuffer = Buffer.alloc(4);
    indexBuffer.writeUInt32LE(answerIndex);
    const [pda] = PublicKey.findProgramAddressSync(
        [
            Buffer.from("ANSWER"),
            questionPDA.toBuffer(),
            indexBuffer,
        ],
        PROGRAM_ID
    );
    return pda;
}
