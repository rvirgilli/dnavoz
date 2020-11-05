// configuration contants
record_as_wav = false; //if 'false' it will use 'audio/ogg; codecs=opus'
fftSize = 1024; //must be a power of 2
rec1_length = 10000;
rec2_length = 10000;
rec3_length = 10000;
rec4_length = 3000;
rec5_length = 10000;

var dict_lengths = {
  1: 10000,
  2: 8000,
  3: 6000,
  4: 3000,
  5: 7000
};

verify_length = 10000; //in milliseconds