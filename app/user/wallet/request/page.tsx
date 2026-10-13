import WalletRequestScreen from "@/views/user/screens/WalletRequestScreen";

export default async function Page({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;
  //keyed so switching between Add money and Withdraw starts a fresh form
  return <WalletRequestScreen key={type} type={type} />;
}
