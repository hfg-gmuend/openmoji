FROM nikolaik/python-nodejs:python3.11-nodejs18-slim

# This Dockerfile provides the image used to generate the fonts
# from the source images.

# Versions of nanoemoji and picsvg used to build the fonts
# can be changed here. Pushing such a change to GitHub should
# trigger a rebuild of the image.
#!!! This must be done BEFORE helpers/generate-fonts.sh is rerun
# for the change to materialise.

# The file helpers/generate-fonts-runner.sh is run within this image

LABEL org.opencontainers.image.url="https://openmoji.org/"
LABEL org.opencontainers.image.source="https://github.com/hfg-gmuend/openmoji"
LABEL org.opencontainers.image.title="OpenMoji Font Builder"
LABEL org.opencontainers.image.description="Builds OpenMoji color fonts"

# This image is used to build fonts using nanoemoji and process them using woff2

# We need xmlstarlet
# We need GCC
RUN apt update \
    && apt install -y --no-install-recommends xmlstarlet woff2 \
    && apt install -y --no-install-recommends gcc g++ \
    && rm -rf /var/lib/apt/lists/* \
    && pip install --no-cache-dir nanoemoji==0.15.1 picosvg==0.20.6 \
    && apt purge -y --auto-remove gcc g++
