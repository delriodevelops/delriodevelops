#!/usr/bin/env bash
# Builds public/reel/showreel.mp4 from project screenshots: slow camera moves per shot,
# xfade cuts, a light grade and film grain. The home showreel scrubs this file with the
# scroll, so it is encoded with a short GOP (frequent keyframes) for smooth seeking.
#
# Usage: bash scripts/make-reel.sh   (needs ffmpeg with WebP decoding on PATH)
# Shot order must match REEL.shots in src/app/page-content.jsx.
set -euo pipefail
cd "$(dirname "$0")/../public"

SHOTS=(
  fainancial/1.webp
  meshmind/3.webp
  cityswipe.webp
  baitme/1.webp
  clyme.webp
  drnews.webp
  mydogfood.webp
  escudolealjpt/1.webp
)

FPS=24
SHOT_FRAMES=60   # 2.5s per shot
XFADE=0.5        # seconds of overlap between shots
TRANSITIONS=(fadeblack slideleft wipeup circleopen fadeblack slideright wipedown fade)

inputs=()
filters=""
for i in "${!SHOTS[@]}"; do
  inputs+=(-i "${SHOTS[$i]}")
  # alternate push-in and pull-out, drifting toward a different corner each shot
  if (( i % 2 == 0 )); then
    zoom="min(1+0.0025*on,1.15)"
  else
    zoom="max(1.15-0.0025*on,1)"
  fi
  case $(( i % 4 )) in
    0) x="iw/2-(iw/zoom/2)"; y="ih/2-(ih/zoom/2)" ;;
    1) x="(iw-iw/zoom)*on/${SHOT_FRAMES}"; y="ih/2-(ih/zoom/2)" ;;
    2) x="iw/2-(iw/zoom/2)"; y="(ih-ih/zoom)*on/${SHOT_FRAMES}" ;;
    3) x="(iw-iw/zoom)*(1-on/${SHOT_FRAMES})"; y="(ih-ih/zoom)/2" ;;
  esac
  filters+="[$i:v]scale=2560:1440:force_original_aspect_ratio=increase,crop=2560:1440,"
  filters+="zoompan=z='${zoom}':x='${x}':y='${y}':d=${SHOT_FRAMES}:s=1280x720:fps=${FPS},"
  filters+="eq=contrast=1.08:saturation=0.85,setsar=1,format=yuv420p[v$i];"
done

# chain the shots with crossfades
shot_len=$(awk "BEGIN{print ${SHOT_FRAMES}/${FPS}}")
prev="v0"
for (( i=1; i<${#SHOTS[@]}; i++ )); do
  offset=$(awk "BEGIN{print ${i}*(${shot_len}-${XFADE})}")
  t=${TRANSITIONS[$(( (i-1) % ${#TRANSITIONS[@]} ))]}
  filters+="[$prev][v$i]xfade=transition=${t}:duration=${XFADE}:offset=${offset}[x$i];"
  prev="x$i"
done
filters+="[$prev]noise=alls=7:allf=t,format=yuv420p[out]"

mkdir -p reel
ffmpeg -y -loglevel error "${inputs[@]}" -filter_complex "$filters" -map "[out]" \
  -c:v libx264 -preset slow -crf 27 -g 6 -keyint_min 6 -sc_threshold 0 \
  -pix_fmt yuv420p -movflags +faststart -an reel/showreel.mp4

# poster frame for slow connections / before the video loads
ffmpeg -y -loglevel error -ss 1 -i reel/showreel.mp4 -frames:v 1 -q:v 4 reel/showreel-poster.jpg

ls -la reel
