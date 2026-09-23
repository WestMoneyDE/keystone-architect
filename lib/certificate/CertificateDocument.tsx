// lib/certificate/CertificateDocument.tsx — the @react-pdf/renderer document
// tree for a Keystone role certificate (ticket 9 / plan items 10 & 17).
//
// Uses @react-pdf/renderer's built-in base-14 "Times-Roman" / "Times-Bold"
// fonts for the serif title — these are embedded in every PDF reader by
// spec, so no Font.register()/network font fetch is needed (more reliable
// for a self-hosted, offline-friendly app than pulling a Google Font at
// render time).

import { Document, Page, View, Text, Svg, G, Path, Circle, StyleSheet, Link } from "@react-pdf/renderer";
import type { ParsedBlobatar } from "./blobatarSvg";

const styles = StyleSheet.create({
  page: {
    padding: 0,
    fontFamily: "Times-Roman",
    backgroundColor: "#fdfcf8",
  },
  outerBorder: {
    position: "absolute",
    top: 24,
    left: 24,
    right: 24,
    bottom: 24,
    border: "2pt solid #4f46e5",
  },
  innerBorder: {
    position: "absolute",
    top: 32,
    left: 32,
    right: 32,
    bottom: 32,
    border: "0.75pt solid #c7c2b8",
  },
  content: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 64,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  eyebrow: {
    fontSize: 12,
    letterSpacing: 3,
    color: "#4f46e5",
    marginBottom: 10,
    textTransform: "uppercase",
  },
  title: {
    fontFamily: "Times-Bold",
    fontSize: 34,
    color: "#16181d",
    marginBottom: 22,
    textAlign: "center",
  },
  lead: {
    fontSize: 12,
    color: "#4b5563",
    marginBottom: 8,
  },
  recipientRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 8,
  },
  recipientName: {
    fontFamily: "Times-Bold",
    fontSize: 26,
    color: "#16181d",
  },
  body: {
    fontSize: 12,
    color: "#4b5563",
    marginTop: 6,
    marginBottom: 20,
    textAlign: "center",
  },
  roleLabel: {
    fontFamily: "Times-Bold",
    fontSize: 20,
    color: "#4f46e5",
    marginBottom: 20,
    textAlign: "center",
  },
  metaRow: {
    display: "flex",
    flexDirection: "row",
    gap: 48,
    marginTop: 10,
  },
  metaBlock: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  metaLabel: {
    fontSize: 8,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: "#9ca3af",
    marginBottom: 3,
  },
  metaValue: {
    fontSize: 13,
    color: "#16181d",
    fontFamily: "Times-Bold",
  },
  footer: {
    position: "absolute",
    bottom: 44,
    left: 0,
    right: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 3,
  },
  footerHash: {
    fontSize: 7,
    color: "#9ca3af",
    fontFamily: "Courier",
  },
  footerLink: {
    fontSize: 9,
    color: "#4f46e5",
  },
  fallbackAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  fallbackAvatarText: {
    fontFamily: "Times-Bold",
    color: "#ffffff",
    fontSize: 22,
  },
});

/** Deterministic HSL-ish hex color from a name, used only for the
 * colored-initial fallback avatar (when blobatar SVG parsing fails). Mirrors
 * the "same seed -> same visual" property the real Blobatar guarantees,
 * scoped down to just a hue pick. */
function fallbackColorFor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  const hue = hash % 360;
  // Fixed, reasonably saturated/mid-lightness swatch list keyed by hue bucket
  // — avoids needing an HSL->hex conversion helper for a one-off fallback.
  const palette = ["#4f46e5", "#0ea5e9", "#16a34a", "#d97706", "#dc2626", "#7c3aed", "#0891b2", "#db2777"];
  return palette[hue % palette.length];
}

interface CertificateDocumentProps {
  recipientName: string;
  roleLabel: string;
  score: number;
  issuedAt: string; // pre-formatted display date
  verificationHash: string;
  githubUrl: string;
  avatar: ParsedBlobatar | null;
}

export function CertificateDocument({
  recipientName,
  roleLabel,
  score,
  issuedAt,
  verificationHash,
  githubUrl,
  avatar,
}: CertificateDocumentProps) {
  return (
    <Document title={`Keystone Certificate — ${roleLabel}`}>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.outerBorder} />
        <View style={styles.innerBorder} />
        <View style={styles.content}>
          <Text style={styles.eyebrow}>Keystone Certification</Text>
          <Text style={styles.title}>Certificate of Completion</Text>

          <Text style={styles.lead}>This certifies that</Text>

          <View style={styles.recipientRow}>
            {avatar ? (
              <Svg width={40} height={40} viewBox={avatar.viewBox}>
                {avatar.groups.map((g, gi) => (
                  <G key={gi} fill={g.fill}>
                    {g.circles.map((c, ci) => (
                      <Circle key={`c${ci}`} cx={c.cx} cy={c.cy} r={c.r} />
                    ))}
                    {g.paths.map((p, pi) => (
                      <Path key={`p${pi}`} d={p.d} />
                    ))}
                  </G>
                ))}
              </Svg>
            ) : (
              <View style={[styles.fallbackAvatar, { backgroundColor: fallbackColorFor(recipientName) }]}>
                <Text style={styles.fallbackAvatarText}>
                  {(recipientName.trim()[0] ?? "K").toUpperCase()}
                </Text>
              </View>
            )}
            <Text style={styles.recipientName}>{recipientName}</Text>
          </View>

          <Text style={styles.body}>has successfully completed the Keystone certification exam for the role of</Text>
          <Text style={styles.roleLabel}>{roleLabel}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaBlock}>
              <Text style={styles.metaLabel}>Score</Text>
              <Text style={styles.metaValue}>{score.toFixed(1)}%</Text>
            </View>
            <View style={styles.metaBlock}>
              <Text style={styles.metaLabel}>Issued</Text>
              <Text style={styles.metaValue}>{issuedAt}</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerHash}>Verification hash: {verificationHash}</Text>
          <Link src={githubUrl} style={styles.footerLink}>
            GitHub: keystone-architect
          </Link>
        </View>
      </Page>
    </Document>
  );
}
