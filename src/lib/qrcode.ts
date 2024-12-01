import QRCode from "qrcode";

export async function generateQRCode(text: string) {
  try {
    const url = await QRCode.toDataURL(text, {
      width: 180,
      margin: 1,
      color: {
        dark: "#000",
        light: "#FFF",
      },
    });
    return url;
  } catch (err) {
    console.error("QR Code generation error:", err);
    return null;
  }
}
