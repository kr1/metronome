# METRONOME

## WHAT IS IT?

_METRONOME_ is a online metronome with the following features:  

  - speed control
  - volume control
  - free choice of rhythms
  - acoustic, visual or audio-visual mode
  - control the metronome with the keyboard

NB: _METRONOME_ uses the web audio API for the audio generation. audio will not work on browsers that do not implement the web audio api. We recommend the Chrome Browser.

## GETTING STARTED

You will need a web-server to run _METRONOME_ locally. if you have python installed, you can `cd` to the project folder (where index.html) is and run:  

    python -m SimpleHTTPServer 8080

which will run _METRONOME_ on a simple web-server, navigate to `http://localhost:8080` to use _METRONOME_ locally.

## RUNNING TEST

A [Jasmine](https://github.com/pivotal/jasmine/) tests in the tests folder.  
to run them you create a _symlink_ to your jasmine library in the `tests` folder called `jasmin_lib`. then you point your browser to `http://localhost:8080/tests/SpecRunner.html`
