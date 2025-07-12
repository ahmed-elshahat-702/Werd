"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { RotateCcw, Save, Clock } from "lucide-react"
import { useAppStore } from "@/lib/store"

const commonZikr = [
  { arabic: "سبحان الله", transliteration: "Subhan Allah", translation: "Glory be to Allah" },
  { arabic: "الحمد لله", transliteration: "Alhamdulillah", translation: "Praise be to Allah" },
  { arabic: "الله أكبر", transliteration: "Allahu Akbar", translation: "Allah is Greatest" },
  { arabic: "لا إله إلا الله", transliteration: "La ilaha illa Allah", translation: "There is no god but Allah" },
  { arabic: "استغفر الله", transliteration: "Astaghfirullah", translation: "I seek forgiveness from Allah" },
  {
    arabic: "لا حول ولا قوة إلا بالله",
    transliteration: "La hawla wa la quwwata illa billah",
    translation: "There is no power except with Allah",
  },
]

export default function MisbahaPage() {
  const { misbaha, incrementMisbaha, resetMisbaha, setCustomZikr, saveMisbahaSession } = useAppStore()

  const [selectedZikr, setSelectedZikr] = useState(commonZikr[0])
  const [customZikrInput, setCustomZikrInput] = useState("")

  useEffect(() => {
    // Vibration feedback on mobile
    if ("vibrate" in navigator && misbaha.count > 0) {
      navigator.vibrate(50)
    }
  }, [misbaha.count])

  const handleIncrement = () => {
    incrementMisbaha()
  }

  const handleReset = () => {
    resetMisbaha()
  }

  const handleSaveSession = () => {
    saveMisbahaSession()
  }

  const handleZikrSelect = (zikr: (typeof commonZikr)[0]) => {
    setSelectedZikr(zikr)
    setCustomZikr(zikr.arabic)
  }

  const handleCustomZikrSubmit = () => {
    if (customZikrInput.trim()) {
      const customZikr = {
        arabic: customZikrInput,
        transliteration: "Custom Zikr",
        translation: "Custom remembrance",
      }
      setSelectedZikr(customZikr)
      setCustomZikr(customZikrInput)
      setCustomZikrInput("")
    }
  }

  const getCounterColor = () => {
    if (misbaha.count >= 100) return "text-emerald-600 dark:text-emerald-400"
    if (misbaha.count >= 33) return "text-blue-600 dark:text-blue-400"
    return "text-gray-600 dark:text-gray-400"
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          <h1 className="text-lg font-semibold">Misbaha</h1>
          <span className="text-sm arabic-text text-muted-foreground">المسبحة</span>
        </div>
      </header>

      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Current Zikr Display */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="arabic-text text-2xl leading-relaxed">{selectedZikr.arabic}</CardTitle>
                <CardDescription className="space-y-1">
                  <div className="text-lg">{selectedZikr.transliteration}</div>
                  <div className="text-sm text-muted-foreground">{selectedZikr.translation}</div>
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          {/* Counter */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <div className="relative">
              <motion.div
                key={misbaha.count}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
                className={`text-8xl font-bold ${getCounterColor()}`}
              >
                {misbaha.count}
              </motion.div>

              {/* Progress indicators */}
              <div className="flex justify-center gap-2 mt-4">
                <Badge variant={misbaha.count >= 33 ? "default" : "outline"}>33</Badge>
                <Badge variant={misbaha.count >= 66 ? "default" : "outline"}>66</Badge>
                <Badge variant={misbaha.count >= 99 ? "default" : "outline"}>99</Badge>
              </div>
            </div>

            {/* Counter Button */}
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleIncrement}
                className="misbaha-button h-32 w-32 rounded-full text-xl font-semibold"
                size="lg"
              >
                <span className="arabic-text">سبح</span>
              </Button>
            </motion.div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <Button onClick={handleReset} variant="outline" className="flex items-center gap-2 bg-transparent">
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
              <Button
                onClick={handleSaveSession}
                variant="outline"
                className="flex items-center gap-2 bg-transparent"
                disabled={misbaha.count === 0}
              >
                <Save className="h-4 w-4" />
                Save Session
              </Button>
            </div>
          </motion.div>

          {/* Zikr Selection */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Common Zikr</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {commonZikr.map((zikr, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Button
                      variant={selectedZikr.arabic === zikr.arabic ? "default" : "outline"}
                      className="w-full justify-start h-auto p-3"
                      onClick={() => handleZikrSelect(zikr)}
                    >
                      <div className="text-left">
                        <div className="arabic-text text-sm">{zikr.arabic}</div>
                        <div className="text-xs text-muted-foreground">{zikr.transliteration}</div>
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Custom Zikr</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Input
                    placeholder="Enter custom zikr in Arabic..."
                    value={customZikrInput}
                    onChange={(e) => setCustomZikrInput(e.target.value)}
                    className="arabic-text text-right"
                    dir="rtl"
                  />
                  <Button onClick={handleCustomZikrSubmit} className="w-full" disabled={!customZikrInput.trim()}>
                    Use Custom Zikr
                  </Button>
                </div>

                {/* Recent Sessions */}
                {misbaha.sessions.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Recent Sessions</h4>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {misbaha.sessions
                        .slice(-5)
                        .reverse()
                        .map((session, index) => (
                          <div key={index} className="text-sm p-2 bg-muted rounded">
                            <div className="arabic-text">{session.zikr}</div>
                            <div className="text-xs text-muted-foreground">
                              {session.count} times • {new Date(session.date).toLocaleDateString()}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarInset>
  )
}
