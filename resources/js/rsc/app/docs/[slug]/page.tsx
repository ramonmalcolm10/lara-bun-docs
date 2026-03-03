import DocsInstallation from '../../../DocsInstallation';
import DocsConfiguration from '../../../DocsConfiguration';
import DocsHowItWorks from '../../../DocsHowItWorks';
import DocsInertiaSsr from '../../../DocsInertiaSsr';
import DocsRsc from '../../../DocsRsc';
import DocsPhpCallables from '../../../DocsPhpCallables';
import DocsServerActions from '../../../DocsServerActions';
import DocsValidation from '../../../DocsValidation';
import DocsStaticGeneration from '../../../DocsStaticGeneration';
import DocsDeployment from '../../../DocsDeployment';

const pages: Record<string, React.ComponentType> = {
  'installation': DocsInstallation,
  'configuration': DocsConfiguration,
  'how-it-works': DocsHowItWorks,
  'inertia-ssr': DocsInertiaSsr,
  'rsc': DocsRsc,
  'php-callables': DocsPhpCallables,
  'server-actions': DocsServerActions,
  'validation': DocsValidation,
  'static-generation': DocsStaticGeneration,
  'deployment': DocsDeployment,
};

export default function DocsPage({ slug }: { slug: string }) {
  const Component = pages[slug];

  if (!Component) {
    return <div style={{ padding: 40, color: '#ef4444' }}>Page not found: {slug}</div>;
  }

  return <Component />;
}
