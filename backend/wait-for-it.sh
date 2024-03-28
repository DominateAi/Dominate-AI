set -e

host="$1"
port="$2"
timeout="${3:-30}"

until nc -z "$host" "$port"; do
  >&2 echo "$host:$port is unavailable - sleeping"
  sleep 1
  ((timeout--))
  if [ "$timeout" -eq 0 ]; then
    >&2 echo "Timeout occurred while waiting for $host:$port"
    exit 1
  fi
done

>&2 echo "$host:$port is available"