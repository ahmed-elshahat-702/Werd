// "use client";

// import { useState } from "react";
// import { motion } from "framer-motion";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Badge } from "@/components/ui/badge";
// import { Switch } from "@/components/ui/switch";
// import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
// import { Separator } from "@/components/ui/separator";
// import {
//   User,
//   Settings,
//   BookOpen,
//   Heart,
//   Clock,
//   Star,
//   Moon,
//   Sun,
//   Globe,
// } from "lucide-react";
// import { useAppStore } from "@/lib/store";

// export default function ProfilePage() {
//   const {
//     user,
//     bookmarks,
//     completedAzkar,
//     misbaha,
//     toggleTheme,
//     toggleLanguage,
//   } = useAppStore();
//   const t = useTranslation(language);

//   const [isEditing, setIsEditing] = useState(false);
//   const [editedName, setEditedName] = useState(user.name);
//   const [editedLocation, setEditedLocation] = useState(user.location);

//   const handleSave = () => {
//     // In a real app, you would update the user data here
//     setIsEditing(false);
//   };

//   const stats = [
//     {
//       label: language === "ar" ? "المفضلة" : "Bookmarks",
//       value: bookmarks.length,
//       icon: <BookOpen className="h-4 w-4" />,
//       color: "text-blue-600",
//     },
//     {
//       label: language === "ar" ? "الأذكار المكتملة" : "Completed Azkar",
//       value: completedAzkar.length,
//       icon: <Heart className="h-4 w-4" />,
//       color: "text-emerald-600",
//     },
//     {
//       label: language === "ar" ? "جلسات التسبيح" : "Misbaha Sessions",
//       value: misbaha.sessions.length,
//       icon: <Clock className="h-4 w-4" />,
//       color: "text-purple-600",
//     },
//     {
//       label: language === "ar" ? "إجمالي التسبيح" : "Total Tasbih",
//       value: misbaha.sessions.reduce(
//         (total, session) => total + session.count,
//         0
//       ),
//       icon: <Star className="h-4 w-4" />,
//       color: "text-yellow-600",
//     },
//   ];

//   return (
//     <SidebarInset>
//       <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
//         <SidebarTrigger className="-ml-1" />
//         <Separator orientation="vertical" className="mr-2 h-4" />
//         <div className="flex items-baseline gap-2">
//           <User className="h-5 w-5" />
//           <h1 className="text-lg font-semibold">{t("userProfile")}</h1>
//           <span className="text-sm arabic-text text-muted-foreground">
//             الملف الشخصي
//           </span>
//         </div>
//       </header>

//       <div className="flex-1 p-6" dir={language === "ar" ? "rtl" : "ltr"}>
//         <div className="max-w-4xl mx-auto space-y-6">
//           {/* Profile Info */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//           >
//             <Card>
//               <CardHeader>
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-4">
//                     <div className="h-16 w-16 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold">
//                       {user.name.charAt(0)}
//                     </div>
//                     <div>
//                       <CardTitle className="text-2xl">{user.name}</CardTitle>
//                       <CardDescription className="flex items-center gap-2">
//                         <span>{user.location}</span>
//                         <Badge variant="outline" className="text-xs">
//                           {language === "ar" ? "مسلم" : "Muslim"}
//                         </Badge>
//                       </CardDescription>
//                     </div>
//                   </div>
//                   <Button
//                     onClick={() => setIsEditing(!isEditing)}
//                     variant="outline"
//                   >
//                     {isEditing ? t("save") : t("edit")}
//                   </Button>
//                 </div>
//               </CardHeader>
//               {isEditing && (
//                 <CardContent className="space-y-4">
//                   <div className="grid gap-4 sm:grid-cols-2">
//                     <div className="space-y-2">
//                       <Label htmlFor="name">
//                         {language === "ar" ? "الاسم" : "Name"}
//                       </Label>
//                       <Input
//                         id="name"
//                         value={editedName}
//                         onChange={(e) => setEditedName(e.target.value)}
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="location">
//                         {language === "ar" ? "الموقع" : "Location"}
//                       </Label>
//                       <Input
//                         id="location"
//                         value={editedLocation}
//                         onChange={(e) => setEditedLocation(e.target.value)}
//                       />
//                     </div>
//                   </div>
//                   <Button onClick={handleSave} className="w-full">
//                     {t("save")}
//                   </Button>
//                 </CardContent>
//               )}
//             </Card>
//           </motion.div>

//           {/* Statistics */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.1 }}
//           >
//             <Card>
//               <CardHeader>
//                 <CardTitle>
//                   {language === "ar" ? "الإحصائيات" : "Statistics"}
//                 </CardTitle>
//                 <CardDescription>
//                   {language === "ar"
//                     ? "ملخص أنشطتك الروحية"
//                     : "Summary of your spiritual activities"}
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//                   {stats.map((stat, index) => (
//                     <motion.div
//                       key={index}
//                       initial={{ opacity: 0, scale: 0.9 }}
//                       animate={{ opacity: 1, scale: 1 }}
//                       transition={{ delay: index * 0.1 }}
//                     >
//                       <Card>
//                         <CardContent className="p-4 text-center">
//                           <div
//                             className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-2 ${stat.color}`}
//                           >
//                             {stat.icon}
//                           </div>
//                           <div className="text-2xl font-bold">{stat.value}</div>
//                           <div className="text-sm text-muted-foreground">
//                             {stat.label}
//                           </div>
//                         </CardContent>
//                       </Card>
//                     </motion.div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>

//           {/* Settings */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2 }}
//           >
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Settings className="h-5 w-5" />
//                   {t("settings")}
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 {/* Theme Toggle */}
//                 <div className="flex items-center justify-between">
//                   <div className="space-y-1">
//                     <div className="flex items-center gap-2">
//                       {theme === "light" ? (
//                         <Sun className="h-4 w-4" />
//                       ) : (
//                         <Moon className="h-4 w-4" />
//                       )}
//                       <span className="font-medium">
//                         {theme === "light" ? t("lightMode") : t("darkMode")}
//                       </span>
//                     </div>
//                     <p className="text-sm text-muted-foreground">
//                       {language === "ar"
//                         ? "تبديل بين الوضع النهاري والليلي"
//                         : "Toggle between light and dark mode"}
//                     </p>
//                   </div>
//                   <Switch
//                     checked={theme === "dark"}
//                     onCheckedChange={toggleTheme}
//                   />
//                 </div>

//                 <Separator />

//                 {/* Language Toggle */}
//                 <div className="flex items-center justify-between">
//                   <div className="space-y-1">
//                     <div className="flex items-center gap-2">
//                       <Globe className="h-4 w-4" />
//                       <span className="font-medium">{t("language")}</span>
//                     </div>
//                     <p className="text-sm text-muted-foreground">
//                       {language === "ar"
//                         ? "تبديل بين العربية والإنجليزية"
//                         : "Switch between Arabic and English"}
//                     </p>
//                   </div>
//                   <Switch
//                     checked={language === "ar"}
//                     onCheckedChange={toggleLanguage}
//                   />
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>

//           {/* Recent Bookmarks */}
//           {bookmarks.length > 0 && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.3 }}
//             >
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <BookOpen className="h-5 w-5" />
//                     {language === "ar" ? "المفضلة الأخيرة" : "Recent Bookmarks"}
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-3">
//                     {bookmarks
//                       .slice(-5)
//                       .reverse()
//                       .map((bookmark, index) => (
//                         <div
//                           key={bookmark.id}
//                           className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
//                         >
//                           <Badge variant="outline" className="text-xs">
//                             {bookmark.type === "quran"
//                               ? language === "ar"
//                                 ? "قرآن"
//                                 : "Qur'an"
//                               : language === "ar"
//                               ? "حديث"
//                               : "Hadith"}
//                           </Badge>
//                           <div className="flex-1 min-w-0">
//                             <div className="font-medium text-sm truncate">
//                               {bookmark.title}
//                             </div>
//                             <div className="text-xs text-muted-foreground line-clamp-2">
//                               {bookmark.content}
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           )}

//           {/* Recent Misbaha Sessions */}
//           {misbaha.sessions.length > 0 && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.4 }}
//             >
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <Clock className="h-5 w-5" />
//                     {language === "ar"
//                       ? "جلسات التسبيح الأخيرة"
//                       : "Recent Misbaha Sessions"}
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-3">
//                     {misbaha.sessions
//                       .slice(-5)
//                       .reverse()
//                       .map((session, index) => (
//                         <div
//                           key={index}
//                           className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
//                         >
//                           <div className="space-y-1">
//                             <div className="arabic-text font-medium">
//                               {session.zikr}
//                             </div>
//                             <div className="text-xs text-muted-foreground">
//                               {new Date(session.date).toLocaleDateString(
//                                 language === "ar" ? "ar-SA" : "en-US"
//                               )}
//                             </div>
//                           </div>
//                           <Badge variant="outline">
//                             {session.count}{" "}
//                             {language === "ar" ? "مرة" : "times"}
//                           </Badge>
//                         </div>
//                       ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           )}
//         </div>
//       </div>
//     </SidebarInset>
//   );
// }

import React from "react";

const page = () => {
  return <div>page</div>;
};

export default page;
