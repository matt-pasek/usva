export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data must be injected as a raw script body
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
