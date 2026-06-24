/**
 * Renderiza dados estruturados (JSON-LD) num <script> de forma consistente.
 * Server Component — o JSON-LD vai no HTML inicial, que é o que Google e
 * crawlers de IA leem.
 *
 * Uso: <JsonLd data={articleSchema(...)} /> ou <JsonLd data={[a, b]} />
 */
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
