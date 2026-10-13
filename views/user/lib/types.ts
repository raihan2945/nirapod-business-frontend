//Shapes returned by the API, matching the mobile app's models. Prisma Decimal
//columns arrive as strings in JSON, so money fields are `string | number` and
//always go through toNumber() before any arithmetic.

export type Money = string | number;

export type ProjectStatus = "ACTIVE" | "INACTIVE" | "CLOSED";
export type VerifyStatus = "PENDING" | "APPROVED" | "CANCELLED";
export type InvestmentStatus = "PENDING" | "APPROVED" | "CLOSED" | "REJECTED" | "CANCELLED";
export type PaymentStatus = "PENDING" | "PAID" | "CANCELLED";
export type WalletTransactionType = "DEPOSIT" | "WITHDRAWAL";
export type TransactionStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface User {
  id: string;
  serial: number;
  fullName: string;
  mobile: string;
  email: string;
  fatherName?: string | null;
  motherName?: string | null;
  nid?: string | null;
  gender?: string | null;
  bloodGroup?: string | null;
  currentProfession?: string | null;
  facebook?: string | null;
  nomineeName?: string | null;
  nomineeRelation?: string | null;
  nomineeMobile?: string | null;
  photo?: string | null;
  address?: string | null;
  bankAccountNo?: string | null;
  bankAccountName?: string | null;
  bankName?: string | null;
  branchName?: string | null;
  routingNo?: string | null;
  role: "user" | "investor" | "admin";
  status: "ACTIVE" | "INACTIVE";
  verifyStatus?: VerifyStatus | null;
  balance?: Money;
  createAt: string;
  updatedAt: string;
}

export interface UserCounts {
  totalProjects: number;
  totalInvestedAmount: Money;
  totalPendingInvestments: number;
}

export interface ProjectSection {
  title?: string;
  description?: string;
}

export interface Project {
  id: string;
  serial: number;
  title: string;
  description?: string | null;
  investmentGoal: Money;
  minInvestment: Money;
  murabahaMarkupReturn: Money;
  temporaryReturnAmount: Money;
  calculatedRoi: Money;
  musharakaMarkupReturn?: string | null;
  expectedRoi?: string | null;
  repayment: number;
  projectDuration: number;
  totalShares?: number | null;
  raisedShares?: number | null;
  roles?: unknown;
  theBusiness?: unknown;
  theContract?: unknown;
  shariahCompliance?: unknown;
  potentialRisks?: unknown;
  coverPhoto?: string | null;
  bankInfo?: string | null;
  status: ProjectStatus;
  closedDate?: string | null;
  createdAt: string;
}

export interface Investment {
  id: string;
  serial: number;
  projectId: string;
  userId: string;
  paymentMethod: string;
  paymentDate?: string | null;
  proof1?: string | null;
  transactionId?: string | null;
  comments?: string | null;
  qty?: number | null;
  amount: Money;
  status: InvestmentStatus;
  investmentAt: string;
  createdAt: string;
  Project?: Project;
}

export interface InvestmentReturn {
  id: string;
  serial: number;
  InvestmentId: string;
  qty?: number | null;
  totalAmount?: number | null;
  status: PaymentStatus;
  date: string;
  ProjectInvestment?: Investment & { Project?: Project };
}

export interface WalletTransaction {
  id: string;
  serial: number;
  userId: string;
  investmentId?: string | null;
  paymentMethod: string;
  paymentDate?: string | null;
  proof1?: string | null;
  transactionId?: string | null;
  comments?: string | null;
  amount: Money;
  type: WalletTransactionType;
  status: TransactionStatus;
  createdAt: string;
  ProjectInvestment?: (Investment & { Project?: Project }) | null;
}

//list endpoints answer { data, pagination: { total_items } }
export interface ListResponse<T> {
  data: T[];
  pagination?: { total_items?: number };
}
