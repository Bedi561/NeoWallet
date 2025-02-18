import WalletDetailsContent from "@/components/ui/wallet-details-content"

export default function WalletDetailsPage({ params }: { params: { userId: string } }) {
  return <WalletDetailsContent userId={params.userId} />
}

