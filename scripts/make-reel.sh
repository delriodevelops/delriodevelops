#!/usr/bin/env bash
# Builds public/reel/showreel.mp4, the home's trailer: a montage that speeds up. The products come
# first, 2.5 s each and overlapping the next by half a second (a slow camera move over a screenshot,
# or a clip of the project's film); then the concept sites (fictional brands) cut fast, 22 frames
# each. A light grade and film grain over all of it. The home scrubs this file with the scroll, so it
# is encoded with a short GOP (a keyframe every 6 frames) for smooth seeking.
#
# A shot is a screenshot (it gets a push-in or a pull-out) or a clip of a project film, written
# file.mp4@start (seconds): a clip keeps its own camera moves, so it gets no push-in.
#
# Usage: bash scripts/make-reel.sh   (needs ffmpeg with WebP decoding on PATH)
# The order and lengths must match REEL.shots in src/app/page-content.jsx: a product takes 2 s of the
# timeline (REEL.shotLength), a concept 22/24 s ({ name, seconds }), and the video holds the last
# shot half a second more. Ten products and eight concepts make 27.8 s.
set -euo pipefail
cd "$(dirname "$0")/../public"

PRODUCTS=(
  fainancial/1.webp
  meshmind/film.mp4@6.55  # the wires drawn, the signal through the flow, the pull-out to the browser
  cityswipe/scroll.mp4@0.6  # the dots fly from the cost field into the value chart, the frontier draws
  billonario/film.mp4@20.3  # a country completed, then ten builds speeding up into the hotel
  motorsportive/film.mp4@14.6  # the red dot closes the Interlagos lap, the frame floods red, the site rises
  baitme/1.webp
  clyme/1.webp
  drnews/film.mp4@10.9  # the edition lands, then a flip to the next story
  mydogfood/film.mp4@8.1  # the vacuum, then manzana: Sí, and its rings
  escudolealjpt/1.webp
)
CONCEPTS=(
  fractura/film.mp4@12.85  # DOCK slams in on the red flood
  orbita/film.mp4@7.75  # the planet fills the frame as its night side's cities switch on
  bloop/film.mp4@2.8  # the can bursts into bubbles and stickers
  kern/film.mp4@19.75  # the particle wordmark is struck through
  casa-alba/film.mp4@13.45  # the arch opens on the sunset over the mustard ground
  grieta/film.mp4@2.5  # the crack opens through the serif
  lumbre/film.mp4@4.15  # the ember cools into caramel past 293 °C
  atolon/film.mp4@24.45  # the giant wordmark over the lighthouse diorama
)

FPS=24
PRODUCT_FRAMES=60   # a product is on screen 2.5 s...
XFADE_FRAMES=12     # ...and overlaps the next by 0.5 s: 2 s of the timeline each
CONCEPT_FRAMES=22   # a concept: 22 frames, hard cuts between them
INTO_FRAMES=6       # the last product slides into the first concept in a quarter second
TAIL_FRAMES=12      # the last concept holds half a second more
TRANSITIONS=(fadeblack slideleft wipeup circleopen fadeblack slideright wipedown fade)

sec() { awk "BEGIN{printf \"%.6f\", $1/${FPS}}"; }
grade="eq=contrast=1.08:saturation=0.85,setsar=1,format=yuv420p"
inputs=()
filters=""
n=0   # next input index

# a film clip of exactly $2 frames from file@start, as stream [$3]
clip() {
  local shot=$1 frames=$2 label=$3
  inputs+=(-ss "${shot#*@}" -t "$(sec $((frames + 6)))" -i "${shot%@*}")
  filters+="[$n:v]fps=${FPS},scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,"
  filters+="trim=end_frame=${frames},setpts=PTS-STARTPTS,${grade}[$label];"
  n=$((n + 1))
}

# the products: a screenshot gets a slow push-in or pull-out, a film clip plays as it is
last=$(( ${#PRODUCTS[@]} - 1 ))
for i in "${!PRODUCTS[@]}"; do
  shot=${PRODUCTS[$i]}
  frames=$PRODUCT_FRAMES
  (( i == last )) && frames=$(( PRODUCT_FRAMES - XFADE_FRAMES + INTO_FRAMES ))
  if [[ $shot == *.mp4@* ]]; then clip "$shot" "$frames" "v$i"; continue; fi
  inputs+=(-i "$shot")
  # alternate push-in and pull-out, drifting toward a different corner each shot
  if (( i % 2 == 0 )); then zoom="min(1+0.0025*on,1.15)"; else zoom="max(1.15-0.0025*on,1)"; fi
  case $(( i % 4 )) in
    0) x="iw/2-(iw/zoom/2)"; y="ih/2-(ih/zoom/2)" ;;
    1) x="(iw-iw/zoom)*on/${frames}"; y="ih/2-(ih/zoom/2)" ;;
    2) x="iw/2-(iw/zoom/2)"; y="(ih-ih/zoom)*on/${frames}" ;;
    3) x="(iw-iw/zoom)*(1-on/${frames})"; y="(ih-ih/zoom)/2" ;;
  esac
  filters+="[$n:v]scale=2560:1440:force_original_aspect_ratio=increase,crop=2560:1440,"
  filters+="zoompan=z='${zoom}':x='${x}':y='${y}':d=${frames}:s=1280x720:fps=${FPS},${grade}[v$i];"
  n=$((n + 1))
done

# chain the products with crossfades, 2 s apart
prev="v0"
for (( i=1; i<=last; i++ )); do
  t=${TRANSITIONS[$(( (i-1) % ${#TRANSITIONS[@]} ))]}
  filters+="[$prev][v$i]xfade=transition=${t}:duration=$(sec $XFADE_FRAMES):offset=$(sec $(( i * (PRODUCT_FRAMES - XFADE_FRAMES) )))[x$i];"
  prev="x$i"
done

# the concepts back to back on hard cuts, the last one held for the tail
cl=""
for k in "${!CONCEPTS[@]}"; do
  frames=$CONCEPT_FRAMES
  (( k == ${#CONCEPTS[@]} - 1 )) && frames=$(( CONCEPT_FRAMES + TAIL_FRAMES ))
  clip "${CONCEPTS[$k]}" "$frames" "c$k"
  cl+="[c$k]"
done
# (concat hands out microsecond timestamps; xfade wants the same 1/24 timebase on both sides)
filters+="${cl}concat=n=${#CONCEPTS[@]}:v=1:a=0,settb=1/${FPS}[cs];"

# the last product slides into the first concept, which starts 2 s after it like any shot
into=${TRANSITIONS[$(( last % ${#TRANSITIONS[@]} ))]}
filters+="[$prev][cs]xfade=transition=${into}:duration=$(sec $INTO_FRAMES):offset=$(sec $(( (last + 1) * (PRODUCT_FRAMES - XFADE_FRAMES) )))[all];"
filters+="[all]noise=alls=7:allf=t,format=yuv420p[out]"

mkdir -p reel
ffmpeg -y -loglevel error "${inputs[@]}" -filter_complex "$filters" -map "[out]" \
  -c:v libx264 -preset slow -crf 27 -g 6 -keyint_min 6 -sc_threshold 0 \
  -pix_fmt yuv420p -movflags +faststart -an reel/showreel.mp4

# poster frame for slow connections / before the video loads
ffmpeg -y -loglevel error -ss 1 -i reel/showreel.mp4 -frames:v 1 -q:v 4 reel/showreel-poster.jpg

ls -la reel
