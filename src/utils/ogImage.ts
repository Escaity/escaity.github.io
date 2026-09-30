import satori from "satori";
import sharp from "sharp";
import {site} from "../consts";

// OGP 画像のサイズ(X / Facebook 推奨の 1.91:1)
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

// Catppuccin Mocha
const colors = {
  base: "#1e1e2e",
  mantle: "#181825",
  surface: "#313244",
  text: "#cdd6f4",
  subtext: "#a6adc8",
  accent: "#89b4fa",
  mauve: "#cba6f7",
};

type OgImageOptions = {
  title: string;
  labels?: string[];
  date?: string;
};

// Google Fonts の text= パラメータで、画像内の文字だけを含むサブセットフォント(TrueType)を取得する
async function loadGoogleFont(text: string, weight: number) {
  const chars = [...new Set(text)].join("");
  const cssUrl = `https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@${weight}&text=${encodeURIComponent(chars)}`;
  const css = await (await fetch(cssUrl)).text();
  const fontUrl = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
  if (!fontUrl) {
    throw new Error(`OG 画像用フォントの取得に失敗しました (weight=${weight})`);
  }
  return (await fetch(fontUrl)).arrayBuffer();
}

let avatarDataUri: Promise<string> | undefined;

function loadAvatar() {
  avatarDataUri ??= sharp("public/avatar.png")
    .resize(144, 144)
    .png()
    .toBuffer()
    .then((buffer) => `data:image/png;base64,${buffer.toString("base64")}`);
  return avatarDataUri;
}

const h = (type: string, style: Record<string, unknown>, children?: unknown) => ({
  type,
  props: {style, children},
});

export async function renderOgImage({title, labels = [], date}: OgImageOptions) {
  const footerText = `${site.author}${site.title}${date ?? ""}`;
  const [boldFont, regularFont, avatar] = await Promise.all([
    loadGoogleFont(title + footerText, 700),
    loadGoogleFont(labels.join("") + footerText, 400),
    loadAvatar(),
  ]);

  // 長いタイトルは文字サイズを落として 3 行程度に収める
  const titleFontSize = title.length > 48 ? 48 : title.length > 28 ? 56 : 64;

  const svg = await satori(
    h("div", {
      width: "100%",
      height: "100%",
      display: "flex",
      padding: 40,
      background: colors.mantle,
      fontFamily: "Noto Sans JP",
    }, [
      h("div", {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "48px 56px",
        borderRadius: 24,
        background: colors.base,
        borderTop: `8px solid ${colors.accent}`,
      }, [
        h("div", {display: "flex", gap: 12}, labels.map((label) =>
          h("div", {
            padding: "6px 20px",
            borderRadius: 999,
            background: colors.surface,
            color: colors.mauve,
            fontSize: 26,
          }, label)
        )),
        h("div", {
          display: "flex",
          color: colors.text,
          fontSize: titleFontSize,
          fontWeight: 700,
          lineHeight: 1.35,
        }, title),
        h("div", {display: "flex", alignItems: "center", justifyContent: "space-between"}, [
          h("div", {display: "flex", alignItems: "center", gap: 20}, [
            {type: "img", props: {src: avatar, width: 72, height: 72, style: {borderRadius: 999}}},
            h("div", {display: "flex", flexDirection: "column"}, [
              h("div", {color: colors.text, fontSize: 28, fontWeight: 700}, site.title),
              h("div", {color: colors.subtext, fontSize: 22}, site.author),
            ]),
          ]),
          h("div", {color: colors.subtext, fontSize: 24}, date ?? ""),
        ]),
      ]),
    ]) as any,
    {
      width: OG_IMAGE_WIDTH,
      height: OG_IMAGE_HEIGHT,
      fonts: [
        {name: "Noto Sans JP", data: boldFont, weight: 700, style: "normal"},
        {name: "Noto Sans JP", data: regularFont, weight: 400, style: "normal"},
      ],
    }
  );

  return sharp(Buffer.from(svg)).png().toBuffer();
}
