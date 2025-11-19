# Project Description

**Deployed Frontend URL:** LINK

**Solana Program ID:** GSKUuDySaKJbVUiHqBa2yLpbVXLL2yZCvcp3oks9jLCL

## Project Overview

### Description
Stack Underflow is a decentralized Q&A platform built on Solana. It allows users to create questions and post answers directly on-chain, ensuring transparency, immutability, and censorship resistance. Each question and answer is stored in program-derived accounts, making the dApp a trustless knowledge-sharing system where content is verifiable and permanent.

### Key Features
- **Create Questions:** Users can initialize a new question with a topic and body, stored as a PDA on Solana.
- **Post Answers:** Community members can respond to questions by submitting answers, also stored as PDAs.
- **Immutable Records:** All questions and answers are permanently recorded on-chain.
- **Wallet Integration:** Users interact with the dApp using their Solana wallet (e.g., Phantom).
- **Devnet Deployment:** Currently deployed on Solana Devnet for testing and demonstration.

### How to Use the dApp
1. **Connect Wallet**  
   Open the frontend and connect your Phantom wallet.
2. **Create a Question**  
   - Enter a topic and body.  
   - Submit to initialize a new `Question` PDA on-chain.
3. **Post an Answer**  
   - Select a question.  
   - Enter your answer text.  
   - Submit to create an `Answer` PDA linked to that question.
4. **View Content**  
   - Browse questions and answers stored on-chain.  
   - Verify that all data is immutable and tied to wallet addresses.

---

## Program Architecture

### PDA Usage
Program Derived Addresses (PDAs) are used to uniquely identify `Question` and `Answer` accounts:
- **Question PDA:** Derived from seeds `["QUESTION", topic, question_authority]`.  
  Ensures each question is uniquely tied to its creator and topic.
- **Answer PDA:** Derived from seeds `["ANSWER", question", answer_index]`.  
  Guarantees each answer is linked to its parent question and indexed properly.

### Program Instructions
**Instructions Implemented:**
- **initialize:**  
  Creates a new `Question` PDA with a topic and body. The `question_authority` wallet is stored as the creator.
- **answer:**  
  Creates a new `Answer` PDA tied to a specific `Question`. Stores the author, body, and timestamp.

### Account Structure
```rust
#[account]
pub struct Question {
    pub question_creator: Pubkey,   // Wallet that created the question
    pub question_topic: String,     // Topic string
    pub question_body: String,      // Body text
    pub answer_count: u32,          // Number of answers posted
}

#[account]
pub struct Answer {
    pub answer_author: Pubkey,      // Wallet that posted the answer
    pub answer_body: String,        // Answer text
    pub timestamp: i64,             // Time of posting
}

```

## Testing

### Test Coverage
Comprehensive test suite covering all instructions with both successful operations and error conditions to ensure program security and reliability.

**Happy Path Tests:**
- **Create Question (Valid)**: Emeka successfully creates a question with a valid topic and body.
- **Create Question (Max Lengths)**: Alice creates a question with topic and body length at maximum allowed limits.
- **Post Answer (Self)**: Emeka is able to answer his own question.
- **Question Count Update (Self)**: Emeka’s question count correctly increases to 1 after posting his answer.
- **Post Answer (Other User)**: Alice successfully answers Emeka’s question.
- **Question Count Update (Other User)**: Emeka’s question count correctly increases to 2 after Alice’s answer.

**Unhappy Path Tests:**
- **Create Question (Exceed Limits)**: Fails when topic and/or body length limits are exceeded.
- **Post Answer (Exceed Length)**: Bob’s answer fails because it exceeds the maximum allowed characters.
- **Question Count Integrity**: Emeka’s question count remains at 2 after Bob’s failed answer attempt.

### Running Tests
```bash
npm install    # install dependencies
anchor test     # run tests
```bash
# Commands to run your tests
anchor test
```

### Additional Notes for Evaluators

This was my first Solana dApp and the learning curve was steep! The biggest challenges were understanding PDA derivation for questions and answers, validating account ownership, and handling error scenarios gracefully. Writing tests for both happy and unhappy paths helped ensure the program’s reliability. Once PDAs clicked, the deterministic addressing made the architecture much cleaner and easier to reason about.

Still have challenges understanding the frontend implementation