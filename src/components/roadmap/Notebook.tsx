import { useState } from "react";
import { NotebookPen, Plus, Trash2 } from "lucide-react";
import { useNotebook } from "@/hooks/use-notebook";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

export function Notebook() {
  const { todos, note, addTodo, toggleTodo, removeTodo, setNote } = useNotebook();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");

  const remaining = todos.filter((t) => !t.done).length;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Notlarımı ve yapılacaklar listemi aç"
        className="fixed top-1/2 right-0 z-40 flex -translate-y-1/2 cursor-pointer items-center gap-1.5 rounded-l-md border border-r-0 border-border bg-card px-2 py-3 text-foreground shadow-md transition-colors hover:bg-accent [writing-mode:vertical-rl]"
      >
        <NotebookPen className="size-3.5 rotate-90" aria-hidden />
        <span className="font-mono text-[0.65rem] font-semibold tracking-wide">NOTLARIM</span>
        {remaining > 0 && (
          <span className="landed-badge grid size-4 shrink-0 -rotate-90 place-items-center rounded-full font-mono text-[0.6rem] font-bold">
            {remaining}
          </span>
        )}
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
          <SheetHeader className="border-b border-border px-5 py-4">
            <SheetTitle className="flex items-center gap-2">
              <NotebookPen className="size-4.5 text-primary" /> Notlarım
            </SheetTitle>
            <SheetDescription>
              Kendi checklist'in ve notların — sadece bu cihazda saklanır.
            </SheetDescription>
          </SheetHeader>

          <Tabs defaultValue="todo" className="flex min-h-0 flex-1 flex-col">
            <TabsList className="mx-5 mt-4 w-fit">
              <TabsTrigger value="todo">Yapılacaklar</TabsTrigger>
              <TabsTrigger value="note">Not</TabsTrigger>
            </TabsList>

            <TabsContent value="todo" className="flex min-h-0 flex-1 flex-col gap-3 px-5 py-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  addTodo(draft);
                  setDraft("");
                }}
                className="flex gap-2"
              >
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Yeni madde ekle..."
                  className="flex-1 rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
                <Button type="submit" size="icon" aria-label="Ekle" disabled={!draft.trim()}>
                  <Plus className="size-4" />
                </Button>
              </form>

              <ul className="flex-1 space-y-1 overflow-y-auto">
                {todos.length === 0 && (
                  <li className="mt-8 text-center text-sm text-muted-foreground">
                    Henüz madde yok — kendi checklist'ini oluşturmaya başla.
                  </li>
                )}
                {todos.map((t) => (
                  <li
                    key={t.id}
                    className="group flex items-center gap-2.5 rounded-md px-2 py-1.5 hover:bg-secondary/60"
                  >
                    <Checkbox checked={t.done} onCheckedChange={() => toggleTodo(t.id)} />
                    <span
                      className={cn(
                        "flex-1 text-sm leading-snug break-words",
                        t.done && "text-muted-foreground line-through",
                      )}
                    >
                      {t.text}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeTodo(t.id)}
                      aria-label="Maddeyi sil"
                      className="cursor-pointer text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            </TabsContent>

            <TabsContent value="note" className="flex min-h-0 flex-1 flex-col px-5 py-4">
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Aklında kalsın diye not al..."
                className="min-h-[240px] flex-1 resize-none"
              />
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>
    </>
  );
}
