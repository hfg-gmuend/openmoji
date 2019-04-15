FROM ubuntu:18.04

RUN apt-get update && apt-get upgrade -y
RUN apt-get install python-pip -y
RUN pip install --trusted-host=pypi.org --trusted-host=files.pythonhosted.org fonttools
RUN pip install --trusted-host=pypi.org --trusted-host=files.pythonhosted.org pyyaml
RUN pip install --trusted-host=pypi.org --trusted-host=files.pythonhosted.org lxml
RUN apt-get install fontforge python-fontforge -y
