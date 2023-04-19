import { FC, useState } from "react";

import styles from "../styles/Home.module.css";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as Web3 from "@solana/web3.js";

export const SendSolForm: FC = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const [txSig, setTxSig] = useState("");

  const link = () => {
    txSig ? `https://explorer.solana.com/tx/${txSig}?cluster=devnet` : "";
  };

  const sendSol = (event) => {
    event.preventDefault();

    //Check if wallet is connected
    if (!connection || !publicKey) {
      return;
    }

    const recipientPubKey = new Web3.PublicKey(event.target.recipient.value);

    //Create a new transaction
    const transaction = new Web3.Transaction();

    //Add an instruction to transaction
    const instruction = Web3.SystemProgram.transfer({
      fromPubkey: publicKey,
      toPubkey: recipientPubKey,
      lamports: event.target.amount.value * Web3.LAMPORTS_PER_SOL,
    });
    transaction.add(instruction);

    //Confirm transaction
    sendTransaction(transaction, connection).then((sig) => setTxSig(sig));

    // console.log(
    //   `Send ${event.target.amount.value} SOL from ${publicKey} to ${event.target.recipient.value}`
    // );
  };

  return (
    <div>
      {publicKey ? (
        <form onSubmit={sendSol} className={styles.form}>
          <label htmlFor="amount">Amount (in SOL) to send:</label>
          <input
            id="amount"
            type="text"
            className={styles.formField}
            placeholder="e.g. 0.1"
            required
          />
          <br />
          <label htmlFor="recipient">Send SOL to:</label>
          <input
            id="recipient"
            type="text"
            className={styles.formField}
            placeholder="e.g. 4Zw1fXuYuJhWhu9KLEYMhiPEiqcpKd6akw3WRZCv84HA"
            required
          />
          <button type="submit" className={styles.formButton}>
            Send
          </button>
        </form>
      ) : (
        <span>Connect Your Wallet</span>
      )}
      {txSig && publicKey ? (
        <div>
          <p>View your transaction on</p>
          <a href={link}>Solana Explorer</a>
        </div>
      ) : null}
    </div>
  );
};
