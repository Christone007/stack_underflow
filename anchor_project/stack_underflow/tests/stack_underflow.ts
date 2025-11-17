import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { StackUnderflow } from "../target/types/stack_underflow";
// import { publicKey } from "@coral-xyz/anchor/dist/cjs/utils";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { assert, expect } from "chai";

const QUESTION_SEED = "QUESTION";
const ANSWER_SEED = "ANSWER";

describe("stack_underflow", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.stackUnderflow as Program<StackUnderflow>;

  const emeka = anchor.web3.Keypair.generate();
  const alice = anchor.web3.Keypair.generate();
  const bob = anchor.web3.Keypair.generate();

  const question_1_topic = "What is a PDA?";
  const question_1_body = "I came across something called PDAs while learning solana development. What exactly do they mean?";
  let emeka_question_pda;

  const alice_question_topic = "What is ED25519 curve?rrrrrrrrrr"
  const alice_question_body = "Someone should dive deep into the full mathematics behind secp256k1 from the prime field, short Weierstrass form, base point G, cofactor, all the way to how ECDSA signing/verification actually works u";
  let alice_question_pda;

  const bob_question_topic = "What is ED25519 curve?";
  const bob_question_body = "Someone should dive deep into the full mathematics behind secp256k1 from the prime field, short Weierstrass form, base point G, cofactor, all the way to how ECDSA signing/verification actually works under the hood.";
  let bob_question_pda;

  describe("Create a Question", async () => {
    it("Emeka: create a question with a valid topic and body", async () => {
      // airdrop emeka's wallet
      await airdrop(provider.connection, emeka.publicKey);

      // generate the question address deterministically
      const [question_pda, question_bump] = PublicKey.findProgramAddressSync([
        anchor.utils.bytes.utf8.encode(QUESTION_SEED),
        anchor.utils.bytes.utf8.encode(question_1_topic),
        emeka.publicKey.toBuffer(),
      ], program.programId);

      emeka_question_pda = question_pda;

      // console.log(`The Generated Question PDA is: ${question_pda} and its bump is ${question_bump}\n\n-> writing to PDA...`);

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

    it("Alice: create a question with topic and body length at max limits", async () => {
      // airdrop alice's wallet
      await airdrop(provider.connection, alice.publicKey);

      // generate the question address deterministically
      const [question_pda, alice_question_bump] = PublicKey.findProgramAddressSync([
        anchor.utils.bytes.utf8.encode(QUESTION_SEED),
        anchor.utils.bytes.utf8.encode(alice_question_topic),
        alice.publicKey.toBuffer(),
      ], program.programId);

      alice_question_pda = question_pda;

      // call the create_question method and provide topic and body within the max_limit length
      await program.methods.initialize(alice_question_topic, alice_question_body).accounts(
        {
          questionAuthority: alice.publicKey,
          question: alice_question_pda,
          systemProgram: anchor.web3.SystemProgram.programId
        }
      ).signers([alice]).rpc();

      // confirm that the PDA contains the question
      await check_question(program, alice_question_pda, alice.publicKey, alice_question_topic, alice_question_body, 0);

    })

    it("Fail to create a question when topic and/or body length limits are exceeded", async () => {
      // airdrop wallet
      await airdrop(provider.connection, bob.publicKey);

      // find a program address for the question PDA
      const [question_pda] = PublicKey.findProgramAddressSync([
        anchor.utils.bytes.utf8.encode(QUESTION_SEED),
        anchor.utils.bytes.utf8.encode(bob_question_topic),
        bob.publicKey.toBuffer(),
      ], program.programId);

      bob_question_pda = question_pda;

      // call the create_question method with overflowing args
      let txError;
      try {
        await program.methods.initialize(bob_question_topic, bob_question_body).accounts(
          {
            questionAuthority: bob.publicKey,
            question: bob_question_pda,
            systemProgram: anchor.web3.SystemProgram.programId
          }
        ).signers([bob]).rpc();

        assert.fail("Transaction should have failed but it succeeded!");
      } catch (err: any) {
        txError = err;
      }

      // confirm if custom error was thrown
      expect(txError.error.errorCode.code).to.equal("QuestionBodyTooLong");
      expect(txError.error.errorMessage).to.include("Cannot initialize, Question body too long");

      // confirm account was never created
      const bob_q_acc = await provider.connection.getAccountInfo(bob_question_pda);
      expect(bob_q_acc).to.be.null;
    })
  })

  describe("Post Answers", async () => {
    it("Emeka should be able to answer his own question", async () => {
      // call the post_answer method
      program.methods.


      // confirm that account data matches emeka's answer
    })

    it("Emeka's question count should increase to 1", async () => {
      // fetch emeka's question account info

      // confirm that the answer count is now 1
    })

    it("Alice should be able to answer Emeka's question", async () => {


    })

    it("Emeka's question count should increase to 2", async () => {

    })

    it("Bob should be able to answer Emeka's question", async () => {

    })

    it("Emeka's question count should increase to 3", async () => {

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