import { getCollection } from "astro:content";

export async function GET({ site }) {
  const essays = await getCollection("essays");

  essays.sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );

  const items = essays
    .map(
      (essay) => `
    <item>
      <title><![CDATA[${essay.data.title}]]></title>
      <description><![CDATA[${essay.data.description}]]></description>
      <link>${site}essays/${essay.id}/</link>
      <guid>${site}essays/${essay.id}/</guid>
      <pubDate>${essay.data.date.toUTCString()}</pubDate>
    </item>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>Intelligence Catalyst</title>
    <description>Thinking about what becomes possible when intelligence becomes abundant.</description>
    <link>${site}</link>
    <language>en</language>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}