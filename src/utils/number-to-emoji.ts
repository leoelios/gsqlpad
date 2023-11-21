export default function toEmoji(number: number) {
  if (number === undefined || number === null) {
    return number;
  }

  const str = number.toString();

  if (str === "10") {
    return "🔟";
  }

  return str
    .replace(/0/g, "0️⃣")
    .replace(/1/g, "1️⃣")
    .replace(/2/g, "2️⃣")
    .replace(/3/g, "3️⃣")
    .replace(/4/g, "4️⃣")
    .replace(/5/g, "5️⃣")
    .replace(/6/g, "6️⃣")
    .replace(/7/g, "7️⃣")
    .replace(/8/g, "8️⃣")
    .replace(/9/g, "9️⃣");
}
