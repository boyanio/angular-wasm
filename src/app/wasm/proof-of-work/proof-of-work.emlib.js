mergeInto(LibraryManager.library, {
  proof_of_work_done: function (result, iterations, _, hashPtr) {
    window["onProofOfWorkDone"](result, iterations, UTF8ToString(hashPtr));
  },
});
