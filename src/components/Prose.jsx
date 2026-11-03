import Image from 'next/image';

/**
 * Minimal markdown renderer for post bodies.
 *
 * The project has no markdown dependency, so this stays hand-rolled — but it
 * now covers links and italics, which the previous inline version silently
 * dropped, and it renders plain semantic elements that `.ed-prose` styles.
 */

// Ordered so that code spans win over emphasis, and bold over italic.
const INLINE = /(`[^`]+`)|(\[[^\]]+\]\([^)]+\))|(\*\*[^*]+\*\*)|(\*[^*]+\*)/g;

function renderInline(text, keyPrefix) {
  const nodes = [];
  let last = 0;
  let match;
  let i = 0;

  INLINE.lastIndex = 0;
  while ((match = INLINE.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const token = match[0];
    const key = `${keyPrefix}-${i++}`;

    if (token.startsWith('`')) {
      nodes.push(<code key={key}>{token.slice(1, -1)}</code>);
    } else if (token.startsWith('[')) {
      const [, label, href] = token.match(/\[([^\]]+)\]\(([^)]+)\)/);
      const external = /^https?:\/\//.test(href);
      nodes.push(
        <a
          key={key}
          href={href}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {label}
        </a>
      );
    } else if (token.startsWith('**')) {
      nodes.push(<strong key={key}>{token.slice(2, -2)}</strong>);
    } else {
      nodes.push(<em key={key}>{token.slice(1, -1)}</em>);
    }

    last = match.index + token.length;
  }

  if (last < text.length) nodes.push(text.slice(last));
  return nodes.length > 0 ? nodes : text;
}

export default function Prose({ content = '' }) {
  const blocks = [];
  let list = null;

  const flushList = (key) => {
    if (!list) return;
    const Tag = list.type;
    blocks.push(
      <Tag key={`list-${key}`}>
        {list.items.map((item, i) => (
          <li key={i}>{renderInline(item, `li-${key}-${i}`)}</li>
        ))}
      </Tag>
    );
    list = null;
  };

  content.split('\n').forEach((raw, index) => {
    const line = raw.trimEnd();

    const bullet = line.match(/^[-*]\s+(.*)$/);
    const numbered = line.match(/^\d+\.\s+(.*)$/);

    if (bullet || numbered) {
      const type = bullet ? 'ul' : 'ol';
      if (!list || list.type !== type) {
        flushList(index);
        list = { type, items: [] };
      }
      list.items.push((bullet || numbered)[1]);
      return;
    }

    flushList(index);

    if (!line.trim()) return;

    const image = line.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (image) {
      const [, alt, src] = image;
      blocks.push(
        <figure key={index}>
          <Image src={src} alt={alt} width={1400} height={788} sizes="(max-width: 1100px) 100vw, 60rem" />
          {alt && <figcaption>{alt}</figcaption>}
        </figure>
      );
      return;
    }

    if (line.trim() === '---') {
      blocks.push(<hr key={index} />);
      return;
    }

    const heading = line.match(/^(#{1,3})\s+(.*)$/);
    if (heading) {
      const Tag = `h${heading[1].length}`;
      blocks.push(<Tag key={index}>{renderInline(heading[2], `h-${index}`)}</Tag>);
      return;
    }

    if (line.startsWith('> ')) {
      blocks.push(
        <blockquote key={index}>{renderInline(line.slice(2), `q-${index}`)}</blockquote>
      );
      return;
    }

    blocks.push(<p key={index}>{renderInline(line, `p-${index}`)}</p>);
  });

  flushList('end');

  return <div className="ed-prose">{blocks}</div>;
}
