import CVPage from '../../../components/cv/CVPage';

export const metadata = {
  title: 'CV | Christian Del Río',
  description: 'Curriculum vitae of Christian del Río Rodríguez, Senior Full Stack Engineer building AI products.',
  alternates: { canonical: '/cv/en', languages: { es: '/cv/es', en: '/cv/en' } },
  robots: { index: false, follow: true },
};

export default function Page() {
  return <CVPage lang="en" />;
}
