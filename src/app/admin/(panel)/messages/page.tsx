import type { Metadata } from "next";
import { deleteMessage, setMessageRead } from "@/actions/messages";
import DeleteButton from "@/components/admin/DeleteButton";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Messages" };

export default async function MessagesPage() {
  const messages = await prisma.message.findMany({ orderBy: { createdAt: "desc" }, take: 200 });

  return (
    <div className="space-y-8">
      <header>
        <p className="eyebrow">Inbox</p>
        <h1 className="mt-2 font-display text-5xl uppercase text-white">Messages</h1>
        <p className="mt-2 text-sm text-zinc-500">Submissions from the contact form on your site.</p>
      </header>

      {messages.length === 0 ? (
        <p className="text-sm text-zinc-500">Nothing here yet.</p>
      ) : (
        <ul className="space-y-4">
          {messages.map((m) => (
            <li key={m.id} className={`card p-5 ${m.read ? "" : "border-brand/50"}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 font-semibold text-white">
                    {!m.read && <span className="h-2 w-2 rounded-full bg-brand" aria-label="Unread" />}
                    {m.name}
                  </p>
                  <a href={`mailto:${m.email}`} className="text-sm text-brand hover:underline">
                    {m.email}
                  </a>
                </div>
                <time dateTime={m.createdAt.toISOString()} className="text-xs text-zinc-500">
                  {m.createdAt.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
                </time>
              </div>

              {m.subject && <p className="mt-4 text-sm font-semibold text-zinc-200">{m.subject}</p>}
              <p className="mt-2 whitespace-pre-line break-words text-sm leading-relaxed text-zinc-400">{m.body}</p>

              <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-white/10 pt-4">
                <a
                  href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject || "your message"}`)}`}
                  className="btn-primary btn-sm"
                >
                  Reply
                </a>
                <form action={setMessageRead}>
                  <input type="hidden" name="id" value={m.id} />
                  <input type="hidden" name="read" value={m.read ? "0" : "1"} />
                  <button type="submit" className="btn-ghost btn-sm">
                    {m.read ? "Mark unread" : "Mark read"}
                  </button>
                </form>
                <DeleteButton action={deleteMessage} id={m.id} confirmText="Delete this message?" />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
