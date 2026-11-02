// Color del puntito de la temperatura de color («2700K» → un blanco cálido). El color sale del
// dato, como la imagen de un acabado: no es un token. Aproximación de cuerpo negro (Tanner Helland).
// Sin un valor en kelvin («RGB», vacío) no hay color y no se dibuja el punto.

export function temperatureColor(text) {
  const kelvin = Number.parseInt(String(text ?? '').match(/(\d{4,5})\s*K/i)?.[1], 10);
  if (!kelvin) return null;
  const t = Math.min(Math.max(kelvin, 1000), 10000) / 100;
  const clamp = (value) => Math.round(Math.min(Math.max(value, 0), 255));
  const red = t <= 66 ? 255 : 329.698727446 * (t - 60) ** -0.1332047592;
  const green = t <= 66 ? 99.4708025861 * Math.log(t) - 161.1195681661 : 288.1221695283 * (t - 60) ** -0.0755148492;
  const blue = t >= 66 ? 255 : t <= 19 ? 0 : 138.5177312231 * Math.log(t - 10) - 305.0447927307;
  return `rgb(${clamp(red)} ${clamp(green)} ${clamp(blue)})`;
}
