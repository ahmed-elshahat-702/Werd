import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, Variants } from "framer-motion";

const DailyHadeethCard = ({ itemVariants }: { itemVariants: Variants }) => {
  return (
    <motion.div variants={itemVariants}>
      <Card>
        <CardHeader>
          <CardTitle>Daily Hadith</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="arabic-text text-lg leading-relaxed">
              قال رسول الله صلى الله عليه وسلم: &quot;من قال سبحان اللهs وبحمده
              في يوم مائة مرة حطت خطاياه وإن كانت مثل زبد البحر&quot;
            </div>
            <div className="text-sm text-muted-foreground">
              The Prophet (ﷺ) said: &quot;Whoever says &apos;Subhan Allah wa
              bihamdihi&apos; (Glory be to Allah and praise Him) one hundred
              times a day, his sins will be wiped away even if they were like
              the foam of the sea.&quot;
            </div>
            <div className="text-xs text-muted-foreground">- Sahih Bukhari</div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DailyHadeethCard;
