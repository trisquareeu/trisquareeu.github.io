import { notFound, redirect } from 'next/navigation';

type Params = {
  params: Promise<{
    name: string;
  }>;
};

const teamMemberToLinkedin: Record<string, string> = {
  'kordian-grabowski': 'https://www.linkedin.com/in/kordiangrabowski/',
  'michal-kalinowski': 'https://www.linkedin.com/in/kalinowski-michal/',
  'artsiom-paliashchuk': 'https://www.linkedin.com/in/artsiompaliashchuk/',
};

export default async function TeamMember({ params }: Params) {
  const name = (await params).name;
  const link = teamMemberToLinkedin[name];
  if (!link) {
    return notFound();
  }

  return redirect(link);
}

export async function generateStaticParams() {
  return [{ name: 'michal-kalinowski' }, { name: 'kordian-grabowski' }, { name: 'artsiom-paliashchuk' }];
}
