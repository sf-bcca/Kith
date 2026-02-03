#!/bin/bash
echo "--- GIT STATUS ---" > debug_output.txt
git status >> debug_output.txt 2>&1
echo "--- GIT LOG ---" >> debug_output.txt
git log -n 5 --oneline >> debug_output.txt 2>&1
echo "--- GH AUTH STATUS ---" >> debug_output.txt
gh auth status >> debug_output.txt 2>&1
echo "--- GH REPO VIEW ---" >> debug_output.txt
gh repo view --json name,owner,url >> debug_output.txt 2>&1
echo "--- PIXEL CHECK ---" >> debug_output.txt
python3 -c "from PIL import Image; img = Image.open('public/logo.png'); print('Pixel at 0,0:', img.getpixel((0,0)))" >> debug_output.txt 2>&1
