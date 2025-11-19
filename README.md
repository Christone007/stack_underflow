# Stack Underflow DApp 🪂

A decentralized Q&A application built on **Solana** and deployed with **Next.js** on [Vercel](https://stack-underflow-psi.vercel.app/).  
Think of it as a blockchain‑powered version of Stack Overflow — users can post questions and answers, and all interactions are recorded on Solana Devnet.

---

## ✨ Features

- **Create Questions**: Users can submit questions with a topic and body.
- **Post Answers**: Answers are tied to questions and stored on-chain.
- **Transaction Links**: Each action returns a Solana Explorer link for transparency.
- **Live Updates**: Questions and answers are fetched from chain and displayed in real time.
- **Deployed Frontend**: Hosted on Vercel for easy access. [Access here](https://stack-underflow-psi.vercel.app/)

---

## 🛠️ Tech Stack

- **Frontend**: [Next.js 15](https://nextjs.org/) + React + TailwindCSS  
- **Blockchain**: [Solana](https://solana.com/) Devnet  
- **Smart Contracts**: [Anchor Framework](https://book.anchor-lang.com/)  
- **Wallet Integration**: Phantom Wallet (via `window.solana`)  
- **Deployment**: [Vercel](https://stack-underflow-psi.vercel.app/)

---

## 📦 Installation

Clone the repo and install dependencies:

```bash
git clone https://github.com/Christone007/stack_underflow.git
cd stack_underflow/frontend/stack_underflow
npm install

---

## 🚀 Running Locally

Start the development server

```bash
npm run dev

---

visit http://localhost:3000 in your browser


## 📸 Screenshots
Homepage: List of questions with corresponding answers.
![Homepage](/root/program-Christone007/frontend/stack_underflow/public/img/stack_underflow.png "Homepage")

Create Question: Form to submit a new question.

Answer Modal: Popup to post answers with transaction link confirmation to view transaction on solana explorer


## Development Notes
- Questions and answers are stored on-chain using PDAs (```getQuestionPDA, ```getAnswerPDA).
- Transactions return signatures that are linked to Solana Explorer.
- State is refreshed after each transaction to show live updates.

---

## Live Demo
👉 [stack-underflow-psi.vercel.app](stack-underflow-psi.vercel.app)

---

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you’d like to change.
