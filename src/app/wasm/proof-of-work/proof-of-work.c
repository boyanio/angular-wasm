// Original code taken from https://github.com/devchild/proof-of-work-in-c

#include "sha256/sha256.h"
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <time.h>
#include <inttypes.h>
#include <emscripten.h>

extern void proof_of_work_done(int, uint64_t, char *);

char * format_hash(const BYTE hash[]) {

  char *result;
  result = malloc(65*sizeof(char));

  int idx;
  for (idx = 0; idx < 64; idx = idx + 2) {
    sprintf(&result[idx], "%02x", hash[idx / 2]);
  }
  result[64] = '\0';
  return result;
}

struct Proof {
  BYTE * hash;
  int64_t nonce;
  int32_t nr_leading_zeros;
  time_t created_at;
  uint64_t iterations;
} Proof;
	
uint64_t random_uint64() {
  uint64_t r = rand(), q = UINT64_MAX, b = (uint64_t) RAND_MAX + 1;
  /* +1 because range of rand() is [0, RAND_MAX] */
  /* We want ceil(log_b(UINT64_MAX + 1)) iterations
     = ceil(log_b(UINT64_MAX)) unless log_b(UINT64_MAX) is an integer, which it
     is only if b = UINT64_MAX, but the return type of rand() is int. */
  while (q > b) {
    r = r * b + (uint64_t) rand();
    q = (q - 1) / b + 1;
  }
  return r;
}

int64_t random_int64() {
  return random_uint64() + INT64_MIN;
}

BYTE * compute_sha256(const BYTE data[], size_t data_len) {
  BYTE * hash = malloc(sizeof(BYTE) * 32);
  SHA256_CTX ctx;
  sha256_init(&ctx);
  sha256_update(&ctx, data, data_len);
  sha256_final(&ctx, hash);
  return hash;
}

int verify(struct Proof * p, const BYTE data[], size_t data_len) {
  BYTE buffer[
    data_len
    + sizeof(time_t)
    + sizeof(int64_t)
  ];

  memcpy(&buffer, data, data_len);
      
  time_t t = p->created_at;
  memcpy(&buffer[data_len], &t, sizeof(t));

  int64_t nonce = p->nonce;
  memcpy(&buffer[data_len + sizeof(t)], &nonce, sizeof(nonce));

  BYTE* hash = compute_sha256(buffer, sizeof(buffer) / sizeof(BYTE));
  return memcmp(hash, p->hash, data_len);
}

struct Proof * work(const BYTE data[], size_t data_len, int32_t leadingZeros) {
  BYTE buffer[
    data_len
    + sizeof(time_t)
    + sizeof(int64_t)
  ];

  memcpy(&buffer, data, data_len);
      
  time_t t = time(NULL);
  memcpy(&buffer[data_len], &t, sizeof(t));

  uint64_t iterations = 1;
  
  while(1) {
    int64_t nonce = random_int64();
    memcpy(&buffer[data_len + sizeof(t)], &nonce, sizeof(nonce));
    
    BYTE* hash = compute_sha256(buffer, sizeof(buffer) / sizeof(BYTE));
    int other_than_zero = 1;
    for (int i = leadingZeros; i > 0 && other_than_zero; i--) {
      other_than_zero = 0x00 == hash[i]; // is zero_bit
    }

    if (other_than_zero) {
      struct Proof* ret = malloc(sizeof(Proof));
      ret->nonce = nonce;
      ret->created_at = t;
      ret->nr_leading_zeros = leadingZeros;
      ret->hash = hash;
      ret->iterations = iterations;
      return ret;
    }

    // Used to prevent blocking of the main thread
    if (iterations % 500 == 0) {
      emscripten_sleep(1);
    }

    iterations++;
  }
}

EMSCRIPTEN_KEEPALIVE
void do_proof_of_work(unsigned char * str, int32_t leadingZeros) {
  struct Proof* p = work(str, sizeof(str) / sizeof(BYTE), leadingZeros);
  int result = verify(p, str, sizeof(str) / sizeof(BYTE));
  proof_of_work_done(result, p->iterations, format_hash(p->hash));
}