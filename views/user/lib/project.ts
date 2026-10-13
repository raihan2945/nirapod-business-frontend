import { baseUrl } from "@/utils/baseUrl";
import { isPast, percent, toNumber } from "./format";
import type { Project, ProjectSection } from "./types";

//stored values are bare filenames; a few legacy rows hold full URLs
export const mediaUrl = (file?: string | null): string | undefined => {
  if (!file) return undefined;
  if (/^(https?:|data:|blob:)/i.test(file)) return file;
  return `${baseUrl}/uploads/photos/${file.replace(/^\/+/, "")}`;
};

export const shareStats = (project?: Project | null) => {
  const total = Number(project?.totalShares || 0);
  const raised = Number(project?.raisedShares || 0);
  return {
    total,
    raised,
    //0 total shares means the admin never capped it - treat as unlimited
    remaining: total > 0 ? Math.max(0, total - raised) : Infinity,
    progress: percent(raised, total),
  };
};

//only an ACTIVE, not-yet-closed, not-sold-out project takes money
export const investBlockReason = (project?: Project | null): string | null => {
  if (!project) return "Project not found";
  if (project.status !== "ACTIVE") return "This project is not open for investment";
  if (project.closedDate && isPast(project.closedDate)) return "The investment window has closed";
  if (Number(project.projectDuration || 0) <= 0 || Number(project.repayment || 0) <= 0)
    return "This project's repayment schedule isn't configured yet";
  if (shareStats(project).remaining <= 0) return "All shares have been sold";
  return null;
};

export const roiLabel = (project?: Project | null): string => {
  if (!project) return "—";
  if (project.expectedRoi) return `${project.expectedRoi}%`;
  const roi = toNumber(project.calculatedRoi);
  return roi ? `${roi}%` : "—";
};

export const markupLabel = (project?: Project | null): { label: string; value: string } => {
  if (project?.musharakaMarkupReturn) return { label: "Musharakah markup", value: `${project.musharakaMarkupReturn}%` };
  return { label: "Murabaha markup", value: `${toNumber(project?.murabahaMarkupReturn)}%` };
};

//what each share pays back per repayment, and in total
export const returnPlan = (project: Project | null | undefined, qty: number) => {
  const perShare = toNumber(project?.temporaryReturnAmount);
  const repayments = Number(project?.repayment || 0);
  const perPayout = Math.round(perShare * qty);
  return { perPayout, repayments, total: perPayout * repayments };
};

const ENTITIES: Record<string, string> = {
  "&nbsp;": " ",
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&#039;": "'",
};

//bankInfo is authored as HTML in the admin. Showing it as plain text keeps
//the portal free of injected markup; render with whitespace-pre-line.
export const htmlToText = (html?: string | null): string => {
  if (!html) return "";
  return html
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<\/\s*(p|div|li|h[1-6])\s*>/gi, "\n")
    .replace(/<\s*li[^>]*>/gi, "• ")
    .replace(/<[^>]+>/g, "")
    .replace(/&[#a-z0-9]+;/gi, (e) => ENTITIES[e.toLowerCase()] ?? e)
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

//detail sections are Json columns, but the admin form stores a JSON *string*
//inside them - accept an array, a JSON string, or garbage
export const parseSections = (value: unknown): ProjectSection[] => {
  let data: unknown = value;
  for (let i = 0; i < 2 && typeof data === "string"; i++) {
    try {
      data = JSON.parse(data);
    } catch {
      return [];
    }
  }
  if (!Array.isArray(data)) return [];
  return data
    .filter((item): item is ProjectSection => !!item && typeof item === "object")
    .filter((item) => !!(item.title || item.description));
};
