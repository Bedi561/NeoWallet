import TransactionDetailsContent from "@/components/ui/transaction-details-content"

export default function TransactionDetailsPage({ params }: { params: { id: string } }) {
  return <TransactionDetailsContent transactionId={params.id} />
}


