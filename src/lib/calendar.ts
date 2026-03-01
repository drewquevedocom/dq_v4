import { google } from "googleapis";
import { requireEnv } from "@/lib/env";

type BusyInterval = {
  start: string;
  end: string;
};

type TimeSlot = {
  start: string;
  end: string;
};

type ServiceAccountConfig = {
  client_email: string;
  private_key: string;
};

const parseServiceAccount = (): ServiceAccountConfig => {
  const raw = requireEnv("GOOGLE_SERVICE_ACCOUNT_JSON");
  try {
    const parsed = JSON.parse(raw) as Partial<ServiceAccountConfig>;
    if (!parsed.client_email || !parsed.private_key) {
      throw new Error("Service account JSON must include client_email and private_key");
    }
    return {
      client_email: parsed.client_email,
      private_key: parsed.private_key,
    };
  } catch {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON must be valid JSON");
  }
};

const toUtcFromTimezoneLocal = (
  date: string,
  time: string,
  timezone: string,
): Date => {
  const [year, month, day] = date.split("-").map((value) => Number(value));
  const [hours, minutes] = time.split(":").map((value) => Number(value));
  const utcGuess = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0));
  const localized = new Date(utcGuess.toLocaleString("en-US", { timeZone: timezone }));
  const diff = utcGuess.getTime() - localized.getTime();
  return new Date(utcGuess.getTime() + diff);
};

const addSlotsForWindow = (
  slots: TimeSlot[],
  windowStart: Date,
  windowEnd: Date,
  durationMinutes: number,
): void => {
  const durationMs = durationMinutes * 60 * 1000;
  let cursor = windowStart.getTime();
  const end = windowEnd.getTime();

  while (cursor + durationMs <= end) {
    const slotStart = new Date(cursor);
    const slotEnd = new Date(cursor + durationMs);
    slots.push({
      start: slotStart.toISOString(),
      end: slotEnd.toISOString(),
    });
    cursor += durationMs;
  }
};

const normalizeAvailableSlots = ({
  busyIntervals,
  dayStart,
  dayEnd,
  durationMinutes,
}: {
  busyIntervals: BusyInterval[];
  dayStart: Date;
  dayEnd: Date;
  durationMinutes: number;
}): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const sortedBusy = [...busyIntervals]
    .map((interval) => ({
      start: new Date(interval.start),
      end: new Date(interval.end),
    }))
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  let cursor = dayStart;
  for (const busy of sortedBusy) {
    if (busy.end <= dayStart || busy.start >= dayEnd) {
      continue;
    }

    const busyStart = busy.start < dayStart ? dayStart : busy.start;
    const busyEnd = busy.end > dayEnd ? dayEnd : busy.end;

    if (busyStart > cursor) {
      addSlotsForWindow(slots, cursor, busyStart, durationMinutes);
    }

    if (busyEnd > cursor) {
      cursor = busyEnd;
    }
  }

  if (cursor < dayEnd) {
    addSlotsForWindow(slots, cursor, dayEnd, durationMinutes);
  }

  return slots;
};

export const checkCalendarAvailability = async ({
  date,
  timezone,
  durationMinutes,
}: {
  date: string;
  timezone: string;
  durationMinutes: number;
}) => {
  const serviceAccount = parseServiceAccount();
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: serviceAccount.client_email,
      private_key: serviceAccount.private_key.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
  });
  const calendar = google.calendar({ version: "v3", auth });
  const calendarId = requireEnv("GOOGLE_CALENDAR_ID");

  const dayStart = toUtcFromTimezoneLocal(date, "09:00", timezone);
  const dayEnd = toUtcFromTimezoneLocal(date, "17:00", timezone);

  const freeBusy = await calendar.freebusy.query({
    requestBody: {
      timeMin: dayStart.toISOString(),
      timeMax: dayEnd.toISOString(),
      timeZone: timezone,
      items: [{ id: calendarId }],
    },
  });

  const busyIntervals = (freeBusy.data.calendars?.[calendarId]?.busy ?? []) as BusyInterval[];
  const slots = normalizeAvailableSlots({
    busyIntervals,
    dayStart,
    dayEnd,
    durationMinutes,
  });

  return {
    date,
    timezone,
    duration_minutes: durationMinutes,
    slots,
  };
};
