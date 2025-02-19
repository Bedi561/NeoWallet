import WalletDetailsContent from "@/components/ui/wallet-details-content";

// Define the type for your params
interface Params {
  userId: string; // Dynamic route parameter
}

export default async function WalletDetailsPage(props: { params: Promise<Params> }) {
  // Await the promise for `params`
  const { userId } = await props.params;

  // Debug logs (optional)
  console.log("Wallet Details Page Rendering");
  console.log("User ID from params:", userId);

  return <WalletDetailsContent userId={userId} />;
}
