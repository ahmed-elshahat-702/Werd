import ChapterContent from "./chapter-content";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return <ChapterContent chapterId={id} />;
};

export default page;
