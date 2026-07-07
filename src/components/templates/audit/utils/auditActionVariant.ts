import { AUDIT_ACTION_VARIANT_MAP } from "../constants";

const FALLBACK_VARIANT = "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400";

export function auditActionVariant(actionType: string): string {
  return AUDIT_ACTION_VARIANT_MAP[actionType] ?? FALLBACK_VARIANT;
}
