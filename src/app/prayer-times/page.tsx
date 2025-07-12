// "use client"

// import type React from "react"

// import { useEffect, useState } from "react"
// import { motion } from "framer-motion"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
// import { Separator } from "@/components/ui/separator"
// import { Badge } from "@/components/ui/badge"
// import { Clock, MapPin, Sun, Moon } from "lucide-react"

// interface PrayerTimes {
//   Fajr: string
//   Sunrise: string
//   Dhuhr: string
//   Asr: string
//   Maghrib: string
//   Isha: string
// }

// interface PrayerInfo {
//   name: string
//   arabic: string
//   time: string
//   icon: React.ReactNode
//   description: string
// }

// export default function PrayerTimesPage() {
//   const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null)
//   const [currentPrayer, setCurrentPrayer] = useState<string>("")
//   const [nextPrayer, setNextPrayer] = useState<string>("")
//   const [countdown, setCountdown] = useState<string>("")
//   const [location, setLocation] = useState("Cairo, Egypt")

//   useEffect(() => {
//     // Fetch prayer times
//     fetch("https://api.aladhan.com/v1/timingsByCity?city=Cairo&country=Egypt")
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.data?.timings) {
//           setPrayerTimes(data.data.timings)
//           calculateCurrentAndNextPrayer(data.data.timings)
//         }
//       })
//       .catch(() => {
//         // Fallback prayer times
//         const fallbackTimes = {
//           Fajr: "05:30",
//           Sunrise: "06:45",
//           Dhuhr: "12:15",
//           Asr: "15:45",
//           Maghrib: "18:20",
//           Isha: "19:45",
//         }
//         setPrayerTimes(fallbackTimes)
//         calculateCurrentAndNextPrayer(fallbackTimes)
//       })
//   }, [])

//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (prayerTimes) {
//         calculateCurrentAndNextPrayer(prayerTimes)
//       }
//     }, 1000)

//     return () => clearInterval(interval)
//   }, [prayerTimes])

//   const calculateCurrentAndNextPrayer = (times: PrayerTimes) => {
//     const now = new Date()
//     const currentTime = now.getHours() * 60 + now.getMinutes()

//     const prayers = [
//       { name: "Fajr", time: times.Fajr },
//       { name: "Sunrise", time: times.Sunrise },
//       { name: "Dhuhr", time: times.Dhuhr },
//       { name: "Asr", time: times.Asr },
//       { name: "Maghrib", time: times.Maghrib },
//       { name: "Isha", time: times.Isha },
//     ]

//     let current = ""
//     let next = ""

//     for (let i = 0; i < prayers.length; i++) {
//       const [hours, minutes] = prayers[i].time.split(":").map(Number)
//       const prayerTime = hours * 60 + minutes

//       if (currentTime >= prayerTime) {
//         current = prayers[i].name
//         next = prayers[i + 1]?.name || prayers[0].name
//       } else {
//         if (!next) next = prayers[i].name
//         break
//       }
//     }

//     setCurrentPrayer(current)
//     setNextPrayer(next)

//     // Calculate countdown to next prayer
//     const nextPrayerData = prayers.find((p) => p.name === next)
//     if (nextPrayerData) {
//       const [hours, minutes] = nextPrayerData.time.split(":").map(Number)
//       const nextPrayerTime = new Date()
//       nextPrayerTime.setHours(hours, minutes, 0, 0)

//       if (nextPrayerTime <= now) {
//         nextPrayerTime.setDate(nextPrayerTime.getDate() + 1)
//       }

//       const diff = nextPrayerTime.getTime() - now.getTime()
//       const hoursLeft = Math.floor(diff / (1000 * 60 * 60))
//       const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
//       const secondsLeft = Math.floor((diff % (1000 * 60)) / 1000)

//       setCountdown(
//         `${hoursLeft.toString().padStart(2, "0")}:${minutesLeft.toString().padStart(2, "0")}:${secondsLeft.toString().padStart(2, "0")}`,
//       )
//     }
//   }

//   const getPrayerInfo = (times: PrayerTimes): PrayerInfo[] => [
//     {
//       name: "Fajr",
//       arabic: "الفجر",
//       time: times.Fajr,
//       icon: <Moon className="h-5 w-5" />,
//       description: "Dawn prayer",
//     },
//     {
//       name: "Sunrise",
//       arabic: "الشروق",
//       time: times.Sunrise,
//       icon: <Sun className="h-5 w-5" />,
//       description: "Sunrise (not a prayer)",
//     },
//     {
//       name: "Dhuhr",
//       arabic: "الظهر",
//       time: times.Dhuhr,
//       icon: <Sun className="h-5 w-5" />,
//       description: "Midday prayer",
//     },
//     {
//       name: "Asr",
//       arabic: "العصر",
//       time: times.Asr,
//       icon: <Sun className="h-5 w-5" />,
//       description: "Afternoon prayer",
//     },
//     {
//       name: "Maghrib",
//       arabic: "المغرب",
//       time: times.Maghrib,
//       icon: <Sun className="h-5 w-5" />,
//       description: "Sunset prayer",
//     },
//     {
//       name: "Isha",
//       arabic: "العشاء",
//       time: times.Isha,
//       icon: <Moon className="h-5 w-5" />,
//       description: "Night prayer",
//     },
//   ]

//   if (!prayerTimes) {
//     return (
//       <SidebarInset>
//         <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
//           <SidebarTrigger className="-ml-1" />
//           <Separator orientation="vertical" className="mr-2 h-4" />
//           <h1 className="text-lg font-semibold">Prayer Times</h1>
//         </header>
//         <div className="flex-1 p-6">
//           <div className="text-center">Loading prayer times...</div>
//         </div>
//       </SidebarInset>
//     )
//   }

//   const prayerInfo = getPrayerInfo(prayerTimes)

//   return (
//     <SidebarInset>
//       <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
//         <SidebarTrigger className="-ml-1" />
//         <Separator orientation="vertical" className="mr-2 h-4" />
//         <div className="flex items-center gap-2">
//           <Clock className="h-5 w-5" />
//           <h1 className="text-lg font-semibold">Prayer Times</h1>
//           <span className="text-sm arabic-text text-muted-foreground">أوقات الصلاة</span>
//         </div>
//       </header>

//       <div className="flex-1 p-6">
//         <div className="max-w-4xl mx-auto space-y-6">
//           {/* Location and Next Prayer */}
//           <div className="grid gap-6 md:grid-cols-2">
//             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <MapPin className="h-5 w-5" />
//                     Location
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <p className="text-lg">{location}</p>
//                   <p className="text-sm text-muted-foreground">
//                     {new Date().toLocaleDateString("en-US", {
//                       weekday: "long",
//                       year: "numeric",
//                       month: "long",
//                       day: "numeric",
//                     })}
//                   </p>
//                 </CardContent>
//               </Card>
//             </motion.div>

//             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
//               <Card className="prayer-card">
//                 <CardHeader>
//                   <CardTitle>Next Prayer</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-2">
//                     <div className="text-2xl font-bold">{nextPrayer}</div>
//                     <div className="arabic-text text-lg text-muted-foreground">
//                       {prayerInfo.find((p) => p.name === nextPrayer)?.arabic}
//                     </div>
//                     <div className="text-3xl font-mono font-bold text-emerald-600 dark:text-emerald-400">
//                       {countdown}
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           </div>

//           {/* Prayer Times Grid */}
//           <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//             {prayerInfo.map((prayer, index) => (
//               <motion.div
//                 key={prayer.name}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: index * 0.1 }}
//               >
//                 <Card
//                   className={`${
//                     currentPrayer === prayer.name ? "ring-2 ring-emerald-500 bg-emerald-50 dark:bg-emerald-950" : ""
//                   } ${prayer.name === "Sunrise" ? "opacity-60" : ""}`}
//                 >
//                   <CardHeader className="pb-3">
//                     <CardTitle className="flex items-center justify-between">
//                       <div className="flex items-center gap-2">
//                         {prayer.icon}
//                         <span>{prayer.name}</span>
//                       </div>
//                       {currentPrayer === prayer.name && <Badge className="bg-emerald-500">Current</Badge>}
//                       {nextPrayer === prayer.name && (
//                         <Badge variant="outline" className="border-emerald-500 text-emerald-600">
//                           Next
//                         </Badge>
//                       )}
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-2">
//                       <div className="text-2xl font-bold font-mono">{prayer.time}</div>
//                       <div className="arabic-text text-lg text-muted-foreground">{prayer.arabic}</div>
//                       <div className="text-xs text-muted-foreground">{prayer.description}</div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </motion.div>
//             ))}
//           </div>

//           {/* Prayer Reminders */}
//           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
//             <Card>
//               <CardHeader>
//                 <CardTitle>Prayer Reminders</CardTitle>
//                 <CardDescription>Stay connected with your daily prayers</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid gap-4 sm:grid-cols-2">
//                   <div className="space-y-2">
//                     <h4 className="font-medium">Before Prayer</h4>
//                     <ul className="text-sm text-muted-foreground space-y-1">
//                       <li>• Perform Wudu (ablution)</li>
//                       <li>• Face the Qibla</li>
//                       <li>• Find a clean place</li>
//                     </ul>
//                   </div>
//                   <div className="space-y-2">
//                     <h4 className="font-medium">After Prayer</h4>
//                     <ul className="text-sm text-muted-foreground space-y-1">
//                       <li>• Recite Tasbih (33x each)</li>
//                       <li>• Make Du'a</li>
//                       <li>• Read Qur'an</li>
//                     </ul>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>
//         </div>
//       </div>
//     </SidebarInset>
//   )
// }

import React from "react";

const page = () => {
  return <div>page</div>;
};

export default page;
