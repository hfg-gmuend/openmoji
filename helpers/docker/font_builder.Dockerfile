FROM nikolaik/python-nodejs:python3.11-nodejs18-slim

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
