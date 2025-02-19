import TransactionDetailsContent from "@/components/ui/transaction-details-content"

interface PageProps {
  params: {
    id: string
  }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function TransactionDetailsPage({ params }: PageProps) {
  return <TransactionDetailsContent transactionId={params.id} />
}