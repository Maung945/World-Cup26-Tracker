"use client";
import { supabase } from "@/lib/supabase";
import React, { useMemo, useState } from "react";

type Team = {
  code: string;
  name: string;
  group: string;
  status: "Group Stage" | "Round of 32" | "Round of 16" | "Quarter Final" | "Semi Final" | "Final" | "Champion" | "Eliminated";
};

type Participant = {
  id: number;
  name: string;
  team1: string;
  team2: string;
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

const starterMatches: Match[] = [
  { id: 1, stage: "Group A", date: "Thu Jun 11", time: "3:00 PM ET", teamA: "Mexico", teamB: "South Africa", scoreA: "", scoreB: "" },
  { id: 2, stage: "Group A", date: "Thu Jun 11", time: "10:00 PM ET", teamA: "South Korea", teamB: "Czechia", scoreA: "", scoreB: "" },
  { id: 3, stage: "Group B", date: "Fri Jun 12", time: "3:00 PM ET", teamA: "Canada", teamB: "Qatar", scoreA: "", scoreB: "" },
  { id: 4, stage: "Group D", date: "Fri Jun 12", time: "9:00 PM ET", teamA: "United States", teamB: "Paraguay", scoreA: "", scoreB: "" },
  { id: 5, stage: "Group C", date: "Sat Jun 13", time: "12:00 PM ET", teamA: "Brazil", teamB: "Morocco", scoreA: "", scoreB: "" },
  { id: 6, stage: "Group E", date: "Sat Jun 13", time: "3:00 PM ET", teamA: "Germany", teamB: "Curaçao", scoreA: "", scoreB: "" },
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
  Scotland: "🏴",
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
  England: "🏴",
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
      current.map((team) => (team.name === teamName ? { ...team, status } : team))
    );
  }

  function updateMatchScore(matchId: number, field: "scoreA" | "scoreB", value: string) {
    setMatches((current) =>
      current.map((match) =>
        match.id === matchId ? { ...match, [field]: value } : match
      )
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6 text-gray-900">
      <section className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-2xl bg-white p-6 shadow">
          <section className="rounded-2xl bg-black text-white shadow overflow-hidden">
            <div className="flex">
              <button
                onClick={() => setActiveTab("matches")}
                className={`flex-1 p-4 text-sm font-semibold transition ${activeTab === "matches"
                    ? "border-b-4 border-white bg-gray-900"
                    : "bg-black hover:bg-gray-800"
                  }`}
              >
                MATCHES
              </button>

              <button
                onClick={() => setActiveTab("bracket")}
                className={`flex-1 p-4 text-sm font-semibold transition ${activeTab === "bracket"
                    ? "border-b-4 border-white bg-gray-900"
                    : "bg-black hover:bg-gray-800"
                  }`}
              >
                BRACKET
              </button>

              <button
                onClick={() => setActiveTab("standings")}
                className={`flex-1 p-4 text-sm font-semibold transition ${activeTab === "standings"
                    ? "border-b-4 border-white bg-gray-900"
                    : "bg-black hover:bg-gray-800"
                  }`}
              >
                STANDINGS
              </button>
            </div>
          </section>
          <h1 className="text-3xl font-bold">World Cup 2026 Team Picker</h1>
          <p className="mt-2 text-gray-600">
            Participants choose two favorite teams. Hover over any team to see who picked it. Update scores and team progress from the admin sections below.
          </p>
        </header>

        {activeTab === "matches" && (
          <section className="rounded-2xl bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold">Add Participant</h2>
            <form onSubmit={addParticipant} className="grid gap-4 md:grid-cols-4">
              <input
                className="rounded-xl border p-3"
                placeholder="Participant name"
                value={participantName}
                onChange={(e) => setParticipantName(e.target.value)}
              />
              <select className="rounded-xl border p-3" value={team1} onChange={(e) => setTeam1(e.target.value)}>
                <option value="">Favorite Team 1</option>
                {teamData.map((team) => <option key={team.code} value={team.name}>{team.name}</option>)}
              </select>
              <select className="rounded-xl border p-3" value={team2} onChange={(e) => setTeam2(e.target.value)}>
                <option value="">Favorite Team 2</option>
                {teamData.map((team) => <option key={team.code} value={team.name}>{team.name}</option>)}
              </select>
              <button className="rounded-xl bg-black p-3 font-semibold text-white hover:bg-gray-800">
                Submit Picks
              </button>
            </form>
            {team1 && team2 && team1 === team2 && <p className="mt-3 text-red-600">Please choose two different teams.</p>}
          </section>
        )}

        {activeTab === "standings" && (
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
                  <div key={team.code} className="group relative rounded-2xl border bg-gray-50 p-4 shadow-sm hover:bg-white hover:shadow-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Group {team.group}</p>
                        <h3 className="font-bold">{team.name}</h3>
                      </div>
                      <span className="rounded-full bg-gray-200 px-3 py-1 text-sm">{names.length}</span>
                    </div>
                    <p className="mt-3 rounded-lg bg-blue-100 px-3 py-2 text-sm font-medium text-blue-800">{team.status}</p>

                    <div className="absolute left-1/2 top-full z-20 mt-2 hidden w-64 -translate-x-1/2 rounded-xl bg-black p-4 text-white shadow-xl group-hover:block">
                      <p className="font-semibold">Participants</p>
                      {names.length === 0 ? (
                        <p className="mt-2 text-sm text-gray-300">No one picked this team yet.</p>
                      ) : (
                        <ul className="mt-2 space-y-1 text-sm">
                          {names.map((name, index) => <li key={`${name}-${index}`}>{index + 1}. {name}</li>)}
                        </ul>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {activeTab === "matches" && (
        <section className="rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">Match Schedule and Scores</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="p-3">Stage</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Time</th>
                  <th className="p-3">Team A</th>
                  <th className="p-3">Score</th>
                  <th className="p-3">Team B</th>
                  <th className="p-3">Score</th>
                </tr>
              </thead>
              <tbody>
                {matches.map((match) => (
                  <tr key={match.id} className="border-b">
                    <td className="p-3">{match.stage}</td>
                    <td className="p-3">{match.date}</td>
                    <td className="p-3">{match.time}</td>
                    <td className="p-3 font-medium">
                      <div className="group relative flex w-fit cursor-pointer items-center gap-2">
                        <span className="text-2xl">{flagMap[match.teamA]}</span>
                        <span className="font-semibold">
                          {shortCodeMap[match.teamA]}
                        </span>

                        <div className="absolute left-0 top-full z-30 mt-2 hidden min-w-52 rounded-xl bg-black p-3 text-white shadow-xl group-hover:block">
                          <p className="mb-2 text-xs font-semibold text-gray-300">
                            Picked by
                          </p>

                          {(selectedByTeam[match.teamA] || []).length === 0 ? (
                            <p className="text-sm text-gray-400">
                              No participants yet
                            </p>
                          ) : (
                            (selectedByTeam[match.teamA] || []).map((name, index) => (
                              <p key={`${name}-${index}`} className="text-sm">
                                {name}
                              </p>
                            ))
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <input className="w-16 rounded-lg border p-2" value={match.scoreA} onChange={(e) => updateMatchScore(match.id, "scoreA", e.target.value)} />
                    </td>
                    <td className="p-3 font-medium">
                      <div className="group relative flex w-fit cursor-pointer items-center gap-2">
                        <span className="text-2xl">{flagMap[match.teamB]}</span>
                        <span className="font-semibold">
                          {shortCodeMap[match.teamB]}
                        </span>

                        <div className="absolute left-0 top-full z-30 mt-2 hidden min-w-52 rounded-xl bg-black p-3 text-white shadow-xl group-hover:block">
                          <p className="mb-2 text-xs font-semibold text-gray-300">
                            Picked by
                          </p>

                          {(selectedByTeam[match.teamB] || []).length === 0 ? (
                            <p className="text-sm text-gray-400">
                              No participants yet
                            </p>
                          ) : (
                            (selectedByTeam[match.teamB] || []).map((name, index) => (
                              <p key={`${name}-${index}`} className="text-sm">
                                {name}
                              </p>
                            ))
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <input className="w-16 rounded-lg border p-2" value={match.scoreB} onChange={(e) => updateMatchScore(match.id, "scoreB", e.target.value)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        )}
        
        {activeTab === "bracket" && (
          <section className="rounded-2xl bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold">Update Team Progress</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {teamData.map((team) => (
                <div key={team.code} className="flex items-center justify-between gap-3 rounded-xl border p-3">
                  <span className="font-medium">{team.name}</span>
                  <select className="rounded-lg border p-2" value={team.status} onChange={(e) => updateTeamStatus(team.name, e.target.value as Team["status"])}>
                    {progressOptions.map((status) => <option key={status} value={status}>{status}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === "standings" && (
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
                      <td className="p-3">{participant.team1}</td>
                      <td className="p-3">{participant.team2}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        )}
      </section>
    </main>
  );
}
