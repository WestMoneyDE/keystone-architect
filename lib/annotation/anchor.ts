/**
 * lib/annotation/anchor.ts — W3C-Web-Annotation-style highlight anchoring.
 *
 * Built directly against the offset contract documented at the top of
 * `components/reader/ArticleBody.tsx`:
 *   - Granularity is BLOCK-LEVEL. Every text-bearing leaf element (p, h1-6,
 *     li, td/th, blockquote, pre) carries `data-offset-start`/`data-offset-end`
 *     (character offsets into a single concatenated plain-text projection of
 *     the whole article, blocks joined by "\n").
 *   - The article's outer wrapper carries the full plain text on
 *     `data-plain-text` (and its length on `data-plain-text-length`).
 *   - Within a block, `element.textContent` lines up 1:1 with
 *     `plainText.slice(offsetStart, offsetEnd)` because each block renders
 *     as one flat inline-formatted text run.
 *
 * Multi-block selection policy: a `Range` the user actually drags rarely
 * crosses a block boundary (paragraphs are usually selected whole or
 * partially, not multiple paragraphs at once via the popup flow), but to
 * avoid ever crashing we explicitly CLAMP to the end of the block containing
 * `range.startContainer` when `startContainer` and `endContainer` resolve to
 * different blocks. This is a deliberate simplification documented here
 * rather than a bug: concatenating across blocks would produce a quote
 * string containing a synthetic "\n" the user never selected, which reads
 * oddly as a highlighted quote and complicates re-anchoring. Clamping keeps
 * every stored highlight's quote as a contiguous, real run of text from a
 * single block.
 */

export interface AnchorData {
  quote: string;
  prefixContext: string;
  suffixContext: string;
  startOffset: number;
  endOffset: number;
}

export interface ReanchorResult {
  startOffset: number;
  endOffset: number;
}

const CONTEXT_LEN = 40;

function getPlainText(articleElement: HTMLElement): string {
  return articleElement.dataset.plainText ?? "";
}

function findOffsetBlock(node: Node): HTMLElement | null {
  const el = node.nodeType === Node.TEXT_NODE ? node.parentElement : (node as Element);
  if (!el) return null;
  return el.closest<HTMLElement>("[data-offset-start]");
}

/**
 * Character offset of (container, offset) relative to the START of
 * `blockEl`'s own text content. Uses a scoped Range + `toString()` rather
 * than a manual TreeWalker sum — simpler and just as accurate for our
 * flat-text-run blocks.
 */
function withinBlockOffset(blockEl: Element, container: Node, offset: number): number {
  const measuring = document.createRange();
  measuring.selectNodeContents(blockEl);
  try {
    measuring.setEnd(container, offset);
  } catch {
    return 0;
  }
  return measuring.toString().length;
}

/**
 * Given the article's root DOM element (carrying the offset contract from
 * ArticleBody.tsx) and a DOM Range the user selected, compute the anchor
 * data to persist as a Highlight. Returns null if the selection can't be
 * resolved to an offset block (should be rare — e.g. selection landed
 * entirely outside any offset-bearing element) or collapses to zero length.
 */
export function buildAnchor(articleElement: HTMLElement, range: Range): AnchorData | null {
  const plainText = getPlainText(articleElement);
  if (!plainText) return null;

  const startBlock = findOffsetBlock(range.startContainer);
  const endBlock = findOffsetBlock(range.endContainer);
  if (!startBlock || !endBlock) return null;

  const startBlockOffset = Number(startBlock.dataset.offsetStart);
  if (Number.isNaN(startBlockOffset)) return null;

  const startWithin = withinBlockOffset(startBlock, range.startContainer, range.startOffset);

  let endOffset: number;
  if (startBlock === endBlock) {
    const endWithin = withinBlockOffset(startBlock, range.endContainer, range.endOffset);
    endOffset = startBlockOffset + endWithin;
  } else {
    // Multi-block selection: clamp to the end of the start block (see
    // module doc comment for rationale).
    const blockEnd = Number(startBlock.dataset.offsetEnd);
    endOffset = Number.isNaN(blockEnd) ? startBlockOffset + (startBlock.textContent?.length ?? 0) : blockEnd;
  }

  const startOffset = startBlockOffset + startWithin;
  if (endOffset <= startOffset) return null;

  const quote = plainText.slice(startOffset, endOffset);
  if (quote.trim().length === 0) return null;

  const prefixContext = plainText.slice(Math.max(0, startOffset - CONTEXT_LEN), startOffset);
  const suffixContext = plainText.slice(endOffset, endOffset + CONTEXT_LEN);

  return { quote, prefixContext, suffixContext, startOffset, endOffset };
}

/**
 * Given a stored highlight and the (possibly changed) current article DOM,
 * try to relocate it: exact offset match first, then fuzzy search for
 * prefix+quote+suffix, then quote alone. Returns the new offsets, or null
 * if the highlight can no longer be found (caller marks it `orphaned`).
 */
export function reanchor(
  articleElement: HTMLElement,
  highlight: { quote: string; prefixContext: string; suffixContext: string; startOffset: number; endOffset: number },
): ReanchorResult | null {
  const plainText = getPlainText(articleElement);
  if (!plainText) return null;

  const { quote, prefixContext, suffixContext, startOffset, endOffset } = highlight;

  if (
    startOffset >= 0 &&
    endOffset <= plainText.length &&
    endOffset > startOffset &&
    plainText.slice(startOffset, endOffset) === quote
  ) {
    return { startOffset, endOffset };
  }

  const combined = `${prefixContext}${quote}${suffixContext}`;
  const combinedIdx = plainText.indexOf(combined);
  if (combinedIdx !== -1) {
    const newStart = combinedIdx + prefixContext.length;
    return { startOffset: newStart, endOffset: newStart + quote.length };
  }

  const quoteIdx = plainText.indexOf(quote);
  if (quoteIdx !== -1) {
    return { startOffset: quoteIdx, endOffset: quoteIdx + quote.length };
  }

  return null;
}

function locateTextPosition(root: Node, charIndex: number): { node: Text; offset: number } | null {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let remaining = charIndex;
  let node = walker.nextNode() as Text | null;
  while (node) {
    const len = node.data.length;
    if (remaining <= len) {
      return { node, offset: remaining };
    }
    remaining -= len;
    node = walker.nextNode() as Text | null;
  }
  return null;
}

function tryWrapRange(block: HTMLElement, start: number, end: number, highlightId: string): boolean {
  if (end <= start) return false;
  const startPos = locateTextPosition(block, start);
  const endPos = locateTextPosition(block, end);
  if (!startPos || !endPos) return false;
  try {
    const range = document.createRange();
    range.setStart(startPos.node, startPos.offset);
    range.setEnd(endPos.node, endPos.offset);
    const mark = document.createElement("mark");
    mark.className = "keystone-highlight";
    mark.dataset.highlightId = highlightId;
    range.surroundContents(mark);
    return true;
  } catch {
    // Range crossed an element boundary awkwardly (e.g. partially inside a
    // <strong>/<a>/<code> run) — surroundContents throws in that case.
    // Caller falls back to block-granularity highlighting.
    return false;
  }
}

/** Removes any DOM highlight markup previously applied for `highlightId` (or all, if omitted). */
export function clearHighlightOverlay(articleElement: HTMLElement, highlightId?: string): void {
  const selector = highlightId ? `[data-highlight-id="${highlightId}"]` : "[data-highlight-id]";
  articleElement.querySelectorAll<HTMLElement>(selector).forEach((el) => {
    if (el.tagName === "MARK") {
      const parent = el.parentNode;
      if (!parent) return;
      while (el.firstChild) parent.insertBefore(el.firstChild, el);
      parent.removeChild(el);
      parent.normalize();
    } else {
      el.classList.remove("keystone-highlight-block");
      delete el.dataset.highlightId;
    }
  });
}

/**
 * Visually marks the resolved offset range in the rendered article DOM.
 * Tries precise DOM surgery (wrap the exact sub-text range in a <mark>)
 * within the single overlapping leaf block; if that's not possible (range
 * spans multiple blocks after fuzzy re-anchoring moved it, or surgery fails
 * because it awkwardly crosses an inline element boundary), degrades
 * gracefully to block-granularity highlighting (CSS class on the whole
 * overlapping block(s)) rather than throwing.
 */
export function renderHighlightOverlay(
  articleElement: HTMLElement,
  offsets: { startOffset: number; endOffset: number },
  highlightId: string,
): void {
  clearHighlightOverlay(articleElement, highlightId);

  const blocks = Array.from(articleElement.querySelectorAll<HTMLElement>("[data-offset-start]"));
  const overlapping = blocks.filter((b) => {
    const os = Number(b.dataset.offsetStart);
    const oe = Number(b.dataset.offsetEnd);
    return os < offsets.endOffset && oe > offsets.startOffset;
  });

  // Prefer leaf blocks — e.g. a <table> and its <td> both carry offsets;
  // only the cell should be considered, not its ancestor table.
  const leafBlocks = overlapping.filter((b) => !overlapping.some((other) => other !== b && b.contains(other)));

  if (leafBlocks.length === 1) {
    const block = leafBlocks[0];
    const os = Number(block.dataset.offsetStart);
    const withinStart = Math.max(0, offsets.startOffset - os);
    const withinEnd = Math.min(block.textContent?.length ?? 0, offsets.endOffset - os);
    if (tryWrapRange(block, withinStart, withinEnd, highlightId)) {
      return;
    }
  }

  // Fallback: coarse block-level highlight for every overlapping leaf block.
  leafBlocks.forEach((b) => {
    b.classList.add("keystone-highlight-block");
    b.dataset.highlightId = highlightId;
  });
}
