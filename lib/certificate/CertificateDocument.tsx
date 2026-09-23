// lib/certificate/CertificateDocument.tsx — the @react-pdf/renderer document
// tree for a Keystone role certificate (ticket 9 / plan items 10 & 17).
//
// Uses @react-pdf/renderer's built-in base-14 "Times-Roman" / "Times-Bold"
// fonts for the serif title — these are embedded in every PDF reader by
// spec, so no Font.register()/network font fetch is needed (more reliable
// for a self-hosted, offline-friendly app than pulling a Google Font at
// render time).

import { Document, Page, View, Text, Svg, Defs, LinearGradient, Stop, Rect, Path, StyleSheet, Link } from "@react-pdf/renderer";
import { LOGO_COLORS, LOGO_SHAPES, LOGO_VIEWBOX } from "../brand/logo";
import { AUTHOR_CREDIT } from "../brand/credit";

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
  brandRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  brandCredit: {
    fontSize: 11,
    color: "#374151",
    fontFamily: "Helvetica",
  },
});

interface CertificateDocumentProps {
  recipientName: string;
  roleLabel: string;
  score: number;
  issuedAt: string; // pre-formatted display date
  verificationHash: string;
  githubUrl: string;
}

export function CertificateDocument({
  recipientName,
  roleLabel,
  score,
  issuedAt,
  verificationHash,
  githubUrl,
}: CertificateDocumentProps) {
  return (
    <Document title={`Keystone Certificate — ${roleLabel}`}>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.outerBorder} />
        <View style={styles.innerBorder} />
        <View style={styles.content}>
          <View style={styles.brandRow}>
            <KeystoneLogo size={40} />
            <Text style={styles.brandCredit}>{AUTHOR_CREDIT}</Text>
          </View>
          <Text style={styles.eyebrow}>Keystone Certification</Text>
          <Text style={styles.title}>Certificate of Completion</Text>

          <Text style={styles.lead}>This certifies that</Text>

          <View style={styles.recipientRow}>
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

function KeystoneLogo({ size }: { size: number }) {
  const sh = LOGO_SHAPES;
  const c = LOGO_COLORS;
  return (
    <Svg width={size} height={size} viewBox={LOGO_VIEWBOX}>
      <Defs>
        <LinearGradient id="kslogo" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={c.gradientFrom} />
          <Stop offset="1" stopColor={c.gradientTo} />
        </LinearGradient>
      </Defs>
      <Rect x={0} y={0} width={64} height={64} rx={sh.background.rx} fill="url(#kslogo)" />
      <Path d={sh.archLeft} fill="none" stroke={c.stone} strokeWidth={sh.archStrokeWidth} />
      <Path d={sh.archRight} fill="none" stroke={c.stone} strokeWidth={sh.archStrokeWidth} />
      <Path d={sh.keystone} fill={c.keystone} />
      <Path d={sh.book} fill="none" stroke={c.stone} strokeWidth={sh.bookStrokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <Path d={sh.spark} fill={c.spark} />
    </Svg>
  );
}
