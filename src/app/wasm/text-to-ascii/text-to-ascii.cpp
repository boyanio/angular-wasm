/**
 * Source code ported from https://github.com/DevonBernard/ASCII-Art
 */

#include <iostream>
#include <fstream>
#include <cassert>
#include <vector>
#include <string>
#include <iomanip>
#include <cmath>
#include <cstdlib>
#include <emscripten.h>

// Helper function to read the provided font from a file.  The format
// of the font file is described in comments below.  The width,
// height, and bitmap_letters variables are set by this function.
void ReadFont(const std::string &font_file, int &width, int &height, std::vector<std::vector<std::string> > &bitmap_letters) {
  // open the font file for reading
  std::ifstream istr(font_file.c_str());
  if (!istr) {
    std::cerr << "ERROR: cannot open font file " << font_file << std::endl;
    return;
  }

  // read in the width & height for every character in the file
  istr >> width >> height;
  assert(width >= 1);
  assert(height >= 1);

  // Create a vector to store all 256 ASCII characters of the
  // characters.  Each character is represented as a vector of
  // <height> strings that are each <width> wide.  Initially the
  // characters are unknown (represented with the '?' character).
  bitmap_letters = std::vector<std::vector<std::string> >
    (256, std::vector<std::string>(height, std::string(width, '?')));

  // read in all the characters
  // output_type is the ascii integer representation of the character
  int ascii;
  while (istr >> ascii) {
    assert(ascii >= 0 && ascii < 256);
    // next the character is printed in single quotes
    char c;
    istr >> c;
    assert(c == '\'');

    // use std::noskipws to make sure we can read the space character correctly
    istr >> std::noskipws >> c;

    // verify that the ascii code matches the character
    assert(c == (char)ascii);

    // switch back to std::skipws mode
    istr >> std::skipws >> c;
    assert(c == '\'');

    // read in the letter
    std::vector<std::string> bitmap;
    std::string tmp;
    for (int i = 0; i < height; i++) {
      istr >> tmp;
      assert((int)tmp.size() == width);

      // make sure the letter uses only '#' and '.' characters
      for (unsigned int j = 0; j < tmp.size(); j++) {
        assert(tmp[j] == '.' || tmp[j] == '#');
      }
      bitmap.push_back(tmp);
    }

    // overwrite the initially unknown letter in the vector
    bitmap_letters[ascii] = bitmap;
  }
}

void find_characters(std::string &read_file_line, char &foreground_character, char &background_character) {
  int array[255] = { 0 }; // initialize all elements to 0
  std::vector<char> str;

  // Add all characters from the user-entered ASCII file to an array
  for (int a = 0; a < read_file_line.size(); a++) {
    str.push_back(2);
    str[a] = read_file_line[a];
  }

  int i, max_similar_character_count;

  // Count the occurance of every character in user-eneted ASCII file
  for (i = 0; str[i] != 0; i++) {
    ++array[str[i]];
  }

  // Find the character that was most frequent and set as the background character 
  // and find the second most frequently used character and set as the foreground character
  max_similar_character_count = array[0];
  foreground_character = 0;
  for (i = 0; str[i] != 0; i++) {
    if (array[str[i]] > max_similar_character_count) {
      max_similar_character_count = array[str[i]];
      background_character = str[i];
    }
    else {
      if (background_character != str[i]) {
        foreground_character = str[i];
      }
    }
  }
}

std::string display(std::string bitmap_file, std::string input, char foreground_character, char background_character) {
  std::string return_string = "";
  int width = 6;
  int height = 7;
  std::vector<std::vector<std::string> > bitmap_letters;
  ReadFont(bitmap_file, width, height, bitmap_letters);
  int letter_index = 0;
  
  // START create the ASCII code for each letter.
  for (int row = 0; row < 7; row++) {
    letter_index = 0;
    
    // START convert simple_font format to user-entered format.
    for (std::string::iterator it = input.begin(); it != input.end(); ++it) {
      for (int letter_character_index = 0; letter_character_index < 7; ++letter_character_index) {
        if (bitmap_letters[input[letter_index]][row][letter_character_index] == '#')
          bitmap_letters[input[letter_index]][row][letter_character_index] = foreground_character;
        if (bitmap_letters[input[letter_index]][row][letter_character_index] == '.')
          bitmap_letters[input[letter_index]][row][letter_character_index] = background_character;
      }

      return_string = return_string + bitmap_letters[input[letter_index]][row] + background_character;
      letter_index++;
    }
    // END convert simple_font format to user-entered format.

    if (row < 6) {
      return_string = return_string + "\n";
    }
  }
  // END create ASCII code.

  return return_string;
}

extern "C" {

  EMSCRIPTEN_KEEPALIVE
  void display_ascii(char* bitmap_file, char* input, char* foreground_character, char* background_character) {
    std::string output_string = display(std::string(bitmap_file), std::string(input), char(foreground_character[0]), char(background_character[0]));
    std::cout << output_string << std::endl;
  }

}