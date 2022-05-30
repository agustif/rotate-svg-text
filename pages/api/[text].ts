import type { NextApiRequest, NextApiResponse } from "next";
const TextToSVG = require("text-to-svg");
const textToSVG = TextToSVG.loadSync();

type Data = {
  svg: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let { text = 'Timezones', color = 'black', size = 14, font = 'Arial' } = req.query;
  if (size > 99) size = 99;
  const attributes = {
    height: '100%',
    fill: color,
    transform: `translate(${size}, 0) rotate(90)`,
  };
  const options = {
    fontSize: size,
    anchor: "top",
    attributes: attributes,
  };
  let svg = textToSVG.getSVG(text, options);
  const metrics = textToSVG.getMetrics(text, options);
  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader(
    "Cache-Control",
    "public, immutable, s-maxage=31536000, max-age=31536000"
  );
  svg = svg.replace(/width="\d."/g, `width="${metrics.height}"`);
  svg = svg.replace(/height="\d."/g, `height="${metrics.width}"`);
  return res.end(svg);
}
