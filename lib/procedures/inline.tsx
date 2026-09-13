import { Fragment, type ReactNode } from "react";

/**
 * Procedure text used to be written as JSX inside the data files, which is why
 * that content could not be moved to JSON and therefore could not be corrected
 * without a store release. It is now this small serialisable format instead.
 *
 * The vocabulary is deliberately tiny — it is exactly what the procedure data
 * actually used: plain text, two spellings of bold, and subscripts for airspeed
 * symbols (V-TOSS, V-Y). Both bold spellings are kept distinct so the converted
 * content renders byte-identically to the JSX it replaced.
 */
export type InlineNode =
  | string
  | { b: InlineNode[] }
  | { semibold: InlineNode[] }
  | { sub: InlineNode[] };

export function renderInline(nodes: InlineNode[] | undefined): ReactNode {
  if (!nodes) return null;
  return nodes.map((node, i) => {
    if (typeof node === "string") return <Fragment key={i}>{node}</Fragment>;
    if ("b" in node) return <b key={i}>{renderInline(node.b)}</b>;
    if ("semibold" in node) {
      return (
        <span key={i} className="font-semibold">
          {renderInline(node.semibold)}
        </span>
      );
    }
    if ("sub" in node) return <sub key={i}>{renderInline(node.sub)}</sub>;
    return null;
  });
}
