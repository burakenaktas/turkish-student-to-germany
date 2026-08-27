import { useState } from "react";
import { ArrowRight, UserRound } from "lucide-react";
import { useProfile } from "@/hooks/use-profile";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GradeConverter } from "@/components/roadmap/GradeConverter";

type Props = { onDone: () => void };

export function ProfileStep({ onDone }: Props) {
  const { profile, setProfile } = useProfile();
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [gpa, setGpa] = useState(profile.gpa);

  function submit() {
    setProfile({ name: name.trim(), email: email.trim(), gpa: gpa.trim() });
    onDone();
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
          <UserRound className="size-4.5" />
        </span>
        <div className="min-w-0">
          <p className="font-mono text-[0.68rem] tracking-wide text-muted-foreground">
            HIZLI TEST · BAŞLANGIÇ
          </p>
          <p className="truncate text-sm font-semibold text-foreground">Önce seni tanıyalım</p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        Rotanı senin adına kişiselleştirelim. Bu bilgiler sadece bu cihazda saklanır, hiçbir yere
        gönderilmez.
      </p>

      <div className="mt-5 space-y-4">
        <div>
          <Label htmlFor="profile-name">Ad Soyad</Label>
          <Input
            id="profile-name"
            className="mt-1.5"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Örn. Ayşe Yılmaz"
          />
        </div>
        <div>
          <Label htmlFor="profile-email">E-posta</Label>
          <Input
            id="profile-email"
            type="email"
            className="mt-1.5"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ornek@eposta.com"
          />
        </div>
        <div>
          <Label>NC karşılaştırman için</Label>
          <p className="mt-1 text-[0.75rem] text-muted-foreground">
            Sadece YKS yerleştirme puanını gir; Alman not karşılığını (NC ile kıyaslanabilecek hale)
            arkada biz hesaplarız.
          </p>
          <div className="mt-2.5 rounded-md border border-border bg-secondary/30 p-3.5">
            <GradeConverter
              preset={{
                nmax: 560,
                nmin: 180,
                scoreLabel: "YKS YERLEŞTİRME PUANIN",
                title: "YKS puanına göre NC hesaplayıcı",
                description:
                  "YKS yerleştirme puanını gir, Bavyera formülüyle Alman not karşılığını hesaplayalım.",
              }}
              onResult={(grade) => setGpa(grade !== null ? grade.toFixed(1).replace(".", ",") : "")}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3 border-t border-border pt-4">
        <button
          type="button"
          onClick={onDone}
          className="cursor-pointer font-mono text-[0.7rem] text-muted-foreground transition-colors hover:text-foreground"
        >
          Atla
        </button>
        <button
          type="button"
          onClick={submit}
          disabled={!name.trim()}
          className="gate-badge inline-flex cursor-pointer items-center gap-1.5 rounded-md px-3.5 py-2 font-mono text-[0.7rem] font-semibold disabled:cursor-not-allowed disabled:opacity-40"
        >
          Devam et <ArrowRight className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
