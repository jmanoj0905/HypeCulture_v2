#!/bin/sh
set -eu

PORT="${1:-5173}"
LOCAL_IP=""

for iface in en0 en1 en2; do
  if ip=$(ipconfig getifaddr "$iface" 2>/dev/null); then
    if [ -n "$ip" ]; then
      LOCAL_IP="$ip"
      break
    fi
  fi
done

if [ -z "$LOCAL_IP" ]; then
  LOCAL_IP="localhost"
fi

printf 'Open HypeCulture in your browser:\n'
printf '  Local: http://localhost:%s\n' "$PORT"
printf '  LAN:   http://%s:%s\n' "$LOCAL_IP" "$PORT"
