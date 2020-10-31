enum Protection {
  private = "-",
  public = "+",
  protected = "#",
  internal = "~",
}

function ProtectionFromString(str: string): Protection {
  str = str.trim().toLowerCase();
  switch (str) {
    case "private":
    case Protection.private:
      return Protection.private;
    case "public":
    case Protection.public:
      return Protection.public;
    case "protected":
    case Protection.protected:
      return Protection.protected;
    case "internal":
    case Protection.internal:
      return Protection.internal;
    default:
      return Protection.public;
  }
}
