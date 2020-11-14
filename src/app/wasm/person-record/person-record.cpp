#include <emscripten/bind.h>

using namespace emscripten;

struct PersonalInfo {
  std::string name;
  int age;
};

struct Body {
  int height;
  int weight;
};

struct PersonRecord {
  std::size_t id;
  std::string avatar;
  PersonalInfo personalInfo;
  Body body;
};

PersonRecord createRecord(PersonalInfo personalInfo, Body body) {
  struct PersonRecord personRecord;
  personRecord.id = std::hash<std::string>{}(
    personalInfo.name +
    std::to_string(personalInfo.age) +
    std::to_string(body.height) +
    std::to_string(body.weight));

  personRecord.avatar = "https://i.pravatar.cc/150?u=" + std::to_string(personRecord.id);

  personRecord.body = body;
  personRecord.personalInfo = personalInfo;

  return personRecord;
}

EMSCRIPTEN_BINDINGS(my_class_example) {
  value_object<PersonalInfo>("PersonalInfo")
    .field("name", &PersonalInfo::name)
    .field("age", &PersonalInfo::age)
    ;

  value_object<Body>("Body")
    .field("height", &Body::height)
    .field("weight", &Body::weight)
    ;

  value_object<PersonRecord>("PersonRecord")
    .field("id", &PersonRecord::id)
    .field("avatar", &PersonRecord::avatar)
    .field("body", &PersonRecord::body)
    .field("personalInfo", &PersonRecord::personalInfo)
    ;

  function("createRecord", &createRecord);
}