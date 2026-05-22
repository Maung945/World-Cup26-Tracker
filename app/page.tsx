"use client";

import { supabase } from "@/lib/supabase";
import React, { useMemo, useState } from "react";
import Select from "react-select";

type Team = {
  code: string;
  name: string;
  group: string;
  status:
    | "Group Stage"
    | "Round of 32"
    | "Round of 16"
    | "Quarter Final"
    | "Semi Final"
    | "Final"
    | "Champion"
    | "Eliminated";
};

type Match = {
  id: number;
  stage: string;
  date: string;
  time: string;
  teamA: string;
  teamB: string;
  scoreA: string;
  scoreB: string;
  status: "Scheduled" | "Live" | "Half Time" | "Full Time";
  venue?: string;
};

const teams: Team[] = [
  { code: "MEX", name: "Mexico", group: "A", status: "Group Stage" },
  { code: "RSA", name: "South Africa", group: "A", status: "Group Stage" },
  { code: "KOR", name: "South Korea", group: "A", status: "Group Stage" },
  { code: "CZE", name: "Czechia", group: "A", status: "Group Stage" },
  { code: "CAN", name: "Canada", group: "B", status: "Group Stage" },
  { code: "BIH", name: "Bosnia and Herzegovina", group: "B", status: "Group Stage" },
  { code: "QAT", name: "Qatar", group: "B", status: "Group Stage" },
  { code: "SUI", name: "Switzerland", group: "B", status: "Group Stage" },
  { code: "BRA", name: "Brazil", group: "C", status: "Group Stage" },
  { code: "MAR", name: "Morocco", group: "C", status: "Group Stage" },
  { code: "HAI", name: "Haiti", group: "C", status: "Group Stage" },
  { code: "SCO", name: "Scotland", group: "C", status: "Group Stage" },
  { code: "USA", name: "United States", group: "D", status: "Group Stage" },
  { code: "PAR", name: "Paraguay", group: "D", status: "Group Stage" },
  { code: "AUS", name: "Australia", group: "D", status: "Group Stage" },
  { code: "TUR", name: "Türkiye", group: "D", status: "Group Stage" },
  { code: "GER", name: "Germany", group: "E", status: "Group Stage" },
  { code: "CUW", name: "Curaçao", group: "E", status: "Group Stage" },
  { code: "CIV", name: "Ivory Coast", group: "E", status: "Group Stage" },
  { code: "ECU", name: "Ecuador", group: "E", status: "Group Stage" },
  { code: "NED", name: "Netherlands", group: "F", status: "Group Stage" },
  { code: "JPN", name: "Japan", group: "F", status: "Group Stage" },
  { code: "SWE", name: "Sweden", group: "F", status: "Group Stage" },
  { code: "TUN", name: "Tunisia", group: "F", status: "Group Stage" },
  { code: "BEL", name: "Belgium", group: "G", status: "Group Stage" },
  { code: "EGY", name: "Egypt", group: "G", status: "Group Stage" },
  { code: "IRN", name: "Iran", group: "G", status: "Group Stage" },
  { code: "NZL", name: "New Zealand", group: "G", status: "Group Stage" },
  { code: "ESP", name: "Spain", group: "H", status: "Group Stage" },
  { code: "CPV", name: "Cape Verde", group: "H", status: "Group Stage" },
  { code: "KSA", name: "Saudi Arabia", group: "H", status: "Group Stage" },
  { code: "URU", name: "Uruguay", group: "H", status: "Group Stage" },
  { code: "FRA", name: "France", group: "I", status: "Group Stage" },
  { code: "SEN", name: "Senegal", group: "I", status: "Group Stage" },
  { code: "IRQ", name: "Iraq", group: "I", status: "Group Stage" },
  { code: "NOR", name: "Norway", group: "I", status: "Group Stage" },
  { code: "ARG", name: "Argentina", group: "J", status: "Group Stage" },
  { code: "ALG", name: "Algeria", group: "J", status: "Group Stage" },
  { code: "AUT", name: "Austria", group: "J", status: "Group Stage" },
  { code: "JOR", name: "Jordan", group: "J", status: "Group Stage" },
  { code: "POR", name: "Portugal", group: "K", status: "Group Stage" },
  { code: "COD", name: "DR Congo", group: "K", status: "Group Stage" },
  { code: "UZB", name: "Uzbekistan", group: "K", status: "Group Stage" },
  { code: "COL", name: "Colombia", group: "K", status: "Group Stage" },
  { code: "ENG", name: "England", group: "L", status: "Group Stage" },
  { code: "CRO", name: "Croatia", group: "L", status: "Group Stage" },
  { code: "GHA", name: "Ghana", group: "L", status: "Group Stage" },
  { code: "PAN", name: "Panama", group: "L", status: "Group Stage" },
];

const flagMap: Record<string, string> = {
  Mexico: "🇲🇽",
  "South Africa": "🇿🇦",
  "South Korea": "🇰🇷",
  Czechia: "🇨🇿",
  Canada: "🇨🇦",
  "Bosnia and Herzegovina": "🇧🇦",
  Qatar: "🇶🇦",
  Switzerland: "🇨🇭",
  Brazil: "🇧🇷",
  Morocco: "🇲🇦",
  Haiti: "🇭🇹",
  Scotland: "/flags/scotland.png",
  "United States": "🇺🇸",
  Paraguay: "🇵🇾",
  Australia: "🇦🇺",
  Türkiye: "🇹🇷",
  Germany: "🇩🇪",
  Curaçao: "🇨🇼",
  "Ivory Coast": "🇨🇮",
  Ecuador: "🇪🇨",
  Netherlands: "🇳🇱",
  Japan: "🇯🇵",
  Sweden: "🇸🇪",
  Tunisia: "🇹🇳",
  Belgium: "🇧🇪",
  Egypt: "🇪🇬",
  Iran: "🇮🇷",
  "New Zealand": "🇳🇿",
  Spain: "🇪🇸",
  "Cape Verde": "🇨🇻",
  "Saudi Arabia": "🇸🇦",
  Uruguay: "🇺🇾",
  France: "🇫🇷",
  Senegal: "🇸🇳",
  Iraq: "🇮🇶",
  Norway: "🇳🇴",
  Argentina: "🇦🇷",
  Algeria: "🇩🇿",
  Austria: "🇦🇹",
  Jordan: "🇯🇴",
  Portugal: "🇵🇹",
  "DR Congo": "🇨🇩",
  Uzbekistan: "🇺🇿",
  Colombia: "🇨🇴",
  England: "/flags/england.png",
  Croatia: "🇭🇷",
  Ghana: "🇬🇭",
  Panama: "🇵🇦",
};

const shortCodeMap: Record<string, string> = {
  Mexico: "MEX",
  "South Africa": "RSA",
  "South Korea": "KOR",
  Czechia: "CZE",
  Canada: "CAN",
  "Bosnia and Herzegovina": "BIH",
  Qatar: "QAT",
  Switzerland: "SUI",
  Brazil: "BRA",
  Morocco: "MAR",
  Haiti: "HAI",
  Scotland: "SCO",
  "United States": "USA",
  Paraguay: "PAR",
  Australia: "AUS",
  Türkiye: "TUR",
  Germany: "GER",
  Curaçao: "CUW",
  "Ivory Coast": "CIV",
  Ecuador: "ECU",
  Netherlands: "NED",
  Japan: "JPN",
  Sweden: "SWE",
  Tunisia: "TUN",
  Belgium: "BEL",
  Egypt: "EGY",
  Iran: "IRN",
  "New Zealand": "NZL",
  Spain: "ESP",
  "Cape Verde": "CPV",
  "Saudi Arabia": "KSA",
  Uruguay: "URU",
  France: "FRA",
  Senegal: "SEN",
  Iraq: "IRQ",
  Norway: "NOR",
  Argentina: "ARG",
  Algeria: "ALG",
  Austria: "AUT",
  Jordan: "JOR",
  Portugal: "POR",
  "DR Congo": "COD",
  Uzbekistan: "UZB",
  Colombia: "COL",
  England: "ENG",
  Croatia: "CRO",
  Ghana: "GHA",
  Panama: "PAN",
};

const starterMatches: Match[] = [
  { id: 1, stage: "Group A", date: "Thu, Jun 11, 2026", time: "3:00 PM PDT", teamA: "Mexico", teamB: "South Africa", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 2, stage: "Group A", date: "Thu, Jun 11, 2026", time: "10:00 PM PDT", teamA: "South Korea", teamB: "Czechia", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 3, stage: "Group B", date: "Fri, Jun 12, 2026", time: "3:00 PM PDT", teamA: "Canada", teamB: "Qatar", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 4, stage: "Group D", date: "Fri, Jun 12, 2026", time: "9:00 PM PDT", teamA: "United States", teamB: "Paraguay", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 5, stage: "Group C", date: "Sat, Jun 13, 2026", time: "12:00 PM PDT", teamA: "Brazil", teamB: "Morocco", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 6, stage: "Group D", date: "Sat, Jun 13, 2026", time: "6:00 PM PDT", teamA: "Australia", teamB: "Türkiye", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 7, stage: "Group C", date: "Sat, Jun 13, 2026", time: "9:00 PM PDT", teamA: "Haiti", teamB: "Scotland", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 8, stage: "Group B", date: "Sat, Jun 13, 2026", time: "3:00 PM PDT", teamA: "Switzerland", teamB: "Bosnia and Herzegovina", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 9, stage: "Group E", date: "Sun, Jun 14, 2026", time: "1:00 PM PDT", teamA: "Germany", teamB: "Curaçao", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 10, stage: "Group F", date: "Sun, Jun 14, 2026", time: "4:00 PM PDT", teamA: "Netherlands", teamB: "Japan", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 11, stage: "Group E", date: "Sun, Jun 14, 2026", time: "7:00 PM PDT", teamA: "Ivory Coast", teamB: "Ecuador", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 12, stage: "Group F", date: "Sun, Jun 14, 2026", time: "10:00 PM PDT", teamA: "Sweden", teamB: "Tunisia", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 13, stage: "Group H", date: "Mon, Jun 15, 2026", time: "6:00 PM PDT", teamA: "Saudi Arabia", teamB: "Uruguay", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 14, stage: "Group H", date: "Mon, Jun 15, 2026", time: "12:00 PM PDT", teamA: "Spain", teamB: "Cape Verde", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 15, stage: "Group G", date: "Mon, Jun 15, 2026", time: "9:00 PM PDT", teamA: "Iran", teamB: "New Zealand", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 16, stage: "Group G", date: "Mon, Jun 15, 2026", time: "3:00 PM PDT", teamA: "Belgium", teamB: "Egypt", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 17, stage: "Group I", date: "Tue, Jun 16, 2026", time: "3:00 PM PDT", teamA: "France", teamB: "Senegal", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 18, stage: "Group I", date: "Tue, Jun 16, 2026", time: "6:00 PM PDT", teamA: "Iraq", teamB: "Norway", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 19, stage: "Group J", date: "Tue, Jun 16, 2026", time: "9:00 PM PDT", teamA: "Argentina", teamB: "Algeria", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 20, stage: "Group J", date: "Tue, Jun 16, 2026", time: "12:00 AM PDT", teamA: "Austria", teamB: "Jordan", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 21, stage: "Group L", date: "Wed, Jun 17, 2026", time: "7:00 PM PDT", teamA: "Ghana", teamB: "Panama", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 22, stage: "Group L", date: "Wed, Jun 17, 2026", time: "4:00 PM PDT", teamA: "England", teamB: "Croatia", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 23, stage: "Group K", date: "Wed, Jun 17, 2026", time: "1:00 PM PDT", teamA: "Portugal", teamB: "DR Congo", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 24, stage: "Group K", date: "Wed, Jun 17, 2026", time: "10:00 PM PDT", teamA: "Uzbekistan", teamB: "Colombia", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 25, stage: "Group A", date: "Thu, Jun 18, 2026", time: "12:00 PM PDT", teamA: "Czechia", teamB: "South Africa", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 26, stage: "Group B", date: "Thu, Jun 18, 2026", time: "3:00 PM PDT", teamA: "Switzerland", teamB: "Bosnia and Herzegovina", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 27, stage: "Group B", date: "Thu, Jun 18, 2026", time: "6:00 PM PDT", teamA: "Canada", teamB: "Qatar", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 28, stage: "Group A", date: "Thu, Jun 18, 2026", time: "9:00 PM PDT", teamA: "Mexico", teamB: "South Korea", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 29, stage: "Group C", date: "Fri, Jun 19, 2026", time: "8:30 PM PDT", teamA: "Brazil", teamB: "Haiti", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 30, stage: "Group C", date: "Fri, Jun 19, 2026", time: "6:00 PM PDT", teamA: "Scotland", teamB: "Morocco", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 31, stage: "Group D", date: "Fri, Jun 19, 2026", time: "11:00 PM PDT", teamA: "Türkiye", teamB: "United States", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 32, stage: "Group D", date: "Fri, Jun 19, 2026", time: "3:00 PM PDT", teamA: "United States", teamB: "Australia", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 33, stage: "Group E", date: "Sat, Jun 20, 2026", time: "4:00 PM PDT", teamA: "Germany", teamB: "Ivory Coast", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 34, stage: "Group E", date: "Sat, Jun 20, 2026", time: "8:00 PM PDT", teamA: "Ecuador", teamB: "Curaçao", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 35, stage: "Group F", date: "Sat, Jun 20, 2026", time: "1:00 PM PDT", teamA: "Netherlands", teamB: "Sweden", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 36, stage: "Group F", date: "Sat, Jun 20, 2026", time: "12:00 AM PDT", teamA: "Tunisia", teamB: "Japan", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 37, stage: "Group H", date: "Sun, Jun 21, 2026", time: "6:00 PM PDT", teamA: "Uruguay", teamB: "Cape Verde", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 38, stage: "Group H", date: "Sun, Jun 21, 2026", time: "12:00 PM PDT", teamA: "Spain", teamB: "Saudi Arabia", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 39, stage: "Group G", date: "Sun, Jun 21, 2026", time: "3:00 PM PDT", teamA: "Belgium", teamB: "Iran", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 40, stage: "Group G", date: "Sun, Jun 21, 2026", time: "9:00 PM PDT", teamA: "New Zealand", teamB: "Egypt", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 41, stage: "Group I", date: "Mon, Jun 22, 2026", time: "8:00 PM PDT", teamA: "Norway", teamB: "Senegal", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 42, stage: "Group I", date: "Mon, Jun 22, 2026", time: "5:00 PM PDT", teamA: "France", teamB: "Iraq", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 43, stage: "Group J", date: "Mon, Jun 22, 2026", time: "1:00 PM PDT", teamA: "Argentina", teamB: "Austria", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 44, stage: "Group J", date: "Mon, Jun 22, 2026", time: "11:00 PM PDT", teamA: "Jordan", teamB: "Algeria", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 45, stage: "Group L", date: "Tue, Jun 23, 2026", time: "4:00 PM PDT", teamA: "England", teamB: "Ghana", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 46, stage: "Group L", date: "Tue, Jun 23, 2026", time: "7:00 PM PDT", teamA: "Panama", teamB: "Croatia", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 47, stage: "Group K", date: "Tue, Jun 23, 2026", time: "1:00 PM PDT", teamA: "Portugal", teamB: "Uzbekistan", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 48, stage: "Group K", date: "Tue, Jun 23, 2026", time: "10:00 PM PDT", teamA: "Colombia", teamB: "DR Congo", scoreA: "", scoreB: "", status: "Scheduled" },

  { id: 49, stage: "Group A", date: "Wed, Jun 24, 2026", time: "12:00 PM PDT", teamA: "Mexico", teamB: "Czechia", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 50, stage: "Group A", date: "Wed, Jun 24, 2026", time: "3:00 PM PDT", teamA: "South Africa", teamB: "South Korea", scoreA: "", scoreB: "", status: "Scheduled" },

  { id: 51, stage: "Group B", date: "Wed, Jun 24, 2026", time: "6:00 PM PDT", teamA: "Canada", teamB: "Switzerland", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 52, stage: "Group B", date: "Wed, Jun 24, 2026", time: "9:00 PM PDT", teamA: "Bosnia and Herzegovina", teamB: "Qatar", scoreA: "", scoreB: "", status: "Scheduled" },

  { id: 53, stage: "Group C", date: "Thu, Jun 25, 2026", time: "12:00 PM PDT", teamA: "Brazil", teamB: "Scotland", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 54, stage: "Group C", date: "Thu, Jun 25, 2026", time: "3:00 PM PDT", teamA: "Morocco", teamB: "Haiti", scoreA: "", scoreB: "", status: "Scheduled" },

  { id: 55, stage: "Group D", date: "Thu, Jun 25, 2026", time: "6:00 PM PDT", teamA: "United States", teamB: "Australia", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 56, stage: "Group D", date: "Thu, Jun 25, 2026", time: "9:00 PM PDT", teamA: "Paraguay", teamB: "Türkiye", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 57, stage: "Group E", date: "Fri, Jun 26, 2026", time: "12:00 PM PDT", teamA: "Germany", teamB: "Ecuador", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 58, stage: "Group E", date: "Fri, Jun 26, 2026", time: "3:00 PM PDT", teamA: "Ivory Coast", teamB: "Curaçao", scoreA: "", scoreB: "", status: "Scheduled" },

  { id: 59, stage: "Group F", date: "Fri, Jun 26, 2026", time: "6:00 PM PDT", teamA: "Netherlands", teamB: "Tunisia", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 60, stage: "Group F", date: "Fri, Jun 26, 2026", time: "9:00 PM PDT", teamA: "Japan", teamB: "Sweden", scoreA: "", scoreB: "", status: "Scheduled" },

  { id: 61, stage: "Group G", date: "Sat, Jun 27, 2026", time: "12:00 PM PDT", teamA: "Belgium", teamB: "New Zealand", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 62, stage: "Group G", date: "Sat, Jun 27, 2026", time: "3:00 PM PDT", teamA: "Egypt", teamB: "Iran", scoreA: "", scoreB: "", status: "Scheduled" },

  { id: 63, stage: "Group H", date: "Sat, Jun 27, 2026", time: "6:00 PM PDT", teamA: "Spain", teamB: "Uruguay", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 64, stage: "Group H", date: "Sat, Jun 27, 2026", time: "9:00 PM PDT", teamA: "Cape Verde", teamB: "Saudi Arabia", scoreA: "", scoreB: "", status: "Scheduled" },

  { id: 65, stage: "Group I", date: "Sat, Jun 27, 2026", time: "11:00 PM PDT", teamA: "France", teamB: "Norway", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 66, stage: "Group I", date: "Sat, Jun 27, 2026", time: "1:00 PM PDT", teamA: "Senegal", teamB: "Iraq", scoreA: "", scoreB: "", status: "Scheduled" },

  { id: 67, stage: "Group J", date: "Sat, Jun 27, 2026", time: "5:00 PM PDT", teamA: "Argentina", teamB: "Jordan", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 68, stage: "Group J", date: "Sat, Jun 27, 2026", time: "8:00 PM PDT", teamA: "Algeria", teamB: "Austria", scoreA: "", scoreB: "", status: "Scheduled" },

  { id: 69, stage: "Group K", date: "Sat, Jun 27, 2026", time: "10:00 PM PDT", teamA: "Portugal", teamB: "Colombia", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 70, stage: "Group K", date: "Sat, Jun 27, 2026", time: "2:00 PM PDT", teamA: "DR Congo", teamB: "Uzbekistan", scoreA: "", scoreB: "", status: "Scheduled" },

  { id: 71, stage: "Group L", date: "Sat, Jun 27, 2026", time: "4:00 PM PDT", teamA: "England", teamB: "Panama", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 72, stage: "Group L", date: "Sat, Jun 27, 2026", time: "7:00 PM PDT", teamA: "Croatia", teamB: "Ghana", scoreA: "", scoreB: "", status: "Scheduled" },

  { id: 73, stage: "Round of 32", date: "Sun, Jun 28, 2026", time: "3:00 PM PDT", teamA: "2A", teamB: "2B", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 74, stage: "Round of 32", date: "Sun, Jun 28, 2026", time: "4:30 PM PDT", teamA: "1E", teamB: "3ABCDF", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 75, stage: "Round of 32", date: "Sun, Jun 28, 2026", time: "9:00 PM PDT", teamA: "1F", teamB: "2C", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 76, stage: "Round of 32", date: "Mon, Jun 29, 2026", time: "1:00 PM PDT", teamA: "1C", teamB: "2F", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 77, stage: "Round of 32", date: "Mon, Jun 29, 2026", time: "5:00 PM PDT", teamA: "1I", teamB: "3CDFGH", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 78, stage: "Round of 32", date: "Mon, Jun 29, 2026", time: "1:00 PM PDT", teamA: "2E", teamB: "2I", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 79, stage: "Round of 32", date: "Tue, Jun 30, 2026", time: "9:00 PM PDT", teamA: "1A", teamB: "3CEFHI", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 80, stage: "Round of 32", date: "Tue, Jun 30, 2026", time: "12:00 PM PDT", teamA: "1L", teamB: "3EHIJK", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 81, stage: "Round of 32", date: "Wed, Jul 1, 2026", time: "8:00 PM PDT", teamA: "1D", teamB: "3BEFIJ", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 82, stage: "Round of 32", date: "Wed, Jul 1, 2026", time: "4:00 PM PDT", teamA: "1G", teamB: "3AEHIJ", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 83, stage: "Round of 32", date: "Thu, Jul 2, 2026", time: "7:00 PM PDT", teamA: "2K", teamB: "2L", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 84, stage: "Round of 32", date: "Thu, Jul 2, 2026", time: "3:00 PM PDT", teamA: "1H", teamB: "2J", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 85, stage: "Round of 32", date: "Fri, Jul 3, 2026", time: "11:00 PM PDT", teamA: "1B", teamB: "3EFGIJ", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 86, stage: "Round of 32", date: "Fri, Jul 3, 2026", time: "6:00 PM PDT", teamA: "1J", teamB: "2H", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 87, stage: "Round of 32", date: "Fri, Jul 3, 2026", time: "9:30 PM PDT", teamA: "1K", teamB: "3DEIJL", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 88, stage: "Round of 32", date: "Fri, Jul 3, 2026", time: "2:00 PM PDT", teamA: "2D", teamB: "2G", scoreA: "", scoreB: "", status: "Scheduled" },
  
  { id: 89, stage: "Round of 16", date: "Sat, Jul 4, 2026", time: "5:00 PM PDT", teamA: "W74", teamB: "W77", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 90, stage: "Round of 16", date: "Sat, Jul 4, 2026", time: "1:00 PM PDT", teamA: "W73", teamB: "W75", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 91, stage: "Round of 16", date: "Sun, Jul 5, 2026", time: "4:00 PM PDT", teamA: "W76", teamB: "W78", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 92, stage: "Round of 16", date: "Sun, Jul 5, 2026", time: "8:00 PM PDT", teamA: "W79", teamB: "W80", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 93, stage: "Round of 16", date: "Mon, Jul 6, 2026", time: "3:00 PM PDT", teamA: "W83", teamB: "W84", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 94, stage: "Round of 16", date: "Mon, Jul 6, 2026", time: "8:00 PM PDT", teamA: "W81", teamB: "W82", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 95, stage: "Round of 16", date: "Tue, Jul 7, 2026", time: "12:00 PM PDT", teamA: "W86", teamB: "W88", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 96, stage: "Round of 16", date: "Tue, Jul 7, 2026", time: "4:00 PM PDT", teamA: "W85", teamB: "W87", scoreA: "", scoreB: "", status: "Scheduled" },

  { id: 97, stage: "Quarter Final", date: "Thu, Jul 9, 2026", time: "4:00 PM PDT", teamA: "W89", teamB: "W90", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 98, stage: "Quarter Final", date: "Fri, Jul 10, 2026", time: "3:00 PM PDT", teamA: "W93", teamB: "W94", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 99, stage: "Quarter Final", date: "Sat, Jul 11, 2026", time: "5:00 PM PDT", teamA: "W91", teamB: "W92", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 100, stage: "Quarter Final", date: "Sat, Jul 11, 2026", time: "9:00 PM PDT", teamA: "W95", teamB: "W96", scoreA: "", scoreB: "", status: "Scheduled" },

  { id: 101, stage: "Semi Final", date: "Tue, Jul 14, 2026", time: "3:00 PM PDT", teamA: "W97", teamB: "W98", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 102, stage: "Semi Final", date: "Wed, Jul 15, 2026", time: "3:00 PM PDT", teamA: "W99", teamB: "W100", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 103, stage: "Bronze Final", date: "Sat, Jul 18, 2026", time: "5:00 PM PDT", teamA: "L101", teamB: "L102", scoreA: "", scoreB: "", status: "Scheduled" },
  { id: 104, stage: "Final", date: "Sun, Jul 19, 2026", time: "3:00 PM PDT", teamA: "W101", teamB: "W102", scoreA: "", scoreB: "", status: "Scheduled" },
];

const progressOptions: Team["status"][] = [
  "Group Stage",
  "Round of 32",
  "Round of 16",
  "Quarter Final",
  "Semi Final",
  "Final",
  "Champion",
  "Eliminated",
];

function flagText(teamName: string) {
  if (teamName === "England") return "🏴 England";
  if (teamName === "Scotland") return "🏴 Scotland";

  return `${flagMap[teamName] || "🏆"} ${teamName}`;
}


export default function Home() {
  const [participantName, setParticipantName] = useState("");
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [participants, setParticipants] = useState<any[]>([]);
  const [teamData, setTeamData] = useState<Team[]>(teams);
  const [matches, setMatches] = useState<Match[]>(starterMatches);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<
    "matches" | "bracket" | "standings"
  >("matches");

  React.useEffect(() => {
    fetchParticipants();
  }, []);

  async function fetchParticipants() {
    const { data, error } = await supabase
      .from("participants")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setParticipants(data);
    }
  }

  const selectedByTeam = useMemo(() => {
    const map: Record<string, string[]> = {};
    teamData.forEach((team) => (map[team.name] = []));

    participants.forEach((participant) => {
      map[participant.team1]?.push(participant.name);
      map[participant.team2]?.push(participant.name);
    });

    return map;
  }, [participants, teamData]);

  const groupedMatches = useMemo(() => {
    return matches.reduce<Record<string, Match[]>>((groups, match) => {
      if (!groups[match.date]) {
        groups[match.date] = [];
      }
      groups[match.date].push(match);
      return groups;
    }, {});
  }, [matches]);

  const filteredTeams = teamData.filter((team) =>
    team.name.toLowerCase().includes(search.toLowerCase())
  );

  async function addParticipant(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!participantName.trim() || !team1 || !team2 || team1 === team2) return;

    const { error } = await supabase.from("participants").insert([
      {
        name: participantName.trim(),
        team1,
        team2,
      },
    ]);

    if (error) {
      console.error("Supabase insert error:", error.message);
      alert(error.message);
      return;
    }

    setParticipantName("");
    setTeam1("");
    setTeam2("");
    fetchParticipants();
  }

  function updateTeamStatus(teamName: string, status: Team["status"]) {
    setTeamData((current) =>
      current.map((team) =>
        team.name === teamName ? { ...team, status } : team
      )
    );
  }

  function updateMatchScore(
    matchId: number,
    field: "scoreA" | "scoreB",
    value: string
  ) {
    setMatches((current) =>
      current.map((match) =>
        match.id === matchId ? { ...match, [field]: value } : match
      )
    );
  }

  function TeamDisplay({ teamName }: { teamName: string }) {
    const participantNames = selectedByTeam[teamName] || [];
    const isKnownTeam = Boolean(shortCodeMap[teamName]);

    return (
      <div className="group relative flex w-fit items-center gap-2">
        {flagMap[teamName]?.startsWith("/") ? (
          <img
            src={flagMap[teamName]}
            alt={`${teamName} flag`}
            className="h-6 w-6 rounded-sm object-cover"
          />
        ) : (
          <span className="text-2xl">{flagMap[teamName] || "🏆"}</span>
        )}
        <span className="font-semibold">
          {teamName}
        </span>

        {isKnownTeam && (
          <div className="absolute left-0 top-full z-30 mt-2 hidden min-w-56 rounded-xl bg-black p-3 text-white shadow-xl group-hover:block">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-300">
              Picked by
            </p>

            {participantNames.length === 0 ? (
              <p className="text-sm text-gray-400">No participants yet</p>
            ) : (
              <div className="space-y-1">
                {participantNames.map((name, index) => (
                  <p key={`${name}-${index}`} className="text-sm">
                    {index + 1}. {name}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  function BracketMatchCard({ match }: { match: Match }) {
    return (
      <div className="rounded-xl border bg-white shadow-sm">
        <div className="border-b bg-gray-50 px-4 py-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Match {match.id} • {match.date}
          </p>
          <p className="text-xs text-gray-500">{match.time}</p>
        </div>

        <div className="space-y-3 p-4">
          <div className="flex items-center justify-between gap-3">
            <TeamDisplay teamName={match.teamA} />
            <input
              className="w-12 rounded-lg border bg-white p-1 text-center font-bold"
              value={match.scoreA}
              onChange={(e) =>
                updateMatchScore(match.id, "scoreA", e.target.value)
              }
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <TeamDisplay teamName={match.teamB} />
            <input
              className="w-12 rounded-lg border bg-white p-1 text-center font-bold"
              value={match.scoreB}
              onChange={(e) =>
                updateMatchScore(match.id, "scoreB", e.target.value)
              }
            />
          </div>
        </div>
      </div>
    );
  }


  return (
    <main className="min-h-screen bg-gray-100 p-6 text-gray-900">
      <section className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-2xl bg-white p-6 shadow">
          <section className="overflow-hidden rounded-2xl bg-black text-white shadow">
            <div className="flex">
              {(["matches", "bracket", "standings"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 p-4 text-sm font-semibold uppercase transition ${
                    activeTab === tab
                      ? "border-b-4 border-white bg-gray-900"
                      : "bg-black hover:bg-gray-800"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </section>

          <h1 className="mt-6 text-3xl font-bold">
            World Cup 2026 Team Picker
          </h1>
          <p className="mt-2 text-gray-600">
            Participants choose two favorite teams. Hover over any team in the
            match schedule to see who picked it.
          </p>
        </header>

        {activeTab === "matches" && (
          <>
            <section className="rounded-2xl bg-white p-6 shadow">
              <h2 className="mb-4 text-xl font-semibold">Add Participant</h2>
              <form
                onSubmit={addParticipant}
                className="grid gap-4 md:grid-cols-4"
              >
                <input
                  className="rounded-xl border p-3"
                  placeholder="Participant name"
                  value={participantName}
                  onChange={(e) => setParticipantName(e.target.value)}
                />
                <select
                  className="rounded-xl border p-3"
                  value={team1}
                  onChange={(e) => setTeam1(e.target.value)}
                >
                  <option value="">Favorite Team 1</option>
                  {[...teamData]
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((team) => (
                    <option key={team.code} value={team.name}>
                      {flagText(team.name)}
                    </option>
                  ))}
                </select>
                <select
                  className="rounded-xl border p-3"
                  value={team2}
                  onChange={(e) => setTeam2(e.target.value)}
                >
                  <option value="">Favorite Team 2</option>
                  {[...teamData]
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((team) => (
                    <option key={team.code} value={team.name}>
                      {flagText(team.name)}
                    </option>
                  ))}
                </select>
                <button className="rounded-xl bg-black p-3 font-semibold text-white hover:bg-gray-800">
                  Submit Picks
                </button>
              </form>

              {team1 && team2 && team1 === team2 && (
                <p className="mt-3 text-red-600">
                  Please choose two different teams.
                </p>
              )}
            </section>

            <section className="rounded-2xl bg-white p-6 shadow">
              <h2 className="mb-4 text-xl font-semibold">Participant Picks</h2>
              {participants.length === 0 ? (
                <p className="text-gray-500">No participants yet.</p>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="p-3">#</th>
                      <th className="p-3">Name</th>
                      <th className="p-3">Team 1</th>
                      <th className="p-3">Team 2</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participants.map((participant, index) => (
                      <tr key={participant.id} className="border-b">
                        <td className="p-3">{index + 1}</td>
                        <td className="p-3">{participant.name}</td>
                        <td className="p-3">
                          <TeamDisplay teamName={participant.team1} />
                        </td>
                        <td className="p-3">
                          <TeamDisplay teamName={participant.team2} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>

            <section className="space-y-6">
              <div className="rounded-2xl bg-white p-6 shadow">
                <h2 className="text-2xl font-bold">Matches</h2>
                <p className="mt-1 text-sm text-gray-500">
                  All times are Pacific Time. Hover over a team to see
                  participants who selected that team.
                </p>
              </div>

              {Object.entries(groupedMatches).map(([date, dateMatches]) => (
                <section key={date} className="overflow-hidden rounded-2xl bg-white shadow">
                  <div className="border-b bg-gray-50 px-6 py-4">
                    <h3 className="text-lg font-bold">{date}</h3>
                  </div>

                  <div className="divide-y">
                    {dateMatches.map((match) => (
                      <div
                        key={match.id}
                        className="grid gap-4 p-5 md:grid-cols-[1fr_auto_1fr] md:items-center"
                      >
                        <div className="flex flex-col gap-2">
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Match {match.id} • {match.stage}
                          </p>
                          <TeamDisplay teamName={match.teamA} />
                        </div>

                        <div className="rounded-2xl bg-gray-100 px-6 py-4 text-center">
                          <p className="text-sm font-semibold text-gray-500">
                            {match.status}
                          </p>
                          <p className="mt-1 text-lg font-bold">{match.time}</p>

                          <div className="mt-3 flex items-center justify-center gap-3">
                            <input
                              className="w-14 rounded-lg border bg-white p-2 text-center text-lg font-bold"
                              value={match.scoreA}
                              onChange={(e) =>
                                updateMatchScore(
                                  match.id,
                                  "scoreA",
                                  e.target.value
                                )
                              }
                            />
                            <span className="font-semibold text-gray-400">-</span>
                            <input
                              className="w-14 rounded-lg border bg-white p-2 text-center text-lg font-bold"
                              value={match.scoreB}
                              onChange={(e) =>
                                updateMatchScore(
                                  match.id,
                                  "scoreB",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>

                        <div className="flex flex-col items-start gap-2 md:items-end">
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            {match.stage}
                          </p>
                          <TeamDisplay teamName={match.teamB} />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </section>
          </>
        )}

        {activeTab === "bracket" && (() => {
          const cardWidth = 320;
          const cardHeight = 150;
          const rowGap = 42;
          const step = cardHeight + rowGap;
          const colGap = 140;

          const rounds = [
            { title: "Round of 32", stage: "Round of 32" },
            { title: "Round of 16", stage: "Round of 16" },
            { title: "Quarter Finals", stage: "Quarter Final" },
            { title: "Semi Finals", stage: "Semi Final" },
            { title: "Final", stage: "Final" },
          ];

          const bracketRounds = rounds.map((round) => ({
            ...round,
            matches: matches.filter((match) => match.stage === round.stage),
          }));

          const topFor = (roundIndex: number, index: number) => {
            const spacingMultiplier = Math.pow(2, roundIndex);
            const offset = (spacingMultiplier - 1) / 2;
            return (index * spacingMultiplier + offset) * step;
          };

          const centerY = (roundIndex: number, index: number) =>
            topFor(roundIndex, index) + cardHeight / 2;

          const leftFor = (roundIndex: number) =>
            roundIndex * (cardWidth + colGap);

          const bracketHeight = 16 * step;

          return (
            <section className="space-y-6">
              <div className="rounded-2xl bg-white p-6 shadow">
                <h2 className="text-2xl font-bold">Knockout Bracket</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Winners advance from each match into the next round.
                </p>
              </div>

              <div className="overflow-x-auto rounded-2xl bg-white p-6 shadow">
                <div
                  className="relative"
                  style={{
                    width: rounds.length * cardWidth + (rounds.length - 1) * colGap,
                    height: bracketHeight,
                  }}
                >
                  <svg
                    className="pointer-events-none absolute left-0 top-0 z-0"
                    width={rounds.length * cardWidth + (rounds.length - 1) * colGap}
                    height={bracketHeight}
                  >
                    {bracketRounds.slice(0, -1).flatMap((round, roundIndex) => {
                      const nextRound = bracketRounds[roundIndex + 1];

                      return nextRound.matches.map((_, nextIndex) => {
                        const sourceIndexA = nextIndex * 2;
                        const sourceIndexB = nextIndex * 2 + 1;

                        const sourceYA = centerY(roundIndex, sourceIndexA);
                        const sourceYB = centerY(roundIndex, sourceIndexB);
                        const targetY = centerY(roundIndex + 1, nextIndex);

                        const sourceX = leftFor(roundIndex) + cardWidth;
                        const targetX = leftFor(roundIndex + 1);
                        const midX = sourceX + colGap / 2;

                        return (
                          <g key={`${round.stage}-${nextIndex}`}>
                            <path
                              d={`
                        M ${sourceX} ${sourceYA}
                        H ${midX}
                        V ${sourceYB}
                        H ${sourceX}
                      `}
                              fill="none"
                              stroke="#9CA3AF"
                              strokeWidth="2"
                            />

                            <path
                              d={`
                        M ${midX} ${targetY}
                        H ${targetX}
                      `}
                              fill="none"
                              stroke="#9CA3AF"
                              strokeWidth="2"
                            />
                          </g>
                        );
                      });
                    })}
                  </svg>

                  {bracketRounds.map((round, roundIndex) => (
                    <div key={round.stage}>
                      <h3
                        className="absolute top-0 z-10 text-center text-sm font-bold uppercase tracking-wide text-gray-500"
                        style={{
                          left: leftFor(roundIndex),
                          width: cardWidth,
                        }}
                      >
                        {round.title}
                      </h3>

                      {round.matches.map((match, matchIndex) => (
                        <div
                          key={match.id}
                          className="absolute z-10"
                          style={{
                            left: leftFor(roundIndex),
                            top: topFor(roundIndex, matchIndex) + 36,
                            width: cardWidth,
                            minHeight: cardHeight,
                          }}
                        >
                          <BracketMatchCard match={match} />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                <div className="mt-10 rounded-2xl border bg-gray-50 p-4">
                  <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-500">
                    Bronze Final
                  </h3>

                  <div className="max-w-sm">
                    {matches
                      .filter((match) => match.stage === "Bronze Final")
                      .map((match) => (
                        <BracketMatchCard key={match.id} match={match} />
                      ))}
                  </div>
                </div>
              </div>
            </section>
          );
        })()}

        {activeTab === "standings" && (
          <>
            <section className="rounded-2xl bg-white p-6 shadow">
              <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-center">
                <h2 className="text-xl font-semibold">Team Chart</h2>
                <input
                  className="rounded-xl border p-3"
                  placeholder="Search team"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {filteredTeams.map((team) => {
                  const names = selectedByTeam[team.name] || [];
                  return (
                    <div
                      key={team.code}
                      className="group relative rounded-2xl border bg-gray-50 p-4 shadow-sm hover:bg-white hover:shadow-md"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">
                            Group {team.group}
                          </p>
                          <h3 className="font-bold">
                            <TeamDisplay teamName={team.name} />
                          </h3>
                        </div>
                        <span className="rounded-full bg-gray-200 px-3 py-1 text-sm">
                          {names.length}
                        </span>
                      </div>
                      <p className="mt-3 rounded-lg bg-blue-100 px-3 py-2 text-sm font-medium text-blue-800">
                        {team.status}
                      </p>

                      <div className="absolute left-1/2 top-full z-20 mt-2 hidden w-64 -translate-x-1/2 rounded-xl bg-black p-4 text-white shadow-xl group-hover:block">
                        <p className="font-semibold">Participants</p>
                        {names.length === 0 ? (
                          <p className="mt-2 text-sm text-gray-300">
                            No one picked this team yet.
                          </p>
                        ) : (
                          <ul className="mt-2 space-y-1 text-sm">
                            {names.map((name, index) => (
                              <li key={`${name}-${index}`}>
                                {index + 1}. {name}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>


          </>
        )}
      </section>
    </main>
  );
}
