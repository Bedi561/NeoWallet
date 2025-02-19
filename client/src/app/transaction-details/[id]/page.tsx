import TransactionDetailsContent from "@/components/ui/transaction-details-content";

interface PageProps {
  params: {
    id: string; // Dynamic route parameter
  };
}

export default async function TransactionDetailsPage({ params }: PageProps) {
  // Await the params (as it's now treated as a Promise)
  const { id } = await params;

  // Debug logs for Vercel deployment
  console.log("Transaction Details Page Rendering");
  console.log("Transaction ID from params:", id);

  return <TransactionDetailsContent transactionId={id} />;
}
