import CVPage from '../../../components/cv/CVPage';

export const metadata = {
  title: 'CV | Christian Del Río',
  description: 'Currículum de Christian del Río Rodríguez, Desarrollador Full Stack.',
  alternates: { canonical: '/cv/es', languages: { es: '/cv/es', en: '/cv/en' } },
  robots: { index: false, follow: true },
};

export default function Page() {
  return <CVPage lang="es" />;
}
