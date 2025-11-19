"use client";
import { useEffect, useState } from "react";
import { getProgram } from "../../src/utils/program";
import { PublicKey } from "@solana/web3.js";

export default function Home() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        const program = getProgram();
        // Example: fetch an account from your Anchor program
        const [questionPDA] = PublicKey.findProgramAddressSync(
  [
    Buffer.from("QUESTION"),
    Buffer.from("what is a PDA?"), // same topic string used in initialize
    questionAuthorityPubkey.toBuffer(),
  ],
  program.programId
);

        const result = await program.account.question.fetch("GSKUuDySaKJbVUiHqBa2yLpbVXLL2yZCvcp3oks9jLCL");
        setMessage(JSON.stringify(result));
      } catch (err) {
        console.error(err);
      }
    };

    run();
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="p-4 bg-gray-100 rounded">
        <h1 className="text-xl font-bold">Stack Underflow DApp</h1>
        <p>Program response: {message}</p>
      </div>
    </main>
  );
}
