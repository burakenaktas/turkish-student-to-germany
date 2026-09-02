import { useState } from "react";
import { X } from "lucide-react";

const WHATSAPP_NUMBER = "491773167286";
const WHATSAPP_MESSAGE =
  "Merhaba almanyadaokumakistiyorum.com'dan ulaşıyorum sizlere şu konuda bir sorum var: ";
const WHATSAPP_CAPTION =
  "Sitedeki herhangi bir bilgi güncellemesi veya site hakkında sorular için ulaşabilirsiniz.";
const DISMISS_KEY = "almanya-whatsapp-caption-dismissed-v1";

const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12.05 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zm8.413-18.297A11.815 11.815 0 0 0 12.05.5C5.735.5.598 5.638.596 11.951a11.9 11.9 0 0 0 1.591 5.972L.5 23.5l5.723-1.5a11.95 11.95 0 0 0 5.822 1.483h.005c6.316 0 11.453-5.14 11.456-11.454a11.4 11.4 0 0 0-3.043-8.041z" />
    </svg>
  );
}

function readDismissed(): boolean {
  try {
    return localStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return false;
  }
}

export function WhatsAppButton() {
  const [captionOpen, setCaptionOpen] = useState(() => !readDismissed());

  function dismissCaption() {
    setCaptionOpen(false);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore quota errors */
    }
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp'tan bize yaz"
      title="WhatsApp'tan bize yaz"
      className="fixed right-5 bottom-5 z-40 flex items-center gap-2.5 rounded-full bg-[#25D366] py-2 pr-2 pl-2 text-white shadow-lg transition-transform hover:scale-105"
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white/15">
        <WhatsAppIcon className="size-5.5" />
      </span>
      {captionOpen && (
        <span className="hidden max-w-[13rem] items-start gap-1.5 py-0.5 pr-1 text-left sm:flex">
          <span className="text-xs leading-snug font-medium">{WHATSAPP_CAPTION}</span>
          <span
            role="button"
            tabIndex={0}
            aria-label="Yazıyı kapat"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              dismissCaption();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.stopPropagation();
                dismissCaption();
              }
            }}
            className="mt-0.5 shrink-0 cursor-pointer rounded-full p-0.5 opacity-70 transition-opacity hover:opacity-100"
          >
            <X className="size-3" />
          </span>
        </span>
      )}
    </a>
  );
}
