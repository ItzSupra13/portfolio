export type Holiday = {
  date: string;
  name: string;
  enabled: boolean;
};

export const WORK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export type WorkDay = (typeof WORK_DAYS)[number];

export const DAY_NUMBER: Record<WorkDay, number> = {
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
  Sun: 0,
};

const INDIA_HOLIDAYS_2026 = [
  { date: "2026-01-14", name: "Makar Sankranti" },
  { date: "2026-01-26", name: "Republic Day" },
  { date: "2026-03-02", name: "Maha Shivaratri" },
  { date: "2026-03-20", name: "Holi" },
  { date: "2026-03-30", name: "Ram Navami" },
  { date: "2026-04-02", name: "Good Friday" },
  { date: "2026-04-14", name: "Dr. Ambedkar Jayanti" },
  { date: "2026-05-27", name: "Bakrid (tentative)" },
  { date: "2026-05-28", name: "Eid ul-Adha (tentative)" },
  { date: "2026-06-26", name: "Muharram/Ashura (tentative)" },
  { date: "2026-07-16", name: "Rath Yatra" },
  { date: "2026-08-15", name: "Independence Day" },
  { date: "2026-08-26", name: "Onam" },
  { date: "2026-08-28", name: "Raksha Bandhan" },
  { date: "2026-09-04", name: "Janmashtami" },
  { date: "2026-09-14", name: "Ganesh Chaturthi" },
  { date: "2026-10-02", name: "Gandhi Jayanti" },
  { date: "2026-10-11", name: "Sharad Navratri (Day 1)" },
  { date: "2026-10-17", name: "Durga Puja Festivities" },
  { date: "2026-10-18", name: "Maha Saptami" },
  { date: "2026-10-19", name: "Maha Ashtami" },
  { date: "2026-10-20", name: "Dussehra" },
  { date: "2026-10-26", name: "Valmiki Jayanti" },
  { date: "2026-10-29", name: "Karva Chauth" },
  { date: "2026-11-08", name: "Diwali" },
  { date: "2026-11-09", name: "Govardhan Puja" },
  { date: "2026-11-11", name: "Bhai Duj" },
  { date: "2026-11-15", name: "Chhat Puja" },
  { date: "2026-11-24", name: "Guru Tegh Bahadur Martyrdom Day" },
  { date: "2026-12-23", name: "Hazrat Ali's Birthday" },
  { date: "2026-12-24", name: "Christmas Eve" },
  { date: "2026-12-25", name: "Christmas" },
];

export const HOLIDAYS_2026: Holiday[] = INDIA_HOLIDAYS_2026.map((holiday) => ({
  ...holiday,
  enabled: true,
}));
