import TransactionDetailsContent from "@/components/ui/transaction-details-content"

type Props = {
  params: { id: string }
}

export default async function TransactionDetailsPage(props: Props) {
  const { id } = props.params
  return <TransactionDetailsContent transactionId={id} />
}

export const dynamic = 'force-dynamic'
export const dynamicParams = true