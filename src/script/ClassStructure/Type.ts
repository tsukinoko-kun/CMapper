enum Type {
  void,
  string,
  int,
  float,
  boolean,
}

const typeString = (t: Type) => {
  return Type[t];
};
