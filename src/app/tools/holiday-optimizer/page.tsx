import type { Metadata } from "next";
import { HolidayOptimizer } from "./holiday-optimizer";

export const metadata: Metadata = {
  title: "Holiday Optimizer | Aster Dev",
  description:
    "Optimize your paid leave days around weekends and public holidays to get the longest breaks.",
};

export default function HolidayOptimizerPage() {
  return <HolidayOptimizer />;
}
