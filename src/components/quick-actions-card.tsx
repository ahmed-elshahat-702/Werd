"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, Variants } from "framer-motion";
import { BookOpen, Calendar, Clock, Heart } from "lucide-react";
import Link from "next/link";

const QuickActionsCard = ({ itemVariants }: { itemVariants: Variants }) => {
  return (
    <motion.div variants={itemVariants}>
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button asChild className="h-auto flex-col gap-2 p-6">
              <Link href="/quran">
                <BookOpen className="h-6 w-6" />
                <span>Read Qur&apos;an</span>
                <span className="text-xs arabic-text">اقرأ القرآن</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-auto flex-col gap-2 p-6 bg-transparent"
            >
              <Link href="/azkar">
                <Heart className="h-6 w-6" />
                <span>Start Azkar</span>
                <span className="text-xs arabic-text">ابدأ الأذكار</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-auto flex-col gap-2 p-6 bg-transparent"
            >
              <Link href="/misbaha">
                <Clock className="h-6 w-6" />
                <span>Misbaha</span>
                <span className="text-xs arabic-text">المسبحة</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-auto flex-col gap-2 p-6 bg-transparent"
            >
              <Link href="/prayer-times">
                <Calendar className="h-6 w-6" />
                <span>Prayer Times</span>
                <span className="text-xs arabic-text">أوقات الصلاة</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default QuickActionsCard;
