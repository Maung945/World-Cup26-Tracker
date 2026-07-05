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

type Participant = {
  id: number;
  name: string;
  team1: string;
  team2: string;
  team3: string;
  user_id?: string;
  paid?: boolean;
};

type KnockoutPick = {
  id: number;
  name: string;
  qf_team1: string;
  qf_team2: string;
  qf_team3: string;
  qf_team4: string;
  qf_team5: string;
  qf_team6: string;
  qf_team7: string;
  qf_team8: string;
  sf_team1: string;
  sf_team2: string;
  sf_team3: string;
  sf_team4: string;
  user_id?: string;
  paid?: boolean;
};

type GroupStanding = {
  team: string;
  group: string;
  mp: number;
  w: number;
  d: number;
  l: number;
  gf: number;
  ga: number;
  gd: number;
  pts: number;
};

const teams: Team[] = [
  { code: "MEX", name: "Mexico", group: "A", status: "Group Stage" },
  { code: "RSA", name: "South Africa", group: "A", status: "Group Stage" },
  { code: "KOR", name: "South Korea", group: "A", status: "Group Stage" },
  { code: "CZE", name: "Czechia", group: "A", status: "Group Stage" },
  { code: "CAN", name: "Canada", group: "B", status: "Group Stage" },
  {
    code: "BIH",
    name: "Bosnia and Herzegovina",
    group: "B",
    status: "Group Stage",
  },
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
  Mexico: "/flags/mexico.png",
  "South Africa": "/flags/south-africa.png",
  "South Korea": "/flags/south-korea.png",
  Czechia: "/flags/czechia.png",
  Canada: "/flags/canada.png",
  "Bosnia and Herzegovina": "/flags/bosnia-and-herzegovina.png",
  Qatar: "/flags/qatar.png",
  Switzerland: "/flags/switzerland.png",
  Brazil: "/flags/brazil.png",
  Morocco: "/flags/morocco.png",
  Haiti: "/flags/haiti.png",
  Scotland: "/flags/scotland.png",
  "United States": "/flags/usa.png",
  Paraguay: "/flags/paraguay.png",
  Australia: "/flags/australia.png",
  Türkiye: "/flags/turkey.png",
  Germany: "/flags/germany.png",
  Curaçao: "/flags/curaçao.png",
  "Ivory Coast": "/flags/ivory-coast.png",
  Ecuador: "/flags/ecuador.png",
  Netherlands: "/flags/netherland.png",
  Japan: "/flags/japan.png",
  Sweden: "/flags/sweden.png",
  Tunisia: "/flags/tunisia.png",
  Belgium: "/flags/belgium.png",
  Egypt: "/flags/egypt.png",
  Iran: "/flags/iran.png",
  "New Zealand": "/flags/new-zealand.png",
  Spain: "/flags/spain.png",
  "Cape Verde": "/flags/cape-verde.png",
  "Saudi Arabia": "/flags/saudi-arabia.png",
  Uruguay: "/flags/uruguay.png",
  France: "/flags/france.png",
  Senegal: "/flags/senegal.png",
  Iraq: "/flags/iraq.png",
  Norway: "/flags/norway.png",
  Argentina: "/flags/argentina.png",
  Algeria: "/flags/algeria.png",
  Austria: "/flags/austria.png",
  Jordan: "/flags/jordan.png",
  Portugal: "/flags/portugal.png",
  "DR Congo": "/flags/dr-congo.png",
  Uzbekistan: "/flags/uzbekistan.png",
  Colombia: "/flags/colombia.png",
  England: "/flags/england.png",
  Croatia: "/flags/croatia.png",
  Ghana: "/flags/ghana.png",
  Panama: "/flags/panama.png",
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
  {
    id: 1,
    stage: "Group A",
    date: "Thu, Jun 11, 2026",
    time: "11:00 AM PDT",
    teamA: "Mexico",
    teamB: "South Africa",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Mexico City Stadium, Mexico City",
  },
  {
    id: 2,
    stage: "Group A",
    date: "Thu, Jun 11, 2026",
    time: "6:00 PM PDT",
    teamA: "South Korea",
    teamB: "Czechia",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Guadalajara Stadium, Guadalajara",
  },
  {
    id: 3,
    stage: "Group B",
    date: "Fri, Jun 12, 2026",
    time: "9:00 AM PDT",
    teamA: "Canada",
    teamB: "Bosnia and Herzegovina",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Toronto Stadium, Toronto",
  },
  {
    id: 4,
    stage: "Group D",
    date: "Fri, Jun 12, 2026",
    time: "6:00 PM PDT",
    teamA: "United States",
    teamB: "Paraguay",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Los Angeles Stadium, Los Angeles",
  },
  {
    id: 5,
    stage: "Group B",
    date: "Sat, Jun 13, 2026",
    time: "12:00 PM PDT",
    teamA: "Qatar",
    teamB: "Switzerland",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "San Francisco Bay Area Stadium, San Francisco Bay Area",
  },
  {
    id: 6,
    stage: "Group C",
    date: "Sat, Jun 13, 2026",
    time: "12:00 PM PDT",
    teamA: "Brazil",
    teamB: "Morocco",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "New York New Jersey Stadium, New York/New Jersey",
  },
  {
    id: 7,
    stage: "Group C",
    date: "Sat, Jun 13, 2026",
    time: "3:00 PM PDT",
    teamA: "Haiti",
    teamB: "Scotland",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Boston Stadium, Boston",
  },
  {
    id: 8,
    stage: "Group D",
    date: "Sat, Jun 13, 2026",
    time: "9:00 PM PDT",
    teamA: "Australia",
    teamB: "T\u00fcrkiye",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "BC Place Vancouver, Vancouver",
  },
  {
    id: 9,
    stage: "Group E",
    date: "Sun, Jun 14, 2026",
    time: "8:00 AM PDT",
    teamA: "Germany",
    teamB: "Cura\u00e7ao",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Houston Stadium, Houston",
  },
  {
    id: 10,
    stage: "Group F",
    date: "Sun, Jun 14, 2026",
    time: "11:00 AM PDT",
    teamA: "Netherlands",
    teamB: "Japan",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Dallas Stadium, Dallas",
  },
  {
    id: 11,
    stage: "Group E",
    date: "Sun, Jun 14, 2026",
    time: "1:00 PM PDT",
    teamA: "Ivory Coast",
    teamB: "Ecuador",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Philadelphia Stadium, Philadelphia",
  },
  {
    id: 12,
    stage: "Group F",
    date: "Sun, Jun 14, 2026",
    time: "7:00 PM PDT",
    teamA: "Sweden",
    teamB: "Tunisia",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Monterrey Stadium, Monterrey",
  },
  {
    id: 13,
    stage: "Group H",
    date: "Mon, Jun 15, 2026",
    time: "6:00 AM PDT",
    teamA: "Spain",
    teamB: "Cape Verde",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Atlanta Stadium, Atlanta",
  },
  {
    id: 14,
    stage: "Group G",
    date: "Mon, Jun 15, 2026",
    time: "12:00 PM PDT",
    teamA: "Belgium",
    teamB: "Egypt",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Seattle Stadium, Seattle",
  },
  {
    id: 15,
    stage: "Group H",
    date: "Mon, Jun 15, 2026",
    time: "12:00 PM PDT",
    teamA: "Saudi Arabia",
    teamB: "Uruguay",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Miami Stadium, Miami",
  },
  {
    id: 16,
    stage: "Group G",
    date: "Mon, Jun 15, 2026",
    time: "6:00 PM PDT",
    teamA: "Iran",
    teamB: "New Zealand",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Los Angeles Stadium, Los Angeles",
  },
  {
    id: 17,
    stage: "Group I",
    date: "Tue, Jun 16, 2026",
    time: "12:00 PM PDT",
    teamA: "France",
    teamB: "Senegal",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "New York New Jersey Stadium, New York/New Jersey",
  },
  {
    id: 18,
    stage: "Group I",
    date: "Tue, Jun 16, 2026",
    time: "03:00 PM PDT",
    teamA: "Iraq",
    teamB: "Norway",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Boston Stadium, Boston",
  },
  {
    id: 19,
    stage: "Group J",
    date: "Tue, Jun 16, 2026",
    time: "06:00 PM PDT",
    teamA: "Argentina",
    teamB: "Algeria",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Kansas City Stadium, Kansas City",
  },
  {
    id: 20,
    stage: "Group J",
    date: "Tue, Jun 16, 2026",
    time: "9:00 PM PDT",
    teamA: "Austria",
    teamB: "Jordan",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "San Francisco Bay Area Stadium, San Francisco Bay Area",
  },
  {
    id: 21,
    stage: "Group K",
    date: "Wed, Jun 17, 2026",
    time: "10:00 AM PDT",
    teamA: "Portugal",
    teamB: "DR Congo",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Houston Stadium, Houston",
  },
  {
    id: 22,
    stage: "Group L",
    date: "Wed, Jun 17, 2026",
    time: "01:00 PM PDT",
    teamA: "England",
    teamB: "Croatia",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Dallas Stadium, Dallas",
  },
  {
    id: 23,
    stage: "Group L",
    date: "Wed, Jun 17, 2026",
    time: "4:00 PM PDT",
    teamA: "Ghana",
    teamB: "Panama",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Toronto Stadium, Toronto",
  },
  {
    id: 24,
    stage: "Group K",
    date: "Wed, Jun 17, 2026",
    time: "5:00 PM PDT",
    teamA: "Uzbekistan",
    teamB: "Colombia",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Mexico City Stadium, Mexico City",
  },
  {
    id: 25,
    stage: "Group A",
    date: "Thu, Jun 18, 2026",
    time: "9:00 AM PDT",
    teamA: "Czechia",
    teamB: "South Africa",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Atlanta Stadium, Atlanta",
  },
  {
    id: 26,
    stage: "Group B",
    date: "Thu, Jun 18, 2026",
    time: "12:00 PM PDT",
    teamA: "Switzerland",
    teamB: "Bosnia and Herzegovina",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Los Angeles Stadium, Los Angeles",
  },
  {
    id: 27,
    stage: "Group B",
    date: "Thu, Jun 18, 2026",
    time: "3:00 PM PDT",
    teamA: "Canada",
    teamB: "Qatar",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "BC Place Vancouver, Vancouver",
  },
  {
    id: 28,
    stage: "Group A",
    date: "Thu, Jun 18, 2026",
    time: "6:00 PM PDT",
    teamA: "Mexico",
    teamB: "South Korea",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Guadalajara Stadium, Guadalajara",
  },
  {
    id: 29,
    stage: "Group D",
    date: "Fri, Jun 19, 2026",
    time: "12:00 PM PDT",
    teamA: "United States",
    teamB: "Australia",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Seattle Stadium, Seattle",
  },
  {
    id: 30,
    stage: "Group C",
    date: "Fri, Jun 19, 2026",
    time: "3:00 PM PDT",
    teamA: "Scotland",
    teamB: "Morocco",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Boston Stadium, Boston",
  },
  {
    id: 31,
    stage: "Group C",
    date: "Fri, Jun 19, 2026",
    time: "5:30 PM PDT",
    teamA: "Brazil",
    teamB: "Haiti",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Philadelphia Stadium, Philadelphia",
  },
  {
    id: 32,
    stage: "Group D",
    date: "Fri, Jun 19, 2026",
    time: "8:00 PM PDT",
    teamA: "T\u00fcrkiye",
    teamB: "Paraguay",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "San Francisco Bay Area Stadium, San Francisco Bay Area",
  },
  {
    id: 33,
    stage: "Group F",
    date: "Sat, Jun 20, 2026",
    time: "10:00 AM PDT",
    teamA: "Netherlands",
    teamB: "Sweden",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Houston Stadium, Houston",
  },
  {
    id: 34,
    stage: "Group E",
    date: "Sat, Jun 20, 2026",
    time: "1:00 PM PDT",
    teamA: "Germany",
    teamB: "Ivory Coast",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Toronto Stadium, Toronto",
  },
  {
    id: 35,
    stage: "Group E",
    date: "Sat, Jun 20, 2026",
    time: "5:00 PM PDT",
    teamA: "Ecuador",
    teamB: "Cura\u00e7ao",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Kansas City Stadium, Kansas City",
  },
  {
    id: 36,
    stage: "Group F",
    date: "Sat, Jun 20, 2026",
    time: "9:00 PM PDT",
    teamA: "Tunisia",
    teamB: "Japan",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Monterrey Stadium, Monterrey",
  },
  {
    id: 37,
    stage: "Group H",
    date: "Sun, Jun 21, 2026",
    time: "9:00 AM PDT",
    teamA: "Spain",
    teamB: "Saudi Arabia",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Atlanta Stadium, Atlanta",
  },
  {
    id: 38,
    stage: "Group G",
    date: "Sun, Jun 21, 2026",
    time: "12:00 PM PDT",
    teamA: "Belgium",
    teamB: "Iran",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Los Angeles Stadium, Los Angeles",
  },
  {
    id: 39,
    stage: "Group H",
    date: "Sun, Jun 21, 2026",
    time: "3:00 PM PDT",
    teamA: "Uruguay",
    teamB: "Cape Verde",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Miami Stadium, Miami",
  },
  {
    id: 40,
    stage: "Group G",
    date: "Sun, Jun 21, 2026",
    time: "6:00 PM PDT",
    teamA: "New Zealand",
    teamB: "Egypt",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "BC Place Vancouver, Vancouver",
  },
  {
    id: 41,
    stage: "Group J",
    date: "Mon, Jun 22, 2026",
    time: "10:00 AM PDT",
    teamA: "Argentina",
    teamB: "Austria",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Dallas Stadium, Dallas",
  },
  {
    id: 42,
    stage: "Group I",
    date: "Mon, Jun 22, 2026",
    time: "2:00 PM PDT",
    teamA: "France",
    teamB: "Iraq",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Philadelphia Stadium, Philadelphia",
  },
  {
    id: 43,
    stage: "Group I",
    date: "Mon, Jun 22, 2026",
    time: "5:00 PM PDT",
    teamA: "Norway",
    teamB: "Senegal",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "New York New Jersey Stadium, New York/New Jersey",
  },
  {
    id: 44,
    stage: "Group J",
    date: "Mon, Jun 22, 2026",
    time: "8:00 PM PDT",
    teamA: "Jordan",
    teamB: "Algeria",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "San Francisco Bay Area Stadium, San Francisco Bay Area",
  },
  {
    id: 45,
    stage: "Group K",
    date: "Tue, Jun 23, 2026",
    time: "10:00 AM PDT",
    teamA: "Portugal",
    teamB: "Uzbekistan",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Houston Stadium, Houston",
  },
  {
    id: 46,
    stage: "Group L",
    date: "Tue, Jun 23, 2026",
    time: "1:00 PM PDT",
    teamA: "England",
    teamB: "Ghana",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Boston Stadium, Boston",
  },
  {
    id: 47,
    stage: "Group L",
    date: "Tue, Jun 23, 2026",
    time: "4:00 PM PDT",
    teamA: "Panama",
    teamB: "Croatia",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Toronto Stadium, Toronto",
  },
  {
    id: 48,
    stage: "Group K",
    date: "Tue, Jun 23, 2026",
    time: "7:00 PM PDT",
    teamA: "Colombia",
    teamB: "DR Congo",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Guadalajara Stadium, Guadalajara",
  },
  {
    id: 49,
    stage: "Group B",
    date: "Wed, Jun 24, 2026",
    time: "12:00 PM PDT",
    teamA: "Switzerland",
    teamB: "Canada",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "BC Place Vancouver, Vancouver",
  },
  {
    id: 50,
    stage: "Group B",
    date: "Wed, Jun 24, 2026",
    time: "12:00 PM PDT",
    teamA: "Bosnia and Herzegovina",
    teamB: "Qatar",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Seattle Stadium, Seattle",
  },
  {
    id: 51,
    stage: "Group C",
    date: "Wed, Jun 24, 2026",
    time: "3:00 PM PDT",
    teamA: "Scotland",
    teamB: "Brazil",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Miami Stadium, Miami",
  },
  {
    id: 52,
    stage: "Group C",
    date: "Wed, Jun 24, 2026",
    time: "3:00 PM PDT",
    teamA: "Morocco",
    teamB: "Haiti",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Atlanta Stadium, Atlanta",
  },
  {
    id: 53,
    stage: "Group A",
    date: "Wed, Jun 24, 2026",
    time: "6:00 PM PDT",
    teamA: "Czechia",
    teamB: "Mexico",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Mexico City Stadium, Mexico City",
  },
  {
    id: 54,
    stage: "Group A",
    date: "Wed, Jun 24, 2026",
    time: "6:00 PM PDT",
    teamA: "South Africa",
    teamB: "South Korea",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Monterrey Stadium, Monterrey",
  },
  {
    id: 55,
    stage: "Group E",
    date: "Thu, Jun 25, 2026",
    time: "1:00 PM PDT",
    teamA: "Ecuador",
    teamB: "Germany",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "New York New Jersey Stadium, New York/New Jersey",
  },
  {
    id: 56,
    stage: "Group E",
    date: "Thu, Jun 25, 2026",
    time: "1:00 PM PDT",
    teamA: "Cura\u00e7ao",
    teamB: "Ivory Coast",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Philadelphia Stadium, Philadelphia",
  },
  {
    id: 57,
    stage: "Group F",
    date: "Thu, Jun 25, 2026",
    time: "4:00 PM PDT",
    teamA: "Tunisia",
    teamB: "Netherlands",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Kansas City Stadium, Kansas City",
  },
  {
    id: 58,
    stage: "Group F",
    date: "Thu, Jun 25, 2026",
    time: "4:00 PM PDT",
    teamA: "Japan",
    teamB: "Sweden",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Dallas Stadium, Dallas",
  },
  {
    id: 59,
    stage: "Group D",
    date: "Thu, Jun 25, 2026",
    time: "7:00 PM PDT",
    teamA: "T\u00fcrkiye",
    teamB: "United States",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Los Angeles Stadium, Los Angeles",
  },
  {
    id: 60,
    stage: "Group D",
    date: "Thu, Jun 25, 2026",
    time: "7:00 PM PDT",
    teamA: "Paraguay",
    teamB: "Australia",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "San Francisco Bay Area Stadium, San Francisco Bay Area",
  },
  {
    id: 61,
    stage: "Group I",
    date: "Fri, Jun 26, 2026",
    time: "12:00 PM PDT",
    teamA: "Norway",
    teamB: "France",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Boston Stadium, Boston",
  },
  {
    id: 62,
    stage: "Group I",
    date: "Fri, Jun 26, 2026",
    time: "12:00 PM PDT",
    teamA: "Senegal",
    teamB: "Iraq",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Toronto Stadium, Toronto",
  },
  {
    id: 63,
    stage: "Group H",
    date: "Fri, Jun 26, 2026",
    time: "5:00 PM PDT",
    teamA: "Uruguay",
    teamB: "Spain",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Guadalajara Stadium, Guadalajara",
  },
  {
    id: 64,
    stage: "Group H",
    date: "Fri, Jun 26, 2026",
    time: "5:00 PM PDT",
    teamA: "Cape Verde",
    teamB: "Saudi Arabia",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Houston Stadium, Houston",
  },
  {
    id: 65,
    stage: "Group G",
    date: "Fri, Jun 26, 2026",
    time: "8:00 PM PDT",
    teamA: "New Zealand",
    teamB: "Belgium",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "BC Place Vancouver, Vancouver",
  },
  {
    id: 66,
    stage: "Group G",
    date: "Fri, Jun 26, 2026",
    time: "8:00 PM PDT",
    teamA: "Egypt",
    teamB: "Iran",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Seattle Stadium, Seattle",
  },
  {
    id: 67,
    stage: "Group L",
    date: "Sat, Jun 27, 2026",
    time: "2:00 PM PDT",
    teamA: "Panama",
    teamB: "England",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "New York New Jersey Stadium, New York/New Jersey",
  },
  {
    id: 68,
    stage: "Group L",
    date: "Sat, Jun 27, 2026",
    time: "2:00 PM PDT",
    teamA: "Croatia",
    teamB: "Ghana",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Philadelphia Stadium, Philadelphia",
  },
  {
    id: 69,
    stage: "Group K",
    date: "Sat, Jun 27, 2026",
    time: "4:30 PM PDT",
    teamA: "Colombia",
    teamB: "Portugal",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Miami Stadium, Miami",
  },
  {
    id: 70,
    stage: "Group K",
    date: "Sat, Jun 27, 2026",
    time: "4:30 PM PDT",
    teamA: "DR Congo",
    teamB: "Uzbekistan",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Atlanta Stadium, Atlanta",
  },
  {
    id: 71,
    stage: "Group J",
    date: "Sat, Jun 27, 2026",
    time: "7:00 PM PDT",
    teamA: "Jordan",
    teamB: "Argentina",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Dallas Stadium, Dallas",
  },
  {
    id: 72,
    stage: "Group J",
    date: "Sat, Jun 27, 2026",
    time: "7:00 PM PDT",
    teamA: "Algeria",
    teamB: "Austria",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Kansas City Stadium, Kansas City",
  },
  {
    id: 73,
    stage: "Round of 32",
    date: "Sun, Jun 28, 2026",
    time: "12:00 PM PDT",
    teamA: "South Africa",
    teamB: "Canada",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Los Angeles Stadium, Los Angeles",
  },
  {
    id: 74,
    stage: "Round of 32",
    date: "Mon, Jun 29, 2026",
    time: "1:30 PM PDT",
    teamA: "Germany",
    teamB: "Paraguay",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Boston Stadium, Boston",
  },
  {
    id: 75,
    stage: "Round of 32",
    date: "Mon, Jun 29, 2026",
    time: "6:00 PM PDT",
    teamA: "Netherlands",
    teamB: "Morocco",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Monterrey Stadium, Monterrey",
  },
  {
    id: 76,
    stage: "Round of 32",
    date: "Mon, Jun 29, 2026",
    time: "10:00 AM PDT",
    teamA: "Brazil",
    teamB: "Japan",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Houston Stadium, Houston",
  },
  {
    id: 77,
    stage: "Round of 32",
    date: "Tue, Jun 30, 2026",
    time: "2:00 PM PDT",
    teamA: "France",
    teamB: "Sweden",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "New York New Jersey Stadium, New York/New Jersey",
  },
  {
    id: 78,
    stage: "Round of 32",
    date: "Tue, Jun 30, 2026",
    time: "10:00 AM PDT",
    teamA: "Ivory Coast",
    teamB: "Norway",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Dallas Stadium, Dallas",
  },
  {
    id: 79,
    stage: "Round of 32",
    date: "Tue, Jun 30, 2026",
    time: "6:00 PM PDT",
    teamA: "Mexico",
    teamB: "3E",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Mexico City Stadium, Mexico City",
  },
  {
    id: 80,
    stage: "Round of 32",
    date: "Wed, Jul 1, 2026",
    time: "9:00 AM PDT",
    teamA: "1L",
    teamB: "3K",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Atlanta Stadium, Atlanta",
  },
  {
    id: 81,
    stage: "Round of 32",
    date: "Wed, Jul 1, 2026",
    time: "1:00 PM PDT",
    teamA: "1G",
    teamB: "3I",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Seattle Stadium, Seattle",
  },
  {
    id: 82,
    stage: "Round of 32",
    date: "Wed, Jul 1, 2026",
    time: "5:00 PM PDT",
    teamA: "United States",
    teamB: "Bosnia and Herzegovina",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "San Francisco Bay Area Stadium, San Francisco Bay Area",
  },
  {
    id: 83,
    stage: "Round of 32",
    date: "Thu, Jul 2, 2026",
    time: "12:00 PM PDT",
    teamA: "Spain",
    teamB: "2J",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Los Angeles Stadium, Los Angeles",
  },
  {
    id: 84,
    stage: "Round of 32",
    date: "Thu, Jul 2, 2026",
    time: "4:00 PM PDT",
    teamA: "2K",
    teamB: "2L",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Toronto Stadium, Toronto",
  },
  {
    id: 85,
    stage: "Round of 32",
    date: "Thu, Jul 2, 2026",
    time: "8:00 PM PDT",
    teamA: "Switzerland",
    teamB: "3J",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "BC Place Vancouver, Vancouver",
  },
  {
    id: 86,
    stage: "Round of 32",
    date: "Fri, Jul 3, 2026",
    time: "11:00 AM PDT",
    teamA: "Australia",
    teamB: "2G",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Dallas Stadium, Dallas",
  },
  {
    id: 87,
    stage: "Round of 32",
    date: "Fri, Jul 3, 2026",
    time: "6:30 PM PDT",
    teamA: "1K",
    teamB: "3L",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Kansas City Stadium, Kansas City",
  },
  {
    id: 88,
    stage: "Round of 32",
    date: "Fri, Jul 3, 2026",
    time: "3:00 PM PDT",
    teamA: "Argentina",
    teamB: "Cape Verde",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Miami Stadium, Miami",
  },
  {
    id: 89,
    stage: "Round of 16",
    date: "Sat, Jul 4, 2026",
    time: "2:00 PM PDT",
    teamA: "W74",
    teamB: "W77",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Philadelphia Stadium, Philadelphia",
  },
  {
    id: 90,
    stage: "Round of 16",
    date: "Sat, Jul 4, 2026",
    time: "10:00 AM PDT",
    teamA: "W73",
    teamB: "W75",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Houston Stadium, Houston",
  },
  {
    id: 91,
    stage: "Round of 16",
    date: "Sun, Jul 5, 2026",
    time: "01:00 PM PDT",
    teamA: "W76",
    teamB: "W78",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "New York New Jersey Stadium, New York/New Jersey",
  },
  {
    id: 92,
    stage: "Round of 16",
    date: "Sun, Jul 5, 2026",
    time: "5:00 PM PDT",
    teamA: "W79",
    teamB: "W80",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Mexico City Stadium, Mexico City",
  },
  {
    id: 93,
    stage: "Round of 16",
    date: "Mon, Jul 6, 2026",
    time: "12:00 PM PDT",
    teamA: "W83",
    teamB: "W84",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Dallas Stadium, Dallas",
  },
  {
    id: 94,
    stage: "Round of 16",
    date: "Mon, Jul 6, 2026",
    time: "5:00 PM PDT",
    teamA: "W81",
    teamB: "W82",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Seattle Stadium, Seattle",
  },
  {
    id: 95,
    stage: "Round of 16",
    date: "Tue, Jul 7, 2026",
    time: "12:00 PM PDT",
    teamA: "W86",
    teamB: "W88",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Atlanta Stadium, Atlanta",
  },
  {
    id: 96,
    stage: "Round of 16",
    date: "Tue, Jul 7, 2026",
    time: "4:00 PM PDT",
    teamA: "W85",
    teamB: "W87",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "BC Place Vancouver, Vancouver",
  },
  {
    id: 97,
    stage: "Quarter Final",
    date: "Thu, Jul 9, 2026",
    time: "10:00 AM PDT",
    teamA: "W89",
    teamB: "W90",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Boston Stadium, Boston",
  },
  {
    id: 98,
    stage: "Quarter Final",
    date: "Fri, Jul 10, 2026",
    time: "12:00 PM PDT",
    teamA: "W93",
    teamB: "W94",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Los Angeles Stadium, Los Angeles",
  },
  {
    id: 99,
    stage: "Quarter Final",
    date: "Sat, Jul 11, 2026",
    time: "11:00 AM PDT",
    teamA: "W91",
    teamB: "W92",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Miami Stadium, Miami",
  },
  {
    id: 100,
    stage: "Quarter Final",
    date: "Sat, Jul 11, 2026",
    time: "4:00 PM PDT",
    teamA: "W95",
    teamB: "W96",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Kansas City Stadium, Kansas City",
  },
  {
    id: 101,
    stage: "Semi Final",
    date: "Tue, Jul 14, 2026",
    time: "10:00 AM PDT",
    teamA: "W97",
    teamB: "W98",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Dallas Stadium, Dallas",
  },
  {
    id: 102,
    stage: "Semi Final",
    date: "Wed, Jul 15, 2026",
    time: "9:00 AM PDT",
    teamA: "W99",
    teamB: "W100",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Atlanta Stadium, Atlanta",
  },
  {
    id: 103,
    stage: "Bronze Final",
    date: "Sat, Jul 18, 2026",
    time: "11:00 AM PDT",
    teamA: "L101",
    teamB: "L102",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Miami Stadium, Miami",
  },
  {
    id: 104,
    stage: "Final",
    date: "Sun, Jul 19, 2026",
    time: "9:00 AM PDT",
    teamA: "W101",
    teamB: "W102",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "New York New Jersey Stadium, New York/New Jersey",
  },
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

const PICK_CUTOFF = new Date("2026-06-28T00:00:00-07:00");
const KNOCKOUT_PICK_CUTOFF = new Date("2026-06-28T00:00:00-07:00");

const ADMIN_EMAILS = ["ma_945@outlook.com"];
const CONTRIBUTION_AMOUNT = 30;
const KNOCKOUT_CONTRIBUTION_AMOUNT = 20;

function flagText(teamName: string) {
  return teamName;
}

export default function Home() {
  const [participantName, setParticipantName] = useState("");
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [team3, setTeam3] = useState("");
  const [knockoutName, setKnockoutName] = useState("");
  const [quarterTeams, setQuarterTeams] = useState<string[]>(Array(8).fill(""));
  const [semiTeams, setSemiTeams] = useState<string[]>(Array(4).fill(""));
  const [knockoutPicks, setKnockoutPicks] = useState<KnockoutPick[]>([]);
  const [myKnockoutPick, setMyKnockoutPick] = useState<KnockoutPick | null>(
    null,
  );
  const [adminEditingKnockoutPick, setAdminEditingKnockoutPick] =
    useState<KnockoutPick | null>(null);
  const [knockoutMessage, setKnockoutMessage] = useState("");
  const [pendingKnockoutPaidById, setPendingKnockoutPaidById] = useState<
    Record<number, boolean>
  >({});
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [teamData, setTeamData] = useState<Team[]>(teams);
  const [matches, setMatches] = useState<Match[]>(starterMatches);
  const [search, setSearch] = useState("");
  const [matchSearch, setMatchSearch] = useState("");
  const [activeTab, setActiveTab] = useState<
    "participants" | "knockout" | "matches" | "bracket" | "groups"
  >("participants");
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMode, setAuthMode] = useState<"signIn" | "signUp">("signIn");
  const [authMessage, setAuthMessage] = useState("");
  const [authLoaded, setAuthLoaded] = useState(false);
  const [myPick, setMyPick] = useState<Participant | null>(null);
  const [scoreSaveMessage, setScoreSaveMessage] = useState("");
  const [paymentSaveMessage, setPaymentSaveMessage] = useState("");
  const [pendingPaidById, setPendingPaidById] = useState<
    Record<number, boolean>
  >({});
  const [isSavingPaymentChanges, setIsSavingPaymentChanges] = useState(false);
  const [adminEditingParticipant, setAdminEditingParticipant] =
    useState<Participant | null>(null);
  const matchDateRefs = React.useRef<Record<string, HTMLElement | null>>({});
  const matchCardRefs = React.useRef<Record<number, HTMLDivElement | null>>({});
  const bracketMatchRefs = React.useRef<Record<number, HTMLDivElement | null>>(
    {},
  );

  const isAdmin = Boolean(
    user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase()),
  );

  const [picksLocked, setPicksLocked] = useState(false);
  const [knockoutPicksOpen, setKnockoutPicksOpen] = useState(false);
  const [expandedBracketRounds, setExpandedBracketRounds] = useState<
    Record<string, boolean>
  >({
    "Round of 32": true,
    "Round of 16": false,
    "Quarter Final": false,
    "Semi Final": false,
    Final: false,
    "Bronze Final": false,
  });

  const hasSubmittedPick = Boolean(myPick);
  const isAdminEditingParticipant = Boolean(isAdmin && adminEditingParticipant);
  const shouldLockPickForm =
    !authLoaded ||
    !user ||
    (!isAdmin &&
      !isAdminEditingParticipant &&
      (picksLocked || hasSubmittedPick));

  const isAdminEditingKnockoutPick = Boolean(
    isAdmin && adminEditingKnockoutPick,
  );

  React.useEffect(() => {
    const now = new Date();
    setPicksLocked(now > PICK_CUTOFF);
    setKnockoutPicksOpen(now < KNOCKOUT_PICK_CUTOFF);
  }, []);

  React.useEffect(() => {
    fetchParticipants();
    fetchKnockoutPicks();
    fetchMatchScores();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);

      if (data.user) {
        fetchMyPick(data.user.id);
        fetchMyKnockoutPick(data.user.id);
      }

      setAuthLoaded(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setAuthLoaded(true);
        setUser(session?.user ?? null);

        if (session?.user) {
          fetchMyPick(session.user.id);
          fetchMyKnockoutPick(session.user.id);
        } else {
          setMyPick(null);
          setParticipantName("");
          setTeam1("");
          setTeam2("");
          setTeam3("");
          setMyKnockoutPick(null);
          setAdminEditingKnockoutPick(null);
          setKnockoutName("");
          setQuarterTeams(Array(8).fill(""));
          setSemiTeams(Array(4).fill(""));
          setAdminEditingParticipant(null);
        }
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function fetchParticipants() {
    const { data, error } = await supabase
      .from("participants")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setParticipants(
        data.map((participant) => ({
          ...participant,
          team3: participant.team3 ?? "",
          paid: Boolean(participant.paid),
        })),
      );
    }
  }

  async function fetchKnockoutPicks() {
    const { data, error } = await supabase
      .from("knockout_picks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Knockout picks fetch error:", error.message);
      return;
    }

    if (data) {
      setKnockoutPicks(
        data.map((pick) => ({ ...pick, paid: Boolean(pick.paid) })),
      );
    }
  }

  async function fetchMyKnockoutPick(userId: string) {
    const { data, error } = await supabase
      .from("knockout_picks")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (!error && data) {
      const normalizedPick = { ...data, paid: Boolean(data.paid) };
      setMyKnockoutPick(normalizedPick);
      setKnockoutName(data.name);
      setQuarterTeams([
        data.qf_team1 ?? "",
        data.qf_team2 ?? "",
        data.qf_team3 ?? "",
        data.qf_team4 ?? "",
        data.qf_team5 ?? "",
        data.qf_team6 ?? "",
        data.qf_team7 ?? "",
        data.qf_team8 ?? "",
      ]);
      setSemiTeams([
        data.sf_team1 ?? "",
        data.sf_team2 ?? "",
        data.sf_team3 ?? "",
        data.sf_team4 ?? "",
      ]);
    } else {
      setMyKnockoutPick(null);
      setKnockoutName("");
      setQuarterTeams(Array(8).fill(""));
      setSemiTeams(Array(4).fill(""));
    }
  }

  async function fetchMatchScores() {
    const { data, error } = await supabase.from("match_scores").select("*");

    if (error) {
      console.error("Match score fetch error:", error.message);
      return;
    }

    if (data) {
      setMatches((current) =>
        current.map((match) => {
          const savedScore = data.find((row) => row.match_id === match.id);

          if (!savedScore) return match;

          return {
            ...match,
            scoreA: savedScore.score_a ?? "",
            scoreB: savedScore.score_b ?? "",
            status: savedScore.status ?? match.status,
          };
        }),
      );
    }
  }

  async function fetchMyPick(userId: string) {
    const { data, error } = await supabase
      .from("participants")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (!error && data) {
      setMyPick({ ...data, team3: data.team3 ?? "", paid: Boolean(data.paid) });
      setParticipantName(data.name);
      setTeam1(data.team1);
      setTeam2(data.team2);
      setTeam3(data.team3 ?? "");
    } else {
      setMyPick(null);
      setParticipantName("");
      setTeam1("");
      setTeam2("");
      setTeam3("");
    }
  }

  async function handlePasswordAuth(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAuthMessage("");

    const cleanEmail = email.trim();

    if (!cleanEmail || !password) {
      setAuthMessage("Please enter both email and password.");
      return;
    }

    if (password.length < 6) {
      setAuthMessage("Password must be at least 6 characters.");
      return;
    }

    if (authMode === "signUp") {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
      });

      if (error) {
        setAuthMessage(error.message);
        return;
      }

      if (data.user && !data.session) {
        setAuthMessage(
          "Account created. If email confirmation is enabled, confirm your email before signing in.",
        );
      } else {
        setAuthMessage("Account created and signed in successfully.");
        setPassword("");
      }

      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (error) {
      setAuthMessage(error.message);
    } else {
      setAuthMessage("Signed in successfully.");
      setPassword("");
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
    setMyPick(null);
    setParticipantName("");
    setTeam1("");
    setTeam2("");
    setTeam3("");
    setPassword("");
    setAdminEditingParticipant(null);
    setAdminEditingKnockoutPick(null);
  }

  const selectedByTeam = useMemo(() => {
    const map: Record<string, string[]> = {};
    teamData.forEach((team) => (map[team.name] = []));

    participants.forEach((participant) => {
      map[participant.team1]?.push(participant.name);
      map[participant.team2]?.push(participant.name);
      map[participant.team3]?.push(participant.name);
    });

    return map;
  }, [participants, teamData]);

  const groupedMatches = useMemo(() => {
    const timeToMinutes = (time: string) => {
      const match = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (!match) return 0;

      let hours = Number(match[1]);
      const minutes = Number(match[2]);
      const period = match[3].toUpperCase();

      if (period === "PM" && hours !== 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;

      return hours * 60 + minutes;
    };

    return matches
      .filter((match) => match.id <= 72)
      .reduce<Record<string, Match[]>>((groups, match) => {
        if (!groups[match.date]) {
          groups[match.date] = [];
        }

        groups[match.date].push(match);

        groups[match.date].sort(
          (a, b) => timeToMinutes(a.time) - timeToMinutes(b.time),
        );

        return groups;
      }, {});
  }, [matches]);

  const filteredGroupedMatches = useMemo(() => {
    const query = matchSearch.trim().toLowerCase();

    if (!query) return groupedMatches;

    const teamMatchesSearch = (teamName: string) => {
      const teamCode = shortCodeMap[teamName]?.toLowerCase() ?? "";
      const normalizedTeamName = teamName.toLowerCase();

      return normalizedTeamName.includes(query) || teamCode.includes(query);
    };

    return Object.entries(groupedMatches).reduce<Record<string, Match[]>>(
      (groups, [date, dateMatches]) => {
        const matchesForSearch = dateMatches.filter(
          (match) =>
            teamMatchesSearch(match.teamA) ||
            teamMatchesSearch(match.teamB) ||
            match.stage.toLowerCase().includes(query) ||
            String(match.id).includes(query),
        );

        if (matchesForSearch.length > 0) {
          groups[date] = matchesForSearch;
        }

        return groups;
      },
      {},
    );
  }, [groupedMatches, matchSearch]);

  const totalFilteredMatchCount = useMemo(
    () =>
      Object.values(filteredGroupedMatches).reduce(
        (total, dateMatches) => total + dateMatches.length,
        0,
      ),
    [filteredGroupedMatches],
  );

  const liveMatches = useMemo(
    () => matches.filter((match) => match.status === "Live"),
    [matches],
  );

  const liveBracketMatches = useMemo(
    () =>
      matches.filter(
        (match) =>
          match.status === "Live" &&
          [
            "Round of 32",
            "Round of 16",
            "Quarter Final",
            "Semi Final",
            "Bronze Final",
            "Final",
          ].includes(match.stage),
      ),
    [matches],
  );

  function getMatchDateValue(dateString: string) {
    const cleanDate = dateString.replace(/^\w{3},\s*/, "");
    const [monthText, dayText, yearText] = cleanDate.split(/[ ,]+/);

    const monthMap: Record<string, number> = {
      Jan: 0,
      Feb: 1,
      Mar: 2,
      Apr: 3,
      May: 4,
      Jun: 5,
      Jul: 6,
      Aug: 7,
      Sep: 8,
      Oct: 9,
      Nov: 10,
      Dec: 11,
    };

    const month = monthMap[monthText];
    const day = Number(dayText);
    const year = Number(yearText);

    if (month === undefined || Number.isNaN(day) || Number.isNaN(year)) {
      return Number.POSITIVE_INFINITY;
    }

    return new Date(year, month, day).getTime();
  }

  function scrollToCurrentMatchDay() {
    const dateKeys = Object.keys(groupedMatches);

    if (dateKeys.length === 0) return;

    const today = new Date();
    const todayValue = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    ).getTime();

    const targetDate =
      dateKeys.find((date) => getMatchDateValue(date) >= todayValue) ??
      dateKeys[dateKeys.length - 1];

    const targetElement = matchDateRefs.current[targetDate];

    if (!targetElement) return;

    const stickyTabOffset = 90;
    const targetTop =
      targetElement.getBoundingClientRect().top +
      window.scrollY -
      stickyTabOffset;

    window.scrollTo({
      top: targetTop,
      behavior: "smooth",
    });
  }

  function scrollToCurrentLiveOrNextMatch() {
    const targetMatch =
      matches.find((match) => ["Live", "Half Time"].includes(match.status)) ??
      null;

    if (!targetMatch) {
      scrollToCurrentMatchDay();
      return;
    }

    const targetElement = matchCardRefs.current[targetMatch.id];

    if (!targetElement) {
      scrollToCurrentMatchDay();
      return;
    }

    const stickyTabOffset = 110;
    const targetTop =
      targetElement.getBoundingClientRect().top +
      window.scrollY -
      stickyTabOffset;

    window.scrollTo({
      top: targetTop,
      behavior: "smooth",
    });
  }

  function getMatchDateTimeValue(match: Match) {
    const cleanDate = match.date.replace(/^\w{3},\s*/, "");
    const parsedDateTime = new Date(
      `${cleanDate} ${match.time.replace("PDT", "GMT-0700")}`,
    );

    if (Number.isNaN(parsedDateTime.getTime())) {
      return getMatchDateValue(match.date);
    }

    return parsedDateTime.getTime();
  }

  function getCurrentBracketTargetMatch() {
    const bracketStageNames = [
      "Round of 32",
      "Round of 16",
      "Quarter Final",
      "Semi Final",
      "Bronze Final",
      "Final",
    ];

    const bracketMatches = matches
      .filter((match) => bracketStageNames.includes(match.stage))
      .sort((a, b) => getMatchDateTimeValue(a) - getMatchDateTimeValue(b));

    const liveMatch = bracketMatches.find((match) =>
      ["Live", "Half Time"].includes(match.status),
    );

    if (liveMatch) return liveMatch;

    const now = Date.now();

    return (
      bracketMatches.find((match) => getMatchDateTimeValue(match) >= now) ??
      bracketMatches[bracketMatches.length - 1] ??
      null
    );
  }

  function scrollToCurrentBracketMatch() {
    const targetMatch = getCurrentBracketTargetMatch();

    if (!targetMatch) return;

    const targetElement = bracketMatchRefs.current[targetMatch.id];

    if (!targetElement) return;

    targetElement.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  }

  function handleTabClick(
    tab: "participants" | "knockout" | "matches" | "bracket" | "groups",
  ) {
    setActiveTab(tab);

    if (tab === "matches") {
      window.setTimeout(() => {
        scrollToCurrentLiveOrNextMatch();
      }, 150);
    }

    if (tab === "bracket") {
      window.setTimeout(() => {
        scrollToCurrentBracketMatch();
      }, 200);
    }
  }

  const filteredTeams = teamData.filter((team) =>
    team.name.toLowerCase().includes(search.toLowerCase()),
  );

  const scoredParticipants = useMemo(() => {
    const hasValidScore = (match: Match) => {
      if (match.scoreA.trim() === "" || match.scoreB.trim() === "")
        return false;

      const scoreA = Number(match.scoreA);
      const scoreB = Number(match.scoreB);

      return !Number.isNaN(scoreA) && !Number.isNaN(scoreB);
    };

    const localGroupStandings = (() => {
      const standings: GroupStanding[] = teamData.map((team) => ({
        team: team.name,
        group: team.group,
        mp: 0,
        w: 0,
        d: 0,
        l: 0,
        gf: 0,
        ga: 0,
        gd: 0,
        pts: 0,
      }));

      const findStanding = (teamName: string) =>
        standings.find((standing) => standing.team === teamName);

      matches.forEach((match) => {
        if (!match.stage.startsWith("Group")) return;
        if (!hasValidScore(match)) return;

        const scoreA = Number(match.scoreA);
        const scoreB = Number(match.scoreB);

        const standingA = findStanding(match.teamA);
        const standingB = findStanding(match.teamB);

        if (!standingA || !standingB) return;

        standingA.mp += 1;
        standingB.mp += 1;

        standingA.gf += scoreA;
        standingA.ga += scoreB;
        standingB.gf += scoreB;
        standingB.ga += scoreA;

        standingA.gd = standingA.gf - standingA.ga;
        standingB.gd = standingB.gf - standingB.ga;

        if (scoreA > scoreB) {
          standingA.w += 1;
          standingA.pts += 3;
          standingB.l += 1;
        } else if (scoreB > scoreA) {
          standingB.w += 1;
          standingB.pts += 3;
          standingA.l += 1;
        } else {
          standingA.d += 1;
          standingB.d += 1;
          standingA.pts += 1;
          standingB.pts += 1;
        }
      });

      const groups: Record<string, GroupStanding[]> = {};

      standings.forEach((standing) => {
        if (!groups[standing.group]) groups[standing.group] = [];
        groups[standing.group].push(standing);
      });

      Object.keys(groups).forEach((group) => {
        groups[group].sort(
          (a, b) =>
            b.pts - a.pts ||
            b.gd - a.gd ||
            b.gf - a.gf ||
            a.team.localeCompare(b.team),
        );
      });

      return groups;
    })();

    const isGroupCompleteLocal = (group: string) => {
      const groupMatches = matches.filter(
        (match) => match.stage === `Group ${group}`,
      );

      return (
        groupMatches.length > 0 &&
        groupMatches.every((match) => hasValidScore(match))
      );
    };

    const getGroupRankTeamLocal = (group: string, rank: number) => {
      if (!isGroupCompleteLocal(group)) return null;
      return localGroupStandings[group]?.[rank - 1]?.team ?? null;
    };

    const getBestThirdPlaceTeamLocal = (candidateGroups: string) => {
      const groups = candidateGroups.split("");

      if (!groups.every((group) => isGroupCompleteLocal(group))) return null;

      const thirdPlaceTeams = groups
        .map((group) => localGroupStandings[group]?.[2])
        .filter(Boolean) as GroupStanding[];

      return (
        [...thirdPlaceTeams].sort(
          (a, b) =>
            b.pts - a.pts ||
            b.gd - a.gd ||
            b.gf - a.gf ||
            a.team.localeCompare(b.team),
        )[0]?.team ?? null
      );
    };

    function resolveScoringSlot(slot: string): string | null {
      if (shortCodeMap[slot]) return slot;

      const groupPlacement = slot.match(/^([123])([A-L])$/);
      if (groupPlacement) {
        const rank = Number(groupPlacement[1]);
        const group = groupPlacement[2];
        return getGroupRankTeamLocal(group, rank);
      }

      const thirdPlacePlacement = slot.match(/^3([A-L]+)$/);
      if (thirdPlacePlacement) {
        return getBestThirdPlaceTeamLocal(thirdPlacePlacement[1]);
      }

      const winnerPlacement = slot.match(/^W(\d+)$/);
      if (winnerPlacement) {
        return getScoringMatchWinner(Number(winnerPlacement[1]));
      }

      const loserPlacement = slot.match(/^L(\d+)$/);
      if (loserPlacement) {
        return getScoringMatchLoser(Number(loserPlacement[1]));
      }

      return null;
    }

    function getScoringMatchWinner(matchId: number): string | null {
      const match = matches.find((item) => item.id === matchId);

      if (!match || !hasValidScore(match)) return null;

      const scoreA = Number(match.scoreA);
      const scoreB = Number(match.scoreB);

      if (scoreA === scoreB) return null;

      return scoreA > scoreB
        ? resolveScoringSlot(match.teamA)
        : resolveScoringSlot(match.teamB);
    }

    function getScoringMatchLoser(matchId: number): string | null {
      const match = matches.find((item) => item.id === matchId);

      if (!match || !hasValidScore(match)) return null;

      const scoreA = Number(match.scoreA);
      const scoreB = Number(match.scoreB);

      if (scoreA === scoreB) return null;

      return scoreA < scoreB
        ? resolveScoringSlot(match.teamA)
        : resolveScoringSlot(match.teamB);
    }

    const getTeamPoints = (teamName: string) => {
      return matches.reduce((points, match) => {
        if (!hasValidScore(match)) return points;

        const resolvedTeamA = resolveScoringSlot(match.teamA);
        const resolvedTeamB = resolveScoringSlot(match.teamB);

        const isTeamA = resolvedTeamA === teamName;
        const isTeamB = resolvedTeamB === teamName;

        if (!isTeamA && !isTeamB) return points;

        const scoreA = Number(match.scoreA);
        const scoreB = Number(match.scoreB);

        if (scoreA === scoreB) return points + 1;
        if (isTeamA && scoreA > scoreB) return points + 3;
        if (isTeamB && scoreB > scoreA) return points + 3;

        return points;
      }, 0);
    };

    return participants
      .map((participant) => {
        const team1Score = getTeamPoints(participant.team1);
        const team2Score = getTeamPoints(participant.team2);
        const team3Score = getTeamPoints(participant.team3);

        return {
          ...participant,
          team1Score,
          team2Score,
          team3Score,
          score: team1Score + team2Score + team3Score,
        };
      })
      .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
  }, [participants, matches, teamData]);

  const highestParticipantScore = scoredParticipants[0]?.score ?? null;

  const isWinnerScore = (score: number) =>
    highestParticipantScore !== null && score === highestParticipantScore;

  const getParticipantRank = (index: number) => {
    const participant = scoredParticipants[index];
    if (!participant) return index + 1;

    const firstSameScoreIndex = scoredParticipants.findIndex(
      (item) => item.score === participant.score,
    );

    return firstSameScoreIndex + 1;
  };

  const getParticipantRankBadgeClass = (rank: number) => {
    if (rank === 1) return "bg-yellow-400 text-yellow-950 ring-yellow-200";
    if (rank === 2) return "bg-gray-200 text-gray-900 ring-gray-300";
    if (rank === 3) return "bg-orange-200 text-orange-900 ring-orange-300";
    return "bg-gray-100 text-gray-700 ring-gray-200";
  };

  const paidParticipantCount = useMemo(
    () => participants.filter((participant) => participant.paid).length,
    [participants],
  );

  const potMoney = paidParticipantCount * CONTRIBUTION_AMOUNT;
  const paidKnockoutCount = knockoutPicks.filter((pick) => pick.paid).length;
  const knockoutPotMoney = paidKnockoutCount * KNOCKOUT_CONTRIBUTION_AMOUNT;
  const hasUnsavedKnockoutPaymentChanges =
    Object.keys(pendingKnockoutPaidById).length > 0;
  const hasUnsavedPaymentChanges = Object.keys(pendingPaidById).length > 0;

  const selectedQuarterTeamSet = useMemo(
    () => new Set(quarterTeams.filter(Boolean)),
    [quarterTeams],
  );

  const quarterTeamOptions = useMemo(
    () =>
      [...teamData]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((team) => ({
          value: team.name,
          label: team.name,
          image: flagMap[team.name],
        })),
    [teamData],
  );

  const semiTeamOptions = useMemo(
    () =>
      quarterTeams
        .filter(Boolean)
        .filter(
          (teamName, index, currentQuarterTeams) =>
            currentQuarterTeams.indexOf(teamName) === index,
        )
        .map((teamName) => ({
          value: teamName,
          label: teamName,
          image: flagMap[teamName],
        })),
    [quarterTeams],
  );

  function setQuarterTeam(index: number, value: string) {
    setQuarterTeams((current) => {
      const nextQuarterTeams = current.map((team, i) =>
        i === index ? value : team,
      );
      const nextQuarterTeamSet = new Set(nextQuarterTeams.filter(Boolean));

      setSemiTeams((currentSemiTeams) =>
        currentSemiTeams.map((team) =>
          team && nextQuarterTeamSet.has(team) ? team : "",
        ),
      );

      return nextQuarterTeams;
    });
  }

  function setSemiTeam(index: number, value: string) {
    if (value && !selectedQuarterTeamSet.has(value)) {
      setKnockoutMessage(
        "Semi-final teams must be selected from your 8 quarter-final teams.",
      );
      return;
    }

    setSemiTeams((current) =>
      current.map((team, i) => (i === index ? value : team)),
    );
  }

  const computedGroupStandings = useMemo(() => {
    const standings: GroupStanding[] = teamData.map((team) => ({
      team: team.name,
      group: team.group,
      mp: 0,
      w: 0,
      d: 0,
      l: 0,
      gf: 0,
      ga: 0,
      gd: 0,
      pts: 0,
    }));

    const findTeam = (teamName: string) =>
      standings.find((standing) => standing.team === teamName);

    matches.forEach((match) => {
      if (!match.stage.startsWith("Group")) return;
      if (match.scoreA.trim() === "" || match.scoreB.trim() === "") return;

      const scoreA = Number(match.scoreA);
      const scoreB = Number(match.scoreB);

      if (Number.isNaN(scoreA) || Number.isNaN(scoreB)) return;

      const teamA = findTeam(match.teamA);
      const teamB = findTeam(match.teamB);

      if (!teamA || !teamB) return;

      teamA.mp += 1;
      teamB.mp += 1;

      teamA.gf += scoreA;
      teamA.ga += scoreB;
      teamB.gf += scoreB;
      teamB.ga += scoreA;

      teamA.gd = teamA.gf - teamA.ga;
      teamB.gd = teamB.gf - teamB.ga;

      if (scoreA > scoreB) {
        teamA.w += 1;
        teamA.pts += 3;
        teamB.l += 1;
      } else if (scoreB > scoreA) {
        teamB.w += 1;
        teamB.pts += 3;
        teamA.l += 1;
      } else {
        teamA.d += 1;
        teamB.d += 1;
        teamA.pts += 1;
        teamB.pts += 1;
      }
    });

    const groups: Record<string, GroupStanding[]> = {};

    standings.forEach((standing) => {
      if (!groups[standing.group]) groups[standing.group] = [];
      groups[standing.group].push(standing);
    });

    Object.keys(groups).forEach((group) => {
      groups[group].sort(
        (a, b) =>
          b.pts - a.pts ||
          b.gd - a.gd ||
          b.gf - a.gf ||
          a.team.localeCompare(b.team),
      );
    });

    return groups;
  }, [matches, teamData]);

  const actualQuarterFinalTeams = useMemo(
    () =>
      [89, 90, 91, 92, 93, 94, 95, 96]
        .map((matchId) => getMatchWinner(matchId))
        .filter(Boolean) as string[],
    [matches, computedGroupStandings],
  );

  const actualSemiFinalTeams = useMemo(
    () =>
      [97, 98, 99, 100]
        .map((matchId) => getMatchWinner(matchId))
        .filter(Boolean) as string[],
    [matches, computedGroupStandings],
  );

  const knockoutEliminatedTeams = useMemo(() => {
    return new Set(
      matches
        .filter((match) => {
          if (match.id < 73) return false;
          if (match.scoreA.trim() === "" || match.scoreB.trim() === "") {
            return false;
          }

          const scoreA = Number(match.scoreA);
          const scoreB = Number(match.scoreB);

          return (
            !Number.isNaN(scoreA) && !Number.isNaN(scoreB) && scoreA !== scoreB
          );
        })
        .map((match) => getMatchLoser(match.id))
        .filter((teamName): teamName is string =>
          Boolean(teamName && shortCodeMap[teamName]),
        ),
    );
  }, [matches, computedGroupStandings]);

  function isKnockoutEliminatedTeam(teamName: string) {
    return knockoutEliminatedTeams.has(teamName);
  }

  function getKnockoutPickScore(pick: KnockoutPick) {
    const pickedQuarterTeams = [
      pick.qf_team1,
      pick.qf_team2,
      pick.qf_team3,
      pick.qf_team4,
      pick.qf_team5,
      pick.qf_team6,
      pick.qf_team7,
      pick.qf_team8,
    ].filter(Boolean);
    const pickedSemiTeams = [
      pick.sf_team1,
      pick.sf_team2,
      pick.sf_team3,
      pick.sf_team4,
    ].filter(Boolean);

    const quarterScore = pickedQuarterTeams.filter((team) =>
      actualQuarterFinalTeams.includes(team),
    ).length;
    const semiScore = pickedSemiTeams.filter((team) =>
      actualSemiFinalTeams.includes(team),
    ).length;

    const matchedCount = quarterScore + semiScore;
    const quarterTotal = 8;
    const semiTotal = 4;
    const totalPossibleBracketSpots = quarterTotal + semiTotal;
    const totalCompletedBracketSpots =
      actualQuarterFinalTeams.length + actualSemiFinalTeams.length;
    const quarterPercentage =
      Math.round((quarterScore / quarterTotal) * 1000) / 10;
    const semiPercentage = Math.round((semiScore / semiTotal) * 1000) / 10;
    const matchPercentage =
      Math.round(((quarterPercentage + semiPercentage) / 2) * 10) / 10;
    const fullPoolPercentage =
      Math.round((matchedCount / totalPossibleBracketSpots) * 1000) / 10;

    return {
      quarterScore,
      semiScore,
      matchedCount,
      quarterTotal,
      semiTotal,
      totalCompletedBracketSpots,
      totalPossibleBracketSpots,
      quarterPercentage,
      semiPercentage,
      matchPercentage,
      fullPoolPercentage,
    };
  }

  const scoredKnockoutPicks = knockoutPicks
    .map((pick) => ({ ...pick, ...getKnockoutPickScore(pick) }))
    .sort(
      (a, b) =>
        b.matchPercentage - a.matchPercentage ||
        b.quarterPercentage - a.quarterPercentage ||
        b.semiPercentage - a.semiPercentage ||
        b.matchedCount - a.matchedCount ||
        b.quarterScore - a.quarterScore ||
        b.semiScore - a.semiScore ||
        a.name.localeCompare(b.name),
    );

  async function submitKnockoutPick(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setKnockoutMessage("");

    if (!user) {
      setKnockoutMessage(
        "Please log in before submitting your knockout picks.",
      );
      return;
    }

    if (!knockoutPicksOpen && !isAdmin) {
      setKnockoutMessage(
        "Quarter / Semi picks are locked after June 27, 2026 at 11:59 PM PDT.",
      );
      return;
    }

    const allTeams = [...quarterTeams, ...semiTeams];

    if (!knockoutName.trim() || allTeams.some((team) => !team)) {
      setKnockoutMessage(
        "Please enter your name and select all 8 quarter-final teams and all 4 semi-final teams.",
      );
      return;
    }

    if (new Set(quarterTeams).size !== 8) {
      setKnockoutMessage("Please choose 8 different quarter-final teams.");
      return;
    }

    if (new Set(semiTeams).size !== 4) {
      setKnockoutMessage("Please choose 4 different semi-final teams.");
      return;
    }

    const semiTeamsAreFromQuarterTeams = semiTeams.every((team) =>
      selectedQuarterTeamSet.has(team),
    );

    if (!semiTeamsAreFromQuarterTeams) {
      setKnockoutMessage(
        "Semi-final teams must come from the 8 quarter-final teams you selected.",
      );
      return;
    }

    const row = {
      name: knockoutName.trim(),
      qf_team1: quarterTeams[0],
      qf_team2: quarterTeams[1],
      qf_team3: quarterTeams[2],
      qf_team4: quarterTeams[3],
      qf_team5: quarterTeams[4],
      qf_team6: quarterTeams[5],
      qf_team7: quarterTeams[6],
      qf_team8: quarterTeams[7],
      sf_team1: semiTeams[0],
      sf_team2: semiTeams[1],
      sf_team3: semiTeams[2],
      sf_team4: semiTeams[3],
      user_id: adminEditingKnockoutPick?.user_id ?? user.id,
    };

    const knockoutPickIdToUpdate =
      adminEditingKnockoutPick?.id ?? myKnockoutPick?.id;

    const { data, error } = knockoutPickIdToUpdate
      ? await supabase
          .from("knockout_picks")
          .update(row)
          .eq("id", knockoutPickIdToUpdate)
          .select("id")
      : await supabase.from("knockout_picks").insert([row]).select("id");

    if (error) {
      setKnockoutMessage(error.message);
      return;
    }

    if (!data || data.length === 0) {
      setKnockoutMessage(
        "Save was blocked by Supabase Row Level Security. Run the admin UPDATE/DELETE policy SQL, then try again.",
      );
      return;
    }

    setAdminEditingKnockoutPick(null);
    await fetchKnockoutPicks();
    await fetchMyKnockoutPick(user.id);
    setKnockoutMessage("Knockout picks saved successfully.");
  }

  function startAdminEditKnockoutPick(pick: KnockoutPick) {
    if (!isAdmin) return;

    setAdminEditingKnockoutPick(pick);
    setKnockoutName(pick.name);
    setQuarterTeams([
      pick.qf_team1 ?? "",
      pick.qf_team2 ?? "",
      pick.qf_team3 ?? "",
      pick.qf_team4 ?? "",
      pick.qf_team5 ?? "",
      pick.qf_team6 ?? "",
      pick.qf_team7 ?? "",
      pick.qf_team8 ?? "",
    ]);
    setSemiTeams([
      pick.sf_team1 ?? "",
      pick.sf_team2 ?? "",
      pick.sf_team3 ?? "",
      pick.sf_team4 ?? "",
    ]);
    setKnockoutMessage(
      `Admin editing ${pick.name}. Make changes above, then click Save Admin Edit.`,
    );
  }

  function cancelAdminEditKnockoutPick() {
    setAdminEditingKnockoutPick(null);

    if (myKnockoutPick) {
      setKnockoutName(myKnockoutPick.name);
      setQuarterTeams([
        myKnockoutPick.qf_team1 ?? "",
        myKnockoutPick.qf_team2 ?? "",
        myKnockoutPick.qf_team3 ?? "",
        myKnockoutPick.qf_team4 ?? "",
        myKnockoutPick.qf_team5 ?? "",
        myKnockoutPick.qf_team6 ?? "",
        myKnockoutPick.qf_team7 ?? "",
        myKnockoutPick.qf_team8 ?? "",
      ]);
      setSemiTeams([
        myKnockoutPick.sf_team1 ?? "",
        myKnockoutPick.sf_team2 ?? "",
        myKnockoutPick.sf_team3 ?? "",
        myKnockoutPick.sf_team4 ?? "",
      ]);
    } else {
      setKnockoutName("");
      setQuarterTeams(Array(8).fill(""));
      setSemiTeams(Array(4).fill(""));
    }

    setKnockoutMessage("Admin edit cancelled.");
  }

  async function deleteKnockoutPick(pick: KnockoutPick) {
    if (!isAdmin) {
      alert("Only admins can delete knockout participants.");
      return;
    }

    const confirmed = window.confirm(
      `Delete ${pick.name} from the QF/Semi pool? This will remove their knockout picks from the leaderboard.`,
    );

    if (!confirmed) return;

    const { data, error } = await supabase
      .from("knockout_picks")
      .delete()
      .eq("id", pick.id)
      .select("id");

    if (error) {
      alert(error.message);
      return;
    }

    if (!data || data.length === 0) {
      alert(
        "Delete was blocked by Supabase Row Level Security. Run the admin UPDATE/DELETE policy SQL, then try again.",
      );
      return;
    }

    if (adminEditingKnockoutPick?.id === pick.id) {
      setAdminEditingKnockoutPick(null);
    }

    if (myKnockoutPick?.id === pick.id) {
      setMyKnockoutPick(null);
      setKnockoutName("");
      setQuarterTeams(Array(8).fill(""));
      setSemiTeams(Array(4).fill(""));
    }

    await fetchKnockoutPicks();
  }

  function toggleKnockoutPaid(pick: KnockoutPick) {
    if (!isAdmin) return;

    const nextPaidStatus = !pick.paid;

    setKnockoutPicks((current) =>
      current.map((item) =>
        item.id === pick.id ? { ...item, paid: nextPaidStatus } : item,
      ),
    );

    setPendingKnockoutPaidById((current) => ({
      ...current,
      [pick.id]: nextPaidStatus,
    }));
    setKnockoutMessage(
      "Knockout payment changes are not saved yet. Click Save changes.",
    );
  }

  async function saveKnockoutPaymentChanges() {
    if (!isAdmin) return;

    const changedEntries = Object.entries(pendingKnockoutPaidById);

    if (changedEntries.length === 0) {
      setKnockoutMessage("No knockout payment changes to save.");
      return;
    }

    for (const [pickId, paid] of changedEntries) {
      const { error } = await supabase
        .from("knockout_picks")
        .update({ paid })
        .eq("id", Number(pickId));

      if (error) {
        setKnockoutMessage(error.message);
        return;
      }
    }

    await fetchKnockoutPicks();
    if (user?.id) await fetchMyKnockoutPick(user.id);
    setPendingKnockoutPaidById({});
    setKnockoutMessage("Knockout payment changes saved successfully.");
  }

  async function addParticipant(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!user) {
      alert("Please log in before submitting your picks.");
      return;
    }

    if (picksLocked && !isAdmin && !isAdminEditingParticipant) {
      alert(
        "Picks are locked. Only the admin can add or edit submitted teams.",
      );
      return;
    }

    if (myPick && !isAdmin && !isAdminEditingParticipant) {
      alert(
        "Your teams are already submitted and cannot be changed. Please contact the admin if a correction is needed.",
      );
      return;
    }

    const selectedTeams = [team1, team2, team3];

    if (
      !participantName.trim() ||
      selectedTeams.some((team) => !team) ||
      new Set(selectedTeams).size !== selectedTeams.length
    ) {
      return;
    }

    const editedParticipantUserId = adminEditingParticipant?.user_id;

    if (isAdminEditingParticipant && adminEditingParticipant) {
      const { data, error } = await supabase
        .from("participants")
        .update({
          name: participantName.trim(),
          team1,
          team2,
          team3,
        })
        .eq("id", adminEditingParticipant.id)
        .select("id");

      if (error) {
        alert(error.message);
        return;
      }

      if (!data || data.length === 0) {
        alert(
          "Edit was blocked by Supabase Row Level Security. Run the admin UPDATE/DELETE policy SQL, then try again.",
        );
        return;
      }

      setAdminEditingParticipant(null);
    } else {
      const { error } = await supabase.from("participants").insert([
        {
          name: participantName.trim(),
          team1,
          team2,
          team3,
          user_id: isAdmin ? null : user.id,
        },
      ]);

      if (error) {
        alert(error.message);
        return;
      }
    }

    await fetchParticipants();

    if (isAdmin) {
      if (editedParticipantUserId === user.id) {
        await fetchMyPick(user.id);
      }

      setParticipantName("");
      setTeam1("");
      setTeam2("");
      setTeam3("");
      return;
    }

    await fetchMyPick(user.id);
  }

  function updateTeamStatus(teamName: string, status: Team["status"]) {
    setTeamData((current) =>
      current.map((team) =>
        team.name === teamName ? { ...team, status } : team,
      ),
    );
  }

  function updateMatchScore(
    matchId: number,
    field: "scoreA" | "scoreB",
    value: string,
  ) {
    if (!isAdmin) return;

    setMatches((current) =>
      current.map((match) =>
        match.id === matchId ? { ...match, [field]: value } : match,
      ),
    );
  }

  function updateMatchStatus(matchId: number, status: Match["status"]) {
    if (!isAdmin) return;

    setMatches((current) =>
      current.map((match) =>
        match.id === matchId ? { ...match, status } : match,
      ),
    );
  }

  async function saveAllScores() {
    if (!isAdmin) {
      alert("Only admins can save match scores.");
      return;
    }

    const rows = matches
      .filter(
        (match) =>
          match.scoreA.trim() !== "" ||
          match.scoreB.trim() !== "" ||
          match.status !== "Scheduled",
      )
      .map((match) => ({
        match_id: match.id,
        score_a: match.scoreA,
        score_b: match.scoreB,
        status: match.status,
        updated_by: user.id,
      }));

    const { error } = await supabase
      .from("match_scores")
      .upsert(rows, { onConflict: "match_id" });

    if (error) {
      console.error("Score save error:", error.message);
      setScoreSaveMessage(error.message);
      return;
    }

    setScoreSaveMessage("Scores saved successfully.");
    await fetchMatchScores();
  }

  async function resetAllScores() {
    if (!isAdmin) {
      alert("Only admins can reset match scores.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to reset all match scores and statuses? This will set every match back to blank and Scheduled.",
    );

    if (!confirmed) return;

    const rows = starterMatches.map((match) => ({
      match_id: match.id,
      score_a: "",
      score_b: "",
      status: "Scheduled",
      updated_by: user.id,
    }));

    const { error } = await supabase
      .from("match_scores")
      .upsert(rows, { onConflict: "match_id" });

    if (error) {
      console.error("Score reset error:", error.message);
      setScoreSaveMessage(error.message);
      return;
    }

    setMatches(starterMatches);
    setScoreSaveMessage("All scores have been reset.");
    await fetchMatchScores();
  }

  async function resetBracketScores() {
    if (!isAdmin) {
      alert("Only admins can reset bracket scores.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to reset only Bracket tab scores and statuses? Group-stage scores will stay unchanged.",
    );

    if (!confirmed) return;

    const bracketStarterMatches = starterMatches.filter(
      (match) => match.id >= 73,
    );

    const rows = bracketStarterMatches.map((match) => ({
      match_id: match.id,
      score_a: "",
      score_b: "",
      status: "Scheduled",
      updated_by: user.id,
    }));

    const { error } = await supabase
      .from("match_scores")
      .upsert(rows, { onConflict: "match_id" });

    if (error) {
      console.error("Bracket score reset error:", error.message);
      setScoreSaveMessage(error.message);
      return;
    }

    setMatches((current) =>
      current.map((match) =>
        match.id >= 73
          ? { ...match, scoreA: "", scoreB: "", status: "Scheduled" }
          : match,
      ),
    );
    setScoreSaveMessage("Bracket scores have been reset.");
    await fetchMatchScores();
  }

  function startAdminEditParticipant(participant: Participant) {
    if (!isAdmin) return;

    setAdminEditingParticipant(participant);
    setParticipantName(participant.name);
    setTeam1(participant.team1);
    setTeam2(participant.team2);
    setTeam3(participant.team3 ?? "");
  }

  function cancelAdminEditParticipant() {
    setAdminEditingParticipant(null);

    if (myPick) {
      setParticipantName(myPick.name);
      setTeam1(myPick.team1);
      setTeam2(myPick.team2);
      setTeam3(myPick.team3 ?? "");
    } else {
      setParticipantName("");
      setTeam1("");
      setTeam2("");
      setTeam3("");
    }
  }

  async function toggleParticipantPaid(participant: Participant) {
    if (!isAdmin) {
      alert("Only admins can update payment status.");
      return;
    }

    const nextPaidStatus = !participant.paid;
    const previousParticipants = participants;
    const previousMyPick = myPick;
    const previousAdminEditingParticipant = adminEditingParticipant;

    setPaymentSaveMessage(
      nextPaidStatus ? "Saving paid status..." : "Removing paid status...",
    );

    setParticipants((current) =>
      current.map((item) =>
        item.id === participant.id ? { ...item, paid: nextPaidStatus } : item,
      ),
    );

    if (myPick?.id === participant.id) {
      setMyPick({ ...myPick, paid: nextPaidStatus });
    }

    if (adminEditingParticipant?.id === participant.id) {
      setAdminEditingParticipant({
        ...adminEditingParticipant,
        paid: nextPaidStatus,
      });
    }

    setPendingPaidById((current) => {
      const next = { ...current };
      delete next[participant.id];
      return next;
    });

    const { data, error } = await supabase
      .from("participants")
      .update({ paid: nextPaidStatus })
      .eq("id", participant.id)
      .select("id, paid");

    if (error) {
      setParticipants(previousParticipants);
      setMyPick(previousMyPick);
      setAdminEditingParticipant(previousAdminEditingParticipant);
      setPaymentSaveMessage(error.message);
      return;
    }

    if (!data || data.length === 0) {
      setParticipants(previousParticipants);
      setMyPick(previousMyPick);
      setAdminEditingParticipant(previousAdminEditingParticipant);
      setPaymentSaveMessage(
        "Supabase did not save the payment change. Run the admin UPDATE policy SQL, then try Add $ again.",
      );
      return;
    }

    await fetchParticipants();

    if (user?.id) {
      await fetchMyPick(user.id);
    }

    setPaymentSaveMessage(
      nextPaidStatus
        ? `$ saved for ${participant.name}. Pot money updated.`
        : `$ removed for ${participant.name}. Pot money updated.`,
    );
  }

  async function savePaymentChanges() {
    if (!isAdmin) {
      alert("Only admins can save payment changes.");
      return;
    }

    const changedEntries = Object.entries(pendingPaidById);

    if (changedEntries.length === 0) {
      setPaymentSaveMessage("No payment changes to save.");
      return;
    }

    setIsSavingPaymentChanges(true);
    setPaymentSaveMessage("Saving payment changes...");

    for (const [participantId, paid] of changedEntries) {
      const { data, error } = await supabase
        .from("participants")
        .update({ paid })
        .eq("id", Number(participantId))
        .select("id, paid");

      if (error) {
        setIsSavingPaymentChanges(false);
        setPaymentSaveMessage(error.message);
        return;
      }

      if (!data || data.length === 0) {
        setIsSavingPaymentChanges(false);
        setPaymentSaveMessage(
          "Supabase did not save the payment change. Run the admin UPDATE policy SQL below, then try Save changes again.",
        );
        return;
      }
    }

    await fetchParticipants();

    if (user?.id) {
      await fetchMyPick(user.id);
    }

    setPendingPaidById({});
    setIsSavingPaymentChanges(false);
    setPaymentSaveMessage("Payment changes saved successfully.");
  }

  async function deleteParticipant(participant: Participant) {
    if (!isAdmin) {
      alert("Only admins can delete participants.");
      return;
    }

    const confirmed = window.confirm(
      `Delete ${participant.name}? This will remove their picks from the leaderboard.`,
    );

    if (!confirmed) return;

    const { data, error } = await supabase
      .from("participants")
      .delete()
      .eq("id", participant.id)
      .select("id");

    if (error) {
      alert(error.message);
      return;
    }

    if (!data || data.length === 0) {
      alert(
        "Delete was blocked by Supabase Row Level Security. Run the admin UPDATE/DELETE policy SQL, then try again.",
      );
      return;
    }

    if (adminEditingParticipant?.id === participant.id) {
      setAdminEditingParticipant(null);
    }

    if (myPick?.id === participant.id) {
      setMyPick(null);
      setParticipantName("");
      setTeam1("");
      setTeam2("");
      setTeam3("");
    }

    await fetchParticipants();
  }

  function LivePulse({ compact = false }: { compact?: boolean }) {
    return (
      <div
        className={
          compact
            ? "flex items-center gap-1.5 rounded-full bg-green-100 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-green-800 ring-1 ring-green-300"
            : "mt-2 flex items-center justify-center gap-2 rounded-full bg-green-100 px-3 py-1.5 text-sm font-black uppercase tracking-wide text-green-800 ring-1 ring-green-300"
        }
      >
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
        </span>
        <span>LIVE</span>
      </div>
    );
  }

  function TeamDisplay({
    teamName,
    showPickedByHover = true,
  }: {
    teamName: string;
    showPickedByHover?: boolean;
  }) {
    const participantNames = selectedByTeam[teamName] || [];
    const isKnownTeam = Boolean(shortCodeMap[teamName]);
    const isEliminated = isKnockoutEliminatedTeam(teamName);

    return (
      <div
        className={`group relative flex min-w-0 max-w-full items-center gap-2 ${
          isEliminated ? "opacity-45 grayscale" : ""
        }`}
        title={
          isEliminated
            ? `${teamName} was eliminated in the knockout stage`
            : teamName
        }
      >
        <img
          src={flagMap[teamName] || "/logos/fifa.png"}
          alt={`${teamName} flag`}
          className={`h-6 w-9 flex-shrink-0 rounded-md object-cover shadow-sm sm:h-8 sm:w-11 ${
            isEliminated ? "grayscale" : ""
          }`}
        />
        <span
          className={`truncate font-semibold ${
            isEliminated ? "text-gray-400 line-through decoration-gray-400" : ""
          }`}
        >
          {teamName}
        </span>

        {showPickedByHover && isKnownTeam && (
          <div className="absolute bottom-full left-0 z-30 mb-2 hidden min-w-56 rounded-xl bg-black p-3 text-white shadow-xl group-hover:block">
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

  function SelectTeamOption({ option }: { option: any }) {
    const isEliminated = isKnockoutEliminatedTeam(option.label);

    return (
      <div
        className={`flex items-center gap-3 ${
          isEliminated ? "opacity-45 grayscale" : ""
        }`}
        title={
          isEliminated
            ? `${option.label} was eliminated in the knockout stage`
            : option.label
        }
      >
        <img
          src={option.image}
          alt={option.label}
          className={`h-5 w-7 rounded-sm object-cover ${
            isEliminated ? "grayscale" : ""
          }`}
        />
        <span
          className={
            isEliminated ? "text-gray-400 line-through decoration-gray-400" : ""
          }
        >
          {option.label}
        </span>
      </div>
    );
  }

  function getMatchWinner(matchId: number): string | null {
    const match = matches.find((item) => item.id === matchId);

    if (!match) return null;
    if (match.scoreA.trim() === "" || match.scoreB.trim() === "") return null;

    const scoreA = Number(match.scoreA);
    const scoreB = Number(match.scoreB);

    if (Number.isNaN(scoreA) || Number.isNaN(scoreB)) return null;
    if (scoreA === scoreB) return null;

    return scoreA > scoreB
      ? resolveBracketTeam(match.teamA).name
      : resolveBracketTeam(match.teamB).name;
  }

  function getMatchLoser(matchId: number): string | null {
    const match = matches.find((item) => item.id === matchId);

    if (!match) return null;
    if (match.scoreA.trim() === "" || match.scoreB.trim() === "") return null;

    const scoreA = Number(match.scoreA);
    const scoreB = Number(match.scoreB);

    if (Number.isNaN(scoreA) || Number.isNaN(scoreB)) return null;
    if (scoreA === scoreB) return null;

    return scoreA < scoreB
      ? resolveBracketTeam(match.teamA).name
      : resolveBracketTeam(match.teamB).name;
  }

  function isGroupComplete(group: string): boolean {
    const groupMatches = matches.filter(
      (match) => match.stage === `Group ${group}`,
    );

    if (groupMatches.length === 0) return false;

    return groupMatches.every(
      (match) =>
        match.scoreA.trim() !== "" &&
        match.scoreB.trim() !== "" &&
        !Number.isNaN(Number(match.scoreA)) &&
        !Number.isNaN(Number(match.scoreB)),
    );
  }

  function getGroupRankTeam(group: string, rank: number): string | null {
    if (!isGroupComplete(group)) return null;

    const groupStandings = computedGroupStandings[group];

    if (!groupStandings || groupStandings.length < rank) return null;

    return groupStandings[rank - 1].team;
  }

  function getBestThirdPlaceTeam(candidateGroups: string): string | null {
    const groups = candidateGroups.split("");

    if (!groups.every((group) => isGroupComplete(group))) return null;

    const thirdPlaceTeams = groups
      .map((group) => computedGroupStandings[group]?.[2])
      .filter(Boolean) as GroupStanding[];

    if (thirdPlaceTeams.length === 0) return null;

    const sortedThirdPlaceTeams = [...thirdPlaceTeams].sort(
      (a, b) =>
        b.pts - a.pts ||
        b.gd - a.gd ||
        b.gf - a.gf ||
        a.team.localeCompare(b.team),
    );

    return sortedThirdPlaceTeams[0]?.team ?? null;
  }

  function resolveBracketTeam(slot: string): {
    name: string;
    source: string;
    resolved: boolean;
  } {
    if (shortCodeMap[slot]) {
      return { name: slot, source: slot, resolved: true };
    }

    const groupPlacement = slot.match(/^([123])([A-L])$/);
    if (groupPlacement) {
      const rank = Number(groupPlacement[1]);
      const group = groupPlacement[2];
      const teamName = getGroupRankTeam(group, rank);

      return {
        name: teamName ?? "TBD",
        source: `${rank}${group}`,
        resolved: Boolean(teamName),
      };
    }

    const thirdPlacePlacement = slot.match(/^3([A-L]+)$/);
    if (thirdPlacePlacement) {
      const teamName = getBestThirdPlaceTeam(thirdPlacePlacement[1]);

      return {
        name: teamName ?? "TBD",
        source: slot,
        resolved: Boolean(teamName),
      };
    }

    const winnerPlacement = slot.match(/^W(\d+)$/);
    if (winnerPlacement) {
      const matchId = Number(winnerPlacement[1]);
      const winner = getMatchWinner(matchId);

      return {
        name: winner ?? "TBD",
        source: `Winner of Match ${matchId}`,
        resolved: Boolean(winner),
      };
    }

    const loserPlacement = slot.match(/^L(\d+)$/);
    if (loserPlacement) {
      const matchId = Number(loserPlacement[1]);
      const loser = getMatchLoser(matchId);

      return {
        name: loser ?? "TBD",
        source: `Loser of Match ${matchId}`,
        resolved: Boolean(loser),
      };
    }

    return { name: "TBD", source: slot, resolved: false };
  }

  function BracketTeamSide({
    slot,
    align,
    isWinner,
  }: {
    slot: string;
    align: "left" | "right";
    isWinner: boolean;
  }) {
    const resolvedTeam = resolveBracketTeam(slot);
    const teamLabel = resolvedTeam.resolved ? resolvedTeam.name : "TBD";
    const flagSrc = resolvedTeam.resolved
      ? flagMap[resolvedTeam.name]
      : "/logos/fifa.png";
    const isEliminated = resolvedTeam.resolved
      ? isKnockoutEliminatedTeam(resolvedTeam.name)
      : false;

    return (
      <div
        className={`flex min-w-0 items-center gap-3 rounded-2xl px-4 py-3 transition ${
          align === "right"
            ? "justify-end text-right"
            : "justify-start text-left"
        } ${isWinner ? "bg-green-50 ring-2 ring-green-200" : "bg-white"} ${
          isEliminated ? "opacity-45 grayscale" : ""
        }`}
        title={resolvedTeam.resolved ? resolvedTeam.name : resolvedTeam.source}
      >
        {align === "left" && (
          <img
            src={flagSrc}
            alt={resolvedTeam.resolved ? `${resolvedTeam.name} flag` : "TBD"}
            className={`h-6 w-9 flex-shrink-0 rounded-md object-cover shadow-sm ${
              isEliminated ? "grayscale" : ""
            }`}
          />
        )}

        <span
          className={`min-w-0 truncate text-base font-extrabold leading-tight sm:text-xl ${
            isEliminated
              ? "text-gray-400 line-through decoration-gray-400"
              : "text-gray-900"
          }`}
        >
          {teamLabel}
        </span>

        {align === "right" && (
          <img
            src={flagSrc}
            alt={resolvedTeam.resolved ? `${resolvedTeam.name} flag` : "TBD"}
            className={`h-6 w-9 flex-shrink-0 rounded-md object-cover shadow-sm ${
              isEliminated ? "grayscale" : ""
            }`}
          />
        )}
      </div>
    );
  }

  function BracketScoreBox({
    matchId,
    field,
    value,
  }: {
    matchId: number;
    field: "scoreA" | "scoreB";
    value: string;
  }) {
    if (isAdmin) {
      return (
        <input
          className="h-9 w-11 flex-shrink-0 rounded-xl border border-gray-400 bg-white text-center text-lg font-extrabold text-gray-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          value={value}
          onChange={(e) => updateMatchScore(matchId, field, e.target.value)}
        />
      );
    }

    return (
      <span className="flex h-9 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-gray-300 bg-white text-lg font-extrabold text-gray-900 shadow-sm">
        {value.trim() === "" ? "-" : value}
      </span>
    );
  }

  function BracketTeamWithHover({
    teamName,
    flagSrc,
    align,
  }: {
    teamName: string;
    flagSrc: string;
    align: "left" | "right";
  }) {
    const participantNames = selectedByTeam[teamName] || [];
    const isKnownTeam = Boolean(shortCodeMap[teamName]);
    const isEliminated = isKnockoutEliminatedTeam(teamName);

    return (
      <div
        className={`flex min-w-0 flex-1 items-center gap-2 ${
          align === "right"
            ? "justify-end text-right"
            : "justify-start text-left"
        } ${isEliminated ? "opacity-45 grayscale" : ""}`}
        title={
          isEliminated
            ? `${teamName} was eliminated in the knockout stage`
            : teamName
        }
      >
        {align === "left" && (
          <div className="group relative flex-shrink-0">
            <img
              src={flagSrc}
              alt={teamName}
              className={`h-6 w-9 rounded-md object-cover shadow-sm ${
                isEliminated ? "grayscale" : ""
              }`}
            />

            {isKnownTeam && (
              <div className="absolute bottom-full left-0 z-50 mb-2 hidden min-w-48 rounded-xl bg-black p-3 text-left text-white shadow-xl group-hover:block">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-gray-300">
                  Picked by
                </p>

                {participantNames.length === 0 ? (
                  <p className="text-xs text-gray-400">No participants yet</p>
                ) : (
                  <div className="space-y-1">
                    {participantNames.map((name, index) => (
                      <p
                        key={`${teamName}-${name}-${index}`}
                        className="text-xs"
                      >
                        {index + 1}. {name}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <span
          className={`min-w-0 truncate text-sm font-bold ${
            isEliminated
              ? "text-gray-400 line-through decoration-gray-400"
              : "text-gray-900"
          }`}
        >
          {teamName}
        </span>

        {align === "right" && (
          <div className="group relative flex-shrink-0">
            <img
              src={flagSrc}
              alt={teamName}
              className={`h-6 w-9 rounded-md object-cover shadow-sm ${
                isEliminated ? "grayscale" : ""
              }`}
            />

            {isKnownTeam && (
              <div className="absolute bottom-full right-0 z-50 mb-2 hidden min-w-48 rounded-xl bg-black p-3 text-left text-white shadow-xl group-hover:block">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-gray-300">
                  Picked by
                </p>

                {participantNames.length === 0 ? (
                  <p className="text-xs text-gray-400">No participants yet</p>
                ) : (
                  <div className="space-y-1">
                    {participantNames.map((name, index) => (
                      <p
                        key={`${teamName}-${name}-${index}`}
                        className="text-xs"
                      >
                        {index + 1}. {name}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  function BracketMatchCard({ match }: { match: Match }) {
    const resolvedA = resolveBracketTeam(match.teamA);
    const resolvedB = resolveBracketTeam(match.teamB);

    const hasScore = match.scoreA.trim() !== "" && match.scoreB.trim() !== "";

    const teamAName = resolvedA.resolved ? resolvedA.name : "TBD";
    const teamBName = resolvedB.resolved ? resolvedB.name : "TBD";

    const flagA = resolvedA.resolved
      ? flagMap[resolvedA.name]
      : "/logos/fifa.png";

    const flagB = resolvedB.resolved
      ? flagMap[resolvedB.name]
      : "/logos/fifa.png";

    const isLive = match.status === "Live" || match.status === "Half Time";
    const isFinal = match.id === 104;
    const isQuarterFinal = match.stage === "Quarter Final";
    const isSemiFinal = match.stage === "Semi Final";
    const isRoundOf16 = match.stage === "Round of 16";
    const isRoundOf32 = match.stage === "Round of 32";

    const roundBracketCardClass = isRoundOf32
      ? "border-emerald-300 bg-gradient-to-br from-emerald-950 via-green-900 to-teal-600 text-white ring-2 ring-emerald-200"
      : isRoundOf16
        ? "border-orange-300 bg-gradient-to-br from-orange-950 via-amber-900 to-yellow-600 text-white ring-2 ring-orange-200"
        : null;

    const isSpecialBracketCard = Boolean(
      isFinal || isQuarterFinal || isSemiFinal || isRoundOf16 || isRoundOf32,
    );

    return (
      <div
        className={`relative w-full overflow-visible rounded-3xl border shadow-xl transition hover:-translate-y-0.5 hover:shadow-2xl ${
          isFinal
            ? "border-yellow-300 bg-gradient-to-br from-slate-950 via-yellow-950 to-yellow-500 text-white ring-4 ring-yellow-200"
            : isSemiFinal
              ? "border-purple-300 bg-gradient-to-br from-purple-950 via-indigo-900 to-fuchsia-700 text-white ring-2 ring-purple-200"
              : isQuarterFinal
                ? "border-blue-300 bg-gradient-to-br from-blue-950 via-sky-900 to-cyan-600 text-white ring-2 ring-blue-200"
                : roundBracketCardClass
                  ? roundBracketCardClass
                  : isLive
                    ? "border-green-400 bg-white ring-2 ring-green-300"
                    : "border-gray-200 bg-white"
        }`}
      >
        {isSpecialBracketCard && (
          <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.26),transparent_48%)]" />
        )}
        {isLive && (
          <div className="absolute right-2 top-2 z-20">
            <LivePulse compact />
          </div>
        )}

        <div
          className={`relative z-10 border-b px-3 py-2 text-center ${
            isFinal
              ? "border-yellow-300/40 bg-black/20"
              : isSemiFinal
                ? "border-purple-200/40 bg-white/10"
                : isQuarterFinal
                  ? "border-blue-200/40 bg-white/10"
                  : isRoundOf16 || isRoundOf32
                    ? "border-white/30 bg-white/10"
                    : isLive
                      ? "border-green-200 bg-green-50"
                      : "border-gray-200 bg-gray-50"
          }`}
        >
          <p
            className={`text-[11px] font-extrabold uppercase tracking-wide ${
              isSpecialBracketCard ? "text-white" : "text-gray-700"
            }`}
          >
            {isFinal
              ? "🏆 World Cup Final"
              : isSemiFinal
                ? `⚡ Match ${match.id} • Semi Final`
                : isQuarterFinal
                  ? `⭐ Match ${match.id} • Quarter Final`
                  : isRoundOf16
                    ? `🎯 Match ${match.id} • Round of 16`
                    : isRoundOf32
                      ? `🌎 Match ${match.id} • Round of 32`
                      : `Match ${match.id} • ${match.stage}`}
          </p>

          {isFinal && (
            <p className="mt-0.5 text-[10px] font-black uppercase tracking-[0.25em] text-yellow-200">
              Match 104
            </p>
          )}

          <p
            className={`mt-0.5 truncate text-[11px] font-medium ${
              isSpecialBracketCard ? "text-white/85" : "text-gray-500"
            }`}
          >
            {match.date} • {match.time}
          </p>

          {isLive && <LivePulse />}

          {match.venue && (
            <p
              className={`mx-auto mt-1 max-w-[230px] break-words text-[11px] font-semibold leading-snug ${
                isSpecialBracketCard ? "text-white/90" : "text-blue-700"
              }`}
              title={match.venue}
            >
              📍 {match.venue}
            </p>
          )}
        </div>

        <div className="relative z-10 flex items-center justify-between gap-2 px-3 py-3">
          {/* LEFT TEAM */}
          <BracketTeamWithHover
            teamName={teamAName}
            flagSrc={flagA}
            align="left"
          />

          {/* SCORES */}
          <div className="flex flex-shrink-0 items-center gap-2">
            {isAdmin ? (
              <input
                value={match.scoreA}
                onChange={(e) =>
                  updateMatchScore(match.id, "scoreA", e.target.value)
                }
                className={`h-9 w-10 rounded-xl border text-center text-base font-extrabold outline-none focus:border-blue-500 sm:w-11 sm:text-lg ${
                  isFinal
                    ? "border-yellow-300 bg-white/95 text-yellow-900"
                    : isSpecialBracketCard
                      ? "border-white/40 bg-white/95 text-gray-900"
                      : "border-gray-300 bg-white text-gray-900"
                }`}
              />
            ) : (
              <div
                className={`flex h-9 w-10 items-center justify-center rounded-xl text-base font-extrabold sm:w-11 sm:text-lg ${
                  isFinal
                    ? "bg-white/95 text-yellow-900"
                    : isSpecialBracketCard
                      ? "bg-white/95 text-gray-900"
                      : "bg-gray-100 text-gray-900"
                }`}
              >
                {hasScore ? match.scoreA : "-"}
              </div>
            )}

            <span
              className={`text-base font-extrabold ${
                isSpecialBracketCard ? "text-white/80" : "text-gray-400"
              }`}
            >
              -
            </span>

            {isAdmin ? (
              <input
                value={match.scoreB}
                onChange={(e) =>
                  updateMatchScore(match.id, "scoreB", e.target.value)
                }
                className={`h-9 w-10 rounded-xl border text-center text-base font-extrabold outline-none focus:border-blue-500 sm:w-11 sm:text-lg ${
                  isFinal
                    ? "border-yellow-300 bg-white/95 text-yellow-900"
                    : isSpecialBracketCard
                      ? "border-white/40 bg-white/95 text-gray-900"
                      : "border-gray-300 bg-white text-gray-900"
                }`}
              />
            ) : (
              <div
                className={`flex h-9 w-10 items-center justify-center rounded-xl text-base font-extrabold sm:w-11 sm:text-lg ${
                  isFinal
                    ? "bg-white/95 text-yellow-900"
                    : isSpecialBracketCard
                      ? "bg-white/95 text-gray-900"
                      : "bg-gray-100 text-gray-900"
                }`}
              >
                {hasScore ? match.scoreB : "-"}
              </div>
            )}
          </div>

          {/* RIGHT TEAM */}
          <BracketTeamWithHover
            teamName={teamBName}
            flagSrc={flagB}
            align="right"
          />
        </div>

        <div
          className={`relative z-10 border-t px-3 pb-3 pt-2 ${
            isSpecialBracketCard ? "border-white/25" : "border-gray-100"
          }`}
        >
          {isAdmin ? (
            <select
              value={match.status}
              onChange={(e) =>
                updateMatchStatus(match.id, e.target.value as Match["status"])
              }
              className={`w-full rounded-xl border px-2 py-2 text-xs font-bold outline-none ${
                isLive
                  ? "border-green-300 bg-green-50 text-green-800"
                  : isFinal
                    ? "border-yellow-300 bg-white/95 text-yellow-900"
                    : isSpecialBracketCard
                      ? "border-white/30 bg-white/95 text-gray-900"
                      : "border-gray-200 bg-gray-50 text-gray-700"
              }`}
            >
              <option value="Scheduled">Scheduled</option>
              <option value="Live">Live</option>
              <option value="Half Time">Half Time</option>
              <option value="Full Time">Full Time</option>
            </select>
          ) : (
            <div
              className={`rounded-xl px-2 py-2 text-center text-xs font-black uppercase tracking-wide ${
                isLive
                  ? "bg-green-100 text-green-800"
                  : isFinal
                    ? "bg-yellow-200 text-yellow-950"
                    : isSemiFinal
                      ? "bg-white/20 text-white"
                      : isQuarterFinal || isRoundOf16 || isRoundOf32
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 text-gray-600"
              }`}
            >
              {match.status}
            </div>
          )}
        </div>
      </div>
    );
  }

  function GroupTable({
    group,
    standings,
  }: {
    group: string;
    standings: GroupStanding[];
  }) {
    return (
      <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white p-4 text-gray-900 shadow-xl sm:p-6">
        <h2 className="mb-4 text-2xl font-extrabold sm:mb-5 sm:text-3xl">
          Group {group}
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left sm:min-w-[760px]">
            <thead>
              <tr className="border-b border-gray-200 text-gray-600">
                <th className="pb-3 text-sm font-medium sm:text-lg">Team</th>
                <th className="pb-3 text-center text-sm font-medium sm:text-lg">
                  MP
                </th>
                <th className="pb-3 text-center text-sm font-medium sm:text-lg">
                  W
                </th>
                <th className="pb-3 text-center text-sm font-medium sm:text-lg">
                  D
                </th>
                <th className="pb-3 text-center text-sm font-medium sm:text-lg">
                  L
                </th>
                <th className="pb-3 text-center text-sm font-medium sm:text-lg">
                  GF
                </th>
                <th className="pb-3 text-center text-sm font-medium sm:text-lg">
                  GA
                </th>
                <th className="pb-3 text-center text-sm font-medium sm:text-lg">
                  GD
                </th>
                <th className="pb-3 text-center text-sm font-extrabold text-gray-900 sm:text-lg">
                  Pts
                </th>
              </tr>
            </thead>

            <tbody>
              {standings.map((standing, index) => (
                <tr
                  key={`${group}-${standing.team}`}
                  className="border-b border-gray-100 transition hover:bg-gray-50"
                >
                  <td className="py-4">
                    <div className="flex items-center gap-4">
                      <span className="w-6 text-center text-xl font-bold text-gray-500 sm:text-3xl">
                        {index + 1}
                      </span>

                      <TeamDisplay teamName={standing.team} />
                    </div>
                  </td>

                  <td className="text-center text-lg sm:text-2xl">
                    {standing.mp}
                  </td>
                  <td className="text-center text-lg sm:text-2xl">
                    {standing.w}
                  </td>
                  <td className="text-center text-lg sm:text-2xl">
                    {standing.d}
                  </td>
                  <td className="text-center text-lg sm:text-2xl">
                    {standing.l}
                  </td>
                  <td className="text-center text-lg sm:text-2xl">
                    {standing.gf}
                  </td>
                  <td className="text-center text-lg sm:text-2xl">
                    {standing.ga}
                  </td>
                  <td className="text-center text-lg sm:text-2xl">
                    {standing.gd}
                  </td>
                  <td className="text-center text-lg font-extrabold sm:text-2xl">
                    {standing.pts}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-3 pb-28 text-gray-900 sm:p-6 sm:pb-28">
      <section className="mx-auto max-w-7xl space-y-4 sm:space-y-6">
        {isAdmin && (activeTab === "matches" || activeTab === "bracket") && (
          <div className="fixed bottom-3 left-3 right-3 z-50 rounded-2xl border border-gray-200 bg-white/95 p-3 shadow-2xl backdrop-blur sm:bottom-6 sm:left-auto sm:right-6 sm:w-auto">
            <div className="flex flex-col gap-1 sm:items-end">
              <button
                type="button"
                onClick={saveAllScores}
                className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-gray-800 sm:text-base"
              >
                💾 Save Scores
              </button>

              <p className="text-center text-xs text-gray-500 sm:text-right">
                Reset Scores stays in the admin controls above to prevent
                accidental resets.
              </p>
            </div>

            {scoreSaveMessage && (
              <p className="mt-2 text-center text-xs font-medium text-green-700 sm:text-right sm:text-sm">
                {scoreSaveMessage}
              </p>
            )}
          </div>
        )}
        <header className="rounded-3xl bg-white px-4 py-4 shadow-2xl sm:px-6 sm:py-5">
          <div className="flex flex-col items-center justify-center gap-4 text-center sm:flex-row sm:justify-between">
            <img
              src="/logos/fifa-world-cup-2026-logo.png"
              alt="Nutanix"
              className="h-10 w-auto object-contain drop-shadow-2xl sm:h-14 md:h-20"
            />

            <div className="px-1 text-center sm:px-6">
              <h1 className="text-xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">
                World Cup 2026 Team Picker
              </h1>

              <p className="mt-2 text-xs text-gray-600 sm:text-sm md:text-base">
                Participants choose three favorite teams and compete throughout
                the FIFA World Cup 2026.
              </p>
            </div>

            <img
              src="/logos/fifa.png"
              alt="FIFA"
              className="h-10 w-auto object-contain drop-shadow-2xl sm:h-14 md:h-20"
            />
          </div>
        </header>

        {!authLoaded ? (
          <section className="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-xl">
            <p className="text-sm font-semibold text-gray-600">Loading...</p>
          </section>
        ) : !user ? (
          <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl">
            <div className="relative bg-gradient-to-br from-blue-950 via-blue-800 to-emerald-700 px-5 py-10 text-white sm:px-10 sm:py-14">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute left-6 top-8 h-28 w-28 rounded-full bg-white blur-3xl" />
                <div className="absolute bottom-8 right-10 h-36 w-36 rounded-full bg-yellow-300 blur-3xl" />
              </div>

              <div className="relative mx-auto max-w-5xl text-center">
                <img
                  src="/logos/fifa-world-cup-2026-logo.png"
                  alt="FIFA World Cup 2026 Logo"
                  className="mx-auto h-28 w-auto object-contain drop-shadow-2xl sm:h-36 md:h-44"
                />

                <p className="mt-6 text-sm font-black uppercase tracking-[0.35em] text-yellow-200">
                  Fun Competition
                </p>

                <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl md:text-6xl">
                  FIFA World Cup 2026 Pool
                </h2>

                <p className="mx-auto mt-5 max-w-3xl text-base font-medium leading-8 text-blue-50 sm:text-lg">
                  Pick your favorite teams, follow every group-stage result,
                  track the knockout bracket, and compete with others on a live
                  leaderboard throughout the tournament.
                </p>
              </div>
            </div>

            <div className="grid gap-6 p-5 sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
              <div className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 text-center">
                    <p className="text-3xl font-black text-blue-900">48</p>
                    <p className="mt-1 text-sm font-bold text-gray-600">
                      Teams
                    </p>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 text-center">
                    <p className="text-3xl font-black text-blue-900">104</p>
                    <p className="mt-1 text-sm font-bold text-gray-600">
                      Matches
                    </p>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 text-center">
                    <p className="text-3xl font-black text-blue-900">3</p>
                    <p className="mt-1 text-sm font-bold text-gray-600">
                      Team Picks
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                  <h3 className="text-2xl font-extrabold text-gray-900">
                    Competition Summary
                  </h3>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl bg-blue-50 p-4">
                      <p className="text-sm font-black uppercase tracking-wide text-blue-800">
                        Main Pool
                      </p>
                      <p className="mt-2 text-sm leading-6 text-gray-700">
                        Each logged-in participant chooses three teams. Team
                        results earn points: win = 3, draw = 1, loss = 0.
                      </p>
                    </div>

                    <div className="rounded-2xl bg-emerald-50 p-4">
                      <p className="text-sm font-black uppercase tracking-wide text-emerald-800">
                        QF / Semi Picks
                      </p>
                      <p className="mt-2 text-sm leading-6 text-gray-700">
                        Participants can also predict the Quarter Final and Semi
                        Final teams, with leaders ranked by best match
                        percentage.
                      </p>
                    </div>

                    <div className="rounded-2xl bg-yellow-50 p-4">
                      <p className="text-sm font-black uppercase tracking-wide text-yellow-800">
                        Live Tracking
                      </p>
                      <p className="mt-2 text-sm leading-6 text-gray-700">
                        Match scores, group tables, bracket progress, and
                        leaderboards update after the admin saves results.
                      </p>
                    </div>

                    <div className="rounded-2xl bg-purple-50 p-4">
                      <p className="text-sm font-black uppercase tracking-wide text-purple-800">
                        Private Access
                      </p>
                      <p className="mt-2 text-sm leading-6 text-gray-700">
                        Participant tabs and pool details stay hidden until a
                        user signs in with email and password.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5 shadow-inner sm:p-6">
                <h3 className="text-2xl font-extrabold text-gray-900">
                  Sign in to enter
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Log in to view Participants, QF/Semi Picks, Matches, Bracket,
                  Groups, and submit your picks.
                </p>

                <form onSubmit={handlePasswordAuth} className="mt-5 space-y-4">
                  <div className="grid grid-cols-2 gap-2 rounded-2xl bg-white p-1 shadow-sm">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode("signIn");
                        setAuthMessage("");
                      }}
                      className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                        authMode === "signIn"
                          ? "bg-black text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      Sign In
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode("signUp");
                        setAuthMessage("");
                      }}
                      className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                        authMode === "signUp"
                          ? "bg-black text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      Create Account
                    </button>
                  </div>

                  <input
                    className="w-full rounded-2xl border border-gray-300 bg-white p-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <input
                    className="w-full rounded-2xl border border-gray-300 bg-white p-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <button className="w-full rounded-2xl bg-black px-5 py-4 font-extrabold text-white shadow-lg transition hover:bg-gray-800">
                    {authMode === "signIn" ? "Sign In" : "Create Account"}
                  </button>

                  <p className="text-center text-xs text-gray-500">
                    Use the same email and password each time.
                  </p>
                </form>

                {authMessage && (
                  <p className="mt-4 rounded-2xl bg-blue-50 p-3 text-center text-sm font-semibold text-blue-700">
                    {authMessage}
                  </p>
                )}
              </div>
            </div>
          </section>
        ) : (
          <>
            <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow sm:p-5">
              <div className="flex flex-col gap-3 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                    Pot Money
                  </p>
                  <h2 className="mt-1 text-2xl font-extrabold text-emerald-900 sm:text-3xl">
                    ${potMoney.toLocaleString()}
                  </h2>
                </div>

                <div className="flex flex-col items-center gap-2 sm:items-end">
                  <div className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-emerald-800 shadow-sm">
                    {paidParticipantCount} participant
                    {paidParticipantCount === 1 ? "" : "s"} paid × $
                    {CONTRIBUTION_AMOUNT}
                  </div>

                  {isAdmin && (
                    <div className="flex flex-col items-center gap-2 sm:items-end">
                      {hasUnsavedPaymentChanges && (
                        <button
                          type="button"
                          onClick={savePaymentChanges}
                          disabled={isSavingPaymentChanges}
                          className={`rounded-xl px-4 py-2 text-sm font-bold text-white shadow ${
                            isSavingPaymentChanges
                              ? "cursor-not-allowed bg-gray-400"
                              : "bg-emerald-700 hover:bg-emerald-800"
                          }`}
                        >
                          {isSavingPaymentChanges
                            ? "Saving..."
                            : "Save changes"}
                        </button>
                      )}

                      {paymentSaveMessage && (
                        <p className="max-w-xs text-center text-xs font-semibold text-emerald-800 sm:text-right">
                          {paymentSaveMessage}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </section>

            <section className="sticky top-0 z-50 overflow-hidden rounded-2xl border border-gray-300 bg-white/95 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-white/90">
              <div className="flex overflow-x-auto">
                {(
                  [
                    "participants",
                    "knockout",
                    "matches",
                    "bracket",
                    "groups",
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => handleTabClick(tab)}
                    className={`min-w-max flex-1 px-4 py-3 text-xs font-bold uppercase transition sm:p-4 sm:text-sm ${
                      activeTab === tab
                        ? "border-b-4 border-black bg-white text-black"
                        : "bg-white text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {tab === "groups"
                      ? "GROUPS/TEAMS"
                      : tab === "knockout"
                        ? "QF/SEMI PICKS"
                        : tab}
                  </button>
                ))}
              </div>
            </section>

            {activeTab === "participants" && (
              <>
                {liveMatches.length > 0 && (
                  <section className="rounded-2xl border-2 border-green-200 bg-green-50 p-4 shadow sm:p-6">
                    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="relative flex h-3 w-3">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                            <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
                          </span>
                          <h2 className="text-xl font-bold text-green-900">
                            Live Now
                          </h2>
                        </div>
                        <p className="mt-1 text-sm font-medium text-green-800">
                          {liveMatches.length === 1
                            ? "1 game is currently live."
                            : `${liveMatches.length} games are currently live.`}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleTabClick(
                            liveMatches.some(
                              (match) => !match.stage.startsWith("Group"),
                            )
                              ? "bracket"
                              : "matches",
                          )
                        }
                        className="w-full rounded-xl bg-green-700 px-4 py-3 text-sm font-bold text-white shadow hover:bg-green-800 sm:w-auto sm:py-2"
                      >
                        View Current Live Match
                      </button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      {liveMatches.map((match) => {
                        const isKnockoutMatch =
                          !match.stage.startsWith("Group");
                        const resolvedA = isKnockoutMatch
                          ? resolveBracketTeam(match.teamA)
                          : { name: match.teamA, resolved: true };
                        const resolvedB = isKnockoutMatch
                          ? resolveBracketTeam(match.teamB)
                          : { name: match.teamB, resolved: true };
                        const liveTeamA = resolvedA.resolved
                          ? resolvedA.name
                          : "TBD";
                        const liveTeamB = resolvedB.resolved
                          ? resolvedB.name
                          : "TBD";

                        return (
                          <div
                            key={match.id}
                            className="rounded-2xl border border-green-200 bg-white p-4 shadow-sm"
                          >
                            <div className="mb-3 flex items-center justify-between gap-3">
                              <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
                                Match {match.id} • {match.stage}
                              </p>
                              <div className="flex items-center gap-2 text-xs font-bold text-green-700">
                                <span className="relative flex h-3 w-3">
                                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                                  <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
                                </span>
                                LIVE
                              </div>
                            </div>

                            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                              <div className="min-w-0">
                                <TeamDisplay teamName={liveTeamA} />
                              </div>

                              <div className="rounded-xl bg-gray-100 px-3 py-2 text-center">
                                <p className="text-2xl font-black text-gray-900">
                                  {match.scoreA || "-"} - {match.scoreB || "-"}
                                </p>
                                <p className="mt-1 text-xs font-bold text-gray-500">
                                  {match.time}
                                </p>
                              </div>

                              <div className="min-w-0">
                                <TeamDisplay teamName={liveTeamB} />
                              </div>
                            </div>

                            {match.venue && (
                              <p className="mt-3 text-center text-xs font-medium text-gray-500">
                                {match.venue}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </section>
                )}

                <section className="rounded-2xl bg-white p-4 shadow sm:p-6">
                  <h2 className="text-xl font-semibold">Login Required</h2>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-600">
                    <li>
                      Each participant must create or sign in with an email and
                      password.
                    </li>
                    <li>You can submit only one set of picks per account.</li>
                    <li>
                      You may update your name or <strong>ONE</strong> team
                      until <strong>June 27, 2026 at 11:59 PM PDT</strong>.
                      After that, all picks are locked.
                    </li>
                  </ul>

                  {picksLocked && (
                    <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700">
                      Picks are now locked. No more team changes are allowed.
                    </p>
                  )}

                  {user ? (
                    <div className="mt-4 flex flex-col gap-3 rounded-xl bg-green-50 p-4 md:flex-row md:items-center md:justify-between">
                      <p className="text-sm text-green-800">
                        Logged in as <strong>{user.email}</strong>
                      </p>
                      <button
                        type="button"
                        onClick={logout}
                        className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
                      >
                        Log out
                      </button>
                    </div>
                  ) : (
                    <form
                      onSubmit={handlePasswordAuth}
                      className="mt-4 space-y-3"
                    >
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setAuthMode("signIn");
                            setAuthMessage("");
                          }}
                          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                            authMode === "signIn"
                              ? "bg-black text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          Sign In
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setAuthMode("signUp");
                            setAuthMessage("");
                          }}
                          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                            authMode === "signUp"
                              ? "bg-black text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          Create Account
                        </button>
                      </div>

                      <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                        <input
                          className="rounded-xl border p-3"
                          type="email"
                          placeholder="Email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />

                        <input
                          className="rounded-xl border p-3"
                          type="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />

                        <button className="rounded-xl bg-black px-5 py-3 font-semibold text-white hover:bg-gray-800">
                          {authMode === "signIn" ? "Sign In" : "Create Account"}
                        </button>
                      </div>

                      <p className="text-xs text-gray-500">
                        Use the same email and password each time. No magic-link
                        email is needed.
                      </p>
                    </form>
                  )}

                  {authMessage && (
                    <p className="mt-3 text-sm font-medium text-blue-700">
                      {authMessage}
                    </p>
                  )}
                </section>

                <section className="rounded-2xl bg-white p-4 shadow sm:p-6">
                  <h2 className="mb-4 text-xl font-semibold">
                    {isAdminEditingParticipant
                      ? `Admin Edit: ${adminEditingParticipant?.name}`
                      : isAdmin
                        ? "Admin Add Participant"
                        : myPick
                          ? "Your Picks Are Locked"
                          : "Add Participant"}
                  </h2>
                  <form
                    onSubmit={addParticipant}
                    className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr_auto]"
                  >
                    <input
                      className="min-w-0 rounded-xl border p-3 sm:col-span-2 lg:col-span-1"
                      placeholder="Participant name"
                      value={participantName}
                      onChange={(e) => setParticipantName(e.target.value)}
                      disabled={Boolean(shouldLockPickForm)}
                    />

                    <Select
                      instanceId="favorite-team-1"
                      inputId="favorite-team-1"
                      className="min-w-0"
                      isDisabled={Boolean(shouldLockPickForm)}
                      placeholder="Favorite Team 1"
                      value={
                        team1
                          ? {
                              value: team1,
                              label: team1,
                              image: flagMap[team1],
                            }
                          : null
                      }
                      onChange={(selected) => setTeam1(selected?.value || "")}
                      options={[...teamData]
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((team) => ({
                          value: team.name,
                          label: team.name,
                          image: flagMap[team.name],
                        }))}
                      formatOptionLabel={(option: any) => (
                        <SelectTeamOption option={option} />
                      )}
                    />

                    <Select
                      instanceId="favorite-team-2"
                      inputId="favorite-team-2"
                      className="min-w-0"
                      isDisabled={Boolean(shouldLockPickForm)}
                      placeholder="Favorite Team 2"
                      value={
                        team2
                          ? {
                              value: team2,
                              label: team2,
                              image: flagMap[team2],
                            }
                          : null
                      }
                      onChange={(selected) => setTeam2(selected?.value || "")}
                      options={[...teamData]
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((team) => ({
                          value: team.name,
                          label: team.name,
                          image: flagMap[team.name],
                        }))}
                      formatOptionLabel={(option: any) => (
                        <SelectTeamOption option={option} />
                      )}
                    />

                    <Select
                      instanceId="favorite-team-3"
                      inputId="favorite-team-3"
                      className="min-w-0"
                      isDisabled={Boolean(shouldLockPickForm)}
                      placeholder="Favorite Team 3"
                      value={
                        team3
                          ? {
                              value: team3,
                              label: team3,
                              image: flagMap[team3],
                            }
                          : null
                      }
                      onChange={(selected) => setTeam3(selected?.value || "")}
                      options={[...teamData]
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((team) => ({
                          value: team.name,
                          label: team.name,
                          image: flagMap[team.name],
                        }))}
                      formatOptionLabel={(option: any) => (
                        <SelectTeamOption option={option} />
                      )}
                    />

                    <button
                      disabled={Boolean(shouldLockPickForm)}
                      className="rounded-xl bg-black p-3 font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400 sm:col-span-2 lg:col-span-1"
                    >
                      {isAdminEditingParticipant
                        ? "Save Admin Edit"
                        : isAdmin
                          ? "Add Participant"
                          : "Submit Picks"}
                    </button>

                    {isAdminEditingParticipant && (
                      <button
                        type="button"
                        onClick={cancelAdminEditParticipant}
                        className="rounded-xl border border-gray-300 p-3 font-semibold text-gray-700 hover:bg-gray-100 sm:col-span-2 lg:col-span-1"
                      >
                        Cancel
                      </button>
                    )}
                  </form>

                  {!user && (
                    <p className="mt-3 text-sm text-gray-500">
                      Log in first to enable the pick form.
                    </p>
                  )}

                  {user && myPick && !isAdmin && !isAdminEditingParticipant && (
                    <p className="mt-3 text-sm font-medium text-orange-700">
                      Your teams are submitted and locked. Only the admin can
                      edit submitted teams.
                    </p>
                  )}

                  {user && isAdmin && !isAdminEditingParticipant && (
                    <p className="mt-3 text-sm font-medium text-blue-700">
                      Admin mode: you can add new participants after the cutoff
                      and edit any participant teams anytime.
                    </p>
                  )}

                  {[team1, team2, team3].every(Boolean) &&
                    new Set([team1, team2, team3]).size !== 3 && (
                      <p className="mt-3 text-red-600">
                        Please choose three different teams.
                      </p>
                    )}
                </section>

                <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl">
                  <div className="flex flex-col justify-between gap-3 border-b border-gray-100 bg-gradient-to-r from-slate-50 via-white to-blue-50 p-4 md:flex-row md:items-center sm:p-6">
                    <div>
                      <h2 className="text-2xl font-extrabold text-gray-900">
                        Participant Leaderboard
                      </h2>
                      <p className="mt-1 text-sm text-gray-500">
                        Scoring: win = 3 points, draw = 1 point, loss = 0
                        points.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-gray-900 px-4 py-2 text-sm font-bold text-white shadow-sm">
                        {participants.length} participants
                      </span>
                      <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-700 shadow-sm">
                        Pot: ${potMoney.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {participants.length === 0 ? (
                    <p className="p-6 text-gray-500">No participants yet.</p>
                  ) : (
                    <>
                      <div className="space-y-3 px-3 py-3 md:hidden">
                        {scoredParticipants.map((participant, index) => {
                          const participantRank = getParticipantRank(index);
                          const winner = participantRank === 1;

                          return (
                            <div
                              key={participant.id}
                              className={`rounded-2xl border p-4 shadow-sm ${
                                winner
                                  ? "border-yellow-200 bg-yellow-50/80"
                                  : "border-gray-200 bg-white"
                              }`}
                            >
                              <div className="mb-3 flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
                                    Rank #{participantRank}
                                  </p>
                                  <h3
                                    className={`truncate text-lg font-extrabold ${
                                      winner
                                        ? "text-yellow-700"
                                        : "text-gray-900"
                                    }`}
                                  >
                                    <span>
                                      {winner ? "🏆 " : ""}
                                      {participant.name}
                                    </span>
                                    {participant.paid && (
                                      <span className="ml-2 inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-extrabold text-emerald-700">
                                        $
                                      </span>
                                    )}
                                  </h3>
                                </div>

                                <span
                                  className={`flex-shrink-0 rounded-full px-3 py-1 text-sm font-extrabold shadow-sm ${
                                    winner
                                      ? "bg-yellow-400 text-yellow-950"
                                      : "bg-gray-900 text-white"
                                  }`}
                                >
                                  {participant.score} pts
                                </span>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 p-3">
                                  <TeamDisplay teamName={participant.team1} />
                                  <span className="flex-shrink-0 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-700">
                                    {participant.team1Score} pts
                                  </span>
                                </div>

                                <div className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 p-3">
                                  <TeamDisplay teamName={participant.team2} />
                                  <span className="flex-shrink-0 rounded-full bg-green-100 px-2.5 py-1 text-xs font-bold text-green-700">
                                    {participant.team2Score} pts
                                  </span>
                                </div>

                                <div className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 p-3">
                                  <TeamDisplay teamName={participant.team3} />
                                  <span className="flex-shrink-0 rounded-full bg-purple-100 px-2.5 py-1 text-xs font-bold text-purple-700">
                                    {participant.team3Score} pts
                                  </span>
                                </div>
                              </div>

                              {isAdmin && (
                                <div className="mt-3 grid grid-cols-3 gap-2">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      startAdminEditParticipant(participant)
                                    }
                                    className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      toggleParticipantPaid(participant)
                                    }
                                    className={`rounded-lg px-3 py-2 text-xs font-semibold text-white ${
                                      participant.paid
                                        ? "bg-emerald-700 hover:bg-emerald-800"
                                        : "bg-emerald-600 hover:bg-emerald-700"
                                    }`}
                                  >
                                    {participant.paid ? "Remove $" : "Add $"}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      deleteParticipant(participant)
                                    }
                                    className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700"
                                  >
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      <div className="hidden overflow-x-auto p-4 md:block sm:p-6">
                        <table className="w-full min-w-[980px] overflow-hidden rounded-2xl text-left text-sm shadow-sm ring-1 ring-gray-200">
                          <thead>
                            <tr className="bg-gray-950 text-xs font-black uppercase tracking-wide text-white">
                              <th className="px-4 py-4">Rank</th>
                              <th className="px-4 py-4">Participant</th>
                              <th className="px-4 py-4">Team 1</th>
                              <th className="px-4 py-4">Team 2</th>
                              <th className="px-4 py-4">Team 3</th>
                              <th className="px-4 py-4 text-right">
                                Total Score
                              </th>
                              {isAdmin && (
                                <th className="px-4 py-4 text-right">Admin</th>
                              )}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 bg-white">
                            {scoredParticipants.map((participant, index) => {
                              const participantRank = getParticipantRank(index);
                              const winner = participantRank === 1;

                              return (
                                <tr
                                  key={participant.id}
                                  className={`transition hover:bg-blue-50/70 ${
                                    winner ? "bg-yellow-50/80" : "bg-white"
                                  }`}
                                >
                                  <td className="px-4 py-4 align-middle">
                                    <div
                                      className={`flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-black shadow-sm ring-2 ${getParticipantRankBadgeClass(
                                        participantRank,
                                      )}`}
                                    >
                                      #{participantRank}
                                    </div>
                                  </td>
                                  <td
                                    className={`px-4 py-4 align-middle font-bold ${
                                      winner
                                        ? "text-yellow-700"
                                        : "text-gray-900"
                                    }`}
                                  >
                                    <div className="flex min-w-[160px] items-center gap-2">
                                      <span className="truncate text-base">
                                        {winner ? "🏆 " : ""}
                                        {participant.name}
                                      </span>
                                      {participant.paid && (
                                        <span className="inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-black text-emerald-700 ring-1 ring-emerald-200">
                                          $
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="px-4 py-4 align-middle">
                                    <div className="rounded-2xl bg-blue-50 p-3 ring-1 ring-blue-100">
                                      <div className="flex items-center justify-between gap-3">
                                        <TeamDisplay
                                          teamName={participant.team1}
                                        />
                                        <span className="flex-shrink-0 rounded-full bg-blue-600 px-3 py-1 text-xs font-black text-white shadow-sm">
                                          {participant.team1Score} pts
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-4 py-4 align-middle">
                                    <div className="rounded-2xl bg-emerald-50 p-3 ring-1 ring-emerald-100">
                                      <div className="flex items-center justify-between gap-3">
                                        <TeamDisplay
                                          teamName={participant.team2}
                                        />
                                        <span className="flex-shrink-0 rounded-full bg-emerald-600 px-3 py-1 text-xs font-black text-white shadow-sm">
                                          {participant.team2Score} pts
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-4 py-4 align-middle">
                                    <div className="rounded-2xl bg-purple-50 p-3 ring-1 ring-purple-100">
                                      <div className="flex items-center justify-between gap-3">
                                        <TeamDisplay
                                          teamName={participant.team3}
                                        />
                                        <span className="flex-shrink-0 rounded-full bg-purple-600 px-3 py-1 text-xs font-black text-white shadow-sm">
                                          {participant.team3Score} pts
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-4 py-4 text-right align-middle">
                                    <span
                                      className={`inline-flex rounded-2xl px-4 py-2 text-lg font-black shadow-sm ${
                                        winner
                                          ? "bg-yellow-400 text-yellow-950"
                                          : "bg-gray-900 text-white"
                                      }`}
                                    >
                                      {participant.score} pts
                                    </span>
                                  </td>
                                  {isAdmin && (
                                    <td className="px-4 py-4 text-right align-middle">
                                      <div className="flex justify-end gap-2">
                                        <button
                                          type="button"
                                          onClick={() =>
                                            startAdminEditParticipant(
                                              participant,
                                            )
                                          }
                                          className="rounded-xl bg-blue-600 px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
                                        >
                                          Edit
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            toggleParticipantPaid(participant)
                                          }
                                          className={`rounded-xl px-3 py-2 text-xs font-bold text-white shadow-sm ${
                                            participant.paid
                                              ? "bg-emerald-700 hover:bg-emerald-800"
                                              : "bg-emerald-600 hover:bg-emerald-700"
                                          }`}
                                        >
                                          {participant.paid
                                            ? "Remove $"
                                            : "Add $"}
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            deleteParticipant(participant)
                                          }
                                          className="rounded-xl bg-red-600 px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-red-700"
                                        >
                                          Delete
                                        </button>
                                      </div>
                                    </td>
                                  )}
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </section>
              </>
            )}

            {activeTab === "knockout" && (
              <>
                <section className="rounded-2xl border border-blue-200 bg-blue-50 p-4 shadow sm:p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-blue-700">
                        Separate $20 Pool
                      </p>
                      <h2 className="mt-1 text-2xl font-extrabold text-blue-950 sm:text-3xl">
                        Quarter / Semi Pick Pot: $
                        {knockoutPotMoney.toLocaleString()}
                      </h2>
                      <p className="mt-2 text-sm text-blue-800">
                        Pick 8 quarter-final teams and 4 semi-final teams. Entry
                        is separate from the original ${CONTRIBUTION_AMOUNT}{" "}
                        pot.
                      </p>
                    </div>

                    <div className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-blue-800 shadow-sm">
                      {paidKnockoutCount} participant
                      {paidKnockoutCount === 1 ? "" : "s"} paid × $
                      {KNOCKOUT_CONTRIBUTION_AMOUNT}
                    </div>
                  </div>

                  {!knockoutPicksOpen && !isAdmin && (
                    <p className="mt-4 rounded-xl bg-orange-50 p-3 text-sm font-semibold text-orange-700">
                      Quarter / Semi picks are locked after June 27, 2026 at
                      11:59 PM PDT.
                    </p>
                  )}
                </section>

                <section className="rounded-2xl bg-white p-4 shadow sm:p-6">
                  <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-xl font-semibold">
                        {isAdminEditingKnockoutPick
                          ? `Admin Edit: ${adminEditingKnockoutPick?.name}`
                          : "Submit Quarter / Semi Picks"}
                      </h2>
                      <p className="mt-1 text-sm text-gray-500">
                        Leaderboard compares your picks against the actual teams
                        shown in the Bracket tab. Ranking is based on highest
                        match percentage, then total matched teams.
                      </p>
                    </div>
                    {myKnockoutPick && (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">
                        Submitted
                      </span>
                    )}
                  </div>

                  <form onSubmit={submitKnockoutPick} className="space-y-5">
                    <input
                      className="w-full rounded-xl border p-3"
                      placeholder="Participant name"
                      value={knockoutName}
                      onChange={(e) => setKnockoutName(e.target.value)}
                      disabled={!user || (!knockoutPicksOpen && !isAdmin)}
                    />

                    <div>
                      <h3 className="mb-3 font-bold text-gray-900">
                        Pick 8 Quarter-Final Teams
                      </h3>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {quarterTeams.map((selectedTeam, index) => (
                          <Select
                            key={`quarter-${index}`}
                            instanceId={`quarter-team-${index}`}
                            inputId={`quarter-team-${index}`}
                            isDisabled={
                              !user || (!knockoutPicksOpen && !isAdmin)
                            }
                            placeholder={`QF Team ${index + 1}`}
                            value={
                              selectedTeam
                                ? {
                                    value: selectedTeam,
                                    label: selectedTeam,
                                    image: flagMap[selectedTeam],
                                  }
                                : null
                            }
                            onChange={(selected) =>
                              setQuarterTeam(index, selected?.value || "")
                            }
                            options={quarterTeamOptions}
                            formatOptionLabel={(option: any) => (
                              <SelectTeamOption option={option} />
                            )}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-1 font-bold text-gray-900">
                        Pick 4 Semi-Final Teams
                      </h3>
                      <p className="mb-3 text-sm text-gray-500">
                        Only the 8 teams you picked in Quarter-Final section
                        will show here.
                      </p>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {semiTeams.map((selectedTeam, index) => (
                          <Select
                            key={`semi-${index}`}
                            instanceId={`semi-team-${index}`}
                            inputId={`semi-team-${index}`}
                            isDisabled={
                              !user ||
                              semiTeamOptions.length < 8 ||
                              (!knockoutPicksOpen && !isAdmin)
                            }
                            placeholder={`Semi Team ${index + 1}`}
                            value={
                              selectedTeam
                                ? {
                                    value: selectedTeam,
                                    label: selectedTeam,
                                    image: flagMap[selectedTeam],
                                  }
                                : null
                            }
                            onChange={(selected) =>
                              setSemiTeam(index, selected?.value || "")
                            }
                            options={semiTeamOptions}
                            formatOptionLabel={(option: any) => (
                              <SelectTeamOption option={option} />
                            )}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <button
                        type="submit"
                        disabled={!user || (!knockoutPicksOpen && !isAdmin)}
                        className="rounded-xl bg-black px-5 py-3 font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
                      >
                        {isAdminEditingKnockoutPick
                          ? "Save Admin Edit"
                          : myKnockoutPick
                            ? "Update Knockout Picks"
                            : "Submit Knockout Picks"}
                      </button>

                      {isAdminEditingKnockoutPick && (
                        <button
                          type="button"
                          onClick={cancelAdminEditKnockoutPick}
                          className="rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50"
                        >
                          Cancel Edit
                        </button>
                      )}

                      {isAdmin && (
                        <button
                          type="button"
                          onClick={saveKnockoutPaymentChanges}
                          disabled={!hasUnsavedKnockoutPaymentChanges}
                          className="rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-gray-400"
                        >
                          Save $20 Payments
                        </button>
                      )}
                    </div>

                    {knockoutMessage && (
                      <p className="text-sm font-semibold text-blue-700">
                        {knockoutMessage}
                      </p>
                    )}
                  </form>
                </section>

                <section className="rounded-2xl bg-white p-4 shadow sm:p-6">
                  <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-xl font-semibold">
                        Quarter / Semi Leaderboard
                      </h2>
                      <p className="mt-1 text-sm text-gray-500">
                        Compares each entry against the actual Bracket
                        Quarter-Final teams out of 8 and Semi-Final teams out of
                        4, then ranks by the highest combined category
                        percentage.
                      </p>
                    </div>
                    <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700">
                      {knockoutPicks.length} entries
                    </span>
                  </div>

                  {knockoutPicks.length === 0 ? (
                    <p className="text-gray-500">No knockout picks yet.</p>
                  ) : (
                    <div className="space-y-3">
                      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                        <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
                          Actual bracket teams used for scoring
                        </p>
                        <p className="mt-2 text-sm font-semibold text-gray-700">
                          Quarter-Final teams found:{" "}
                          {actualQuarterFinalTeams.length}/8 • Semi-Final teams
                          found: {actualSemiFinalTeams.length}/4
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          QF percentage is scored out of 8 teams. Semi
                          percentage is scored out of 4 teams. Overall match
                          percentage is the average of those two category
                          percentages.
                        </p>
                      </div>
                      {scoredKnockoutPicks.map((pick, index) => (
                        <div
                          key={pick.id}
                          className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
                        >
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
                                Rank #{index + 1}
                              </p>
                              <h3 className="text-lg font-extrabold text-gray-900">
                                {pick.name}
                                {pick.paid && (
                                  <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-extrabold text-blue-700">
                                    $20
                                  </span>
                                )}
                              </h3>
                              <p className="mt-1 text-sm font-semibold text-gray-600">
                                QF {pick.quarterScore}/{pick.quarterTotal} ={" "}
                                {pick.quarterPercentage}% • Semi{" "}
                                {pick.semiScore}/{pick.semiTotal} ={" "}
                                {pick.semiPercentage}% • Overall{" "}
                                {pick.matchPercentage}%
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-extrabold text-yellow-700">
                                {pick.matchPercentage}%
                              </span>
                              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-extrabold text-gray-700">
                                {pick.matchedCount}/
                                {pick.totalPossibleBracketSpots} matched
                              </span>
                              {isAdmin && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      startAdminEditKnockoutPick(pick)
                                    }
                                    className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => toggleKnockoutPaid(pick)}
                                    className="rounded-lg bg-blue-700 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-800"
                                  >
                                    {pick.paid ? "Remove $20" : "Add $20"}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => deleteKnockoutPick(pick)}
                                    className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700"
                                  >
                                    Delete
                                  </button>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="mt-4 grid gap-3 lg:grid-cols-2">
                            <div className="rounded-xl bg-gray-50 p-3">
                              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">
                                Quarter Picks
                              </p>
                              <div className="grid gap-2 sm:grid-cols-2">
                                {[
                                  pick.qf_team1,
                                  pick.qf_team2,
                                  pick.qf_team3,
                                  pick.qf_team4,
                                  pick.qf_team5,
                                  pick.qf_team6,
                                  pick.qf_team7,
                                  pick.qf_team8,
                                ].map((team, teamIndex) => (
                                  <TeamDisplay
                                    key={`${pick.id}-qf-${teamIndex}`}
                                    teamName={team}
                                    showPickedByHover={false}
                                  />
                                ))}
                              </div>
                            </div>
                            <div className="rounded-xl bg-gray-50 p-3">
                              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">
                                Semi Picks
                              </p>
                              <div className="grid gap-2 sm:grid-cols-2">
                                {[
                                  pick.sf_team1,
                                  pick.sf_team2,
                                  pick.sf_team3,
                                  pick.sf_team4,
                                ].map((team, teamIndex) => (
                                  <TeamDisplay
                                    key={`${pick.id}-sf-${teamIndex}`}
                                    teamName={team}
                                    showPickedByHover={false}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </>
            )}

            {activeTab === "matches" && (
              <>
                <section className="space-y-6">
                  <div className="rounded-2xl bg-white p-4 shadow sm:p-6">
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                      <div>
                        <h2 className="text-2xl font-bold">Matches</h2>
                        <p className="mt-1 text-sm text-gray-500">
                          All times are Pacific Time. Group-stage matches are
                          shown here; knockout matches are available in the
                          Bracket tab.
                        </p>
                        <p className="mt-1 text-sm font-medium text-gray-700">
                          {isAdmin
                            ? "Admin mode: you can edit scores and match status."
                            : "Viewer mode: only the admin can update match scores."}
                        </p>
                      </div>

                      {isAdmin && (
                        <div className="flex flex-col items-start gap-2 md:items-end">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={saveAllScores}
                              className="rounded-xl bg-black px-5 py-3 font-semibold text-white hover:bg-gray-800"
                            >
                              Save Scores
                            </button>

                            <button
                              type="button"
                              onClick={resetAllScores}
                              className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700"
                            >
                              Reset Scores
                            </button>
                          </div>

                          {scoreSaveMessage && (
                            <p className="text-sm font-medium text-green-700">
                              {scoreSaveMessage}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                      <label
                        htmlFor="match-search"
                        className="text-sm font-bold text-gray-700"
                      >
                        Search matches by team
                      </label>
                      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                        <input
                          id="match-search"
                          value={matchSearch}
                          onChange={(e) => setMatchSearch(e.target.value)}
                          placeholder="Type USA, United States, Mexico, Brazil..."
                          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium outline-none ring-blue-500 focus:ring-2"
                        />

                        {matchSearch.trim() && (
                          <button
                            type="button"
                            onClick={() => setMatchSearch("")}
                            className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-100"
                          >
                            Clear
                          </button>
                        )}
                      </div>

                      <p className="mt-2 text-sm font-medium text-gray-600">
                        {matchSearch.trim()
                          ? `${totalFilteredMatchCount} match${
                              totalFilteredMatchCount === 1 ? "" : "es"
                            } found for "${matchSearch.trim()}".`
                          : "Search by team name or short code to show that team’s past, live, and future games."}
                      </p>
                    </div>
                  </div>

                  {matchSearch.trim() && totalFilteredMatchCount === 0 && (
                    <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center shadow">
                      <p className="text-lg font-bold text-gray-800">
                        No matches found
                      </p>
                      <p className="mt-2 text-sm text-gray-500">
                        Try searching by full team name or short code, such as
                        USA, United States, MEX, Brazil, or England.
                      </p>
                    </div>
                  )}

                  {Object.entries(filteredGroupedMatches).map(
                    ([date, dateMatches]) => (
                      <section
                        key={date}
                        ref={(element) => {
                          matchDateRefs.current[date] = element;
                        }}
                        className="overflow-hidden rounded-2xl bg-white shadow"
                      >
                        <div className="border-b bg-gray-50 px-6 py-4">
                          <h3 className="text-lg font-bold">{date}</h3>
                        </div>

                        <div className="divide-y">
                          {dateMatches.map((match) => (
                            <div
                              key={match.id}
                              ref={(element) => {
                                matchCardRefs.current[match.id] = element;
                              }}
                              className={`grid gap-4 p-4 sm:p-5 md:grid-cols-[1fr_auto_1fr] md:items-center ${
                                ["Live", "Half Time"].includes(match.status)
                                  ? "bg-green-50"
                                  : "bg-white"
                              }`}
                            >
                              <div className="flex flex-col gap-2">
                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                  Match {match.id} • {match.stage}
                                </p>
                                <TeamDisplay teamName={match.teamA} />
                              </div>

                              <div className="rounded-2xl bg-gray-100 px-4 py-4 text-center sm:px-6">
                                {isAdmin ? (
                                  <select
                                    className="rounded-lg border bg-white px-3 py-2 text-sm font-semibold"
                                    value={match.status}
                                    onChange={(e) =>
                                      updateMatchStatus(
                                        match.id,
                                        e.target.value as Match["status"],
                                      )
                                    }
                                  >
                                    <option value="Scheduled">Scheduled</option>
                                    <option value="Live">Live</option>
                                    <option value="Half Time">Half Time</option>
                                    <option value="Full Time">Full Time</option>
                                  </select>
                                ) : (
                                  <p className="text-sm font-semibold text-gray-500">
                                    {match.status}
                                  </p>
                                )}

                                {match.status === "Live" && <LivePulse />}

                                <p className="mt-1 text-lg font-bold">
                                  {match.time}
                                </p>

                                {match.venue && (
                                  <p className="mt-1 text-xs font-medium text-gray-500">
                                    {match.venue}
                                  </p>
                                )}

                                <div className="mt-3 flex items-center justify-center gap-3">
                                  {isAdmin ? (
                                    <>
                                      <input
                                        className="w-14 rounded-lg border bg-white p-2 text-center text-lg font-bold"
                                        value={match.scoreA}
                                        onChange={(e) =>
                                          updateMatchScore(
                                            match.id,
                                            "scoreA",
                                            e.target.value,
                                          )
                                        }
                                      />
                                      <span className="font-semibold text-gray-400">
                                        -
                                      </span>
                                      <input
                                        className="w-14 rounded-lg border bg-white p-2 text-center text-lg font-bold"
                                        value={match.scoreB}
                                        onChange={(e) =>
                                          updateMatchScore(
                                            match.id,
                                            "scoreB",
                                            e.target.value,
                                          )
                                        }
                                      />
                                    </>
                                  ) : (
                                    <div className="rounded-xl bg-white px-5 py-2 text-xl font-extrabold">
                                      {match.scoreA.trim() !== "" &&
                                      match.scoreB.trim() !== ""
                                        ? `${match.scoreA} - ${match.scoreB}`
                                        : "-"}
                                    </div>
                                  )}
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
                    ),
                  )}
                </section>
              </>
            )}

            {activeTab === "bracket" &&
              (() => {
                const cardWidth = 270;
                const cardHeight = 166;
                // Increase rowGap and colGap together to create more diagonal breathing room
                // between connected bracket cards while keeping the same mapping/order.
                const rowGap = 48;
                const step = cardHeight + rowGap;
                const colGap = 56;
                const headerOffset = 54;

                const rounds = [
                  { title: "Round of 32", stage: "Round of 32" },
                  { title: "Round of 16", stage: "Round of 16" },
                  { title: "Quarter Finals", stage: "Quarter Final" },
                  { title: "Semi Finals", stage: "Semi Final" },
                  { title: "Final", stage: "Final" },
                ];

                const bracketRounds = rounds.map((round) => ({
                  ...round,
                  matches: matches
                    .filter((match) => match.stage === round.stage)
                    .sort((a, b) => {
                      const roundOf32Order = [
                        74, 77, 73, 75, 84, 83, 82, 81, 76, 78, 79, 80, 88, 86,
                        85, 87,
                      ];

                      // Round of 16 is intentionally displayed in swapped pairs
                      // so the bracket visual position matches the requested layout:
                      // 90 before 89, 92 before 91, 94 before 93, and 96 before 95.
                      // Round of 32 stays unchanged.
                      const roundOf16Order = [89, 90, 93, 94, 91, 92, 95, 96];
                      const quarterFinalOrder = [97, 98, 99, 100];
                      const semiFinalOrder = [101, 102];

                      if (round.stage === "Round of 32") {
                        return (
                          roundOf32Order.indexOf(a.id) -
                          roundOf32Order.indexOf(b.id)
                        );
                      }

                      if (round.stage === "Round of 16") {
                        return (
                          roundOf16Order.indexOf(a.id) -
                          roundOf16Order.indexOf(b.id)
                        );
                      }

                      if (round.stage === "Quarter Final") {
                        return (
                          quarterFinalOrder.indexOf(a.id) -
                          quarterFinalOrder.indexOf(b.id)
                        );
                      }

                      if (round.stage === "Semi Final") {
                        return (
                          semiFinalOrder.indexOf(a.id) -
                          semiFinalOrder.indexOf(b.id)
                        );
                      }
                      return a.id - b.id;
                    }),
                }));

                const topFor = (roundIndex: number, index: number) => {
                  const spacing = Math.pow(2, roundIndex);
                  const offset = (spacing - 1) / 2;
                  return headerOffset + (index * spacing + offset) * step;
                };

                const centerY = (roundIndex: number, index: number) =>
                  topFor(roundIndex, index) + cardHeight / 2;

                const leftFor = (roundIndex: number) =>
                  roundIndex * (cardWidth + colGap);

                const bracketWidth =
                  rounds.length * cardWidth + (rounds.length - 1) * colGap;

                const bracketHeight = headerOffset + 16 * step + 120;

                return (
                  <section className="max-w-full overflow-hidden rounded-3xl border border-gray-200 bg-white p-4 shadow-xl md:p-8">
                    <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-end">
                      <div>
                        <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
                          Knockout Bracket
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                          Winners advance from each match into the next round.
                        </p>
                        <p className="mt-2 text-xs font-medium text-blue-700 md:hidden">
                          Tap each round to expand or collapse it for an easier
                          mobile view.
                        </p>
                      </div>

                      {isAdmin && (
                        <div className="flex flex-col items-start gap-2 md:items-end">
                          <button
                            type="button"
                            onClick={resetBracketScores}
                            className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-red-700 sm:text-base"
                          >
                            Reset Bracket Scores
                          </button>

                          {scoreSaveMessage && (
                            <p className="text-sm font-medium text-green-700">
                              {scoreSaveMessage}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {liveBracketMatches.length > 0 && (
                      <section className="mb-6 rounded-2xl border-2 border-green-200 bg-green-50 p-4 shadow sm:p-5">
                        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="relative flex h-3 w-3">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                                <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
                              </span>
                              <h3 className="text-xl font-bold text-green-900">
                                Live Knockout Games
                              </h3>
                            </div>
                            <p className="mt-1 text-sm font-medium text-green-800">
                              {liveBracketMatches.length === 1
                                ? "1 bracket game is currently live."
                                : `${liveBracketMatches.length} bracket games are currently live.`}
                            </p>
                          </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          {liveBracketMatches.map((match) => {
                            const resolvedA = resolveBracketTeam(match.teamA);
                            const resolvedB = resolveBracketTeam(match.teamB);
                            const teamAName = resolvedA.resolved
                              ? resolvedA.name
                              : "TBD";
                            const teamBName = resolvedB.resolved
                              ? resolvedB.name
                              : "TBD";

                            return (
                              <div
                                key={match.id}
                                className="rounded-2xl border border-green-200 bg-white p-4 shadow-sm"
                              >
                                <div className="mb-3 flex items-center justify-between gap-3">
                                  <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
                                    Match {match.id} • {match.stage}
                                  </p>
                                  <div className="flex items-center gap-2 text-xs font-bold text-green-700">
                                    <span className="relative flex h-3 w-3">
                                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                                      <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
                                    </span>
                                    LIVE
                                  </div>
                                </div>

                                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                                  <div className="min-w-0">
                                    <TeamDisplay teamName={teamAName} />
                                  </div>

                                  <div className="rounded-xl bg-gray-100 px-3 py-2 text-center">
                                    <p className="text-2xl font-black text-gray-900">
                                      {match.scoreA || "-"} -{" "}
                                      {match.scoreB || "-"}
                                    </p>
                                    <p className="mt-1 text-xs font-bold text-gray-500">
                                      {match.time}
                                    </p>
                                  </div>

                                  <div className="min-w-0">
                                    <TeamDisplay teamName={teamBName} />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </section>
                    )}

                    <div className="space-y-4 md:hidden">
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedBracketRounds({
                              "Round of 32": true,
                              "Round of 16": true,
                              "Quarter Final": true,
                              "Semi Final": true,
                              Final: true,
                              "Bronze Final": true,
                            })
                          }
                          className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-800 shadow-sm"
                        >
                          Expand All
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setExpandedBracketRounds({
                              "Round of 32": false,
                              "Round of 16": false,
                              "Quarter Final": false,
                              "Semi Final": false,
                              Final: false,
                              "Bronze Final": false,
                            })
                          }
                          className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 shadow-sm"
                        >
                          Collapse All
                        </button>
                      </div>

                      {bracketRounds.map((round) => {
                        const isExpanded = Boolean(
                          expandedBracketRounds[round.stage],
                        );

                        return (
                          <section
                            key={`mobile-${round.stage}`}
                            className="overflow-hidden rounded-3xl border border-gray-200 bg-gray-50 shadow-inner"
                          >
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedBracketRounds((current) => ({
                                  ...current,
                                  [round.stage]: !current[round.stage],
                                }))
                              }
                              className="flex w-full items-center justify-between gap-3 bg-white px-4 py-3 text-left shadow-sm"
                            >
                              <div>
                                <h3 className="text-sm font-extrabold uppercase tracking-wide text-gray-900">
                                  {round.title}
                                </h3>
                                <p className="mt-0.5 text-xs font-semibold text-gray-500">
                                  {round.matches.length} match
                                  {round.matches.length === 1 ? "" : "es"}
                                </p>
                              </div>

                              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-black text-gray-700">
                                {isExpanded ? "Hide" : "Show"}
                              </span>
                            </button>

                            {isExpanded && (
                              <div className="space-y-4 p-3">
                                {round.matches.map((match) => (
                                  <BracketMatchCard
                                    key={`mobile-card-${match.id}`}
                                    match={match}
                                  />
                                ))}
                              </div>
                            )}
                          </section>
                        );
                      })}

                      <section className="overflow-hidden rounded-3xl border border-gray-200 bg-gray-50 shadow-inner">
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedBracketRounds((current) => ({
                              ...current,
                              "Bronze Final": !current["Bronze Final"],
                            }))
                          }
                          className="flex w-full items-center justify-between gap-3 bg-white px-4 py-3 text-left shadow-sm"
                        >
                          <div>
                            <h3 className="text-sm font-extrabold uppercase tracking-wide text-gray-900">
                              Bronze Final
                            </h3>
                            <p className="mt-0.5 text-xs font-semibold text-gray-500">
                              1 match
                            </p>
                          </div>

                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-black text-gray-700">
                            {expandedBracketRounds["Bronze Final"]
                              ? "Hide"
                              : "Show"}
                          </span>
                        </button>

                        {expandedBracketRounds["Bronze Final"] && (
                          <div className="space-y-4 p-3">
                            {matches
                              .filter((match) => match.stage === "Bronze Final")
                              .map((match) => (
                                <BracketMatchCard
                                  key={`mobile-bronze-${match.id}`}
                                  match={match}
                                />
                              ))}
                          </div>
                        )}
                      </section>
                    </div>

                    <div className="hidden w-full max-w-full overflow-x-auto rounded-3xl border border-gray-200 bg-gray-50 p-3 shadow-inner md:block md:p-5">
                      <div
                        className="relative"
                        style={{ width: bracketWidth, height: bracketHeight }}
                      >
                        <svg
                          className="pointer-events-none absolute left-0 top-0 z-0"
                          width={bracketWidth}
                          height={bracketHeight}
                        >
                          {bracketRounds
                            .slice(0, -1)
                            .flatMap((round, roundIndex) => {
                              const nextRound = bracketRounds[roundIndex + 1];

                              return nextRound.matches.map((_, nextIndex) => {
                                const sourceIndexA = nextIndex * 2;
                                const sourceIndexB = nextIndex * 2 + 1;

                                const sourceYA = centerY(
                                  roundIndex,
                                  sourceIndexA,
                                );
                                const sourceYB = centerY(
                                  roundIndex,
                                  sourceIndexB,
                                );
                                const targetY = centerY(
                                  roundIndex + 1,
                                  nextIndex,
                                );

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
                                      stroke="#60A5FA"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />

                                    <path
                                      d={`
                          M ${midX} ${targetY}
                          H ${targetX}
                        `}
                                      fill="none"
                                      stroke="#60A5FA"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </g>
                                );
                              });
                            })}
                        </svg>

                        {bracketRounds.map((round, roundIndex) => (
                          <div key={round.stage}>
                            <h3
                              className="absolute top-0 z-10 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-center text-xs font-bold uppercase tracking-wide text-gray-900 shadow"
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
                                ref={(element) => {
                                  bracketMatchRefs.current[match.id] = element;
                                }}
                                className="absolute z-10"
                                style={{
                                  left: leftFor(roundIndex),
                                  top: topFor(roundIndex, matchIndex),
                                  width: cardWidth,
                                  height: cardHeight,
                                }}
                              >
                                <BracketMatchCard match={match} />
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>

                      <div className="mt-10 rounded-3xl border border-gray-200 bg-white p-5 shadow-xl">
                        <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-700">
                          Bronze Final
                        </h3>

                        <div className="max-w-[270px]">
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

            {activeTab === "groups" && (
              <section className="space-y-6">
                <section className="rounded-2xl bg-white p-4 shadow sm:p-6">
                  <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                    <div>
                      <h2 className="text-2xl font-bold">Groups / Teams</h2>
                      <p className="mt-1 text-sm text-gray-500">
                        Group tables update automatically as match scores are
                        saved.
                      </p>
                    </div>

                    <input
                      className="rounded-xl border p-3"
                      placeholder="Search team"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </section>

                {Object.keys(computedGroupStandings)
                  .sort()
                  .map((group) => {
                    const groupStandings = computedGroupStandings[group].filter(
                      (standing) =>
                        standing.team
                          .toLowerCase()
                          .includes(search.toLowerCase()),
                    );

                    if (groupStandings.length === 0) return null;

                    return (
                      <GroupTable
                        key={group}
                        group={group}
                        standings={groupStandings}
                      />
                    );
                  })}
              </section>
            )}
          </>
        )}
      </section>
    </main>
  );
}
