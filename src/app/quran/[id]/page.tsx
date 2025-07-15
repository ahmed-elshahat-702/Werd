import SurahContent from "./surah-content";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return <SurahContent surahId={id} />;
};

export default page;
