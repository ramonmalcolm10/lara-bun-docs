import DocsInstallation from '../../../DocsInstallation';
import DocsConfiguration from '../../../DocsConfiguration';
import DocsHowItWorks from '../../../DocsHowItWorks';
import DocsInertiaSsr from '../../../DocsInertiaSsr';
import DocsRsc from '../../../DocsRsc';
import DocsPhpCallables from '../../../DocsPhpCallables';
import DocsServerActions from '../../../DocsServerActions';
import DocsFileUploads from '../../../DocsFileUploads';
import DocsAuthorization from '../../../DocsAuthorization';
import DocsValidation from '../../../DocsValidation';
import DocsMetadata from '../../../DocsMetadata';
import DocsPpr from '../../../DocsPpr';
import DocsStaticGeneration from '../../../DocsStaticGeneration';
import DocsReactCompiler from '../../../DocsReactCompiler';
import DocsRouteInterception from '../../../DocsRouteInterception';
import DocsTypedRoutes from '../../../DocsTypedRoutes';
import DocsDeployment from '../../../DocsDeployment';

const pages: Record<string, React.ComponentType> = {
  'installation': DocsInstallation,
  'configuration': DocsConfiguration,
  'how-it-works': DocsHowItWorks,
  'inertia-ssr': DocsInertiaSsr,
  'rsc': DocsRsc,
  'php-callables': DocsPhpCallables,
  'server-actions': DocsServerActions,
  'file-uploads': DocsFileUploads,
  'authorization': DocsAuthorization,
  'validation': DocsValidation,
  'metadata': DocsMetadata,
  'ppr': DocsPpr,
  'static-generation': DocsStaticGeneration,
  'react-compiler': DocsReactCompiler,
  'route-interception': DocsRouteInterception,
  'typed-routes': DocsTypedRoutes,
  'deployment': DocsDeployment,
};

export default function DocsPage({ slug }: { slug: string }) {
  const Component = pages[slug];

  if (!Component) {
    return <div style={{ padding: 40, color: '#ef4444' }}>Page not found: {slug}</div>;
  }

  return <Component />;
}
