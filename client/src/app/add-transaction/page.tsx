import AddTransactionForm from "@/components/ui/add-transaction-form"
import { Suspense } from "react";
export default function AddTransactionPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
          <AddTransactionForm />
        </Suspense>
  )
}



