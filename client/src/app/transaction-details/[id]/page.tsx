import TransactionDetailsContent from "@/components/ui/transaction-details-content";

interface PageProps {
  params: {
    id: string; // Dynamic route parameter
  };
}

export default function TransactionDetailsPage({ params }: PageProps) {
  // Debug logs for Vercel deployment
  console.log("Transaction Details Page Rendering");
  console.log("Transaction ID from params:", params.id);

  return <TransactionDetailsContent transactionId={params.id} />;
}
