import TransactionDetailsContent from "@/components/ui/transaction-details-content";

interface Params {
  id: string; // Dynamic route parameter
}

export default async function TransactionDetailsPage(props: { params: Promise<Params> }) {
  // Await the promise for `params`
  const { id } = await props.params;

  // Debug logs for Vercel deployment
  console.log("Transaction Details Page Rendering");
  console.log("Transaction ID from params:", id);

  return <TransactionDetailsContent transactionId={id} />;
}
