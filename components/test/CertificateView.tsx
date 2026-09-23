"use client";

// components/test/CertificateView.tsx — styled on-screen preview of a
// generated certificate, mirroring the PDF's actual content (not just a
// bare download link), plus a download-PDF button and a
// copy-shareable-link / social-card preview (ticket 9).

import { useState } from "react";
import { Download, Link2, Check } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { KeystoneMark } from "@/components/brand/KeystoneMark";
import { AUTHOR_CREDIT } from "@/lib/brand/credit";

export interface CertificateViewProps {
  certificateId: string;
  recipientName: string;
  roleLabel: string;
  score: number;
  issuedAt: string; // pre-formatted display date
  verificationHash: string;
  githubUrl: string;
  shareUrl: string;
}

export function CertificateView({
  certificateId,
  recipientName,
  roleLabel,
  score,
  issuedAt,
  verificationHash,
  githubUrl,
  shareUrl,
}: CertificateViewProps) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      const absoluteUrl = shareUrl.startsWith("http")
        ? shareUrl
        : `${window.location.origin}${shareUrl}`;
      await navigator.clipboard.writeText(absoluteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API unavailable — silently no-op, the link is still
      // visible/selectable in the input below.
    }
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      {/* On-screen certificate preview — visually mirrors CertificateDocument.tsx's PDF layout. */}
      <GlassCard className="relative overflow-hidden rounded-3xl border-2 border-accent/40 bg-[#fdfcf8] p-2">
        <div className="rounded-2xl border border-[#c7c2b8] p-10 text-center">
          <div className="mb-4 flex items-center justify-center gap-2.5">
            <KeystoneMark size={40} className="rounded-[10px]" />
            <span className="text-sm font-medium text-[#374151]">{AUTHOR_CREDIT}</span>
          </div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-accent">Keystone Certification</p>
          <h1 className="mb-6 font-serif text-3xl font-bold text-[#16181d]">Certificate of Completion</h1>

          <p className="mb-2 text-sm text-[#4b5563]">This certifies that</p>
          <p className="mb-2 font-serif text-2xl font-bold text-[#16181d]">{recipientName}</p>
          <p className="mb-1 text-sm text-[#4b5563]">
            has successfully completed the Keystone certification exam for the role of
          </p>
          <p className="mb-6 font-serif text-xl font-bold text-accent">{roleLabel}</p>

          <div className="mb-6 flex justify-center gap-12">
            <div>
              <p className="text-[10px] uppercase tracking-wide text-[#9ca3af]">Score</p>
              <p className="font-serif text-lg font-bold text-[#16181d]">{score.toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-[#9ca3af]">Issued</p>
              <p className="font-serif text-lg font-bold text-[#16181d]">{issuedAt}</p>
            </div>
          </div>

          <p className="font-mono text-[9px] text-[#9ca3af]">Verification hash: {verificationHash}</p>
          <a href={githubUrl} target="_blank" rel="noreferrer" className="text-xs text-accent hover:underline">
            GitHub: keystone-architect
          </a>
        </div>
      </GlassCard>

      <div className="flex flex-wrap items-center gap-3">
        <a href={`/api/certificates/${certificateId}/pdf`} target="_blank" rel="noreferrer">
          <Button variant="primary" className="gap-1.5">
            <Download size={16} /> PDF herunterladen
          </Button>
        </a>
        <Button variant="secondary" onClick={copyLink} className="gap-1.5">
          {copied ? <Check size={16} /> : <Link2 size={16} />}
          {copied ? "Link kopiert" : "Link kopieren"}
        </Button>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-foreground">Social-Card-Vorschau (1200×630, für LinkedIn/Twitter)</p>
        <GlassCard className="overflow-hidden rounded-2xl p-2">
          {/* eslint-disable-next-line @next/next/no-img-element -- server-generated PNG, not a next/image-optimizable static asset */}
          <img
            src={`/api/certificates/${certificateId}/social-card`}
            alt={`Keystone certificate social card for ${recipientName}`}
            className="w-full rounded-xl"
          />
        </GlassCard>
      </div>
    </div>
  );
}
