import {
  // Bookmark,
  BookOpen,
  Clock,
  Droplet,
  Heart,
  Home,
  LucideProps,
  Moon,
  Sun,
} from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { AzkarCategory, ZikrItem } from "./types";

export const sidebarMenuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
    arabic: "الرئيسية",
  },
  {
    title: "Qur'an",
    url: "/quran",
    icon: BookOpen,
    arabic: "القرآن",
  },
  // {
  //   title: "Hadith",
  //   url: "/hadith",
  //   icon: Bookmark,
  //   arabic: "الحديث",
  // },
  {
    title: "Azkar",
    url: "/azkar",
    icon: Heart,
    arabic: "الأذكار",
  },
  {
    title: "Misbaha",
    url: "/misbaha",
    icon: Droplet,
    arabic: "المسبحة",
  },
  {
    title: "Prayer Times",
    url: "/prayer-times",
    icon: Clock,
    arabic: "أوقات الصلاة",
  },
];

export const initialAzkarData: Record<AzkarCategory, ZikrItem[]> = {
  morning: [
    {
      id: "morning-1",
      arabic: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ",
      transliteration: "A'udhu billahi min ash-shaytani'r-rajim",
      translation: "I seek refuge in Allah from Satan, the accursed.",
      count: 1,
      currentCount: 0,
      reference: "Quran 16:98",
    },
    {
      id: "morning-2",
      arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      transliteration: "Bismillahi'r-rahmani'r-rahim",
      translation:
        "In the name of Allah, the Most Gracious, the Most Merciful.",
      count: 1,
      currentCount: 0,
      reference: "Quran 1:1",
    },
    {
      id: "morning-3",
      arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
      transliteration: "Subhan Allahi wa bihamdihi",
      translation: "Glory be to Allah and praise Him.",
      count: 100,
      currentCount: 0,
      reference: "Sahih Muslim 2694",
    },
    {
      id: "morning-4",
      arabic:
        "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ",
      transliteration:
        "Allahumma bika asbahna, wabika amsayna, wabika nahya, wabika namutu, wa ilayka'n-nushur",
      translation:
        "O Allah, by You we enter the morning, by You we enter the evening, by You we live, by You we die, and to You is the resurrection.",
      count: 1,
      currentCount: 0,
      reference: "Sunan Abi Dawud 5068",
    },
    {
      id: "morning-5",
      arabic:
        "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَٰهَ إِلَّا أَنْتَ",
      transliteration:
        "Allahumma ‘afini fi badani, Allahumma ‘afini fi sam‘i, Allahumma ‘afini fi basari, la ilaha illa ant",
      translation:
        "O Allah, grant health to my body, grant health to my hearing, grant health to my sight. There is no deity except You.",
      count: 3,
      currentCount: 0,
      reference: "Sunan Abi Dawud 5090",
    },
  ],
  evening: [
    {
      id: "evening-1",
      arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ",
      transliteration: "Amsayna wa amsa'l-mulku lillah",
      translation:
        "We have reached the evening and at this very time unto Allah belongs all sovereignty.",
      count: 1,
      currentCount: 0,
      reference: "Sahih Muslim 2723",
    },
    {
      id: "evening-2",
      arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ",
      transliteration: "Allahumma anta rabbi la ilaha illa ant",
      translation:
        "O Allah, You are my Lord, none has the right to be worshipped except You.",
      count: 1,
      currentCount: 0,
      reference: "Sahih Bukhari 6306",
    },
    {
      id: "evening-3",
      arabic:
        "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ",
      transliteration:
        "Allahumma inni as’alukal-‘afiyata fid-dunya wal-akhirah",
      translation:
        "O Allah, I ask You for well-being in this world and the Hereafter.",
      count: 1,
      currentCount: 0,
      reference: "Sunan Ibn Majah 3871",
    },
    {
      id: "evening-4",
      arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
      transliteration: "A‘udhu bikalimatillahi’t-tammati min sharri ma khalaq",
      translation:
        "I seek refuge in the perfect words of Allah from the evil of what He has created.",
      count: 3,
      currentCount: 0,
      reference: "Sahih Muslim 2708",
    },
  ],
  afterPrayer: [
    {
      id: "after-1",
      arabic: "سُبْحَانَ اللَّهِ",
      transliteration: "Subhan Allah",
      translation: "Glory be to Allah.",
      count: 33,
      currentCount: 0,
      reference: "Sahih Muslim 597",
    },
    {
      id: "after-2",
      arabic: "الْحَمْدُ لِلَّهِ",
      transliteration: "Alhamdulillah",
      translation: "Praise be to Allah.",
      count: 33,
      currentCount: 0,
      reference: "Sahih Muslim 597",
    },
    {
      id: "after-3",
      arabic: "اللَّهُ أَكْبَرُ",
      transliteration: "Allahu Akbar",
      translation: "Allah is Greatest.",
      count: 34,
      currentCount: 0,
      reference: "Sahih Muslim 597",
    },
    {
      id: "after-4",
      arabic:
        "لَا إِلَٰهَ إِلَّا ٱللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ ٱلْمُلْكُ وَلَهُ ٱلْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَىْءٍ قَدِيرٌ",
      transliteration:
        "La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu wa huwa ‘ala kulli shay’in qadir",
      translation:
        "There is no deity except Allah alone with no partner; to Him belongs the dominion, and to Him belongs all praise, and He is over all things competent.",
      count: 1,
      currentCount: 0,
      reference: "Sahih Muslim 598",
    },
    {
      id: "after-5",
      arabic: "اللَّهُمَّ أَجِرْنِي مِنَ النَّارِ",
      transliteration: "Allahumma ajirni min an-nar",
      translation: "O Allah, protect me from the Fire.",
      count: 7,
      currentCount: 0,
      reference: "Sunan Abi Dawud 5079",
    },
  ],
  sleep: [
    {
      id: "sleep-1",
      arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
      transliteration: "Bismika Allahumma amutu wa ahya",
      translation: "In Your name, O Allah, I live and die.",
      count: 1,
      currentCount: 0,
      reference: "Sahih Bukhari 6324",
    },
    {
      id: "sleep-2",
      arabic: "أَسْتَغْفِرُ اللَّهَ",
      transliteration: "Astaghfirullah",
      translation: "I seek forgiveness from Allah.",
      count: 3,
      currentCount: 0,
      reference: "Sahih Muslim 2711",
    },
    {
      id: "sleep-3",
      arabic:
        "اللَّهُمَّ رَبَّ السَّمَاوَاتِ السَّبْعِ وَرَبَّ الأَرْضِ وَرَبَّ كُلِّ شَيْءٍ، فَالِقَ الْحَبِّ وَالنَّوَى، مُنْزِلَ التَّوْرَاةِ وَالإِنْجِيلِ وَالْقُرْآنِ، أَعُوذُ بِكَ مِنْ شَرِّ كُلِّ شَيْءٍ أَنْتَ آخِذٌ بِنَاصِيَتِهِ",
      transliteration:
        "Allahumma Rabbas-samawati’s-sab‘i wa Rabbal-ardi wa Rabba kulli shay’in, faliqal-habbi wan-nawa, munzilat-Tawrati wal-Injili wal-Qur’an, a‘udhu bika min sharri kulli shay’in anta akhidhun binasiyatihi",
      translation:
        "O Allah, Lord of the seven heavens and Lord of the earth and Lord of all things, Splitter of the grain and the date-stone, Revealer of the Torah, the Gospel, and the Quran, I seek refuge in You from the evil of everything You hold by its forelock.",
      count: 1,
      currentCount: 0,
      reference: "Sunan Abi Dawud 5067",
    },
    {
      id: "sleep-4",
      arabic: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ",
      transliteration: "Allahumma qini ‘adhabaka yawma tab‘athu ‘ibadak",
      translation:
        "O Allah, protect me from Your punishment on the day You resurrect Your servants.",
      count: 3,
      currentCount: 0,
      reference: "Sunan Tirmidhi 3393",
    },
  ],
};

export const azkarTabsData: {
  value: AzkarCategory;
  label: string;
  arabic: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
}[] = [
  {
    value: "morning",
    label: "Morning",
    arabic: "الصباح",
    icon: Sun,
  },
  {
    value: "evening",
    label: "Evening",
    arabic: "المساء",
    icon: Moon,
  },
  {
    value: "afterPrayer",
    label: "After Prayer",
    arabic: "بعد الصلاة",
    icon: Heart,
  },
  {
    value: "sleep",
    label: "Before Sleep",
    arabic: "قبل النوم",
    icon: Clock,
  },
];

export const commonMisbahaZikr = [
  {
    arabic: "سبحان الله",
    transliteration: "Subhan Allah",
    translation: "Glory be to Allah",
  },
  {
    arabic: "الحمد لله",
    transliteration: "Alhamdulillah",
    translation: "Praise be to Allah",
  },
  {
    arabic: "الله أكبر",
    transliteration: "Allahu Akbar",
    translation: "Allah is Greatest",
  },
  {
    arabic: "لا إله إلا الله",
    transliteration: "La ilaha illa Allah",
    translation: "There is no god but Allah",
  },
  {
    arabic: "استغفر الله",
    transliteration: "Astaghfirullah",
    translation: "I seek forgiveness from Allah",
  },
  {
    arabic: "لا حول ولا قوة إلا بالله",
    transliteration: "La hawla wa la quwwata illa billah",
    translation: "There is no power except with Allah",
  },
  {
    arabic: "اللهم صلي على سيدنا محمد",
    transliteration: "Allahum salli ala saidena Muhammad",
    translation: "The blessings of God to the Prophet Muhammad.",
  },
];
