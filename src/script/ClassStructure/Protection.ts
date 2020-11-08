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

function signToProtection(sign: string): Protection {
  for (const k in Protection) {
    if (Protection[k].toString() === sign) {
      return <Protection>Protection[k];
    }
  }
  throw new Error(`Unexpected sign ${sign}`);
}

function protectionToCode(p: Protection): string {
  switch (p) {
    case Protection.internal:
    case Protection.private:
      return "private";
    case Protection.protected:
      return "protected";
    case Protection.public:
      return "public";
  }
}
