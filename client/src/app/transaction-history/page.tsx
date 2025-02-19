import { Suspense } from "react";
import TransactionHistoryContent from "@/components/ui/transaction-history-content"


export default function TransactionHistoryPage() {
   return (
      <Suspense fallback={<div>Loading...</div>}>
        <TransactionHistoryContent />
      </Suspense>
    );
}


