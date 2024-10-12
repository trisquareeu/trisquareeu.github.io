import { notFound, redirect } from 'next/navigation';

type Params = {
  params: {
    name: string;
  };
};

const teamMemberToLinkedin: Record<string, string> = {
  'kordian-grabowski': 'https://www.linkedin.com/in/kordiangrabowski/',
  'michal-kalinowski': 'https://www.linkedin.com/in/kalinowski-michal/'
};

export default async function TeamMember({ params }: Params) {
  const link = teamMemberToLinkedin[params.name];
  if (!link) {
    return notFound();
  }

  return redirect(link);
}

export function generateStaticParams() {
  return [{ name: 'michal-kalinowski' }, { name: 'kordian-grabowski' }];
}
