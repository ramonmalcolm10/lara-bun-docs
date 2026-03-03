import DocsLayout from '../../DocsLayout';

export default function DocsLayoutWrapper({ children }: { children: React.ReactNode }) {
  return <DocsLayout>{children}</DocsLayout>;
}
