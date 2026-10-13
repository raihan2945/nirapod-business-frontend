import InvestmentDetailScreen from "@/views/user/screens/InvestmentDetailScreen";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <InvestmentDetailScreen id={id} />;
}
