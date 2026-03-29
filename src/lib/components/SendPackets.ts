function base64Encode(str: string) {
  const encodedStr = encodeURIComponent(str);

  const bytes = encodedStr.replace(/%([0-9A-F]{2})/g, (match, p1) =>
    String.fromCharCode(parseInt(p1, 16)),
  );
  return btoa(bytes);
}

export async function sendPacketsFromCode(
  code: string,
  server: string,
  timestamp: bigint,
) {
  const packetToSend = JSON.parse(code);
  packetToSend.payload.value = base64Encode(packetToSend.payload.value);
  if (packetToSend.timestamp === 0) {
    packetToSend.timestamp = timestamp.toString();
  }
  const response = await fetch(server, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(packetToSend),
  });

  return response;
}
