"use client";
import { useEffect, useState } from "react";
import { getProgram } from "../../src/utils/program";
import { getQuestionPDA, getAnswerPDA } from "../../src/utils/pdas";
import { PublicKey, Connection, clusterApiUrl } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";

export default function Home() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [topic, setTopic] = useState("");
  const [body, setBody] = useState("");
  const [answerBody, setAnswerBody] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState<any | null>(null);
  const [status, setStatus] = useState<React.ReactNode>("");
  const [answerSuccessTx, setAnswerSuccessTx] = useState<string | null>(null);


  const connection = new Connection(clusterApiUrl("devnet"), "processed");

  // Fetch all Question accounts from chain
  const fetchQuestions = async () => {
    try {
      const program = getProgram();

      const allQuestions = await (program.account as any).question.all();

      const fetchedQuestions: any[] = [];
      for (const q of allQuestions) {
        const qPubkey = q.publicKey;
        const qAcc = q.account;

        const answers: any[] = [];
        for (let i = 0; i < qAcc.answerCount; i++) {
          try {
            const answerPDA = getAnswerPDA(qPubkey, i);
            const ansAcc = await (program.account as any).answer.fetch(answerPDA);
            answers.push({
              pubkey: answerPDA.toBase58(),
              body: ansAcc.answerBody,
              author: ansAcc.answerAuthor.toBase58(),
              timestamp: ansAcc.timestamp,
            });
          } catch (err) {
            console.warn("No answer at index", i, "for question", qPubkey.toBase58());
          }
        }

        fetchedQuestions.push({
          pubkey: qPubkey.toBase58(),
          topic: qAcc.questionTopic,
          body: qAcc.questionBody,
          answerCount: qAcc.answerCount,
          answers,
        });
      }

      setQuestions(fetchedQuestions);
    } catch (err) {
      console.error("Error fetching questions:", err);
    }
  };



  useEffect(() => {
    fetchQuestions();
  }, []);

  const createQuestion = async () => {
    try {
      const program = getProgram();
      const wallet = (window as any).solana;
      await wallet.connect();
      const authority = new PublicKey(wallet.publicKey);

      const questionPDA = getQuestionPDA(topic, authority);

      const question_tx = await program.methods
        .initialize(topic, body)
        .accounts({
          questionAuthority: authority,
          question: questionPDA,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      setStatus(
        <>
          ✅ Question created successfully! View Transaction{" "}
          <a
            href={`https://explorer.solana.com/tx/${question_tx}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            here
          </a>
        </>
      );

      // Refresh questions from chain
      fetchQuestions();
    } catch (err) {
      console.error(err);
      setStatus("❌ Error: " + (err as Error).message);
    }
  };

  const postAnswer = async () => {
    if (!selectedQuestion) return;
    try {
      const program = getProgram();
      const wallet = (window as any).solana;
      if (!wallet.isConnected) {
        await wallet.connect();
      }
      const authority = new PublicKey(wallet.publicKey);

      const answerIndex = selectedQuestion.answerCount;
      const answerPDA = getAnswerPDA(new PublicKey(selectedQuestion.pubkey), answerIndex);

      const answer_tx = await program.methods
        .answer(answerIndex, answerBody)
        .accounts({
          answerAuthor: authority,
          answer: answerPDA,
          question: new PublicKey(selectedQuestion.pubkey),
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      setAnswerBody("");
      await fetchQuestions();

      // Show success modal
      setAnswerSuccessTx(answer_tx);

    } catch (err) {
      console.error(err);
      setStatus("❌ Error: " + (err as Error).message);
    }
  };


  return (
    <main className="flex flex-col min-h-screen items-center justify-start p-8 bg-gray-50 text-black">
      <h1 className="text-2xl font-bold mb-6">Stack Underflow DApp</h1>

      {/* Create Question Form */}
      <div className="w-full max-w-md p-4 mb-6 bg-white rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Create a Question</h2>
        <input
          type="text"
          placeholder="Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full p-2 mb-2 border rounded bg-gray-50 text-black"
        />
        <textarea
          placeholder="Body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full p-2 mb-2 border rounded bg-gray-50 text-black"
        />
        <button
          onClick={createQuestion}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </div>

      {/* Questions List */}
      <div className="w-full max-w-md p-4 mb-6 bg-white rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Available Questions</h2>
        {questions.length === 0 ? (
          <p className="text-gray-500">No questions yet.</p>
        ) : (
          <ul>
            {questions.map((q, idx) => (
              <li
                key={idx}
                className={`p-2 mb-2 border rounded cursor-pointer ${selectedQuestion?.pubkey === q.pubkey ? "bg-blue-100" : ""
                  }`}
                onClick={() => setSelectedQuestion(q)}
              >
                <strong>{q.topic}</strong>: {q.body}
                <br />
                Answers: {q.answerCount}
                {q.answers && q.answers.length > 0 && (
                  <ul className="ml-4 mt-2 text-sm text-gray-700">
                    {q.answers.map((a: any, i: number) => (
                      <li key={i} className="mb-1">
                        <span className="font-semibold">{a.author}:</span> {a.body}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Post Answer Form */}
      {/* {selectedQuestion && (
        <div className="w-full max-w-md p-4 mb-6 bg-white rounded shadow">
          <h2 className="text-lg font-semibold mb-2">
            Post Answer to: {selectedQuestion.topic}
          </h2>
          <textarea
            placeholder="Your answer"
            value={answerBody}
            onChange={(e) => setAnswerBody(e.target.value)}
            className="w-full p-2 mb-2 border rounded bg-gray-50 text-black"
          />
          <button
            onClick={postAnswer}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Submit Answer
          </button>
        </div>
      )} */}
      {selectedQuestion && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-2">
              Post Answer to: {selectedQuestion.topic}
            </h2>
            <textarea
              placeholder="Your answer"
              value={answerBody}
              onChange={(e) => setAnswerBody(e.target.value)}
              className="w-full p-2 mb-2 border rounded bg-gray-50 text-black"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setSelectedQuestion(null)}
                className="bg-gray-300 text-black px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={postAnswer}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Submit Answer
              </button>
            </div>
          </div>
        </div>
      )}

      {answerSuccessTx && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Answer Submitted!</h2>
            <p className="mb-4">
              ✅ Your answer was posted successfully. View Transaction{" "}
              <a
                href={`https://explorer.solana.com/tx/${answerSuccessTx}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                here
              </a>
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setAnswerSuccessTx(null);
                  setSelectedQuestion(null); // close modal entirely
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Status */}
      {status && <p className="mt-4">{status}</p>}
    </main>
  );
}
