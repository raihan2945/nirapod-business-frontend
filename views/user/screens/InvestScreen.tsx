"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Building2, CalendarDays, CircleAlert, CircleCheck, Lock, Wallet, Zap } from "lucide-react";
import { useCreateNewProjectInvestmentMutation } from "@/state/features/projects/projectInvestmentApi";
import { useGetAllProjectsQuery, useGetSingleProjectByIdQuery } from "@/state/features/projects/projectsApi";
import { formatMoney, toIsoDay, toNumber } from "../lib/format";
import { errorMessage, toQuery, useAuthId, useMe } from "../lib/hooks";
import { htmlToText, investBlockReason, returnPlan, shareStats } from "../lib/project";
import type { Investment, ListResponse, Project } from "../lib/types";
import { Button, Card, Notice, Segmented, Skeleton, Stepper, rise } from "../ui/primitives";
import { ImagePicker, SelectInput, TextArea, TextInput } from "../ui/form";
import { Sheet, useToast } from "../ui/overlay";
import { ScreenHeader, StickyFooter } from "../shell/ScreenHeader";

type Method = "direct" | "wallet";

const PAYMENT_METHODS = [
  { label: "Bank transfer", value: "Bank" },
  { label: "Cash deposit", value: "Cash" },
];

export default function InvestScreen({ projectId: initialProjectId }: { projectId?: string }) {
  const router = useRouter();
  const toast = useToast();
  const userId = useAuthId();
  const { user } = useMe();

  const [projectId, setProjectId] = useState(initialProjectId ?? "");
  const [qty, setQty] = useState(1);
  const [method, setMethod] = useState<Method>("direct");
  const [paymentMethod, setPaymentMethod] = useState("Bank");
  const [paymentDate, setPaymentDate] = useState(toIsoDay(new Date()));
  const [transactionId, setTransactionId] = useState("");
  const [comments, setComments] = useState("");
  const [proof, setProof] = useState<File | null>(null);
  const [confirming, setConfirming] = useState(false);

  const openProjects = useGetAllProjectsQuery(toQuery({ status: "ACTIVE", size: 50 }));
  const projectQ = useGetSingleProjectByIdQuery(projectId, { skip: !projectId });
  const project = (projectQ.currentData as { data?: Project } | undefined)?.data;
  const [create, { isLoading }] = useCreateNewProjectInvestmentMutation();

  const projectOptions = useMemo(
    () =>
      ((openProjects.data as ListResponse<Project> | undefined)?.data ?? []).map((p) => ({
        label: `${p.title} — ${formatMoney(p.minInvestment)} / share`,
        value: p.id,
      })),
    [openProjects.data],
  );

  const shares = shareStats(project);
  const maxQty = Number.isFinite(shares.remaining) ? Math.max(1, shares.remaining) : 9999;
  const unit = toNumber(project?.minInvestment);
  const total = unit * qty;
  const plan = returnPlan(project, qty);
  const balance = toNumber(user?.balance);
  const insufficient = method === "wallet" && total > balance;
  const blocked = project ? investBlockReason(project) : null;
  const bankInfo = htmlToText(project?.bankInfo);

  const send = async () => {
    if (!project || !userId) return;
    const wallet = method === "wallet";
    const form = new FormData();
    form.append("projectId", project.id);
    form.append("userId", userId);
    form.append("qty", String(qty));
    form.append("amount", String(total));
    //a wallet payment settles instantly and needs no manual method/proof
    form.append("paymentMethod", wallet ? "WALLET" : paymentMethod);
    //z.coerce.boolean turns "false" into true - only send the flag when set
    if (wallet) form.append("fromWallet", "true");
    if (!wallet) {
      form.append("paymentDate", paymentDate);
      if (transactionId.trim()) form.append("transactionId", transactionId.trim());
      if (proof) form.append("proof1", proof);
    }
    if (comments.trim()) form.append("comments", comments.trim());

    const res = await create({ data: form });
    setConfirming(false);
    if ("error" in res) {
      toast.error("Investment failed", errorMessage(res.error));
      return;
    }
    toast.success(
      wallet ? "Investment confirmed" : "Investment submitted",
      wallet ? "Paid from your wallet. Your return schedule is ready." : "We'll confirm it once your payment is verified.",
    );
    const created = (res.data as { data?: Investment } | undefined)?.data;
    router.push(created?.id ? `/user/portfolio/${created.id}` : "/user/portfolio");
  };

  //a wallet payment is debited instantly - confirm first
  const submit = () => (method === "wallet" ? setConfirming(true) : send());

  return (
    <div className="mx-auto max-w-2xl">
      <ScreenHeader title="Make an investment" subtitle="Choose a project and number of shares" back="/user/projects" />

      <div className="space-y-4">
        <div {...rise(0)}>
          <SelectInput
            label="Project"
            value={projectId}
            onChange={(e) => {
              //a different project starts again from one share
              setProjectId(e.target.value);
              setQty(1);
            }}
            options={projectOptions}
            placeholder={openProjects.isLoading ? "Loading projects…" : "Select a project"}
          />
        </div>

        {projectId && projectQ.isFetching && !project && <Skeleton className="h-44 rounded-[20px]" />}

        {blocked && <Notice tone="danger" icon={Lock} title={blocked} />}

        {project && !blocked && (
          <div className="animate-np-fade space-y-4">
            {/* shares */}
            <Card>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">Number of shares</p>
                  <p className="text-[13px] text-np-muted">
                    {formatMoney(unit)} each{Number.isFinite(shares.remaining) ? ` · ${shares.remaining} available` : ""}
                  </p>
                </div>
                <Stepper value={qty} onChange={setQty} max={maxQty} />
              </div>

              {plan.repayments > 0 && plan.perPayout > 0 && (
                <div className="mt-4 flex gap-2 rounded-xl bg-np-primary-soft p-3 text-[13px] leading-5 text-np-primary-dark">
                  <CalendarDays className="mt-0.5 size-[18px] shrink-0" />
                  <p>
                    You’ll receive <b>{formatMoney(plan.perPayout)}</b> × {plan.repayments} payouts over {project.projectDuration} months (
                    <b>{formatMoney(plan.total)}</b> total), and your capital is returned when the investment closes.
                  </p>
                </div>
              )}
            </Card>

            {/* method */}
            <Card>
              <p className="mb-3 font-semibold">How would you like to pay?</p>
              <Segmented
                items={[
                  { label: "Bank / Cash", value: "direct" },
                  { label: "From wallet", value: "wallet" },
                ]}
                value={method}
                onChange={setMethod}
              />
              <p className="mt-3 flex items-center gap-1.5 text-[13px] text-np-muted">
                <Wallet className="size-4" />
                Wallet balance: <b className="text-np-text">{formatMoney(balance)}</b>
              </p>
            </Card>

            {method === "wallet" ? (
              <div key="wallet" className="animate-np-fade">
                {insufficient ? (
                  <Notice
                    tone="danger"
                    icon={CircleAlert}
                    title="Not enough balance"
                    message={`You need ${formatMoney(total - balance)} more. Add money or reduce shares.`}
                    href="/user/wallet/request?type=DEPOSIT"
                  />
                ) : (
                  <Notice tone="success" icon={Zap} title="Instant confirmation" message="Wallet investments are approved immediately and your return schedule is created right away." />
                )}
              </div>
            ) : (
              <div key="direct" className="animate-np-fade space-y-4">
                {!!bankInfo && (
                  <Card className="bg-[#F7FCF9]">
                    <p className="flex items-center gap-2 font-semibold text-np-primary-dark">
                      <Building2 className="size-[18px]" />
                      Send payment to
                    </p>
                    <p className="mt-2 whitespace-pre-line text-sm leading-6">{bankInfo}</p>
                  </Card>
                )}
                <Card className="space-y-4">
                  <SelectInput label="Payment method" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} options={PAYMENT_METHODS} />
                  <TextInput label="Payment date" type="date" value={paymentDate} max={toIsoDay(new Date())} onChange={(e) => setPaymentDate(e.target.value)} />
                  <TextInput label="Transaction / reference ID" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} placeholder="e.g. TXN123456" />
                  <TextArea label="Remarks" value={comments} onChange={(e) => setComments(e.target.value)} placeholder="Anything we should know?" />
                  <ImagePicker label="Payment proof" value={proof} onChange={setProof} hint="A photo of the deposit slip or transfer receipt speeds up approval." />
                </Card>
              </div>
            )}
          </div>
        )}
      </div>

      <StickyFooter>
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[13px] text-np-muted">You pay</p>
            <p className="truncate text-xl font-bold">{formatMoney(total)}</p>
          </div>
          <Button
            size="lg"
            icon={CircleCheck}
            loading={isLoading && !confirming}
            disabled={!project || !!blocked || insufficient || total <= 0}
            onClick={submit}
          >
            {method === "wallet" ? "Pay & invest" : "Submit"}
          </Button>
        </div>
      </StickyFooter>

      <Sheet
        open={confirming}
        onClose={() => !isLoading && setConfirming(false)}
        title="Confirm investment"
        footer={
          <>
            <Button variant="outline" block onClick={() => setConfirming(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button block icon={CircleCheck} loading={isLoading} onClick={send}>
              Invest
            </Button>
          </>
        }
      >
        <p className="text-[15px] leading-6 text-np-muted">
          <b className="text-np-text">{formatMoney(total)}</b> will be deducted from your wallet for {qty} share(s) in{" "}
          <b className="text-np-text">{project?.title}</b>.
        </p>
      </Sheet>
    </div>
  );
}
