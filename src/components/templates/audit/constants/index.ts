export const AUDIT_COLUMNS = ["Data e Hora", "Ação", "Entidade", "ID", "Detalhes"] as const;

export const AUDIT_SKELETON_WIDTHS = ["w-36", "w-24", "w-28", "w-20", "w-12"] as const;

export const ITEMS_PER_PAGE = 8;

export const AUDIT_ACTION_VARIANT_MAP: Record<string, string> = {
  CREATE_ORDER: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400",
  UPDATE_STATUS: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400",
};
