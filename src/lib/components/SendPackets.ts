import packets from "$lib/packets.json";
import { json } from "@sveltejs/kit";

export async function sendPacketsFromCode(
  code: string,
  server: string,
  timestamp: bigint
) {
  const found = packets.find((p) => p.code === code);
  if (!found) throw new Error("Packet code not found");
  const packetToSend = JSON.parse(JSON.stringify(found.packet));
  packetToSend.payload.value = btoa(
    encodeURIComponent(packetToSend.payload.value) // Encode the value to base64
  );
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
