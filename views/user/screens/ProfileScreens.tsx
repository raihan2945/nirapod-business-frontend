"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Building2,
  CalendarDays,
  ChartPie,
  ChevronRight,
  Eye,
  EyeOff,
  IdCard,
  KeyRound,
  LogOut,
  Newspaper,
  SquarePen,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUpdateUserMutation } from "@/state/features/user/userApi";
import { useChangePasswordMutation } from "@/state/features/auth/authApi";
import { formatDate } from "../lib/format";
import { errorMessage, useAuthId, useMe } from "../lib/hooks";
import { mediaUrl } from "../lib/project";
import { statusLabel, statusTone } from "../lib/status";
import type { User } from "../lib/types";
import { Avatar, Badge, Button, Card, InfoRow, Spinner, rise } from "../ui/primitives";
import { ImagePicker, SelectInput, TextArea, TextInput } from "../ui/form";
import { Sheet, useToast } from "../ui/overlay";
import { HeaderIconButton, PageTitle, ScreenHeader, StickyFooter } from "../shell/ScreenHeader";
import { useLogout } from "../shell/PortalShell";

/* ------------------------------- Menu pieces ----------------------------- */

interface MenuItemProps {
  icon: LucideIcon;
  label: string;
  description?: string;
  href?: string;
  onClick?: () => void;
  danger?: boolean;
}

function MenuItem({ icon: Icon, label, description, href, onClick, danger }: MenuItemProps) {
  const body = (
    <>
      <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl", danger ? "bg-np-danger-soft text-np-danger" : "bg-np-primary-soft text-np-primary-dark")}>
        <Icon className="size-[19px]" />
      </span>
      <span className="min-w-0 flex-1">
        <span className={cn("block text-[15px] font-semibold", danger ? "text-np-danger" : "text-np-text")}>{label}</span>
        {description && <span className="block text-[13px] text-np-muted">{description}</span>}
      </span>
      {!danger && <ChevronRight className="size-[18px] shrink-0 text-np-subtle" />}
    </>
  );
  const cls = "flex w-full cursor-pointer items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-np-surface-muted";
  return href ? (
    <Link href={href} className={cls}>
      {body}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={cls}>
      {body}
    </button>
  );
}

function MenuGroup({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      {title && <p className="ml-1 text-[11px] font-semibold tracking-wide text-np-subtle">{title.toUpperCase()}</p>}
      <div className="divide-y divide-np-border overflow-hidden rounded-[20px] border border-np-border bg-white shadow-np">{children}</div>
    </div>
  );
}

/* ---------------------------------- Profile ------------------------------ */

export function ProfileScreen() {
  const { user } = useMe();
  const logout = useLogout();
  const [confirm, setConfirm] = useState(false);

  return (
    <div>
      <PageTitle title="Profile" />

      <div {...rise(0)} className="relative flex animate-np-rise items-center gap-4 overflow-hidden rounded-[28px] bg-gradient-to-br from-np-deep via-np-mid to-np-primary p-5 text-white sm:p-6">
        <span aria-hidden className="pointer-events-none absolute -right-20 -top-24 size-56 rounded-full border-[30px] border-white/[0.06]" />
        <Avatar name={user?.fullName} photo={user?.photo} size={76} ring />
        <div className="relative min-w-0 flex-1 space-y-0.5">
          <p className="truncate text-xl font-bold">{user?.fullName}</p>
          <p className="truncate text-[13px] text-white/80">{user?.email}</p>
          <p className="text-[13px] text-white/80">
            {user?.mobile} · Member #{user?.serial}
          </p>
          {!!user?.verifyStatus && (
            <div className="pt-2">
              <Badge
                label={user.verifyStatus === "APPROVED" ? "Verified" : `KYC ${statusLabel(user.verifyStatus).toLowerCase()}`}
                tone={statusTone(user.verifyStatus)}
              />
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div {...rise(1)} className="animate-np-rise space-y-5">
          <MenuGroup title="Account">
            <MenuItem icon={IdCard} label="Personal details" description="KYC, nominee and bank info" href="/user/profile/details" />
            <MenuItem icon={SquarePen} label="Edit profile" href="/user/profile/edit" />
            <MenuItem icon={KeyRound} label="Change password" href="/user/profile/password" />
          </MenuGroup>
          <MenuGroup title="Investing">
            <MenuItem icon={ChartPie} label="My portfolio" href="/user/portfolio" />
            <MenuItem icon={CalendarDays} label="Return schedule" href="/user/returns" />
            <MenuItem icon={Wallet} label="Wallet" href="/user/wallet" />
          </MenuGroup>
        </div>
        <div {...rise(2)} className="animate-np-rise space-y-5">
          <MenuGroup title="More">
            <MenuItem icon={Newspaper} label="Insights & news" href="/blogs" />
            <MenuItem icon={Building2} label="Apply for business funding" description="Raise capital for your business" href="/investor-signup" />
          </MenuGroup>
          <MenuGroup>
            <MenuItem icon={LogOut} label="Log out" onClick={() => setConfirm(true)} danger />
          </MenuGroup>
          <p className="text-center text-[13px] text-np-subtle">Nirapad Business · Investor portal</p>
        </div>
      </div>

      <Sheet
        open={confirm}
        onClose={() => setConfirm(false)}
        title="Log out?"
        footer={
          <>
            <Button variant="outline" block onClick={() => setConfirm(false)}>
              Cancel
            </Button>
            <Button variant="danger" block icon={LogOut} onClick={logout}>
              Log out
            </Button>
          </>
        }
      >
        <p className="text-[15px] text-np-muted">You&apos;ll need your email and password to log back in.</p>
      </Sheet>
    </div>
  );
}

/* ------------------------------ Personal details ------------------------- */

//read-only view of every KYC field
function UserDetailsCards({ user }: { user: User }) {
  const groups: { title: string; rows: [string, string | null | undefined][] }[] = [
    {
      title: "Personal",
      rows: [
        ["Full name", user.fullName],
        ["Email", user.email],
        ["Mobile", user.mobile],
        ["NID", user.nid],
        ["Gender", user.gender],
        ["Blood group", user.bloodGroup],
        ["Father's name", user.fatherName],
        ["Mother's name", user.motherName],
        ["Profession", user.currentProfession],
        ["Facebook", user.facebook],
        ["Address", user.address],
        ["Member since", formatDate(user.createAt)],
      ],
    },
    {
      title: "Nominee",
      rows: [
        ["Name", user.nomineeName],
        ["Relation", user.nomineeRelation],
        ["Mobile", user.nomineeMobile],
      ],
    },
    {
      title: "Bank account",
      rows: [
        ["Account name", user.bankAccountName],
        ["Account number", user.bankAccountNo],
        ["Bank", user.bankName],
        ["Branch", user.branchName],
        ["Routing no.", user.routingNo],
      ],
    },
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
      {groups.map((g, i) => (
        <Card key={g.title} {...rise(i)} className={cn("animate-np-rise", i === 0 && "lg:row-span-2")}>
          <h3 className="mb-1 text-[17px] font-bold">{g.title}</h3>
          {g.rows.map(([label, value], j) => (
            <InfoRow key={label} label={label} value={value ?? undefined} last={j === g.rows.length - 1} />
          ))}
        </Card>
      ))}
    </div>
  );
}

export function ProfileDetailsScreen() {
  const { user } = useMe();
  return (
    <>
      <ScreenHeader
        title="Personal details"
        back="/user/profile"
        right={
          <HeaderIconButton href="/user/profile/edit" label="Edit profile">
            <SquarePen className="size-5" />
          </HeaderIconButton>
        }
      />
      {user ? <UserDetailsCards user={user} /> : <Spinner />}
    </>
  );
}

/* -------------------------------- Edit profile --------------------------- */

//same rules as signup and the mobile app; editing is forgiving about gaps,
//but anything filled in must still be well-formed
const BD_MOBILE = /^01[3-9]\d{8}$/;
const optional = z.string().trim();
const optionalMatching = (re: RegExp, message: string) => z.string().trim().refine((v) => v === "" || re.test(v), message);

const profileSchema = z.object({
  fullName: z.string().trim().min(3, "Full name must be at least 3 characters"),
  mobile: z.string().trim().regex(BD_MOBILE, "Enter a valid 11-digit number, e.g. 01712345678"),
  fatherName: optional,
  motherName: optional,
  nid: optionalMatching(/^(\d{10}|\d{13}|\d{17})$/, "NID must be 10, 13 or 17 digits"),
  gender: optional,
  bloodGroup: optional,
  currentProfession: optional,
  facebook: optional,
  address: optional,
  nomineeName: optional,
  nomineeRelation: optional,
  nomineeMobile: optionalMatching(BD_MOBILE, "Enter a valid 11-digit number"),
  bankAccountName: optional,
  bankAccountNo: optionalMatching(/^\d{6,20}$/, "Account number must be 6-20 digits"),
  bankName: optional,
  branchName: optional,
  routingNo: optionalMatching(/^\d{9}$/, "Routing no. must be exactly 9 digits"),
});

type ProfileForm = z.infer<typeof profileSchema>;
const FIELDS = Object.keys(profileSchema.shape) as (keyof ProfileForm)[];

const GENDERS = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
];
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((g) => ({ label: g, value: g }));

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card className="space-y-4">
      <p className="text-[11px] font-semibold tracking-wide text-np-primary-dark">{title.toUpperCase()}</p>
      {children}
    </Card>
  );
}

export function EditProfileScreen() {
  const router = useRouter();
  const toast = useToast();
  const userId = useAuthId();
  const { user } = useMe();
  const [update, { isLoading }] = useUpdateUserMutation();
  const [photo, setPhoto] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileForm>({ resolver: zodResolver(profileSchema) });

  //fill the form once the profile arrives (nulls become empty strings)
  useEffect(() => {
    if (!user) return;
    reset(Object.fromEntries(FIELDS.map((k) => [k, (user[k] as string | null | undefined) ?? ""])) as ProfileForm);
  }, [user, reset]);

  const save = handleSubmit(async (values) => {
    const form = new FormData();
    FIELDS.forEach((k) => form.append(k, values[k]));
    if (photo) form.append("photo", photo);
    const res = await update({ id: userId, data: form });
    if ("error" in res) {
      toast.error("Couldn't save changes", errorMessage(res.error));
      return;
    }
    toast.success("Profile updated");
    router.push("/user/profile");
  });

  if (!user) {
    return (
      <>
        <ScreenHeader title="Edit profile" back="/user/profile" />
        <Spinner />
      </>
    );
  }

  const e = (k: keyof ProfileForm) => errors[k]?.message;

  return (
    <form onSubmit={save} className="mx-auto max-w-3xl">
      <ScreenHeader title="Edit profile" back="/user/profile" />

      <div className="space-y-4">
        <div className="flex justify-center py-2">
          <ImagePicker shape="circle" label="Change photo" value={photo} onChange={setPhoto} existingUrl={mediaUrl(user.photo)} />
        </div>

        <Section title="Personal">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput label="Full name" required {...register("fullName")} error={e("fullName")} />
            <TextInput label="Mobile" required inputMode="tel" maxLength={11} {...register("mobile")} error={e("mobile")} />
            <TextInput label="NID" inputMode="numeric" maxLength={17} {...register("nid")} error={e("nid")} />
            <div className="grid grid-cols-2 gap-3">
              <SelectInput label="Gender" placeholder="Select" options={GENDERS} {...register("gender")} />
              <SelectInput label="Blood group" placeholder="Select" options={BLOOD_GROUPS} {...register("bloodGroup")} />
            </div>
            <TextInput label="Father's name" {...register("fatherName")} />
            <TextInput label="Mother's name" {...register("motherName")} />
            <TextInput label="Profession" {...register("currentProfession")} />
            <TextInput label="Facebook link" type="url" {...register("facebook")} />
          </div>
          <TextArea label="Address" {...register("address")} />
        </Section>

        <Section title="Nominee">
          <div className="grid gap-4 sm:grid-cols-3">
            <TextInput label="Nominee name" {...register("nomineeName")} />
            <TextInput label="Relation" {...register("nomineeRelation")} />
            <TextInput label="Nominee mobile" inputMode="tel" maxLength={11} {...register("nomineeMobile")} error={e("nomineeMobile")} />
          </div>
        </Section>

        <Section title="Bank account">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput label="Account name" {...register("bankAccountName")} />
            <TextInput label="Account number" inputMode="numeric" {...register("bankAccountNo")} error={e("bankAccountNo")} />
            <TextInput label="Bank name" {...register("bankName")} />
            <TextInput label="Branch name" {...register("branchName")} />
            <TextInput label="Routing no." inputMode="numeric" maxLength={9} {...register("routingNo")} error={e("routingNo")} />
          </div>
        </Section>

        <p className="text-center text-[13px] text-np-subtle">Email can’t be changed here. Contact support if you need to update it.</p>
      </div>

      <StickyFooter>
        <Button type="submit" size="lg" block loading={isLoading} disabled={!isDirty && !photo}>
          Save changes
        </Button>
      </StickyFooter>
    </form>
  );
}

/* ------------------------------ Change password -------------------------- */

const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(6, "Enter your current password"),
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .regex(/[A-Za-z]/, "Password must contain at least one letter")
      .regex(/\d/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, { message: "Passwords do not match", path: ["confirmPassword"] })
  .refine((d) => d.newPassword !== d.oldPassword, { message: "Choose a password you haven't used here", path: ["newPassword"] });

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

export function ChangePasswordScreen() {
  const router = useRouter();
  const toast = useToast();
  const userId = useAuthId();
  const [change, { isLoading }] = useChangePasswordMutation();
  const [show, setShow] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
  });

  const submit = handleSubmit(async ({ oldPassword, newPassword }) => {
    if (!userId) return;
    const res = await change({ userId, oldPassword, newPassword });
    if ("error" in res) {
      const msg = errorMessage(res.error, "Couldn't change password");
      //the API answers a wrong current password with a plain message
      if (msg.toLowerCase().includes("old password")) setError("oldPassword", { message: "Current password is incorrect" });
      toast.error("Couldn't change password", msg);
      return;
    }
    toast.success("Password changed");
    router.push("/user/profile");
  });

  const type = show ? "text" : "password";

  return (
    <form onSubmit={submit} className="mx-auto max-w-md">
      <ScreenHeader title="Change password" back="/user/profile" />
      <Card className="space-y-4">
        <p className="text-[15px] text-np-muted">Use at least 6 characters with a mix of letters and numbers.</p>
        <TextInput label="Current password" type={type} autoComplete="current-password" {...register("oldPassword")} error={errors.oldPassword?.message} />
        <TextInput label="New password" type={type} autoComplete="new-password" {...register("newPassword")} error={errors.newPassword?.message} />
        <TextInput label="Confirm new password" type={type} autoComplete="new-password" {...register("confirmPassword")} error={errors.confirmPassword?.message} />
        <button type="button" onClick={() => setShow((s) => !s)} className="flex cursor-pointer items-center gap-2 text-[13px] font-semibold text-np-primary-dark">
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          {show ? "Hide passwords" : "Show passwords"}
        </button>
        <Button type="submit" size="lg" block icon={KeyRound} loading={isLoading}>
          Update password
        </Button>
      </Card>
    </form>
  );
}
