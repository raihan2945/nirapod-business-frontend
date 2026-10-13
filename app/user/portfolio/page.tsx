import PortfolioScreen from "@/views/user/screens/PortfolioScreen";

export default async function Page({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  return <PortfolioScreen status={status} />;
}
