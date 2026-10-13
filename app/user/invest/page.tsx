import InvestScreen from "@/views/user/screens/InvestScreen";

export default async function Page({ searchParams }: { searchParams: Promise<{ projectId?: string }> }) {
  const { projectId } = await searchParams;
  return <InvestScreen key={projectId} projectId={projectId} />;
}
