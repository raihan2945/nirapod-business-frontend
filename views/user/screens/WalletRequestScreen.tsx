"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Building2, CircleArrowDown, CircleArrowUp, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCreateNewWalletTransactionMutation } from "@/state/features/wallet/walletTransactionApi";
import { formatMoney, toIsoDay, toNumber } from "../lib/format";
import { errorMessage, useAuthId, useMe } from "../lib/hooks";
import type { WalletTransactionType } from "../lib/types";
import { Button, Card, Notice, rise } from "../ui/primitives";
import { ImagePicker, SelectInput, TextArea, TextInput } from "../ui/form";
import { useToast } from "../ui/overlay";
import { ScreenHeader, StickyFooter } from "../shell/ScreenHeader";

const METHODS = [
  { label: "Bank transfer", value: "Bank" },
  { label: "Cash", value: "Cash" },
];

const PRESETS = [5000, 10000, 25000, 50000];

//Add money (DEPOSIT) or withdraw (WITHDRAWAL). Both are filed as PENDING
//requests - the balance only changes once an admin approves them.
export default function WalletRequestScreen({ type: rawType }: { type?: string }) {
  const type: WalletTransactionType = rawType === "WITHDRAWAL" ? "WITHDRAWAL" : "DEPOSIT";
  const deposit = type === "DEPOSIT";

  const router = useRouter();
  const toast = useToast();
  const userId = useAuthId();
  const { user } = useMe();
  const [create, { isLoading }] = useCreateNewWalletTransactionMutation();

  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Bank");
  const [paymentDate, setPaymentDate] = useState(toIsoDay(new Date()));
  const [transactionId, setTransactionId] = useState("");
  const [comments, setComments] = useState("");
  const [proof, setProof] = useState<File | null>(null);
  const [error, setError] = useState<string>();

  const balance = toNumber(user?.balance);
  const value = Number(amount || 0);
  const overLimit = !deposit && value > balance;
  const presets = deposit ? PRESETS : [Math.floor(balance / 4), Math.floor(balance / 2), Math.floor(balance)].filter((p) => p > 0);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!/^\d+(\.\d{1,2})?$/.test(amount) || value <= 0) {
      setError("Enter a valid amount");
      return;
    }
    if (overLimit) {
      setError(`You can withdraw up to ${formatMoney(balance)}`);
      return;
    }
    setError(undefined);

    const form = new FormData();
    form.append("userId", userId ?? "");
    form.append("type", type);
    form.append("amount", String(value));
    form.append("paymentMethod", paymentMethod);
    if (deposit) {
      form.append("paymentDate", paymentDate);
      if (transactionId.trim()) form.append("transactionId", transactionId.trim());
      if (proof) form.append("proof1", proof);
    }
    if (comments.trim()) form.append("comments", comments.trim());

    const res = await create({ data: form });
    if ("error" in res) {
      toast.error("Request failed", errorMessage(res.error));
      return;
    }
    toast.success(deposit ? "Deposit request sent" : "Withdrawal requested", "You'll see it in your wallet once it's approved.");
    router.push("/user/wallet");
  };

  return (
    <form onSubmit={submit} className="mx-auto max-w-xl">
      <ScreenHeader title={deposit ? "Add money" : "Withdraw"} subtitle={deposit ? "Top up your wallet" : "Send money to your bank"} back="/user/wallet" />

      <div className="space-y-4">
        <Card {...rise(0)} className="animate-np-rise">
          <label htmlFor="amount" className="text-[13px] text-np-muted">
            Amount
          </label>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-[30px] font-extrabold text-np-muted">৳</span>
            <input
              id="amount"
              inputMode="decimal"
              autoFocus
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value.replace(/[^\d.]/g, ""));
                setError(undefined);
              }}
              placeholder="0"
              aria-invalid={!!error}
              className="h-14 min-w-0 flex-1 rounded-2xl border border-np-border bg-white px-4 text-[30px] font-extrabold text-np-text outline-none placeholder:text-np-subtle focus:border-np-primary focus:ring-4 focus:ring-np-primary/15"
            />
          </div>
          {!!error && <p className="mt-1.5 text-[13px] text-np-danger">{error}</p>}
          {presets.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {presets.map((p, i) => (
                <button
                  key={`${p}-${i}`}
                  type="button"
                  onClick={() => {
                    setAmount(String(p));
                    setError(undefined);
                  }}
                  className={cn(
                    "cursor-pointer rounded-full px-3.5 py-2 text-[13px] font-bold transition-colors",
                    String(p) === amount ? "bg-np-primary-dark text-white" : "bg-np-primary-soft text-np-text hover:bg-[#d6efdf]",
                  )}
                >
                  {!deposit && i === presets.length - 1 ? "Max" : formatMoney(p)}
                </button>
              ))}
            </div>
          )}
          <p className="mt-3 flex items-center gap-1.5 text-[13px] text-np-muted">
            <Wallet className="size-[15px]" />
            Current balance <span className="font-bold text-np-text">{formatMoney(balance)}</span>
          </p>
        </Card>

        {!deposit && (
          <Notice
            tone="info"
            icon={Building2}
            title="Paid to your registered bank account"
            message={user?.bankAccountNo ? `${user.bankName ?? "Bank"} · A/C ${user.bankAccountNo}` : "Add your bank details in Profile so we know where to send the money."}
            href={user?.bankAccountNo ? undefined : "/user/profile/edit"}
          />
        )}

        <Card {...rise(1)} className="animate-np-rise space-y-4">
          <SelectInput label={deposit ? "Paid via" : "Receive via"} value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} options={METHODS} />
          {deposit && (
            <>
              <TextInput label="Payment date" type="date" value={paymentDate} max={toIsoDay(new Date())} onChange={(e) => setPaymentDate(e.target.value)} />
              <TextInput label="Transaction / reference ID" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} placeholder="e.g. TXN123456" />
            </>
          )}
          <TextArea label="Note" value={comments} onChange={(e) => setComments(e.target.value)} placeholder="Optional" />
          {deposit && <ImagePicker label="Payment proof" value={proof} onChange={setProof} hint="Upload the deposit slip or transfer screenshot." />}
        </Card>
      </div>

      <StickyFooter>
        <Button type="submit" size="lg" block icon={deposit ? CircleArrowDown : CircleArrowUp} loading={isLoading} disabled={!amount || overLimit}>
          {deposit ? "Submit deposit" : "Request withdrawal"}
        </Button>
      </StickyFooter>
    </form>
  );
}
