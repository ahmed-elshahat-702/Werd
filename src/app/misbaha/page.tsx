"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { commonMisbahaZikr } from "@/lib/consts";
import { useAppStore } from "@/lib/store";
import { motion } from "framer-motion";
import { RotateCcw, Save } from "lucide-react";
import { useEffect, useState } from "react";

export default function MisbahaPage() {
  const {
    misbaha,
    incrementMisbaha,
    resetMisbaha,
    setCustomZikr,
    saveMisbahaSession,
    setHeaderArabicTitle,
    setHeaderEnglishTitle,
  } = useAppStore();

  const [selectedZikr, setSelectedZikr] = useState(commonMisbahaZikr[0]);
  const [customZikrInput, setCustomZikrInput] = useState("");

  useEffect(() => {
    setHeaderArabicTitle("المسبحة");
    setHeaderEnglishTitle("Misbaha");
  }, [setHeaderArabicTitle, setHeaderEnglishTitle]);

  useEffect(() => {
    // Vibration feedback on mobile
    if ("vibrate" in navigator && misbaha.count > 0) {
      navigator.vibrate(50);
    }
  }, [misbaha.count]);

  const handleIncrement = () => {
    incrementMisbaha();
  };

  const handleReset = () => {
    resetMisbaha();
  };

  const handleSaveSession = () => {
    saveMisbahaSession();
  };

  const handleZikrSelect = (zikr: (typeof commonMisbahaZikr)[0]) => {
    setSelectedZikr(zikr);
    setCustomZikr(zikr.arabic);
  };

  const handleCustomZikrSubmit = () => {
    if (customZikrInput.trim()) {
      const customZikr = {
        arabic: customZikrInput,
        transliteration: "Custom Zikr",
        translation: "Custom remembrance",
      };
      setSelectedZikr(customZikr);
      setCustomZikr(customZikrInput);
      setCustomZikrInput("");
    }
  };

  const getCounterColor = () => {
    if (misbaha.count >= 100) return "text-emerald-600 dark:text-emerald-400";
    if (misbaha.count >= 33) return "text-blue-600 dark:text-blue-400";
    return "text-gray-600 dark:text-gray-400";
  };

  return (
    <div className="flex-1 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Current Zikr Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="arabic-text text-2xl leading-relaxed text-center">
                {selectedZikr.arabic}
              </CardTitle>
              <CardDescription className="space-y-1">
                <div className="text-lg">{selectedZikr.transliteration}</div>
                <div className="text-sm text-muted-foreground">
                  {selectedZikr.translation}
                </div>
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
              <Badge variant={misbaha.count >= 33 ? "default" : "outline"}>
                33
              </Badge>
              <Badge variant={misbaha.count >= 66 ? "default" : "outline"}>
                66
              </Badge>
              <Badge variant={misbaha.count >= 99 ? "default" : "outline"}>
                99
              </Badge>
            </div>
          </div>

          {/* Counter Button */}
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleIncrement}
              className="emerald-gradient h-32 w-32 rounded-full text-xl font-semibold"
              size="lg"
            >
              <span className="arabic-text">سبح</span>
            </Button>
          </motion.div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button
              onClick={handleReset}
              variant="outline"
              className="flex items-center gap-2 bg-transparent arabic-text"
            >
              <RotateCcw className="h-4 w-4" />
              إرجاع
            </Button>
            <Button
              onClick={handleSaveSession}
              variant="outline"
              className="flex items-center gap-2 bg-transparent arabic-text"
              disabled={misbaha.count === 0}
            >
              <Save className="h-4 w-4" />
              حفظ الجلسة
            </Button>
          </div>
        </motion.div>

        {/* Zikr Selection */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="arabic-text">ذكر شائع</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {commonMisbahaZikr.map((zikr, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Button
                    variant={
                      selectedZikr.arabic === zikr.arabic
                        ? "default"
                        : "outline"
                    }
                    className="w-full h-auto p-3"
                    onClick={() => handleZikrSelect(zikr)}
                  >
                    <div className="w-full flex items-center justify-between flex-wrap-reverse">
                      <div
                        className={`text-sm w-full text-left ${
                          selectedZikr.arabic === zikr.arabic
                            ? "text-emerald-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {zikr.transliteration}
                      </div>
                      <div className="arabic-text text-base w-full">
                        {zikr.arabic}
                      </div>
                    </div>
                  </Button>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="arabic-text">ذكر مخصص</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="أدخل ذكرك الخاص..."
                  value={customZikrInput}
                  onChange={(e) => setCustomZikrInput(e.target.value)}
                  className="arabic-text text-right"
                  dir="rtl"
                />
                <Button
                  onClick={handleCustomZikrSubmit}
                  className="w-full arabic-text"
                  disabled={!customZikrInput.trim()}
                >
                  إستخدم ذكر مخصص
                </Button>
              </div>

              {/* Recent Sessions */}
              {misbaha.sessions.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium arabic-text">الجلسات السابقة</h4>
                    <Button
                      variant="ghost"
                      className="text-red-600 hover:text-red-700 p-1 text-sm"
                      onClick={() =>
                        useAppStore.getState().clearMisbahaSessions()
                      }
                    >
                      حذف الكل
                    </Button>
                  </div>
                  <div className="space-y-1 max-h-80 overflow-y-auto">
                    {misbaha.sessions
                      .slice() // important to not mutate original
                      .reverse()
                      .map((session, index) => (
                        <div
                          key={index}
                          className="text-sm p-2 bg-muted rounded"
                        >
                          <div className="arabic-text">{session.zikr}</div>
                          <div className="text-xs text-muted-foreground arabic-text">
                            {session.count} مرة •{" "}
                            {new Date(session.date).toLocaleDateString("ar-EG")}
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
  );
}
