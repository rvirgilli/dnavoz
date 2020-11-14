// configuration contants
record_as_wav = false; //if 'false' it will use 'audio/ogg; codecs=opus'
fftSize = 1024; //must be a power of 2

var dict_lengths = {
  1: 10000, //ref1
  2: 8000,  //ref2
  3: 6000,  //ref3
  4: 3000,  //keyword
  5: 7000,  //silence
  6: 2000   //verification
};