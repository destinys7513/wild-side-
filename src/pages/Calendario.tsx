import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalIcon, List } from "lucide-react";
import { fetchEvents, type EventEntry } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { setPageMeta } from "@/lib/seo";

type ViewMode = "calendar" | "list";

const WEEKDAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

const MONTH_NAMES_ES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const EVENT_TYPE_COLORS: Record<string, string> = {
  Parche: "bg-purple-500/20 text-purple-400",
  Torneo: "bg-yellow-500/20 text-yellow-400",
  Rotación: "bg-blue-500/20 text-blue-400",
  Evento: "bg-green-500/20 text-green-400",
  Preview: "bg-gray-500/20 text-gray-400",
  Temporada: "bg-orange-500/20 text-orange-400",
};

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function toMonthPrefix(year: number, month: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}`;
}

export default function Calendario() {
  useEffect(() => {
    setPageMeta(
      "Calendario – WR Hub | Eventos Wild Rift",
      "Calendario de eventos, parches y torneos de Wild Rift. Mantente al día con todas las fechas importantes de la temporada competitiva."
    );
  }, []);

  const today = new Date();
  const [displayYear, setDisplayYear] = useState(today.getFullYear());
  const [displayMonth, setDisplayMonth] = useState(today.getMonth());
  const [view, setView] = useState<ViewMode>("calendar");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [calendarEvents, setCalendarEvents] = useState<EventEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const events = await fetchEvents();
        setCalendarEvents(events);
      } catch {
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const daysInMonth = getDaysInMonth(displayYear, displayMonth);
  const firstDayOfWeek = getFirstDayOfWeek(displayYear, displayMonth);
  const monthName = `${MONTH_NAMES_ES[displayMonth]} ${displayYear}`;
  const monthPrefix = toMonthPrefix(displayYear, displayMonth);

  const isCurrentMonth =
    today.getFullYear() === displayYear && today.getMonth() === displayMonth;

  const goToPrevMonth = () => {
    setSelectedDay(null);
    if (displayMonth === 0) {
      setDisplayMonth(11);
      setDisplayYear((y) => y - 1);
    } else {
      setDisplayMonth((m) => m - 1);
    }
  };

  const goToNextMonth = () => {
    setSelectedDay(null);
    if (displayMonth === 11) {
      setDisplayMonth(0);
      setDisplayYear((y) => y + 1);
    } else {
      setDisplayMonth((m) => m + 1);
    }
  };

  const eventsForDay = (day: number) => {
    const dateStr = `${monthPrefix}-${String(day).padStart(2, "0")}`;
    return calendarEvents.filter((e) => e.date === dateStr);
  };

  const allEventsForMonth = calendarEvents.filter((e) => e.date.startsWith(monthPrefix));

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#A5B4FC]/60">Cargando calendario...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Calendario</h1>
          <p className="text-[#A5B4FC]/70">Eventos, parches, torneos y rotaciones de Wild Rift</p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPrevMonth}
              className="h-9 px-3 text-[#A5B4FC] hover:text-white"
              aria-label="Mes anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h2 className="text-white font-semibold text-lg min-w-[180px] text-center">{monthName}</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToNextMonth}
              className="h-9 px-3 text-[#A5B4FC] hover:text-white"
              aria-label="Mes siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={view === "calendar" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("calendar")}
              className="h-9 px-3"
            >
              <CalIcon className="w-4 h-4" />
            </Button>
            <Button
              variant={view === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("list")}
              className="h-9 px-3"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {view === "calendar" ? (
          <div className="bg-[#1D2B64] border border-white/10 rounded-2xl overflow-hidden">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 border-b border-white/10">
              {WEEKDAYS.map((day) => (
                <div key={day} className="py-2 text-center text-[#A5B4FC]/50 text-xs font-semibold uppercase">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7">
              {/* Empty cells before first day */}
              {[...Array(firstDayOfWeek)].map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square bg-[#0B1635]/50" />
              ))}

              {/* Days */}
              {[...Array(daysInMonth)].map((_, i) => {
                const day = i + 1;
                const dayEvents = eventsForDay(day);
                const isToday = isCurrentMonth && day === today.getDate();
                const isSelected = selectedDay === day;

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay((d) => (d === day ? null : day))}
                    className={`relative aspect-square p-2 flex flex-col transition-all ${
                      isToday ? "bg-primary/10" : ""
                    } ${isSelected ? "bg-primary/20 ring-2 ring-primary/50" : "hover:bg-white/5"}`}
                  >
                    <div className={`flex-1 flex items-start justify-end`}>
                      <span className={`text-sm font-medium ${
                        isToday ? "text-primary" : "text-white"
                      } ${isSelected ? "text-primary" : ""}`}>
                        {day}
                      </span>
                    </div>
                    <div className="flex-1 flex flex-col gap-1 min-h-0">
                      {dayEvents.slice(0, 3).map((event) => (
                        <div
                          key={event.id}
                          className={`text-xs px-1.5 py-0.5 rounded truncate flex items-center gap-1 ${EVENT_TYPE_COLORS[event.type] ?? "bg-gray-500/20 text-gray-400"}`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />
                          <span className="truncate">{event.title}</span>
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="text-xs text-[#A5B4FC]/50 text-center">
                          +{dayEvents.length - 3} más
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}

              {/* Empty cells after last day */}
              {((firstDayOfWeek + daysInMonth) % 7 !== 0) &&
                [...Array((7 - (firstDayOfWeek + daysInMonth) % 7) % 7)].map((_, i) => (
                  <div key={`empty-end-${i}`} className="aspect-square bg-[#0B1635]/50" />
                ))}
            </div>
          </div>
        ) : (
          <div className="bg-[#1D2B64] border border-white/10 rounded-2xl overflow-hidden">
            {allEventsForMonth.length === 0 ? (
              <div className="py-16 text-center text-[#A5B4FC]/40">
                <CalIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-lg">No hay eventos este mes</p>
                <p className="text-sm mt-1">Vuelve otro mes para ver las actividades</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {allEventsForMonth
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .map((event) => (
                    <div key={event.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/5 transition-colors">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${EVENT_TYPE_COLORS[event.type] ?? "bg-gray-500/20 text-gray-400"}`}>
                        <span className="w-2.5 h-2.5 rounded-full bg-current" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-medium text-sm truncate">{event.title}</div>
                        <div className="text-[#A5B4FC]/50 text-xs truncate mt-0.5">{event.description}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${EVENT_TYPE_COLORS[event.type] ?? "bg-gray-500/20 text-gray-400"}`}>
                          {event.type}
                        </span>
                        <span className="text-[#A5B4FC]/60 text-sm font-mono">
                          {new Date(event.date).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* Day detail panel */}
        {selectedDay && (
          <div className="mt-6 bg-[#1D2B64] border border-white/10 rounded-2xl p-5 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold text-lg">
                {new Date(`${monthPrefix}-${String(selectedDay).padStart(2, "0")}`).toLocaleDateString("es-ES", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedDay(null)} className="text-[#A5B4FC]/60">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            {eventsForDay(selectedDay).length === 0 ? (
              <p className="text-[#A5B4FC]/50 text-center py-4">No hay eventos programados para este día</p>
            ) : (
              <div className="space-y-3">
                {eventsForDay(selectedDay).map((event) => (
                  <div key={event.id} className="flex items-start gap-3 p-3 bg-[#0B1635]/50 rounded-xl border border-white/5">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${EVENT_TYPE_COLORS[event.type] ?? "bg-gray-500/20 text-gray-400"}`}>
                      <span className="w-3 h-3 rounded-full bg-current" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-white font-medium text-sm">{event.title}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${EVENT_TYPE_COLORS[event.type] ?? "bg-gray-500/20 text-gray-400"}`}>
                          {event.type}
                        </span>
                      </div>
                      <p className="text-[#A5B4FC]/70 text-sm leading-relaxed">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}