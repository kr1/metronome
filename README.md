# METRONOME

## WHAT IS IT?

_METRONOME_ is a online metronome with the following features:  

  - speed control
  - volume control
  - free choice of rhythms
  - acoustic, visual or audio-visual mode
  - control the metronome with the keyboard

NB: _METRONOME_ uses the Web Audio API for audio generation. Audio will not work on browsers that do not implement the Web Audio API.

## SCREENSHOTS

### Linear Mode

![linear mode](http://github.com/kr1/metronome/raw/master/pics/2013-04-24_screenshot_metronome_linear.png "screenshot linear mode")

### Circular Mode

![circular mode](http://github.com/kr1/metronome/raw/master/pics/2013-04-24_screenshot_metronome_circle.png "screenshot circular mode")

## DEMO

see this periodically updated [online version](http://metronome.zanstaen.org)

It is possible to specify a rhythm with an URL parameter, like [_**-**_**-**-_)](http://metronome.zanstaen.org/#speed=132/meter=_**-**_**-**-_)

## GETTING STARTED

You will need a web-server to run _METRONOME_ locally. if you have python installed, you can `cd` to the project folder (where index.html) is and run:  

    python -m SimpleHTTPServer 8080

which will run _METRONOME_ on a simple web-server, navigate to `http://localhost:8080` to use _METRONOME_ locally.

## RUNNING TESTS

A series of [Jasmine](https://github.com/pivotal/jasmine/) tests are in the tests folder.  
to run them you create a _symlink_ to your jasmine library in the `tests` folder called `jasmin_lib`. then you point your browser to [`http://localhost:8080/tests/SpecRunner.html`](http://localhost:8080/tests/SpecRunner.html)
