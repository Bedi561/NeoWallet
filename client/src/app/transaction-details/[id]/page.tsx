// src/app/transaction-details/[id]/page.tsx
import TransactionDetailsContent from "@/components/ui/transaction-details-content"

type Props = {
  params: {
    id: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default function TransactionDetailsPage({ params }: Props) {
  // Debug logs for Vercel deployment
  console.log('Transaction Details Page Rendering');
  console.log('Transaction ID from params:', params.id);

  return <TransactionDetailsContent transactionId={params.id} />;
}