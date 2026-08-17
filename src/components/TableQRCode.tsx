"use client";

import { QRCodeSVG } from "qrcode.react";

type Props = {
  url: string;
};

export default function TableQRCode({ url }: Props) {
  return (
    <div className="rounded-xl bg-white p-4">
      <QRCodeSVG value={url} size={180} />
    </div>
  );
}
