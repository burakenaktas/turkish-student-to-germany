/** YKS yerleştirme puan skalası — Bavyera formülü Nmax/Nmin girdileri. */
export const YKS_NMAX = 560;
export const YKS_NMIN = 180;

/** Bavyera formülü: bir puanı (Nd) Alman not sistemine (1,0–5,0) çevirir. */
export function computeGermanGrade(score: number, nmax: number, nmin: number): number | null {
  if (![score, nmax, nmin].every((n) => Number.isFinite(n)) || nmax <= nmin) return null;
  const raw = 1 + (3 * (nmax - score)) / (nmax - nmin);
  return Math.min(Math.max(raw, 1), 5);
}

export function gradeLabel(grade: number): string {
  if (grade <= 1.5) return "sehr gut (çok iyi)";
  if (grade <= 2.5) return "gut (iyi)";
  if (grade <= 3.5) return "befriedigend (orta)";
  if (grade <= 4.0) return "ausreichend (yeterli)";
  return "nicht ausreichend (yetersiz)";
}

export function formatGrade(grade: number): string {
  return grade.toFixed(1).replace(".", ",");
}
