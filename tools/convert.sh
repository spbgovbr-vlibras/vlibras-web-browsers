#!/bin/bash

SIZE=64
COLORS=4

DIM="\033[2m"
RESET="\033[0m"

while [[ $# -gt 0 ]]; do
    case "$1" in
        --size|-s)
            SIZE="$2"
            shift 2
            ;;
        --colors|-c)
            COLORS="$2"
            shift 2
            ;;
        *)
            echo "Opção desconhecida: $1"
            echo "Uso: $0 [--size|-s valor] [--colors|-c valor]"
            exit 1
            ;;
    esac
done

mkdir -p webp

shopt -s nullglob
files=(icons/*.{svg,webp,png,jpg,jpeg})
shopt -u nullglob

for file in "${files[@]}"; do
    [ -e "$file" ] || continue
    
    filename=$(basename "$file")
    name="${filename%.*}"
    ext="${filename##*.}"
    ext=$(echo "$ext" | tr '[:upper:]' '[:lower:]')
    
    output_file="webp/${name}.webp"

    if [ "$ext" = "svg" ]; then
        rsvg-convert -w $SIZE -h $SIZE "$file" \
        | convert png:- -channel A -threshold 50% png:- \
        | convert png:- +dither -colors $COLORS png:- \
        | cwebp -quiet -lossless -o "$output_file" -- -
    else
        convert "$file" -resize "${SIZE}x${SIZE}" -channel A -threshold 50% +dither -colors $COLORS png:- \
        | cwebp -quiet -lossless -o "$output_file" -- -
    fi

    size_bytes=$(wc -c < "$output_file")

    echo -e "✅ $output_file $DIM(${size_bytes} bytes)$RESET"
done