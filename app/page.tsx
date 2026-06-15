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
    time: "9:00 AM PDT",
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
    time: "12:00 PM PDT",
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
    time: "4:00 PM PDT",
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
    time: "8:00 AM PDT",
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
    time: "11:00 AM PDT",
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
    time: "1:00 PM PDT",
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
    time: "6:00 PM PDT",
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
    time: "6:00 AM PDT",
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
    time: "5:00 PM PDT",
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
    time: "12:00 PM PDT",
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
    time: "2:30 PM PDT",
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
    time: "8:00 AM PDT",
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
    time: "10:00 AM PDT",
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
    time: "3:00 PM PDT",
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
    time: "8:00 PM PDT",
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
    time: "6:00 AM PDT",
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
    time: "12:00 PM PDT",
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
    time: "8:00 AM PDT",
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
    time: "11:00 AM PDT",
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
    time: "2:00 PM PDT",
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
    time: "8:00 AM PDT",
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
    time: "10:00 AM PDT",
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
    time: "1:00 PM PDT",
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
    time: "12:00 PM PDT",
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
    time: "12:00 PM PDT",
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
    time: "5:00 PM PDT",
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
    time: "5:00 PM PDT",
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
    time: "10:00 AM PDT",
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
    time: "10:00 AM PDT",
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
    time: "2:00 PM PDT",
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
    time: "2:00 PM PDT",
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
    time: "9:00 AM PDT",
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
    time: "9:00 AM PDT",
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
    time: "4:00 PM PDT",
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
    time: "3:00 PM PDT",
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
    time: "11:00 AM PDT",
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
    time: "11:00 AM PDT",
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
    time: "1:30 PM PDT",
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
    time: "1:30 PM PDT",
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
    time: "5:00 PM PDT",
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
    time: "5:00 PM PDT",
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
    teamA: "2A",
    teamB: "2B",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Los Angeles Stadium, Los Angeles",
  },
  {
    id: 74,
    stage: "Round of 32",
    date: "Mon, Jun 29, 2026",
    time: "8:00 AM PDT",
    teamA: "1C",
    teamB: "2F",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Houston Stadium, Houston",
  },
  {
    id: 75,
    stage: "Round of 32",
    date: "Mon, Jun 29, 2026",
    time: "10:30 AM PDT",
    teamA: "1E",
    teamB: "3ABCDF",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Boston Stadium, Boston",
  },
  {
    id: 76,
    stage: "Round of 32",
    date: "Mon, Jun 29, 2026",
    time: "5:00 PM PDT",
    teamA: "1F",
    teamB: "2C",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Monterrey Stadium, Monterrey",
  },
  {
    id: 77,
    stage: "Round of 32",
    date: "Tue, Jun 30, 2026",
    time: "8:00 AM PDT",
    teamA: "2E",
    teamB: "2I",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Dallas Stadium, Dallas",
  },
  {
    id: 78,
    stage: "Round of 32",
    date: "Tue, Jun 30, 2026",
    time: "11:00 AM PDT",
    teamA: "1I",
    teamB: "3CDFGH",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "New York New Jersey Stadium, New York/New Jersey",
  },
  {
    id: 79,
    stage: "Round of 32",
    date: "Tue, Jun 30, 2026",
    time: "5:00 PM PDT",
    teamA: "1A",
    teamB: "3CEFHI",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Mexico City Stadium, Mexico City",
  },
  {
    id: 80,
    stage: "Round of 32",
    date: "Wed, Jul 1, 2026",
    time: "6:00 AM PDT",
    teamA: "1L",
    teamB: "3EHIJK",
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
    teamB: "3AEHIJ",
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
    teamA: "1D",
    teamB: "3BEFIJ",
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
    teamA: "1H",
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
    time: "1:00 PM PDT",
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
    teamA: "1B",
    teamB: "3EFGIJ",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "BC Place Vancouver, Vancouver",
  },
  {
    id: 86,
    stage: "Round of 32",
    date: "Fri, Jul 3, 2026",
    time: "9:00 AM PDT",
    teamA: "2D",
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
    time: "12:00 PM PDT",
    teamA: "1J",
    teamB: "2H",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Miami Stadium, Miami",
  },
  {
    id: 88,
    stage: "Round of 32",
    date: "Fri, Jul 3, 2026",
    time: "4:30 PM PDT",
    teamA: "1K",
    teamB: "3DEIJL",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Kansas City Stadium, Kansas City",
  },
  {
    id: 89,
    stage: "Round of 16",
    date: "Sat, Jul 4, 2026",
    time: "8:00 AM PDT",
    teamA: "W73",
    teamB: "W75",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Houston Stadium, Houston",
  },
  {
    id: 90,
    stage: "Round of 16",
    date: "Sat, Jul 4, 2026",
    time: "11:00 AM PDT",
    teamA: "W74",
    teamB: "W77",
    scoreA: "",
    scoreB: "",
    status: "Scheduled",
    venue: "Philadelphia Stadium, Philadelphia",
  },
  {
    id: 91,
    stage: "Round of 16",
    date: "Sun, Jul 5, 2026",
    time: "10:00 AM PDT",
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
    time: "4:00 PM PDT",
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
    time: "10:00 AM PDT",
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
    time: "6:00 AM PDT",
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
    time: "1:00 PM PDT",
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

const ADMIN_EMAILS = ["ma_945@outlook.com"];
const CONTRIBUTION_AMOUNT = 30;

function flagText(teamName: string) {
  return teamName;
}

export default function Home() {
  const [participantName, setParticipantName] = useState("");
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [team3, setTeam3] = useState("");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [teamData, setTeamData] = useState<Team[]>(teams);
  const [matches, setMatches] = useState<Match[]>(starterMatches);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<
    "participants" | "matches" | "bracket" | "groups"
  >("participants");
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMode, setAuthMode] = useState<"signIn" | "signUp">("signIn");
  const [authMessage, setAuthMessage] = useState("");
  const [myPick, setMyPick] = useState<Participant | null>(null);
  const [scoreSaveMessage, setScoreSaveMessage] = useState("");
  const [paymentSaveMessage, setPaymentSaveMessage] = useState("");
  const [pendingPaidById, setPendingPaidById] = useState<Record<number, boolean>>({});
  const [isSavingPaymentChanges, setIsSavingPaymentChanges] = useState(false);
  const [adminEditingParticipant, setAdminEditingParticipant] =
    useState<Participant | null>(null);

  const isAdmin = Boolean(
    user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase()),
  );

  const [picksLocked, setPicksLocked] = useState(false);

  const hasSubmittedPick = Boolean(myPick);
  const isAdminEditingParticipant = Boolean(isAdmin && adminEditingParticipant);
  const shouldLockPickForm =
    !user || (!isAdminEditingParticipant && (picksLocked || hasSubmittedPick));

  React.useEffect(() => {
    setPicksLocked(new Date() > PICK_CUTOFF);
  }, []);

  React.useEffect(() => {
    fetchParticipants();
    fetchMatchScores();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);

      if (data.user) {
        fetchMyPick(data.user.id);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);

        if (session?.user) {
          fetchMyPick(session.user.id);
        } else {
          setMyPick(null);
          setParticipantName("");
          setTeam1("");
          setTeam2("");
          setTeam3("");
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

  const paidParticipantCount = useMemo(
    () => participants.filter((participant) => participant.paid).length,
    [participants],
  );

  const potMoney = paidParticipantCount * CONTRIBUTION_AMOUNT;
  const hasUnsavedPaymentChanges = Object.keys(pendingPaidById).length > 0;

  async function addParticipant(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!user) {
      alert("Please log in before submitting your picks.");
      return;
    }

    if (picksLocked && !isAdminEditingParticipant) {
      alert("Picks are locked. Only the admin can edit submitted teams.");
      return;
    }

    if (myPick && !isAdminEditingParticipant) {
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

    if (isAdminEditingParticipant && adminEditingParticipant) {
      const { error } = await supabase
        .from("participants")
        .update({
          name: participantName.trim(),
          team1,
          team2,
          team3,
        })
        .eq("id", adminEditingParticipant.id);

      if (error) {
        alert(error.message);
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
          user_id: user.id,
        },
      ]);

      if (error) {
        alert(error.message);
        return;
      }
    }

    await fetchParticipants();
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

  function toggleParticipantPaid(participant: Participant) {
    if (!isAdmin) {
      alert("Only admins can update payment status.");
      return;
    }

    const nextPaidStatus = !participant.paid;

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

    setPendingPaidById((current) => ({
      ...current,
      [participant.id]: nextPaidStatus,
    }));
    setPaymentSaveMessage("Payment changes are not saved yet. Click Save changes.");
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

    const { error } = await supabase
      .from("participants")
      .delete()
      .eq("id", participant.id);

    if (error) {
      alert(error.message);
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

  function TeamDisplay({ teamName }: { teamName: string }) {
    const participantNames = selectedByTeam[teamName] || [];
    const isKnownTeam = Boolean(shortCodeMap[teamName]);

    return (
      <div className="group relative flex min-w-0 max-w-full items-center gap-2">
        <img
          src={flagMap[teamName] || "/flags/world-cup.png"}
          alt={`${teamName} flag`}
          className="h-6 w-9 flex-shrink-0 rounded-md object-cover shadow-sm sm:h-8 sm:w-11"
        />
        <span className="truncate font-semibold">{teamName}</span>

        {isKnownTeam && (
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
      : "/flags/world-cup.png";

    return (
      <div
        className={`flex min-w-0 items-center gap-3 rounded-2xl px-4 py-3 transition ${
          align === "right"
            ? "justify-end text-right"
            : "justify-start text-left"
        } ${isWinner ? "bg-green-50 ring-2 ring-green-200" : "bg-white"}`}
        title={resolvedTeam.resolved ? resolvedTeam.name : resolvedTeam.source}
      >
        {align === "left" && (
          <img
            src={flagSrc}
            alt={resolvedTeam.resolved ? `${resolvedTeam.name} flag` : "TBD"}
            className="h-6 w-9 flex-shrink-0 rounded-md object-cover shadow-sm"
          />
        )}

        <span className="min-w-0 truncate text-base font-extrabold leading-tight text-gray-900 sm:text-xl">
          {teamLabel}
        </span>

        {align === "right" && (
          <img
            src={flagSrc}
            alt={resolvedTeam.resolved ? `${resolvedTeam.name} flag` : "TBD"}
            className="h-6 w-9 flex-shrink-0 rounded-md object-cover shadow-sm"
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

    return (
      <div
        className={`flex min-w-0 flex-1 items-center gap-2 ${
          align === "right"
            ? "justify-end text-right"
            : "justify-start text-left"
        }`}
      >
        {align === "left" && (
          <div className="group relative flex-shrink-0">
            <img
              src={flagSrc}
              alt={teamName}
              className="h-6 w-9 rounded-md object-cover shadow-sm"
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

        <span className="min-w-0 truncate text-sm font-bold text-gray-900">
          {teamName}
        </span>

        {align === "right" && (
          <div className="group relative flex-shrink-0">
            <img
              src={flagSrc}
              alt={teamName}
              className="h-6 w-9 rounded-md object-cover shadow-sm"
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
      : "/flags/world-cup.png";

    const flagB = resolvedB.resolved
      ? flagMap[resolvedB.name]
      : "/flags/world-cup.png";

    return (
      <div className="w-full overflow-visible rounded-3xl border border-gray-200 bg-white shadow-xl transition hover:shadow-2xl">
        <div className="border-b border-gray-200 bg-gray-50 px-3 py-2 text-center">
          <p className="text-[11px] font-extrabold uppercase tracking-wide text-gray-700">
            Match {match.id} • {match.stage}
          </p>

          <p className="mt-0.5 truncate text-[11px] font-medium text-gray-500">
            {match.date} • {match.time}
          </p>

          {match.venue && (
            <p
              className="mx-auto mt-1 max-w-[230px] break-words text-[11px] font-semibold leading-snug text-blue-700"
              title={match.venue}
            >
              📍 {match.venue}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 px-3 py-3">
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
                className="h-9 w-10 rounded-xl border border-gray-300 bg-white text-center text-base font-extrabold text-gray-900 outline-none focus:border-blue-500 sm:w-11 sm:text-lg"
              />
            ) : (
              <div className="flex h-9 w-10 items-center justify-center rounded-xl bg-gray-100 text-base font-extrabold text-gray-900 sm:w-11 sm:text-lg">
                {hasScore ? match.scoreA : "-"}
              </div>
            )}

            <span className="text-base font-extrabold text-gray-400">-</span>

            {isAdmin ? (
              <input
                value={match.scoreB}
                onChange={(e) =>
                  updateMatchScore(match.id, "scoreB", e.target.value)
                }
                className="h-9 w-10 rounded-xl border border-gray-300 bg-white text-center text-base font-extrabold text-gray-900 outline-none focus:border-blue-500 sm:w-11 sm:text-lg"
              />
            ) : (
              <div className="flex h-9 w-10 items-center justify-center rounded-xl bg-gray-100 text-base font-extrabold text-gray-900 sm:w-11 sm:text-lg">
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
      </div>
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
    <main className="min-h-screen bg-gray-100 p-3 text-gray-900 sm:p-6">
      <section className="mx-auto max-w-7xl space-y-4 sm:space-y-6">
        <header className="rounded-3xl bg-white px-4 py-4 shadow-2xl sm:px-6 sm:py-5">
          <div className="flex flex-col items-center justify-center gap-4 text-center sm:flex-row sm:justify-between">
            <img
              src="/logos/nutanix.png"
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
                  <button
                    type="button"
                    onClick={savePaymentChanges}
                    disabled={!hasUnsavedPaymentChanges || isSavingPaymentChanges}
                    className={`rounded-xl px-4 py-2 text-sm font-bold text-white shadow ${
                      !hasUnsavedPaymentChanges || isSavingPaymentChanges
                        ? "cursor-not-allowed bg-gray-400"
                        : "bg-emerald-700 hover:bg-emerald-800"
                    }`}
                  >
                    {isSavingPaymentChanges ? "Saving..." : "Save changes"}
                  </button>

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
          <div className="flex">
            {(["participants", "matches", "bracket", "groups"] as const).map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 p-3 text-xs font-bold uppercase transition sm:p-4 sm:text-sm ${
                    activeTab === tab
                      ? "border-b-4 border-black bg-white text-black"
                      : "bg-white text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {tab === "groups" ? "GROUPS/TEAMS" : tab}
                </button>
              ),
            )}
          </div>
        </section>

        {activeTab === "participants" && (
          <>
            <section className="rounded-2xl bg-white p-4 shadow sm:p-6">
              <h2 className="text-xl font-semibold">Login Required</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-600">
                <li>
                  Each participant must create or sign in with an email and
                  password.
                </li>
                <li>You can submit only one set of picks per account.</li>
                <li>
                  You may update your name or teams until{" "}
                  <strong>June 27, 2026 at 11:59 PM PDT</strong>. After that,
                  all picks are locked.
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
                <form onSubmit={handlePasswordAuth} className="mt-4 space-y-3">
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
                  disabled={shouldLockPickForm}
                />

                <Select
                  instanceId="favorite-team-1"
                  inputId="favorite-team-1"
                  className="min-w-0"
                  isDisabled={shouldLockPickForm}
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
                    <div className="flex items-center gap-3">
                      <img
                        src={option.image}
                        alt={option.label}
                        className="h-5 w-7 rounded-sm object-cover"
                      />
                      <span>{option.label}</span>
                    </div>
                  )}
                />

                <Select
                  instanceId="favorite-team-2"
                  inputId="favorite-team-2"
                  className="min-w-0"
                  isDisabled={shouldLockPickForm}
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
                    <div className="flex items-center gap-3">
                      <img
                        src={option.image}
                        alt={option.label}
                        className="h-5 w-7 rounded-sm object-cover"
                      />
                      <span>{option.label}</span>
                    </div>
                  )}
                />

                <Select
                  instanceId="favorite-team-3"
                  inputId="favorite-team-3"
                  className="min-w-0"
                  isDisabled={shouldLockPickForm}
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
                    <div className="flex items-center gap-3">
                      <img
                        src={option.image}
                        alt={option.label}
                        className="h-5 w-7 rounded-sm object-cover"
                      />
                      <span>{option.label}</span>
                    </div>
                  )}
                />

                <button
                  disabled={shouldLockPickForm}
                  className="rounded-xl bg-black p-3 font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400 sm:col-span-2 lg:col-span-1"
                >
                  {isAdminEditingParticipant
                    ? "Save Admin Edit"
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

              {user && myPick && !isAdminEditingParticipant && (
                <p className="mt-3 text-sm font-medium text-orange-700">
                  Your teams are submitted and locked. Only the admin can edit
                  submitted teams.
                </p>
              )}

              {[team1, team2, team3].every(Boolean) &&
                new Set([team1, team2, team3]).size !== 3 && (
                  <p className="mt-3 text-red-600">
                    Please choose three different teams.
                  </p>
                )}
            </section>

            <section className="rounded-2xl bg-white p-4 shadow sm:p-6">
              <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-center">
                <div>
                  <h2 className="text-xl font-semibold">
                    Participant Leaderboard
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Scoring: win = 3 points, draw = 1 point, loss = 0 points.
                  </p>
                </div>
                <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700">
                  {participants.length} participants
                </span>
              </div>

              {participants.length === 0 ? (
                <p className="text-gray-500">No participants yet.</p>
              ) : (
                <>
                  <div className="space-y-3 md:hidden">
                    {scoredParticipants.map((participant, index) => (
                      <div
                        key={participant.id}
                        className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
                      >
                        <div className="mb-3 flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
                              Rank #{index + 1}
                            </p>
                            <h3
                              className={`truncate text-lg font-extrabold ${
                                isWinnerScore(participant.score)
                                  ? "text-yellow-600"
                                  : "text-gray-900"
                              }`}
                            >
                              <span>
                                {isWinnerScore(participant.score) ? "🏆 " : ""}
                                {participant.name}
                              </span>
                              {participant.paid && (
                                <span className="ml-2 inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-extrabold text-emerald-700">
                                  $
                                </span>
                              )}
                            </h3>
                          </div>

                          <span className="flex-shrink-0 rounded-full bg-yellow-100 px-3 py-1 text-sm font-extrabold text-yellow-700">
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
                              onClick={() => toggleParticipantPaid(participant)}
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
                              onClick={() => deleteParticipant(participant)}
                              className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="hidden overflow-visible md:block">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="p-3">Rank</th>
                          <th className="p-3">Name</th>
                          <th className="p-3">Team 1</th>
                          <th className="p-3">Team 2</th>
                          <th className="p-3">Team 3</th>
                          <th className="p-3 text-right">Score</th>
                          {isAdmin && <th className="p-3 text-right">Admin</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {scoredParticipants.map((participant, index) => (
                          <tr key={participant.id} className="border-b">
                            <td className="p-3 font-semibold">{index + 1}</td>
                            <td
                              className={`p-3 font-bold ${
                                isWinnerScore(participant.score)
                                  ? "text-yellow-600"
                                  : "text-gray-900"
                              }`}
                            >
                              <span>
                                {isWinnerScore(participant.score) ? "🏆 " : ""}
                                {participant.name}
                              </span>
                              {participant.paid && (
                                <span className="ml-2 inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-extrabold text-emerald-700">
                                  $
                                </span>
                              )}
                            </td>
                            <td className="p-3">
                              <div className="flex items-center justify-between gap-3">
                                <TeamDisplay teamName={participant.team1} />
                                <span className="flex-shrink-0 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-700">
                                  {participant.team1Score} pts
                                </span>
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center justify-between gap-3">
                                <TeamDisplay teamName={participant.team2} />
                                <span className="flex-shrink-0 rounded-full bg-green-100 px-2.5 py-1 text-xs font-bold text-green-700">
                                  {participant.team2Score} pts
                                </span>
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center justify-between gap-3">
                                <TeamDisplay teamName={participant.team3} />
                                <span className="flex-shrink-0 rounded-full bg-purple-100 px-2.5 py-1 text-xs font-bold text-purple-700">
                                  {participant.team3Score} pts
                                </span>
                              </div>
                            </td>
                            <td className="p-3 text-right text-lg font-bold">
                              <span className="rounded-full bg-yellow-100 px-3 py-1 text-yellow-700">
                                {participant.score} pts
                              </span>
                            </td>
                            {isAdmin && (
                              <td className="p-3 text-right">
                                <div className="flex justify-end gap-2">
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
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
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
                      All times are Pacific Time. Group-stage matches are shown
                      here; knockout matches are available in the Bracket tab.
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
              </div>

              {Object.entries(groupedMatches).map(([date, dateMatches]) => (
                <section
                  key={date}
                  className="overflow-hidden rounded-2xl bg-white shadow"
                >
                  <div className="border-b bg-gray-50 px-6 py-4">
                    <h3 className="text-lg font-bold">{date}</h3>
                  </div>

                  <div className="divide-y">
                    {dateMatches.map((match) => (
                      <div
                        key={match.id}
                        className="grid gap-4 p-4 sm:p-5 md:grid-cols-[1fr_auto_1fr] md:items-center"
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

                          <p className="mt-1 text-lg font-bold">{match.time}</p>

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
              ))}
            </section>
          </>
        )}

        {activeTab === "bracket" &&
          (() => {
            const cardWidth = 270;
            const cardHeight = 166;
            const rowGap = 24;
            const step = cardHeight + rowGap;
            const colGap = 34;
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
                    73, 75, 74, 77, 76, 78, 79, 80, 83, 84, 81, 82, 86, 88, 85,
                    87,
                  ];

                  const quarterFinalOrder = [97, 98, 99, 100];
                  const semiFinalOrder = [101, 102];

                  if (round.stage === "Round of 32") {
                    return (
                      roundOf32Order.indexOf(a.id) -
                      roundOf32Order.indexOf(b.id)
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
                    <p className="mt-2 text-xs font-medium text-blue-700 sm:hidden">
                      Swipe sideways to view the full bracket.
                    </p>
                  </div>
                </div>

                <div className="w-full max-w-full overflow-x-auto rounded-3xl border border-gray-200 bg-gray-50 p-3 shadow-inner md:p-5">
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
                    Group tables update automatically as match scores are saved.
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
                    standing.team.toLowerCase().includes(search.toLowerCase()),
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
      </section>
    </main>
  );
}