FROM python:3.11-slim-bullseye

LABEL org.opencontainers.image.url="https://openmoji.org/"
LABEL org.opencontainers.image.source="https://github.com/hfg-gmuend/openmoji"
LABEL org.opencontainers.image.title="OpenMoji Font Builder"
LABEL org.opencontainers.image.description="Builds OpenMoji color fonts"

# This image is used to build fonts using nanoemoji and process them using woff2

# We need xmlstarlet
# We need GCC
# Remove pip git branch install and git dependency once https://github.com/googlefonts/picosvg/pull/279 is merged
RUN apt update \
    && apt install -y --no-install-recommends xmlstarlet woff2 \
    && apt install -y --no-install-recommends git \
    && apt install -y --no-install-recommends gcc g++ \
    && rm -rf /var/lib/apt/lists/* \
    && pip install --no-cache-dir nanoemoji==0.15.0 \
    && pip install --no-cache-dir git+https://github.com/JeppeKlitgaard/picosvg.git@fix-assert-line-length \
    && apt purge -y --auto-remove git \
    && apt purge -y --auto-remove gcc g++
