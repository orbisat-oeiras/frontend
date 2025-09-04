import packets from "$lib/packets.json";
import { json } from "@sveltejs/kit";

function base64Encode(str: string) {
  const encodedStr = encodeURIComponent(str);

  const bytes = encodedStr.replace(/%([0-9A-F]{2})/g, (match, p1) =>
    String.fromCharCode(parseInt(p1, 16))
  );
  return btoa(bytes);
}

export async function sendPacketsFromCode(
  code: string,
  server: string,
  timestamp: bigint
) {
  const found = packets.find((p) => p.code === code);
  if (!found) throw new Error("Packet code not found");
  const packetToSend = JSON.parse(JSON.stringify(found.packet));
  packetToSend.payload.value = base64Encode(packetToSend.payload.value);
  packetToSend.timestamp = timestamp.toString();
  const response = await fetch(server, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(packetToSend),
  });

  return response.ok;
}
