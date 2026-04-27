"use client";

import "react-big-calendar/lib/css/react-big-calendar.css";

import React, { useState, useCallback, useEffect } from "react";
import { Calendar, dateFnsLocalizer, View, SlotInfo } from "react-big-calendar";
import {
  format,
  parse,
  startOfWeek,
  getDay,
  startOfMonth,
  endOfMonth,
  addMonths,
  addHours,
} from "date-fns";
import { enUS } from "date-fns/locale";
import useSWR from "swr";
import Link from "next/link";
import { toast } from "sonner";

// ── Localizer ─────────────────────────────────────────────────────────────────
const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date: Date) => startOfWeek(date, { weekStartsOn: 0 }),
  getDay,
  locales,
});

// ── Types ─────────────────────────────────────────────────────────────────────
interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  attendees: { email?: string; displayName?: string; responseStatus?: string; self?: boolean }[];
  meetLink: string | null;
  description: string | null;
  location: string | null;
  organizer: string | null;
  status: string | null;
}

interface RBCEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  resource: CalendarEvent;
}

interface CreateForm {
  title: string;
  start: string;
  end: string;
  attendees: string;
  description: string;
}

// ── Fetcher ───────────────────────────────────────────────────────────────────
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to fetch events");
  }
  return res.json();
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function getInitials(name: string | null | undefined): string {
  if (!name) return "?";
  return name
    .split(/[\s@]/)
    .filter(Boolean)
    .map((n) => n[0].toUpperCase())
    .slice(0, 2)
    .join("");
}

function formatEventTime(start: Date, end: Date, allDay: boolean): string {
  if (allDay) return "All Day";
  return `${format(start, "EEE, MMM d")} · ${format(start, "h:mm a")} – ${format(end, "h:mm a")}`;
}

// ── Custom Toolbar ─────────────────────────────────────────────────────────────
function CustomToolbar({
  label,
  onNavigate,
  onView,
  view,
  onCreateClick,
}: {
  label: string;
  onNavigate: (action: "PREV" | "NEXT" | "TODAY") => void;
  onView: (view: View) => void;
  view: View;
  onCreateClick: () => void;
}) {
  const views: { key: View; label: string; icon: string }[] = [
    { key: "month", label: "Month", icon: "grid_view" },
    { key: "week", label: "Week", icon: "view_week" },
    { key: "day", label: "Day", icon: "view_day" },
    { key: "agenda", label: "Agenda", icon: "list" },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      {/* Navigation */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onNavigate("PREV")}
          className="w-9 h-9 rounded-xl bg-surface-container-low hover:bg-surface-container border border-surface-container/50 flex items-center justify-center text-on-surface-variant hover:text-primary transition-all soft-scale"
        >
          <span className="material-symbols-outlined text-lg">chevron_left</span>
        </button>
        <button
          onClick={() => onNavigate("TODAY")}
          className="px-4 h-9 rounded-xl bg-surface-container-low hover:bg-surface-container border border-surface-container/50 text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:text-primary transition-all soft-scale"
        >
          Today
        </button>
        <button
          onClick={() => onNavigate("NEXT")}
          className="w-9 h-9 rounded-xl bg-surface-container-low hover:bg-surface-container border border-surface-container/50 flex items-center justify-center text-on-surface-variant hover:text-primary transition-all soft-scale"
        >
          <span className="material-symbols-outlined text-lg">chevron_right</span>
        </button>
        <span className="font-headline text-xl font-black text-on-surface tracking-tight ml-2">
          {label}
        </span>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* View switcher */}
        <div className="flex items-center bg-surface-container-low border border-surface-container/50 rounded-xl p-1 gap-1">
          {views.map((v) => (
            <button
              key={v.key}
              onClick={() => onView(v.key)}
              title={v.label}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all soft-scale ${
                view === v.key
                  ? "bg-primary text-on-primary shadow-sm"
                  : "text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{v.icon}</span>
            </button>
          ))}
        </div>

        {/* Create event */}
        <button
          onClick={onCreateClick}
          className="flex items-center gap-2 px-4 h-9 btn-gradient text-black font-headline font-black text-[10px] uppercase tracking-widest rounded-xl soft-scale shadow-lg shadow-accent/20 transition-all"
        >
          <span className="material-symbols-outlined text-base">add</span>
          New Event
        </button>
      </div>
    </div>
  );
}

// ── Event Detail Modal ────────────────────────────────────────────────────────
function EventModal({
  event,
  onClose,
}: {
  event: RBCEvent;
  onClose: () => void;
}) {
  const raw = event.resource;
  const start = new Date(raw.start);
  const end = new Date(raw.end);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div
        className="relative bg-surface-container-lowest rounded-3xl shadow-2xl shadow-black/20 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-surface-container/30 bg-primary/5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                <span
                  className="material-symbols-outlined text-xl"
                  style={{ color: "#00dc82", fontVariationSettings: "'FILL' 1" }}
                >
                  event
                </span>
              </div>
              <div>
                <h2 className="font-headline text-xl font-black text-on-surface tracking-tight leading-tight">
                  {raw.title}
                </h2>
                <p className="text-[11px] font-bold text-on-surface-variant opacity-60 mt-1">
                  {formatEventTime(start, end, raw.allDay)}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-all soft-scale shrink-0"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-8 py-6 space-y-5">
          {/* Meet Link */}
          {raw.meetLink && (
            <a
              href={raw.meetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 w-full px-5 py-3.5 bg-accent/10 border border-accent/20 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all hover:bg-accent/20 soft-scale group"
              style={{ color: "#00dc82" }}
            >
              <span
                className="material-symbols-outlined text-xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                videocam
              </span>
              Join Google Meet
              <span className="material-symbols-outlined text-sm ml-auto opacity-50 group-hover:opacity-100 transition-opacity">
                open_in_new
              </span>
            </a>
          )}

          {/* Location */}
          {raw.location && (
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-lg text-on-surface-variant opacity-50 mt-0.5">
                location_on
              </span>
              <p className="text-sm text-on-surface font-medium">{raw.location}</p>
            </div>
          )}

          {/* Description */}
          {raw.description && (
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-lg text-on-surface-variant opacity-50 mt-0.5">
                notes
              </span>
              <p
                className="text-sm text-on-surface-variant leading-relaxed"
                dangerouslySetInnerHTML={{ __html: raw.description }}
              />
            </div>
          )}

          {/* Attendees */}
          {raw.attendees.length > 0 && (
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-60 mb-3">
                Attendees ({raw.attendees.length})
              </p>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {raw.attendees.map((a, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-primary-container flex items-center justify-center text-primary text-[9px] font-black shrink-0">
                      {getInitials(a.displayName || a.email)}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[11px] font-bold text-on-surface truncate">
                        {a.displayName || a.email}
                        {a.self && (
                          <span className="ml-1 text-[9px] text-on-surface-variant opacity-50">
                            (you)
                          </span>
                        )}
                      </span>
                      {a.displayName && a.email && (
                        <span className="text-[10px] text-on-surface-variant opacity-50 truncate">
                          {a.email}
                        </span>
                      )}
                    </div>
                    <div className="ml-auto shrink-0">
                      {a.responseStatus === "accepted" && (
                        <span className="text-[9px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                          Accepted
                        </span>
                      )}
                      {a.responseStatus === "declined" && (
                        <span className="text-[9px] font-black text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                          Declined
                        </span>
                      )}
                      {a.responseStatus === "tentative" && (
                        <span className="text-[9px] font-black text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full">
                          Maybe
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Organizer */}
          {raw.organizer && (
            <div className="flex items-center gap-3 pt-2 border-t border-surface-container/30">
              <span className="material-symbols-outlined text-sm text-on-surface-variant opacity-40">
                person
              </span>
              <p className="text-[10px] text-on-surface-variant opacity-60 font-medium">
                Organized by <span className="font-bold text-on-surface">{raw.organizer}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Create Event Modal ─────────────────────────────────────────────────────────
function CreateEventModal({
  onClose,
  onCreated,
  defaultStart,
}: {
  onClose: () => void;
  onCreated: () => void;
  defaultStart?: Date;
}) {
  const [form, setForm] = useState<CreateForm>({
    title: "",
    start: defaultStart
      ? format(defaultStart, "yyyy-MM-dd'T'HH:mm")
      : format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    end: defaultStart
      ? format(addHours(defaultStart, 1), "yyyy-MM-dd'T'HH:mm")
      : format(addHours(new Date(), 1), "yyyy-MM-dd'T'HH:mm"),
    attendees: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    setIsSubmitting(true);
    const toastId = toast.loading("Creating event...");

    try {
      const res = await fetch("/api/calendar/events/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          start: form.start,
          end: form.end,
          attendees: form.attendees
            .split(",")
            .map((e) => e.trim())
            .filter(Boolean),
          description: form.description,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to create event");
      }

      const data = await res.json();
      toast.success("Event created!", {
        id: toastId,
        description: data.meetLink ? "Google Meet link generated." : undefined,
      });
      onCreated();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to create event", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full bg-surface-container-low border border-surface-container px-4 py-3 rounded-xl text-on-surface text-sm font-medium focus:outline-none focus:border-primary focus:bg-surface-container-lowest transition-all";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div
        className="relative bg-surface-container-lowest rounded-3xl shadow-2xl shadow-black/20 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-surface-container/30 bg-primary/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-accent/10 flex items-center justify-center">
              <span
                className="material-symbols-outlined text-xl"
                style={{ color: "#00dc82", fontVariationSettings: "'FILL' 1" }}
              >
                add_circle
              </span>
            </div>
            <div>
              <h2 className="font-headline text-xl font-black text-on-surface tracking-tight">
                New Event
              </h2>
              <p className="text-[10px] text-on-surface-variant opacity-50 font-bold uppercase tracking-widest">
                Google Calendar
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-all soft-scale"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-60">
              Event Title *
            </label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Team Sync"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-60">
                Start *
              </label>
              <input
                required
                type="datetime-local"
                value={form.start}
                onChange={(e) => setForm((f) => ({ ...f, start: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-60">
                End *
              </label>
              <input
                required
                type="datetime-local"
                value={form.end}
                onChange={(e) => setForm((f) => ({ ...f, end: e.target.value }))}
                className={inputClass}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-60">
              Attendees
              <span className="normal-case ml-1 opacity-50">(comma-separated emails)</span>
            </label>
            <input
              value={form.attendees}
              onChange={(e) => setForm((f) => ({ ...f, attendees: e.target.value }))}
              placeholder="alice@company.com, bob@company.com"
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-60">
              Description
            </label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Optional agenda or notes..."
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <div className="flex items-center gap-1.5 text-[10px] text-on-surface-variant opacity-50">
              <span className="material-symbols-outlined text-sm" style={{ color: "#00dc82" }}>
                videocam
              </span>
              Meet link auto-generated
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="ml-auto flex items-center gap-2 px-6 h-11 btn-gradient text-black font-headline font-black text-[10px] uppercase tracking-widest rounded-xl soft-scale shadow-lg shadow-accent/20 transition-all disabled:opacity-50 disabled:grayscale"
            >
              {isSubmitting ? (
                <div className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <span className="material-symbols-outlined text-base">add</span>
              )}
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Not Connected State ────────────────────────────────────────────────────────
function NotConnectedCard() {
  return (
    <div className="bg-surface-container-lowest border border-surface-container/20 rounded-3xl p-16 flex flex-col items-center text-center gap-6 shadow-sm">
      <div className="w-20 h-20 rounded-3xl bg-surface-container-low flex items-center justify-center">
        <span className="material-symbols-outlined text-4xl text-on-surface-variant opacity-20">
          calendar_month
        </span>
      </div>
      <div className="space-y-2 max-w-md">
        <h3 className="font-headline text-2xl font-black text-on-surface uppercase tracking-tight">
          No Calendar Connected
        </h3>
        <p className="text-sm text-on-surface-variant leading-relaxed opacity-70">
          Connect your Google account from Settings to view your calendar events and schedule
          interviews with Google Meet.
        </p>
      </div>
      <Link
        href="/admin/settings"
        className="flex items-center gap-2 px-8 h-12 btn-gradient text-black font-headline font-black text-[10px] uppercase tracking-widest rounded-xl soft-scale shadow-lg shadow-accent/20"
      >
        <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
          link
        </span>
        Go to Settings
      </Link>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export function CalendarView({ isConnected }: { isConnected: boolean }) {
  const [view, setView] = useState<View>("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [range, setRange] = useState<{ start: Date; end: Date }>({
    start: startOfMonth(new Date()),
    end: endOfMonth(addMonths(new Date(), 1)),
  });
  const [selectedEvent, setSelectedEvent] = useState<RBCEvent | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createDefaultStart, setCreateDefaultStart] = useState<Date | undefined>(undefined);

  // SWR fetch with range-based key
  const swrKey = isConnected
    ? `/api/calendar/events?timeMin=${range.start.toISOString()}&timeMax=${range.end.toISOString()}`
    : null;

  const { data: rawEvents, isLoading, error, mutate } = useSWR<CalendarEvent[]>(
    swrKey,
    fetcher,
    {
      revalidateOnFocus: true,
      refreshInterval: 60000, // Poll every 60s
      dedupingInterval: 10000,
    }
  );

  // Map API events → RBC format
  const events: RBCEvent[] = (rawEvents || []).map((e) => ({
    id: e.id,
    title: e.title,
    start: new Date(e.start),
    end: new Date(e.end),
    allDay: e.allDay,
    resource: e,
  }));

  // Update range when view/date changes
  const handleRangeChange = useCallback(
    (rangeArg: Date[] | { start: Date; end: Date }) => {
      if (Array.isArray(rangeArg)) {
        if (rangeArg.length > 0) {
          setRange({ start: rangeArg[0], end: rangeArg[rangeArg.length - 1] });
        }
      } else {
        setRange({ start: rangeArg.start, end: rangeArg.end });
      }
    },
    []
  );

  const handleNavigate = useCallback((date: Date) => {
    setCurrentDate(date);
  }, []);

  const handleViewChange = useCallback((newView: View) => {
    setView(newView);
  }, []);

  const handleSelectEvent = useCallback((event: RBCEvent) => {
    setSelectedEvent(event);
  }, []);

  const handleSelectSlot = useCallback((slotInfo: SlotInfo) => {
    setCreateDefaultStart(slotInfo.start);
    setShowCreateModal(true);
  }, []);

  if (!isConnected) {
    return <NotConnectedCard />;
  }

  return (
    <div className="space-y-4">
      {/* Error Banner */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600">
          <span className="material-symbols-outlined text-lg">error</span>
          <p className="text-sm font-medium">{error.message}</p>
          <button
            onClick={() => mutate()}
            className="ml-auto text-xs font-bold underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-50">
          <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Syncing with Google Calendar...
        </div>
      )}

      {/* Calendar container */}
      <div className="bg-surface-container-lowest rounded-3xl border border-surface-container/20 shadow-sm p-6">
        <Calendar
          localizer={localizer}
          events={events}
          date={currentDate}
          view={view}
          onNavigate={handleNavigate}
          onView={handleViewChange}
          onRangeChange={handleRangeChange}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable
          style={{ minHeight: 640 }}
          popup
          components={{
            toolbar: (toolbarProps) => (
              <CustomToolbar
                label={toolbarProps.label}
                onNavigate={toolbarProps.onNavigate}
                onView={toolbarProps.onView}
                view={toolbarProps.view}
                onCreateClick={() => {
                  setCreateDefaultStart(undefined);
                  setShowCreateModal(true);
                }}
              />
            ),
          }}
          eventPropGetter={() => ({
            style: {
              backgroundColor: "#00dc82",
              color: "#000",
              border: "none",
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: 700,
            },
          })}
          dayPropGetter={(date) => {
            const isToday =
              date.toDateString() === new Date().toDateString();
            return isToday
              ? { style: { backgroundColor: "rgba(0,220,130,0.04)" } }
              : {};
          }}
        />
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}

      {/* Create Event Modal */}
      {showCreateModal && (
        <CreateEventModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => mutate()}
          defaultStart={createDefaultStart}
        />
      )}
    </div>
  );
}
