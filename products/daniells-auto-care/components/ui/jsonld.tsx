/**
 * JsonLd — Contract §10, §7
 * Server-rendered <script type="application/ld+json">.
 * Accepts a single object or an array of objects.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  const payload = Array.isArray(data)
    ? data
    : [data];

  return (
    <>
      {payload.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
