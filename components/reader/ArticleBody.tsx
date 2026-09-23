import { Fragment, type ElementType, type ReactNode } from "react";

/**
 * ArticleBody — dependency-free Markdown renderer for `Article.body`.
 *
 * Uses a simple block-scanning approach (headings,
 * paragraphs, ``` / ~~~ code fences, pipe tables, blockquotes, unordered
 * lists incl. `- [ ]` checklist items, bold, inline code, links), but
 * rewritten to produce React nodes directly instead of an HTML string, and
 * extended with offset metadata for future highlight anchoring.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * OFFSET CONTRACT (read this before building ticket 6's `lib/annotation/anchor.ts`)
 * ─────────────────────────────────────────────────────────────────────────
 * Granularity: BLOCK-LEVEL, not per inline run. Every text-bearing leaf
 * element this renderer emits — a paragraph, a heading, a blockquote, a
 * single list item (`<li>`), a single table cell (`<td>`/`<th>`), or a
 * fenced code block's `<pre>` — is wrapped in a span-like element carrying:
 *
 *   data-offset-start="<int>"   data-offset-end="<int>"
 *
 * These are character offsets into a single concatenated PLAIN-TEXT
 * projection of the whole article body, built by walking the same blocks
 * in document order and joining each block's own plain text with a single
 * "\n" separator (so `plainText.slice(start, end)` for a given element's
 * offsets reproduces exactly that element's own rendered text, e.g. the
 * paragraph's inline text with markdown syntax stripped but link/bold text
 * kept). This plain text is returned alongside the rendered nodes (see
 * `renderArticleBody`'s return shape) so a later ticket can:
 *
 *   1. Run its own selection-to-offset math against `plainText` (e.g. the
 *      user selects characters 340-412).
 *   2. Find the DOM element(s) whose `[data-offset-start, data-offset-end)`
 *      range overlaps that selection (e.g.
 *      `document.querySelectorAll('[data-offset-start]')`, filter by range
 *      overlap).
 *   3. Do the final *within-block* offset math client-side against that
 *      element's own `element.textContent` (which — because each block is
 *      rendered as a single contiguous text run per the inline renderer
 *      below — lines up 1:1 with `plainText.slice(start, end)`).
 *
 * Rationale for stopping at block granularity: every leaf block below is
 * rendered as one flat inline-formatted string (bold/code/link markup
 * collapses to plain characters in the text projection, same as
 * `element.textContent` would report), so there is no ambiguity to resolve
 * within a block — ticket 6 only needs `element.textContent.indexOf(...)`
 * or a simple char-count walk within that one element, never a search
 * across elements. This avoids wrapping every bold/code/link run in its
 * own span (noisy DOM, harder to style) while still giving ticket 6 exactly
 * the anchor points it needs (quote + prefix/suffix context + start/end
 * offsets per the `Highlight` model) without re-architecting this renderer.
 *
 * Table cells and list items each get their own offsets (not just their
 * parent `<table>`/`<ul>`) because a highlight is very plausibly scoped to
 * a single cell or list item's text, and block-level-only offsets on the
 * whole table would make that ambiguous.
 */

interface RenderState {
  plainText: string;
  keyCounter: number;
}

function escapeForKey(prefix: string, state: RenderState): string {
  state.keyCounter += 1;
  return `${prefix}-${state.keyCounter}`;
}

// ---------------------------------------------------------------------------
// Inline parsing: bold, inline code, links. Produces both React nodes (for
// display) and a plain-text string (for the offset projection) so the two
// stay in lockstep — the plain text is literally the concatenation of each
// inline node's own text content, matching how `element.textContent` would
// read for the rendered nodes.
// ---------------------------------------------------------------------------

interface InlineResult {
  nodes: ReactNode[];
  text: string;
}

function renderInline(raw: string, state: RenderState): InlineResult {
  // Tokenize left-to-right: inline code, bold, links, else literal text.
  const nodes: ReactNode[] = [];
  let text = "";
  let i = 0;
  const push = (node: ReactNode, chunk: string) => {
    nodes.push(node);
    text += chunk;
  };

  while (i < raw.length) {
    const rest = raw.slice(i);

    const codeMatch = rest.match(/^`([^`]+)`/);
    if (codeMatch) {
      push(
        <code key={escapeForKey("code", state)} className="rounded bg-surface px-1 py-0.5 font-mono text-[0.9em]">
          {codeMatch[1]}
        </code>,
        codeMatch[1],
      );
      i += codeMatch[0].length;
      continue;
    }

    const boldMatch = rest.match(/^\*\*([^*]+)\*\*/);
    if (boldMatch) {
      push(
        <strong key={escapeForKey("bold", state)} className="font-semibold text-foreground">
          {boldMatch[1]}
        </strong>,
        boldMatch[1],
      );
      i += boldMatch[0].length;
      continue;
    }

    const linkMatch = rest.match(/^\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      push(
        <a
          key={escapeForKey("link", state)}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline underline-offset-2 hover:opacity-80"
        >
          {linkMatch[1]}
        </a>,
        linkMatch[1],
      );
      i += linkMatch[0].length;
      continue;
    }

    // Literal run up to the next special char (or end of string).
    const nextSpecial = rest.slice(1).search(/[`*[]/);
    const literalLen = nextSpecial === -1 ? rest.length : nextSpecial + 1;
    const literal = rest.slice(0, literalLen);
    push(literal, literal);
    i += literalLen;
  }

  return { nodes, text };
}

// ---------------------------------------------------------------------------
// Block-level wrapper: assigns data-offset-start/end and advances the
// running plain-text offset, then joins blocks with "\n".
// ---------------------------------------------------------------------------

function OffsetBlock({
  as: Tag,
  text,
  offsetStart,
  offsetEnd,
  className,
  children,
}: {
  as: ElementType;
  text: string;
  offsetStart: number;
  offsetEnd: number;
  className?: string;
  children: ReactNode;
}) {
  const Component = Tag;
  return (
    <Component
      data-offset-start={offsetStart}
      data-offset-end={offsetEnd}
      data-plain-text-length={text.length}
      className={className}
    >
      {children}
    </Component>
  );
}

interface BlockAccumulator {
  nodes: ReactNode[];
  plainText: string;
}

function appendBlock(
  acc: BlockAccumulator,
  render: (offsetStart: number, offsetEnd: number) => ReactNode,
  blockPlainText: string,
) {
  // Blocks are joined by a single "\n" in the plain-text projection.
  if (acc.plainText.length > 0) {
    acc.plainText += "\n";
  }
  const offsetStart = acc.plainText.length;
  acc.plainText += blockPlainText;
  const offsetEnd = acc.plainText.length;
  acc.nodes.push(render(offsetStart, offsetEnd));
}

function renderTable(lines: string[], state: RenderState, acc: BlockAccumulator) {
  const parseRow = (line: string) =>
    line
      .trim()
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map((c) => c.trim());

  const header = parseRow(lines[0]);
  const bodyRows = lines.slice(2).map(parseRow);
  const tableKey = escapeForKey("table", state);

  const headerCells = header.map((h) => {
    const inline = renderInline(h, state);
    return { nodes: inline.nodes, text: inline.text };
  });

  const bodyCellRows = bodyRows.map((row) =>
    row.map((cell) => {
      const inline = renderInline(cell, state);
      return { nodes: inline.nodes, text: inline.text };
    }),
  );

  // Wrap the whole table as one block for a coarse offset range, but also
  // give each <th>/<td> its own offsets (see contract note above).
  const cellNodesWithOffsets: {
    kind: "th" | "td";
    key: string;
    nodes: ReactNode[];
    offsetStart: number;
    offsetEnd: number;
  }[] = [];

  const tableStart = acc.plainText.length > 0 ? acc.plainText.length + 1 : 0;

  headerCells.forEach((cell, idx) => {
    let offsetStart = 0;
    let offsetEnd = 0;
    appendBlock(
      acc,
      (s, e) => {
        offsetStart = s;
        offsetEnd = e;
        return null;
      },
      cell.text,
    );
    acc.nodes.pop(); // we only wanted the offset bookkeeping, not a stray node
    cellNodesWithOffsets.push({
      kind: "th",
      key: `${tableKey}-th-${idx}`,
      nodes: cell.nodes,
      offsetStart,
      offsetEnd,
    });
  });

  bodyCellRows.forEach((row, rowIdx) => {
    row.forEach((cell, colIdx) => {
      let offsetStart = 0;
      let offsetEnd = 0;
      appendBlock(
        acc,
        (s, e) => {
          offsetStart = s;
          offsetEnd = e;
          return null;
        },
        cell.text,
      );
      acc.nodes.pop();
      cellNodesWithOffsets.push({
        kind: "td",
        key: `${tableKey}-td-${rowIdx}-${colIdx}`,
        nodes: cell.nodes,
        offsetStart,
        offsetEnd,
      });
    });
  });

  const tableEnd = acc.plainText.length;

  let cellCursor = 0;
  const headerRowNode = (
    <tr key={`${tableKey}-thead-row`}>
      {header.map(() => {
        const cell = cellNodesWithOffsets[cellCursor];
        cellCursor += 1;
        return (
          <OffsetBlock
            key={cell.key}
            as="th"
            text=""
            offsetStart={cell.offsetStart}
            offsetEnd={cell.offsetEnd}
            className="border-b border-border px-3 py-2 text-left text-sm font-semibold text-foreground"
          >
            {cell.nodes}
          </OffsetBlock>
        );
      })}
    </tr>
  );

  const bodyRowNodes = bodyRows.map((row, rowIdx) => (
    <tr key={`${tableKey}-row-${rowIdx}`} className="border-b border-border/60 last:border-0">
      {row.map(() => {
        const cell = cellNodesWithOffsets[cellCursor];
        cellCursor += 1;
        return (
          <OffsetBlock
            key={cell.key}
            as="td"
            text=""
            offsetStart={cell.offsetStart}
            offsetEnd={cell.offsetEnd}
            className="px-3 py-2 align-top text-sm text-foreground"
          >
            {cell.nodes}
          </OffsetBlock>
        );
      })}
    </tr>
  ));

  acc.nodes.push(
    <div key={tableKey} className="my-4 overflow-x-auto rounded-lg border border-border">
      <table
        data-offset-start={tableStart}
        data-offset-end={tableEnd}
        className="w-full border-collapse"
      >
        <thead>{headerRowNode}</thead>
        <tbody>{bodyRowNodes}</tbody>
      </table>
    </div>,
  );
}

const headingClasses: Record<number, string> = {
  1: "mt-8 mb-4 text-3xl font-bold text-foreground",
  2: "mt-8 mb-3 text-2xl font-bold text-foreground",
  3: "mt-6 mb-3 text-xl font-semibold text-foreground",
  4: "mt-5 mb-2 text-lg font-semibold text-foreground",
  5: "mt-4 mb-2 text-base font-semibold text-foreground",
  6: "mt-4 mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground",
};

export interface RenderedArticleBody {
  content: ReactNode;
  /** Concatenated plain-text projection of the whole body — see the offset contract above. */
  plainText: string;
}

export function renderArticleBody(md: string): RenderedArticleBody {
  const lines = md.split("\n");
  const state: RenderState = { plainText: "", keyCounter: 0 };
  const acc: BlockAccumulator = { nodes: [], plainText: "" };

  let i = 0;
  let listBuffer: { nodes: ReactNode[]; text: string; offsetStart: number; offsetEnd: number }[] = [];

  function flushList() {
    if (listBuffer.length === 0) return;
    const key = escapeForKey("ul", state);
    const items = listBuffer;
    acc.nodes.push(
      <ul key={key} className="my-3 ml-5 list-disc space-y-1.5">
        {items.map((item, idx) => (
          <OffsetBlock
            key={`${key}-li-${idx}`}
            as="li"
            text=""
            offsetStart={item.offsetStart}
            offsetEnd={item.offsetEnd}
            className="text-foreground/90"
          >
            {item.nodes}
          </OffsetBlock>
        ))}
      </ul>,
    );
    listBuffer = [];
  }

  while (i < lines.length) {
    const line = lines[i];

    // Code fence
    const fenceMatch = line.match(/^(~~~|```)(\w*)\s*$/);
    if (fenceMatch) {
      flushList();
      const fenceChar = fenceMatch[1];
      const lang = fenceMatch[2] || "";
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && lines[i].trim() !== fenceChar) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing fence
      const codeText = codeLines.join("\n");
      appendBlock(
        acc,
        (offsetStart, offsetEnd) => (
          <OffsetBlock
            key={escapeForKey("pre", state)}
            as="pre"
            text={codeText}
            offsetStart={offsetStart}
            offsetEnd={offsetEnd}
            className={`code-block my-4 overflow-x-auto rounded-lg bg-surface p-4 font-mono text-sm text-foreground${lang ? ` lang-${lang}` : ""}`}
          >
            <code>{codeText}</code>
          </OffsetBlock>
        ),
        codeText,
      );
      continue;
    }

    // Table
    if (/^\|/.test(line) && lines[i + 1] && /^\|?[\s:|-]+\|?$/.test(lines[i + 1])) {
      flushList();
      const tableLines = [line, lines[i + 1]];
      let j = i + 2;
      while (j < lines.length && /^\|/.test(lines[j])) {
        tableLines.push(lines[j]);
        j++;
      }
      renderTable(tableLines, state, acc);
      i = j;
      continue;
    }

    // Heading
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      flushList();
      const level = headingMatch[1].length;
      const inline = renderInline(headingMatch[2], state);
      const Tag = `h${level}` as ElementType;
      appendBlock(
        acc,
        (offsetStart, offsetEnd) => (
          <OffsetBlock
            key={escapeForKey("h", state)}
            as={Tag}
            text={inline.text}
            offsetStart={offsetStart}
            offsetEnd={offsetEnd}
            className={headingClasses[level]}
          >
            {inline.nodes}
          </OffsetBlock>
        ),
        inline.text,
      );
      i++;
      continue;
    }

    // Blockquote
    if (/^>\s?/.test(line)) {
      flushList();
      const quoteLines: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        quoteLines.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      const inline = renderInline(quoteLines.join(" "), state);
      appendBlock(
        acc,
        (offsetStart, offsetEnd) => (
          <OffsetBlock
            key={escapeForKey("bq", state)}
            as="blockquote"
            text={inline.text}
            offsetStart={offsetStart}
            offsetEnd={offsetEnd}
            className="my-4 border-l-4 border-accent/50 pl-4 italic text-muted-foreground"
          >
            {inline.nodes}
          </OffsetBlock>
        ),
        inline.text,
      );
      continue;
    }

    // Unordered list item (incl. "- [ ] " checklist items)
    const listMatch = line.match(/^-\s+(.+)$/);
    if (listMatch) {
      const checklistMatch = listMatch[1].match(/^\[[ xX]\]\s*(.+)$/);
      const itemSource = checklistMatch ? checklistMatch[1] : listMatch[1];
      const inline = renderInline(itemSource, state);
      let offsetStart = 0;
      let offsetEnd = 0;
      appendBlock(
        acc,
        (s, e) => {
          offsetStart = s;
          offsetEnd = e;
          return null;
        },
        inline.text,
      );
      acc.nodes.pop(); // bookkeeping only; the actual <li> is emitted on flushList()

      const itemNode = checklistMatch ? (
        <label key={escapeForKey("checklist", state)} className="flex items-start gap-2">
          <input type="checkbox" disabled className="mt-1" />
          <span>{inline.nodes}</span>
        </label>
      ) : (
        inline.nodes
      );

      listBuffer.push({ nodes: [itemNode], text: inline.text, offsetStart, offsetEnd });
      i++;
      continue;
    }

    // Blank line
    if (line.trim() === "") {
      flushList();
      i++;
      continue;
    }

    // Paragraph: collect consecutive non-blank, non-special lines
    flushList();
    const paraLines = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^(#{1,6})\s/.test(lines[i]) &&
      !/^(~~~|```)/.test(lines[i]) &&
      !/^-\s+/.test(lines[i]) &&
      !/^>/.test(lines[i]) &&
      !/^\|/.test(lines[i])
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    const inline = renderInline(paraLines.join(" "), state);
    appendBlock(
      acc,
      (offsetStart, offsetEnd) => (
        <OffsetBlock
          key={escapeForKey("p", state)}
          as="p"
          text={inline.text}
          offsetStart={offsetStart}
          offsetEnd={offsetEnd}
          className="my-3 leading-relaxed text-foreground/90"
        >
          {inline.nodes}
        </OffsetBlock>
      ),
      inline.text,
    );
  }

  flushList();

  return {
    content: <Fragment>{acc.nodes}</Fragment>,
    plainText: acc.plainText,
  };
}

export interface ArticleBodyProps {
  body: string;
}

export function ArticleBody({ body }: ArticleBodyProps) {
  const { content, plainText } = renderArticleBody(body);
  return (
    <div
      className="article-body"
      data-plain-text-length={plainText.length}
      // The full plain-text projection is stashed here (invisible to
      // layout) so ticket 6 can read it directly off the DOM without a
      // second markdown parse pass, matching the offset contract documented
      // at the top of this file.
      data-plain-text={plainText}
    >
      {content}
    </div>
  );
}
