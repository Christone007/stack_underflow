import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { StackUnderflow } from "../target/types/stack_underflow";
// import { publicKey } from "@coral-xyz/anchor/dist/cjs/utils";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { assert } from "chai";

const QUESTION_SEED = "QUESTION";
const ANSWER_SEED = "ANSWER";

describe("stack_underflow", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.stackUnderflow as Program<StackUnderflow>;

  const emeka = anchor.web3.Keypair.generate();

  const question_1_topic = "PDA?";
  const question_1_body = "I came across something called PDAs while learning solana development. What exactly do they mean?";

  describe("Create a Question", async () => {
    it("Should successfully create a question with a valid topic and body", async () => {
      // airdrop emeka's wallet
      await airdrop(provider.connection, emeka.publicKey);

      // generate the question address deterministically
      const [question_pda, question_bump] = PublicKey.findProgramAddressSync([
        anchor.utils.bytes.utf8.encode(QUESTION_SEED),
        anchor.utils.bytes.utf8.encode(question_1_topic),
        emeka.publicKey.toBuffer(),
      ], program.programId);

      console.log(`The Generated Question PDA is: ${question_pda} and its bump is ${question_bump}\n\n-> writing to PDA...`);

      // call the create_question method and provide it with the arguments, accounts, and signers and make it call the rpc
      await program.methods.initialize(question_1_topic, question_1_body).accounts(
        {
          questionAuthority: emeka.publicKey,
          question: question_pda,
          systemProgram: anchor.web3.SystemProgram.programId
        }
      ).signers([emeka]).rpc();

      // check that the PDA contains the question
      await check_question(program, question_pda, emeka.publicKey, question_1_topic, question_1_body, 0);
    })
  })

});


async function airdrop(connection: any, address: any, amount = 1000000000) {
  await connection.confirmTransaction(await connection.requestAirdrop(address, amount), "confirmed");
}

async function check_question(
  program: anchor.Program<StackUnderflow>,
  question: PublicKey,
  question_author: PublicKey,
  topic: String,
  body: String,
  answer_count: number,
) {
  let questionData = await program.account.question.fetch(question);

  if (question_author) {
    assert.strictEqual(questionData.questionCreator.toBase58(), question_author.toBase58(), `Question author should be ${question_author.toString()} but was ${questionData.questionCreator.toString()}`);
  }

  if (topic) {
    assert.strictEqual(questionData.questionTopic, topic, `Question topic should be ${topic} but was ${questionData.questionTopic}`);
  }

  if (body) {
    assert.strictEqual(questionData.questionBody, body, `Question body should be ${body} but was ${questionData.questionBody}`);
  }

  if (answer_count) {
    assert.strictEqual(questionData.answerCount.toNumber(), 0, `Number of answers should be ${answer_count} but was ${questionData.answerCount.toNumber()}`);
  }
}