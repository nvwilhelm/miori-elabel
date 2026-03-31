import QRCode from "qrcode";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://elabel.miori.de";

// QR-Code als SVG-String generieren (fuer Druck)
export async function generateQrSvg(slug: string): Promise<string> {
  const url = `${BASE_URL}/p/${slug}`;
  return QRCode.toString(url, {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: 2,
    width: 300,
    color: {
      dark: "#1a1a1a",
      light: "#ffffff",
    },
  });
}

// QR-Code als PNG-Buffer generieren (fuer Digital)
export async function generateQrPng(slug: string): Promise<Buffer> {
  const url = `${BASE_URL}/p/${slug}`;
  return QRCode.toBuffer(url, {
    type: "png",
    errorCorrectionLevel: "M",
    margin: 2,
    width: 600,
    color: {
      dark: "#1a1a1a",
      light: "#ffffff",
    },
  });
}

// QR-Code als Data-URL (fuer Vorschau im Admin)
export async function generateQrDataUrl(slug: string): Promise<string> {
  const url = `${BASE_URL}/p/${slug}`;
  return QRCode.toDataURL(url, {
    errorCorrectionLevel: "M",
    margin: 2,
    width: 300,
    color: {
      dark: "#1a1a1a",
      light: "#ffffff",
    },
  });
}
