"use client";
import { motion, AnimatePresence } from "framer-motion";

export default function TransactionList({ transactions, deleteTransaction }) {
  return (
    <div className="mt-6 w-72">
      <h2 className="text-xl font-semibold">Transactions</h2>
      <ul className="mt-2">
        <AnimatePresence>
          {transactions.map((t) => (
            <motion.li
              key={t.id}
              className={`p-2 border-b flex justify-between ${
                t.type === "income" ? "text-green-600" : "text-red-600"
              }`}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
            >
              {t.description}: ₹{t.amount}
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() => deleteTransaction(t.id)}
              >
                ❌
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
